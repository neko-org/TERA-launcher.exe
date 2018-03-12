/**
 * Steam Login Controller
 *
 * @constructor
 *
 * @author Stefan Kober <stefan.kober@gameforge.com>
 */
function SteamLoginController() {
    this.steamUserId = 0;
    this.steamInit = false;
    this.accountCreated = false;
    this.accountTries = 0;
    this.pendingLinking = false;
    SteamLoginController.self = this;
}

/**
 * A place to store the reference to the SteamLoginController object. The flow for steam login takes
 * us through non-steam function, that destroys the "this"-context
 *
 * @type SteamLoginController
 */
SteamLoginController.prototype.self = null;

/**
 * Initializes steam. Connects the launcher to steam. If this function is success-full the app is displayed
 * as "running" in steam. This function also retreives the steamId of the user
 */
SteamLoginController.prototype.init = function() {
    $('#steamProgress').html(host.getLanguageString("Steam_Status_Init"));

    var steamApp = parseInt(app.getConfig("SteamAppId", "true")); // this needs to be an int, number-strings are not allowed
    var steamInitResult = window.steam.init(steamApp);

    if (steamInitResult === true) // steam init was successfull
    {
        this.steamUserId = window.steam.getSteamId();
        this.steamInit = true;
    }
    else // steam init failed
    {
        this.showError(459);
        //$('#steamProgress').html('Could not initialize Steam. Please make sure Steam is running and that you are logged in.');
    }
};

/**
 * Starts the steam login process. This function does not open the modal itself (because there are different entry
 * points.
 *
 * @returns {undefined}
 */
SteamLoginController.prototype.login = function() {

    var self = this;
    $('#steamProgress').html(host.getLanguageString("Steam_Status_Login"));
    // get session ticket
    var steamSession = window.steam.getSessionTicket();
    //console.log(steamSession);
    if (steamSession === false)
    {
        this.showError(459);
        return;
    }
    //console.log(this.steamUserId);

    if(!window.blackBox) {  //no bb, return with a hardware sig error
        this.showError(601);
        return;
    }

    var langCode = app.getLanguage();
    //console.log(langCode);

    $.ajax({
        url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/authenticate_steam",
        method:"POST",
        type:"POST",
        data: "user[language]=" + langCode + "&steam[session]=" + encodeURIComponent(steamSession) + "&steam[id]=" + encodeURIComponent(this.steamUserId) + "&authenticity_token=00&user[io_black_box]=" + window.blackBox
    }).done(function (data, status, jqxhr) {
        //console.log('DEBUG initializeAccount success: ' + jqxhr.status + ' ' + data);
        window.steam.cancelSessionTicket();

        // here catch steam id not found code!
        if(jqxhr.status === 444) {
            skinWindowView.hideModal('steamAndLaunch');
            skinWindowView.showModal($("#steamLinkingModal"), false, "steamLinkingModal", null);
            return;
        }
        // login was successful
        window.ams_cookie = jqxhr.getResponseHeader('Set-Cookie');
        if(jqxhr.status !== 200) {
            return self.finalizeLogin(jqxhr.status, data);
        }

        setTimeout(function() {initSession(null,self.finalizeLogin);}, 1);
    }).fail(function (jqxhr, statusTxt, errTxt) {
        //console.log('DEBUG initializeAccount fail: ' + jqxhr.status + ' ' + statusTxt + " " + errTxt);
        window.steam.cancelSessionTicket();

        // here catch steam id not found code!
        if(jqxhr.status === 444) {
            skinWindowView.hideModal('steamAndLaunch');
            skinWindowView.showModal($("#steamLinkingModal"), false, "steamLinkingModal", null);
            return;
        }
        self.finalizeLogin(jqxhr.status);
    });


};

/**
 * Asks the AMS to create an account for this steamid.
 *
 * @param {type} steamSession
 * @returns {undefined}
 */
