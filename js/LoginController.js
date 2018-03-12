/**
 * Steam Login Controller
 *
 * @constructor
 *
 * @author Stefan Kober <stefan.kober@gameforge.com>
 */
function LoginController() {
    this.dReturnErr = null;
    this.dReturnFail = false;
    this.deferredNext = null;
    this.deferred = false;
    this.deferredLoginDone = false;
    this.iHHRunning = false;
    this.iHHLeft = 0;
    this.iHHCountdown = 0;
    this.iHHHidden = false;
    LoginController.self = this;

    $('#ihh_button').on('click', this.displayIHHLink);
}
LoginController.prototype.self = null;


LoginController.prototype.login = function(username, password, token, next)
{
    //console.log("Call iA 2");

    if(!next) { next = function(){}; }

    if(!window.blackBox) {
      //no bb, return with a hardware sig error
      LoginController.self.showError(601);
      return;
    }

    var langCode = app.getLanguage();
    var requestToken = '';
    var tokenStr = '';

    if ($("#saveUsernameCheck").prop('checked')) {
        requestToken = '&user[get_token]=1';
    }
    if (token)
    {
        tokenStr = '&user[token]=' + token;
    }

    var setDeferred = LoginController.self.deferred === true ? 'true' : 'false';
    $.ajax({
        url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/authenticate_shadow",
        method:"POST",
        type:"POST",
        data: "user[email]=" + encodeURIComponent(username) + "&user[password]=" + encodeURIComponent(password) + "&user[language]=" + langCode + requestToken + tokenStr + "&user[deferred]=" + setDeferred + "&authenticity_token=00&user[io_black_box]=" + window.blackBox
    }).done(function (data, status, jqxhr) {

        //console.log('DEBUG initializeAccount success: ' + jqxhr.status + ' ' + data);

        if(jqxhr.status !== 200) {
            if (LoginController.self.deferred)
            {
                LoginController.self.dReturnErr = jqxhr.status;
                LoginController.self.dReturnFail = true;
                LoginController.self.deferredNext = next;
                LoginController.self.deferredLoginDone = true;
                return;
            }
            else
            {
                return next(jqxhr.status);
            }
        }

        dataObj = JSON.parse(data);
        //console.log(dataObj.token);

        if ($("#saveUsernameCheck").prop('checked') && dataObj.token) {
            $('#savedLoginName').text(username);
            window.settings.set("usertoken", dataObj.token);
        }

        window.ams_cookie = jqxhr.getResponseHeader('Set-Cookie');
        if (LoginController.self.deferred)
        {
            LoginController.self.dReturnErr = null;
            LoginController.self.dReturnFail = false;
            LoginController.self.deferredNext = next;
            LoginController.self.deferredLoginDone = true;
            if (dataObj.i_happyhour)
            {
                LoginController.self.displayIHH(dataObj.i_happyhour);
            }
        }
        else
        {
            setTimeout(function() {initSession(null,next);}, 1);
        }
    }).fail(function (jqxhr, statusTxt, errTxt) {
        //console.log('DEBUG initializeAccount fail: ' + jqxhr.status + ' ' + statusTxt + " " + errTxt);
        if (LoginController.self.deferred)
        {
            LoginController.self.dReturnErr = jqxhr.status;
            LoginController.self.dReturnFail = true;
            LoginController.self.deferredNext = next;
            LoginController.self.deferredLoginDone = true;
        }
        else
        {
            next(jqxhr.status);
        }
    });
};

LoginController.prototype.logout = function()
{
    window.settings.set("usertoken", '');
    window.settings.save();
    LoginController.self.deferredLoginDone = false;
    LoginController.self.deferred = false;
    $('#buttonLogin').removeClass('loading');
    $('#loggedin').hide();
    $('#badLogin').hide();
    $('.login_loading').css("display", "none");
    if (LoginController.self.iHHRunning)
    {
        LoginController.self.hideIHH();
    }
};

LoginController.prototype.continueLogin = function()
{
    if (!LoginController.self.dReturnFail)
    {
        setTimeout(function() {initSession(null,LoginController.self.deferredNext);}, 1);
    }
    else
    {
        LoginController.self.deferredNext(LoginController.self.dReturnErr);
    }
    LoginController.self.deferredLoginDone = false;
    LoginController.self.deferred = false;
};

LoginController.prototype.validateLogin = function()
{
    // Do authentication work here and trigger modalSuccess on successful login
    // Since this dialog has requireValidation I am responsible for telling the view when it has finished
    $('.login_loading').css("display", "block");
    $('#buttonLogin').addClass('loading');
    $('#badLogin').hide();

    if (LoginController.self.deferredLoginDone)
    {
        LoginController.self.continueLogin();
        return;
    }

    var jqhxr;

    var user = $("#loginUsername").val();
    //user = 'jason.eley@gmail.com'; //multi
    //user = 'jeley@outlook.com'; //device
    var password = $("#loginPassword").val();
    var userToken = window.settings.get("usertoken");
    var token = false;
    if ((!password || password.length < 1) && (userToken || userToken.length > 1))
    {
        token = userToken;
    }

    LoginController.self.login(user, password, token, function(err, data) {

        //console.log("Login processed");
        //console.log('DEBUG Login returned:  ' + err);

        if(handleLoginSpecialCases(err,data)) {
            return;
        }
        else if(err) {
            if (err === 450) // force password reset
            {
                $(".systemModal").trigger("modalHide");
                $("#pwResetPResetText").hide();
                $("#pwResetPResetSpinner").hide();
                skinWindowView.showModal($("#pwResetModal"), false, "pwResetModal", null);
                return;
            }

            $('.login_loading').css("display", "none");
            $('#buttonLogin').removeClass('loading');

            errorText = host.getLanguageString("AMS_Error_" + err);
            //console.log("DEBUG Login Error: " + errorText);

            $('#badLogin').html(errorText);

            $('#badLogin').css("display", "block");
            $('#badLogin').addClass("loginFailure");
            //$("#loginModal").addClass("loginFailure"); //display the login failure message in the login dialog.
            //window.analytics.trackEvent({ "event": "LoginFailure", "errorMessage": errorMessage, "http.status": err, "distinct_id": machineId });
            return;
        }

        loginOk();
    });
};

