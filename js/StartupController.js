var workflowUnLoaded = null;

function StartupController(task, args) {
    var self = this;
    StartupController.self = this;

    this.steamInit = false;

    // Listen for event notifications
    this.observers = [];
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Complete", task, function(sender, info) { self.onComplete(task, info); }));
}

StartupController.steamMode = false;

// not sure if i really need this?
StartupController.prototype.release = function() {
    // Release all the notificationCenter observers
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

/**
 * Entry point for the "startUp" job. Calls are defined in the workflow. This job has 2 differend entry points
 * 1. it is called with "message" = "start", once the launcher is done patching
 * 2. it is called with "message" = "loginAndLaunch" when the Start-Button is being pressed
 *
 * @param {type} task
 * @param {type} info
 */
StartupController.prototype.onStart = function(task, info) {

    if (task.args.message === 'loginAndLaunch') // this is bound to the launch button (see workflow)
    {
        if (StartupController.steamMode === false)
        {
            // non steam launch. Just execute the job that was previously bound to the launch button
            window.workflow.runTask('loginAndLaunch', null);
            var token = window.settings.get("usertoken");
            if (token)
            {
                //console.debug('triggertoken');
                $("#loginModal").trigger("modalValidate");
            }
        }
        else // only execute steam function, if steam was found
        {
            skinWindowView.showModal($("#steamModal"), false, "steamAndLaunch", null); // show login modal
            if (window.steamLogin.steamInit !== true) // if we could not init before, mabye we can now
            {
                window.steamLogin.init();
            }
            if (window.steamLogin.steamInit === true)
            {
                window.steamLogin.login();
            }

        }

    }
    else if (task.args.message === 'start') // this is bound to be executed, right after patching (see workflow)
    {
        //console.log(window.blackBox);
        //console.log('startup Start');

        // are we running on steam?
        /*if (app.isCommandFieldSet('location'))
        {
            StartupController.steamMode = app.getCommandFieldByName('location') === 'steam';
        }*/

        if (StartupController.steamMode === true) // initialize steam
        {
            // setup steam login controller
            window.steamLogin = new SteamLoginController();
            skinWindowView.showModal($("#steamModal"), false, "steamAndLaunch", null); // show login modal

            window.steam = window.interop.createInstance("Steam.Auth", SteamController); // load steam dll
            workflowUnLoaded = notificationCenter.addObserver("Workflow", "WillUnload", StartupWorkflowUnLoaded);

            window.steamLogin.init();
            if (window.steamLogin.steamInit === true)
            {
                window.steamLogin.login();
            }

            // hide repair option
            $('#repairDiv').hide();

        }
        else
        {
            var token = window.settings.get("usertoken");
            if (token)
            {
                //console.log("deferred login");
                //console.debug('triggertoken');
                LoginController.self.deferred = true;
                $("#loginModal").trigger("modalValidate");
            }
        }


    }
    else if (task.args.message === 'init') // this is bound to be executed, right before patching (see workflow)
    {
        //console.log('init');

        // get the environment we need to be running in
        var env = app.getConfig("DefaultEnvironment", "live").toLowerCase();
        if (app.isCommandFieldSet('environment'))
        {
            var envParam = app.getCommandFieldByName('environment').toLowerCase();
            if (envParam === 't1' || envParam === 't2' || envParam === 't3' || envParam === 'live')
            {
                env = envParam;
            }
        }
        if (env === 't1')
        {
            console.log('T1');
            AMS_HOST = AMS_HOSTS['t1'];
        }
        if (env === 't2')
        {
            AMS_HOST = AMS_HOSTS['t2'];
        }
        if (env === 't3')
        {
            console.log('T3');
            AMS_HOST = AMS_HOSTS['t3'];
        }

        StartupController.steamMode = app.getConfig("SteamMode", "FALSE") === 'TRUE';

        window.login = new LoginController();

    }
    task.complete();
};

StartupController.prototype.onComplete = function(task, info) {
   // Notification for when the task is completed
};

StartupController.prototype.showTerminationError = function(error) {
    errorText = host.getLanguageString("Termination_Code_" + error);
    if (errorText === ("Termination_Code_" + error)) // unkown error
    {
        var text = host.getLanguageString("Termination_Code_unknown");
        text = text.replace('&#37;i', error);
        text = text.replace('%i', error);
        errorText = text;
    }
    //console.log("DEBUG Login Error: " + error);

    skinWindowView.showModal($("#errorModal"), false, "errorModal", null);

    $('#errorP').html(errorText);
};

StartupController.prototype.register = function()
{
    $('#registerModalError').text('');
    var username = $('#registerUsername').val();
    var password = $('#registerPassword').val();

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username)))
    {
        $('#registerModalError').html(host.getLanguageString("Register_Invalid_Email"));
        return;
    }
    if (password.length < 4)
    {
        $('#registerModalError').html(host.getLanguageString("Register_Password_Restriction"));
        return;
    }
    if (!(/^[a-zA-Z0-9 @!#$%&(){}*+,\-.\/:;<>=?[\]\^_|~]*$/.test(password)))
    {
        $('#registerModalError').html(host.getLanguageString("Register_Password_Restriction2"));
        return;
    }

    $('.login_loading').show();
    $('#modalRegisterButton').addClass('loading');
    var langCode = app.getLanguage();

    $.ajax({
        url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/create",
        method:"POST",
        type:"POST",
        data: "user[email]=" + encodeURIComponent(username) + "&user[password]=" + encodeURIComponent(password) + "&user[language]=" + langCode + "&authenticity_token=00&user[io_black_box]=" + window.blackBox
    }).done(function (data, status, jqxhr) {
        //console.log(jqxhr.status);
        window.ams_cookie = jqxhr.getResponseHeader('Set-Cookie');
        if (jqxhr.status !== 200)
        {
            $('#registerModalError').html(host.getLanguageString("Register_Error"));
            $('.login_loading').hide();
            $('#modalRegisterButton').removeClass('loading');
            return;
        }

        // account registered successfully \o/
        setTimeout(function() {

            $('.login_loading').hide();
            $('#modalRegisterButton').removeClass('loading');
            $(".systemModal").trigger("modalHide");
            skinWindowView.showModal($("#loginModal"), false, "loginAndLaunch", null);
            $("#loginUsername").val(username);
            $("#loginPassword").val(password);
            $("#saveUsernameCheck").prop('checked', true);
            window.login.validateLogin();

        }, 5000);

        // seems ok!
        //SteamLoginController.self.linkAccount();
        //setTimeout(function() {initSession(null,SteamLoginController.self.finalizeLogin);}, 1);

    }).fail(function (jqxhr, statusTxt, errTxt) {
        //console.log(jqxhr.status);
        $('#registerModalError').html(host.getLanguageString("Register_Error"));
        $('.login_loading').hide();
        $('#modalRegisterButton').removeClass('loading');
    });

};

registerTaskController("startUp", StartupController);

function StartupWorkflowUnLoaded() {
    window.steam.release();

    workflowUnLoaded.release();
    workflowUnLoaded = null;
}