SteamLoginController.prototype.createAccount = function() {

    SteamLoginController.self.pendingLinking = false;
    skinWindowView.hideModal('steamLinkingModal');
    skinWindowView.showModal($("#steamModal"), false, "steamAndLaunch", null);

    $('#steamProgress').html(host.getLanguageString("Steam_Status_Create"));
    //console.log("Create account");
    var self = this;
    this.accountCreated = true;
    var langCode = app.getLanguage();
    var steamSession = window.steam.getSessionTicket();
    $.ajax({
        url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/create_steam",
        method:"POST",
        type:"POST",
        data: "user[language]=" + langCode + "&steam[session]=" + encodeURIComponent(steamSession) + "&steam[id]=" + encodeURIComponent(this.steamUserId) + "&authenticity_token=00&user[io_black_box]=" + window.blackBox
    }).done(function (data, status, jqxhr) {
        if(jqxhr.status !== 200) {
            self.showError(jqxhr.status);
            return;
        }
        window.steam.cancelSessionTicket(); // that session ticket has been used
        setTimeout(function(){ self.login(); }, 3000); // give the ams some time for the delayed jobs

    }).fail(function (jqxhr, statusTxt, errTxt) {
        window.steam.cancelSessionTicket();
        self.showError(jqxhr.status);
    });

};

SteamLoginController.prototype.linkAccountForm = function() {
    skinWindowView.hideModal('steamLinkingModal');
    skinWindowView.showModal($("#steamLinkingLoginModal"), false, "steamLinkingLoginModal", null);
    $('#spinnerLinking').hide();
};

SteamLoginController.prototype.linkAccountLogin = function() {

    var username = $('#steamUsername').val();
    var password = $('#steamPassword').val();

    SteamLoginController.self.pendingLinking = true;
    var langCode = app.getLanguage();

    $('#spinnerLinking').show();
    $('#badLoginSteam').html('');

    $.ajax({
        url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/authenticate_shadow",
        method:"POST",
        type:"POST",
        data: "user[email]=" + encodeURIComponent(username) + "&user[password]=" + encodeURIComponent(password) + "&user[language]=" + langCode + "&authenticity_token=00&user[io_black_box]=" + window.blackBox
    }).done(function (data, status, jqxhr) {
        //console.log(jqxhr.status);
        window.ams_cookie = jqxhr.getResponseHeader('Set-Cookie');
        if (jqxhr.status !== 200)
        {
            if (jqxhr.status === 410)
            {
                $('#deviceActivationModal').show();
                return;
            }
        }
        // seems ok!
        //SteamLoginController.self.linkAccount();
        setTimeout(function() {initSession(null,SteamLoginController.self.finalizeLogin);}, 1);

    }).fail(function (jqxhr, statusTxt, errTxt) {
        //console.log(jqxhr.status);
        window.ams_cookie = jqxhr.getResponseHeader('Set-Cookie');

        $('#spinnerLinking').hide();
        SteamLoginController.self.finalizeLogin(jqxhr.status);
        SteamLoginController.self.pendingLinking = false;
    });


};

SteamLoginController.prototype.linkAccount = function()
{
    skinWindowView.hideModal('steamLinkingLoginModal');
    skinWindowView.showModal($("#steamModal"), false, "steamAndLaunch", null);
    //console.log("Link account");
    var steamSession = window.steam.getSessionTicket();
    $.ajax({
        url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/link_steam",
        headers:{"Cookie": window.ams_cookie},
        method:"POST",
        type:"POST",
        data: "steam[session]=" + encodeURIComponent(steamSession) + "&steam[id]=" + encodeURIComponent(this.steamUserId) + "&authenticity_token=00&user[io_black_box]=" + window.blackBox
    }).done(function (data, status, jqxhr) {
        window.steam.cancelSessionTicket();
        //console.log(jqxhr.status);
        SteamLoginController.self.pendingLinking = false;

        // linking done... restart login
        SteamLoginController.self.login();

    }).fail(function (jqxhr, statusTxt, errTxt) {
        window.steam.cancelSessionTicket();
        //console.log(jqxhr.status);
        SteamLoginController.self.pendingLinking = false;
        SteamLoginController.self.showError(jqxhr.status);

    });

};


/**
 * Finalizes the login by triggering the handling of special cases like multiple game accounts or engarde
 *
 * @param {type} err
 * @param {type} data
 * @returns {undefined}
 */