LoginController.prototype.resendPwReset = function()
{
    $("#pwResetPResetText").hide();
    $("#pwResetPResetSpinner").show();

    var username = $("#loginUsername").val();
    $.ajax({
        url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/resend_pw_reset",
        method:"POST",
        type:"POST",
        data: "user[email]=" + encodeURIComponent(username)
    }).done(function (data, status, jqxhr) {
        $("#pwResetPResetText").show();
        $("#pwResetPResetSpinner").hide();

    }).fail(function (jqxhr, statusTxt, errTxt) {
        $("#pwResetPResetText").show();
        $("#pwResetPResetSpinner").hide();
    });
};

LoginController.prototype.displayIHH = function(data)
{
    LoginController.self.iHHRunning = true;
    LoginController.self.iHHLeft = data.seconds_left + 1;
    LoginController.self.unhideIHH();
    LoginController.self.countdownIHH();
    LoginController.self.iHHCountdown = setInterval(LoginController.self.countdownIHH, 1000);
};

LoginController.prototype.unhideIHH = function()
{
    if (LoginController.self.iHHLeft > 0)
    {
        LoginController.self.iHHHidden = false;
    $('#contentBackground').addClass('contentBackgroundIHH');
    $('#contentBackground').removeClass('contentBackground');
    $('#start_page_normal').hide();
    $('#start_page_ihh').show();
    }
};

LoginController.prototype.hideIHH = function()
{
    if (LoginController.self.iHHRunning && LoginController.self.iHHHidden === false)
    {
        $('#contentBackground').addClass('contentBackground');
        $('#contentBackground').removeClass('contentBackgroundIHH');
        $('#start_page_normal').show();
        $('#start_page_ihh').hide();
        if (LoginController.self.iHHLeft > 0)
        {
            LoginController.self.iHHHidden = true;
        }
        else
        {
            clearInterval(LoginController.self.iHHCountdown);
        }
    }
};

LoginController.prototype.countdownIHH = function()
{
    LoginController.self.iHHLeft--;
    if (LoginController.self.iHHHidden === false)
    {
    var d = parseInt(LoginController.self.iHHLeft / 86400);
    var h = parseInt((LoginController.self.iHHLeft % 86400) / 3600);
    var m = parseInt((LoginController.self.iHHLeft % 3600) / 60);
    var s = LoginController.self.iHHLeft % 60;
    d = ('0' + d).slice(-2);
    h = ('0' + h).slice(-2);
    m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);
    var text = d + 'd ' + h + 'h ' + m + 'm ' + s + 's';
    $('#ihh_countdown').text(text);
    if (LoginController.self.iHHLeft === 0)
    {
        LoginController.self.hideIHH();
    }
    }
};

LoginController.prototype.displayIHHLink = function()
{
    if (LoginController.self.iHHRunning)
    {
        $.ajax({
            url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/get_ihh_link",
            method:"GET",
            type:"GET",
            headers:{"Cookie": window.ams_cookie}
        }).done(function (data, status, jqxhr) {

            //console.log('DEBUG displayIHHLink success: ' + jqxhr.status + ' ' + data);

            if (jqxhr.status !== 200 || (data.substring(0,4) !== 'http' && data.substring(0,2) !== '//'))
            {
                LoginController.self.showError(520);
                return;
            }

            $('#start_page_ihh').append('<a id="ihh_link" href="' + data + '" style="display:none"></a>');
            $('#ihh_link').click();
            $('#ihh_link').remove();


            notificationCenter.addObserver('SkinWindow','DidRestore', LoginController.self.checkIHH);

            skinWindow.minimize();


        }).fail(function (jqxhr, statusTxt, errTxt) {
            LoginController.self.showError(520);
        });
    }
};

LoginController.prototype.checkIHH = function(frameNotification)
{
    console.debug('restore');
    if (LoginController.self.iHHRunning)
    {
        $.ajax({
            url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/check_ihh",
            method:"GET",
            type:"GET",
            headers:{"Cookie": window.ams_cookie}
        }).done(function (data, status, jqxhr) {

            //console.log('DEBUG checkIHH success: ' + jqxhr.status + ' ' + data);

            if (data !== 'true')
            {
                LoginController.self.hideIHH();
            }
            else if (LoginController.self.iHHHidden === true)
            {
                LoginController.self.unhideIHH();
            }
        });
    }
};

LoginController.prototype.showError = function(error) {
    //errorText = host.getLanguageString("AMS_Error_" + error);
    //console.log("DEBUG Login Error: " + error);
    errorText = host.getLanguageString("AMS_Error_" + error);

    skinWindowView.showModal($("#errorModal"), false, "errorModal", null);

    $('#errorP').html(errorText);
};