SteamLoginController.prototype.finalizeLogin = function(err, data) {
    //console.log("Login processed");
    // this conext is lost here... use global self
    if(SteamLoginController.self.handleLoginSpecialCases(err,data)) {
        return;
    }
    else if(err) {

        // sometimes we are to fast for the ams, cycle again
        if (err == 406 && SteamLoginController.self.accountCreated === true)
        {
            SteamLoginController.self.accountTries++;
            if (SteamLoginController.self.accountTries < 5)
            {
                setTimeout(function(){ SteamLoginController.self.login(); }, 3000);
                return;
            }
            SteamLoginController.self.showError(462);
        }

        if (SteamLoginController.self.pendingLinking === false)
        {
            SteamLoginController.self.showError(err);
        }
        else
        {
            $('#spinnerLinking').hide();
            $('#badLoginSteam').html(host.getLanguageString("AMS_Error_" + err));
        }
        return;
    }
    if (SteamLoginController.self.pendingLinking === false)
    {
        //console.log('finalizeNormalLogin');
        SteamLoginController.self.loginOk();
    }
    else
    {
        SteamLoginController.self.linkAccount();
    }

};

/**
 * If the login was ok, the method hides the modal and starts the client
 *
 * @returns {undefined}
 */
SteamLoginController.prototype.loginOk = function() {
    //console.log("Launching game");
    copyCub.launchGame();

    $('#steamProgress').html(host.getLanguageString("Steam_Status_Done"));
    setTimeout(function()
    {
        skinWindowView.hideModal('steamAndLaunch');
        skinWindow.minimize();
    }, 5000);
};

SteamLoginController.prototype.openPayment = function() {
    $.ajax({
        url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/get_payment_link_steam",
        headers:{"Cookie": window.ams_cookie},
        method:"GET",
        type:"GET"
    }).done(function (data, status, jqxhr) {
        //console.log(data);
        //console.log(jqxhr.status);

        window.steam.openWebBrowserToUrl(data);

    }).fail(function (jqxhr, statusTxt, errTxt) {
        //console.log(jqxhr.status);

    });
};

SteamLoginController.prototype.openClub = function() {
    $.ajax({
        url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/get_clubtime_link_steam",
        headers:{"Cookie": window.ams_cookie},
        method:"GET",
        type:"GET"
    }).done(function (data, status, jqxhr) {
        //console.log(data);
        //console.log(jqxhr.status);

        window.steam.openWebBrowserToUrl(data);

    }).fail(function (jqxhr, statusTxt, errTxt) {
        //console.log(jqxhr.status);

    });
};

/**
 * If the initial login retunred an error this function checks, if there are special cases like multiple
 * game accounts or engarde... and handles them
 *
 * @param {type} err
 * @param {type} data
 * @returns {Boolean}
 */
SteamLoginController.prototype.handleLoginSpecialCases = function(err, data) {
    //console.log("Login handleLoginSpecialCases");
    if(err === 409) {
        if (SteamLoginController.self.pendingLinking === true) // trying to link a user-account, don't care now
        {
            SteamLoginController.self.linkAccount();
            return true;
        }
        $('#user_select').empty();
        data.forEach(function(item) {
            li = $('<li>' + item.gname + ' - ' + item.gtype + '</li>');
            li.on('click', function(evt, s) {
                initSession(item.gid, function(err, data) {
                    if(!err) {
                        $('#multiAccountModal').hide();
                        $('#deviceActivationModal').hide();
                        SteamLoginController.self.loginOk();
                    }
                });
            });
            $('#user_select').append(li);
        });

        $('#multiAccountModal').show();

        return true;
    }
    else if(err === 410) {
        skinWindowView.hideModal('steamAndLaunch');
        $('#deviceActivationModal').show();
        return true;
    }
    else {
        return false;
    }
};

SteamLoginController.prototype.showError = function(error) {
    //errorText = host.getLanguageString("AMS_Error_" + error);
    //console.log("DEBUG Login Error: " + error);
    errorText = host.getLanguageString("AMS_Error_" + error);

    skinWindowView.hideModal('steamAndLaunch');
    skinWindowView.hideModal('steamLinkingLoginModal');
    skinWindowView.showModal($("#steamErrorModal"), false, "steamErrorModal", null);

    $('#steamError').html(errorText);
};