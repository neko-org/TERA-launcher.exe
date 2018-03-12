// Disable selection on whole window
document.onselectstart = function() { return false; };

// Disable dragging on the whole window
document.ondragstart = function () { return false; };

function test4k() { return ((screen.height < screen.width) ? (screen.width > 3839  ) : (screen.height > 3839 ) ); }

(function () {


    if (test4k()) {
        skinWindow.setSize(2416, 1612);
        $('body').css('-webkit-transform', 'scale(2, 2)');
        //console.log("S4k");
        skinWindow.setOrigin(parseInt((screen.width - 2416) / 2), parseInt((screen.height - 1612) / 2));
    }

    //console.log("Starting up.");


    //function to make sure that if one of the RSS Xhr requests fails that we don't cause a javascript error that prevents the launcher from closing.
    var oldOnRequestComplete = HttpRequestXhr.prototype.onRequestComplete;
    HttpRequestXhr.prototype.onRequestComplete = function (sender, info) {
        var self = this;
        try {
            oldOnRequestComplete.apply(this, sender, info);
        } catch (err) {
            host.assert(false, err);

            self.responseXML = null;
            if (!isNull(self.httpRequest)) {
                setTimeout(function () { self.internalClose(); }, 0);
            }
        }
    }

    // Bind to functions that might get called before the document is ready
    $("body").on("localize", function (e, langCode, countryCode) {
        // default to EN if lang is unknown
        if (langCode !== 'de' && langCode !== 'en' && langCode !== 'fr')
        {
            settings.set("language", 'en-us');
            skinWindow.relocalize();
            return;
        }

        var websiteUrl = 'https://{lang}.tera.gameforge.com';
        var env = app.getConfig("DefaultEnvironment", "live");
        if (app.isCommandFieldSet('environment'))
        {
            var envParam = app.getCommandFieldByName('environment');
            if (envParam === 't1' || envParam === 't2' || envParam === 't3' || envParam === 'live')
            {
                env = envParam;
            }
        }
        if (env === 't1')
        {
            //console.log('T1s');
            websiteUrl = 'https://devt1-{lang}.tera.gfsrv.net';
        }
        if (env === 't2')
        {
            websiteUrl = 'https://devt2-{lang}.tera.gfsrv.net';
        }
        if (env === 't3')
        {
            //console.log('T3s');
            websiteUrl = 'https://devt3-{lang}.tera.gfsrv.net';
        }
        websiteUrl = websiteUrl.replace('{lang}', langCode);
        //also know as the News Feed
        $("#rss").rssfeed((websiteUrl + "/feed/fullnewsFeed"), {
        //$("#rss").rssfeed(("http://" + langCode + ".tera.gameforge.com/feed/fullnewsFeed"), {
            limit: 5,
            snippet: false,
            media: true,
            header: false
        });

        //also know as the Banner Feed
        $("#thumbsRss, #thumbsRssNews").rssfeed1((websiteUrl + "/feed/bannerFeed"), {
        //$("#thumbsRss, #thumbsRssNews").rssfeed1(("http://" + langCode + ".tera.gameforge.com/feed/bannerFeed"), {
		    limit: 3,
            snippet: true,
            media: true,
            header: false
        });



        // set the proper flag to active. Because localization happens twice, make sure to clear the active class after the first one.
        //$("#flags").find("img").removeClass("active");
        var forumLink;
        switch (langCode) {
            case "en":
                $("#selected_language").html("English");
                forumLink = "https://board.tera.gameforge.com/index.php/Board/433/";
                //$("#en-us").find("img").addClass("active");
                break;
            case "de":
                $("#selected_language").html("Deutsche");
                forumLink = "https://board.tera.gameforge.com/index.php/Board/490/";
                //$("#de-de").find("img").addClass("active");
                break;
            case "fr":
                $("#selected_language").html("Fran&#xE7;ais");
                forumLink = "https://board.tera.gameforge.com/index.php/Board/523/";
                //$("#fr-fr").find("img").addClass("active");
                break;
        }

    /******** Set localized links and make them all HREFs so we don't get double clicks ******************/
        //Localized Links
        $(".faq a").attr("href", "http://" + langCode + ".tera.gameforge.com/support/faq");
        $(".forum a").attr("href", forumLink);
        $(".support a").attr("href", "http://support." + langCode + ".tera.gameforge.com");
        $("#logo a").attr("href", "http://" + langCode + ".tera.gameforge.com/news/index");
        $(".teraclub").attr("href", "http://" + langCode + ".tera.gameforge.com/main/club#club");
        //$(".registerAccountLink").attr("href", "http:" + langCode + ".tera.gameforge.com/user/register");
        $(".forgotPasswordLink").attr("href", "http:" + langCode + ".tera.gameforge.com/news/index?lost=1");

        $('#steamLinkingReturn').on("click", function () {
            skinWindowView.hideModal('steamLinkingLoginModal');
            skinWindowView.showModal($("#steamLinkingModal"), false, "steamLinkingModal", null);
        });

        var privacyLink = {
            'de' : 'https://agbserver.gameforge.com/deDE-Datenschutz-Tera.html',
            'en' : 'https://agbserver.gameforge.com/enGB-Privacy-Tera.html',
            'fr' : 'https://agbserver.gameforge.com/frFR-Privacy-Tera.html'
        };

        $('.privacyAgreementLink').attr("href", privacyLink[langCode]);

        var countryCodes = {
            'de' : 'DE',
            'en' : 'GB',
            'fr' : 'FR'
        };

        $('.tacLink').attr("href", 'https://agbserver.gameforge.com/' + langCode + countryCodes[langCode] + '-Switch-Tera.html');


        //load the server status on localization
        var serverStatusURL = "http://web-sls.tera.gameforge.com:4566/servers/list." + langCode;
        $("#statusTable tr:gt(0)").remove();

        $.ajax({
            type: "GET",
            url: serverStatusURL,
            dataType: "xml",
            success: function (xml) {

                if (langCode !== app.getLanguage()) return;
                $("#statusTable tr:gt(0)").remove();

                var $xml = $(xml)

                // Find Server Tag
                var server = $xml.find("server");
                server.each(function () {
                    var name = $(this).find('name').text();
                    var name = name.trim();
                    var serverName = name.split(" - ").pop(); // <-- this was NOT an obvious solution
                    var language = $(this).find('language').text();
                    var category = $(this).find('category').text();
                    var status = $(this).find('permission_mask').text();
                    var population = $(this).find('open').text();
                    switch (status) {
                        case "0x00000000":
                            status = "green";
                            break;
                        case "0x00000001":
                            status = "green";
                            reason = "full, new users cannot access server.";
                            break;
                        case "0x80000000":
                            status = "red";
                            reason = "down";
                            break;
                        case "0x80000100":
                            status = "red";
                            reason = "down";
                            break;
                        case "0x00000100":
                            status = "red";
                            reason = "maintenance";
                            break;
                    }
                    $("#statusTable").append('<tr><td>' + '<span data-status=' + status + '></span>' + '</td><td>' + serverName + '</td><td>' + category + '</td><td>' + population + "</td><td>" + language + "</td></tr>");
                })
            },
            error: function (request, status, error) {
                  $(".serverStatusError").show();
            }
        });

        $('#ihh_eyecatcher').removeClass('langDE langEN langFR');
        $('#ihh_eyecatcher').addClass('lang' + langCode.toUpperCase());
        $('#ihh_button').removeClass('langDE langEN langFR');
        $('#ihh_button').addClass('lang' + langCode.toUpperCase());
        $('#contentBackground').removeClass('contentBackgroundDE contentBackgroundEN contentBackgroundFR');
        $('#contentBackground').addClass('contentBackground' + langCode.toUpperCase());

    });

    $(".systemModal").on("modalShow", function() {
        $("#rssContainer, #contentOverlay, #rss li.active").removeClass("active");
    });
} ());

function handleLoginSpecialCases(err, data) {
    if(err === 409) {
        $('#user_select').empty();
        data.forEach(function(item) {
            li = $('<li>' + item.gname + ' - ' + item.gtype + '</li>');
            li.on('click', function(evt, s) {
                initSession(item.gid, function(err, data) {
                    if(!err) {
                        $('#multiAccountModal').hide();
                        $('#deviceActivationModal').hide();
                        loginOk();
                    }
                })
            });
            $('#user_select').append(li);
        })

        $('#multiAccountModal').show();

        return true;
    }
    else if(err === 410) {
        $('#deviceActivationModal').show();
        return true;
    }
    else {
        return false;
    }
}

var loginOk = function() {

    console.log("Launching game");
    copyCub.launchGame();

    //lets send a loginSuccess event to mixpanel
   var goodUserName = $("#loginUsername").val(); //login successful - fill variable for passing username to events.
   app.addMacro("userEmail", goodUserName); //create a macro for storing the username so we can use the macro in the analytics.json
   //window.analytics.trackEvent({ "event": "LoginSuccess", "username": goodUserName, "email": goodUserName, "distinct_id":machineId });
   //window.analytics.trackUserInfo({ "$email": goodUserName });

   if ($("#saveUsernameCheck").prop('checked')) {
       window.settings.set("username", goodUserName);
       //console.debug('token!');
       var token = window.settings.get("usertoken");
       //console.debug(token);
       if (token)
       {
           $('#loggedin').show();
           $('#savedLoginName').text(goodUserName);
       }

   } else {
       window.settings.set("username", '');
       window.settings.set("usertoken", '');
   }
   window.settings.set("remember_username", $("#saveUsernameCheck").is(':checked'));
   window.settings.save();

   $("#loginModal").trigger("modalSuccess"); //close the modal window and trigger the patch download
   $('.login_loading').css("display", "none");
   $('#buttonLogin').removeClass('loading');
   $("#header").show();
};

$(document).ready(function () {
    //console.log("Running");

    // Opens external links in new browser window
    $(document).on("click", "a", function (e) {
        if ($(this).attr("href").indexOf("http") == 0) {
            e.preventDefault();
            platform.shellOpen($(this).attr("href"));
        }
    });

    //minimize the window when the Close (X) button is clicked since it takes a long time for CopyCub to unload
    $("#windowClose").on("click", function () {
        skinWindow.minimize();
    });

    // fade in
    $(function () {
        $(window).scroll(function () {


            $('.fadeInBlock').each(function (i) {

                var bottom_of_object = $(this).position().top + $(this).outerHeight();
                var bottom_of_window = $(window).scrollTop() + $(window).height();

                /* Adjust the "200" to either have a delay or that the content starts fading a bit before you reach it  */
                bottom_of_window = bottom_of_window + 200;

                if (bottom_of_window > bottom_of_object) {

                    $(this).animate({ 'opacity': '1' }, 500);

                }
            });

        });
    });

    // lets set a global variable for machineId this is a unique_id for use in analytics.
    var machineId = app.expandString("{SHA1:{Lower:{PrimaryMAC}{DiskSerial:{SystemPath}}}}");
    // then lets set a macro to that variable so we can use it in the analytics.json
    app.addMacro("machineId", machineId);
    loadCopyCub();

    //return;

    // --- let's add the login modal stuff --- //

    $("#loginModal").bind("bind", null, function (event, task, view) {
        view.requireValidation = true;
        view.cancelElement = $(this).find(".login_cancel");
        //$("#header").hide();
        //displayLoginIFrame(false);
    });

    //make the loading icon go away if user clicks cancel on main login or even the device activation.
    $(".login_cancel").click(function(){
        $(".login_loading").css("display","none");
    })
    $(".cancel_deviceactivation").click(function () {
        $(".login_loading").css("display", "none");
    })
    $(".deviceactivation_cancel").click(function () {
        $(".login_loading").css("display", "none");
    })

    $("#loginModal").bind("modalValidate", null, function (event, task) {
        window.login.validateLogin();
    });

    $(".resend_code a").click(function () {
        resendVerification(function(err) {
            err = !err?'no errors':err;
            //console.log('DEBUG Resend account security code: ' + err);
        });
    });

    $("#buttonAuthorize a").click(function () {
        var aCode = $("#txtDeviceActivationCode").val();
        var aRemember;
        if ($("#chkRememberDevice").is(":checked")) {
            aRemember = "true";
        } else {
            aRemember = "false";
        }

        var activationError = function(code) {
            errorText = host.getLanguageString("AMS_Error_" + code);

            $('.activationErrorText').html(errorText);
            $('.activationErrorText').css("display","block");
        }

        checkActivation(aCode, aRemember, function(err, data) {
            if(err) {
                //show error message
                activationError(err);
                //console.log('DEBUG Account security code send error ' + err);
                return;
            }

            initSession(null, function(err, data) {
                if(handleLoginSpecialCases(err,data)) {
                    return true;
                }
                else if(err) {
                    //show error
                    activationError(err);
                    return;
                }
                else {
                    $('#deviceActivationModal').hide();
                    if (StartupController.steamMode === false)
                    {
                        loginOk();
                    }
                    else
                    {
                        if (SteamLoginController.self.pendingLinking === false)
                        {
                            skinWindowView.showModal($("#steamModal"), false, "steamAndLaunch", null);
                            SteamLoginController.self.loginOk();
                        }
                        else
                        {
                            SteamLoginController.self.linkAccount();
                        }
                    }
                }
            });

        });
        //console.log("DEBUG Account security parameters: " + aCode + " " + aRemember);
    });



    // Navigation
    $("#nav li").click(function () {
        // Nav Active State
        $("#nav li").removeClass("active");
        $(this).addClass("active");

        // Vertical Scroll
        var index = $("#nav li").index(this);
        $(".content").css({ "top": index * -100 + "%" });
        $("#contentWrapper .content").removeClass("selected");
        $("#contentWrapper .content").eq(index).addClass("selected");
        if (index === 2) {
            $("#options_container").css("display", "block");
        } else {
            $("#options_container").css("display", "none");
        }
    });



    // Options Navigation
    $("#options_nav li").click(function () {
        // Nav Active State
        $("#options_nav li a").removeClass("active");
        $(this).find("a").addClass("active");

        // Vertical Scroll
        var index = $("#options_nav li").index(this);
        $(".options_content").css({ "top": index * -100 + "%" });
        $("#options_container .options_content").removeClass("selected");
        $("#options_container .options_content").eq(index).addClass("selected");
    });


    //Reset progress bar
    $("#footer .downloadProgress").width("0%");

    // Footer hover
    var originalFooterHeight = $("#footer").height();
    $("#footer").hover(
        function() {
            $("#footer").height($("#footer .extendedInfo").height() + originalFooterHeight);
        },
        function() {
            $("#footer").height(originalFooterHeight);
        }
    );

    $(document).live("click", function (e) {
        if ($(e.target).is("a[href]") && e.button === 1) {
            e.preventDefault();
        }
    });

    $("#contentOverlay, #rssContainer .rssCloseIcon").on("click", function () {
        $("#rssContainer .rssViewer").scrollTop(0);
        if ($("body").hasClass("skinStateRunning")) {
            $("#rssContainer, #contentOverlay, #rss li.active").removeClass("active");
        }
    });


    // Clones the News Feed card once it"s clicked to bring it out of the nesting - putting it in the modal
    $(".preview_news, .preview_news_long").live("click", function (e) {
        e.preventDefault();
        $(this).addClass("active");
        $("#contentOverlay").addClass("active");

        //$("#rssContainer .rssViewer").children(".rssRow").remove();
        $("#rssContainer .rssViewer").html(""); //empty out the rssViewer modal from any previous content.


        $("#rssContainer .rssViewer").append($(this).clone()).delay(0).queue(function () {
		//$("#rssContainer .rssViewer").scrollTop(0).append($(this).clone()).delay(0).queue(function () {

            /* its worth looking heavily at the CSS file for information about the styles that are being enforced
            up and down the DOM in order to make sure we don't do something ugly to the Feed Full Description when we show it. Each
            full description can have it's own HTML which can create some complexities in displaying the content */

            /* this is a hack to make all links in the articles link out to the browser from the modal -
            because we turned off linking out in the articles because we want links in the news feed to open in the modal */
            $("#rssContainer .rssViewer h3 a").attr("href", $("#rssContainer .rssViewer h3 a").attr("link"));
            $("#rssContainer .rssViewer .news_thumb").attr("href", $("#rssContainer .rssViewer h3 a").attr("link"));
            $("#rssContainer .rssViewer .learn_more").attr("href", $("#rssContainer .rssViewer h3 a").attr("link"));

            //hide the news article elements that we don't want displayed in the modal
            $("#rssContainer .rssViewer .news_thumb").css("display", "none");
            $("#rssContainer .rssViewer .short_description").css("display", "none");
            $("#rssContainer .rssViewer .learn_more").css("display", "none");
            $("#rssContainer .rssViewer .full_description").css("display", "block");
            $("#rssContainer .rssViewer .full_description > *").css("display", "block");
            $("#rssContainer .rssViewer > article").removeAttr('background');
            $("#rssContainer").addClass("active");
            $(this).dequeue();
        });
    });

    // Clones the Banner Feed card once it"s clicked to bring it out of the nesting - putting it in the modal
    $(".thumbs_li").live("click", function (e) {
        e.preventDefault();
        $(this).addClass("active");
        $("#contentOverlay").addClass("active");

        $("#rssContainer .rssViewer").html(""); //empty out the rssViewer modal from any previous content.

        $("#rssContainer .rssViewer").append($(this).clone()).delay(0).queue(function () {
        //$("#rssContainer .rssViewer").scrollTop(0).append($(this).clone()).delay(0).queue(function () {
            /* its worth looking heavily at the CSS file for information about the styles that are being enforced
            up and down the DOM in order to make sure we don't do something ugly to the Feed Full Description when we show it. Each
            full description can have it's own HTML which can create some complexities in displaying the content */

            /* this is a hack to make all links in the articles link out to the browser from the modal -
            because we turned off linking out in the articles because we want links in the news feed to open in the modal */
            $("#rssContainer .rssViewer h3 a").attr("href", $("#rssContainer .rssViewer h3 a").attr("link"));
            $("#rssContainer .rssViewer .news_thumb").attr("href", $("#rssContainer .rssViewer h3 a").attr("link"));
            $("#rssContainer .rssViewer .learn_more").attr("href", $("#rssContainer .rssViewer h3 a").attr("link"));

            //hide the news article elements that we don't want displayed in the modal
            $("#rssContainer .rssViewer .thumbs_li").removeAttr('background');
            $("#rssContainer .rssViewer .thumbs_li").removeAttr('style');
            $("#rssContainer .rssViewer .short_description").css("display", "none");
            $("#rssContainer .rssViewer .learn_more").css("display", "none");

            $("#rssContainer .rssViewer .full_description").css("display", "block");
            $("#rssContainer .rssViewer .full_description > *").css("display", "block");
            $("#rssContainer .rssViewer > article").removeAttr('background');
            $("#rssContainer").addClass("active");
            $(this).dequeue();
        });
    });

    var statusTimeout = null;

    /* set the user language here */
    $("#flags li").live("click", function (e) {
        var language = $(this).attr('id');

        settings.set("language", language);
        skinWindow.relocalize();
        $("#flags li img").removeClass("active");
        $(this).find('img').addClass("active");
      });

    function fadeOutStatus() {
        $("#footer #statusText").css({ "opacity": "0" });
        $("#footer #statusText #statusSpinner").removeClass("spin");
    };

    $("#statusText").bind("changed", null, function() {
        $("#footer #statusText").css({ "opacity": "1" });
        $("#footer #statusText #statusSpinner").addClass("spin");

        // Timer to keep status change text available for 2.5 secs every time it is changed, rather than just 2.5 secs at a time
        if (statusTimeout != null) window.clearTimeout(statusTimeout);
        statusTimeout = window.setTimeout(fadeOutStatus, 2500);
    });

    // System Modal UI Behavior
    $(".systemModal .modalCancel, #repairModal .modalOk").live("click", function () {
        $(".systemModal").trigger("modalHide");
    });

    $(".systemModal form").live("submit", function() {
        $(".systemModal").trigger("modalHide");
        return false;
    });

    $('#steamUsername, #steamPassword').keypress(function(e) {
        if(e.which == 13) {
            $(this).blur();
            SteamLoginController.self.linkAccountLogin();
        }
    });

    $('#registerUsername, #registerPassword').keypress(function(e) {
        if(e.which == 13) {
            $(this).blur();
            StartupController.self.register();
        }
    });

    $('#modalRegisterButton').live("click", function () {
        StartupController.self.register();
    });

    $("#steamCreateButton").live("click", function () {
        SteamLoginController.self.createAccount();
    });

    $("#steamGoLinkingButton").live("click", function () {
        SteamLoginController.self.linkAccountForm();
    });

    $("#modalSteamLinkingButton").live("click", function () {
        SteamLoginController.self.linkAccountLogin();
    });

    $("#signupButton").live("click", function () {
        $(".systemModal").trigger("modalHide");
        skinWindowView.showModal($("#registerModal"), false, "registerModal", null);
    });

    // Mulitple Account Modal UI Behavior
    $("#registerCancel").live("click", function () {
        $(".systemModal").trigger("modalHide");
    });

    $("#loginButton").live("click", function () {
        $(".systemModal").trigger("modalHide");
        skinWindowView.showModal($("#loginModal"), false, "loginAndLaunch", null);
    });

    $(".loggout_link").live("click", function () {
        LoginController.self.logout();
    });

    $("#steamErrorClose").live("click", function () {
        $(".systemModal").trigger("modalHide");
    });

    $("#errorClose").live("click", function () {
        $(".systemModal").trigger("modalHide");
    });

    // Device Activation Modal UI Behavior
    $(".deviceactivation_cancel, .cancel_deviceactivation").live("click", function () {
        $("#deviceActivationModal").css("display", "none");
    });

    // Mulitple Account Modal UI Behavior
    $(".multiAccount_cancel").live("click", function () {
        $("#multiAccountModal").css("display", "none");
    });

    // Repair Button on Click
    $("#buttonRepair a").live("click", function (e) {
        skinWindowView.showModal($("#repairModal"), false, "repair", null);
    });

    $("#pwResetClose").live("click", function (e) {
        $(".systemModal").trigger("modalHide");
    });

    $("#pwResetResend").live("click", function (e) {
        LoginController.self.resendPwReset();
    });

    $("#settings form select, #support form input").change(function() {
        $(this).parents("form:first").submit();
    });
});


/* Here is where we start all of the View bindings - most of this is not custom */

$(window).load(function () {
    $("#settings").masonry({
        itemSelector: ".masonry",
        columnWidth: 64,
        isRTL: true
    });
});

(function() {
    notificationCenter.addObserver("WebGetAuthenticateView", "Bind", function(sender, view) {
        view.rootElement = $("#webAuthenticateModal");
        view.serverElement = view.rootElement.find(".server");
        view.portElement = view.rootElement.find(".port");
        view.realmElement = view.rootElement.find(".realm");
        view.usernameElement = view.rootElement.find("input[name=username]");
        view.passwordElement = view.rootElement.find("input[name=password]");
        view.errorElement = view.rootElement.find("h2");
        view.cancelElement = view.rootElement.find(".modalCancel");
    });

    notificationCenter.addObserver("SkinWindowView", "Bind", function(sender, view) {
        view.rootElement = $("body");
        view.errorElement = $("#statusText span");
        view.moveElement = $("#windowMoveGripArea");
        view.minimizeElement = $("#windowMinimize");
        view.closeElement = $("#windowClose");
        //app.setLanguage("en");
    });

    notificationCenter.addObserver("OptionsView", "Bind", function(sender, view) {
        view.rootElement = $("#settings");
        view.protocolsElement = view.rootElement.find("select[name=downloadMethod]");
        view.maxUploadRateElement = view.rootElement.find("select[name=maxUploadSpeed]");
        view.maxDownloadRateElement = view.rootElement.find("select[name=maxDownloadSpeed]");
    });

    $(".debugFile").change(function() {
        var currentFlags = app.getDebugFlags() | debugFlag.VERBOSE | debugFlag.TIMESTAMP;
        var newFlags = currentFlags;
        var debugFilename = app.getDebugFilename();

        window.settings.set("debugFile", $(this).is(':checked'));

        if ($(this).is(':checked')) {
            //setting the debug file location to ModulePath at Gameforge's request.
            //We recommend against this in the event that they run the launcher un-elevated. Doing this can cause instability in the launcher.
            //debugFilename = app.expandString("{LocalStorage}{ModuleFileTitle}.log");
            debugFilename = app.expandString("{ModulePath}{ModuleFileTitle}.log");
            newFlags |= debugFlag.FILE;
        } else {
            newFlags &= (~debugFlag.FILE);
        }

        if (currentFlags != newFlags) {
            app.setDebugLogging(debugFilename, newFlags);
        }

        $(".debugFile").attr('checked', $(this).is(':checked'));
    });

    $(".debugConsole").change(function() {
        var currentFlags = app.getDebugFlags() | debugFlag.VERBOSE | debugFlag.TIMESTAMP;
        var newFlags = currentFlags;
        var debugFilename = app.getDebugFilename();

        window.settings.set("debugConsole", $(this).is(':checked'));

        if ($(this).is(':checked')) {
            newFlags |= debugFlag.WINDOW;
        } else {
            newFlags &= (~debugFlag.WINDOW);
        }

        if (currentFlags != newFlags) {
            app.setDebugLogging(debugFilename, newFlags);
        }

        $(".debugConsole").attr('checked', $(this).is(':checked'));
    });

    notificationCenter.addObserver("DownloadView", "Bind", function(task, view) {
        view.rootElement = $("#footer");
        view.statusElement = view.rootElement.find(".downloadStatus");
        view.deliveryMethodElement = view.rootElement.find(".downloadP2PEnabled");
        view.timeEstElement = view.rootElement.find(".downloadTimeRemaining");
        view.bytesLeftElement = view.rootElement.find(".downloadBytesRemaining");
        view.transferSpeedElement = view.rootElement.find(".downloadTotalDownloadSpeed");
        view.progressBarElement = view.rootElement.find(".downloadProgress");
        view.progressElement = view.rootElement.find(".downloadPercent");
        view.pauseElement = view.rootElement.find(".downloadPauseResume");
        view.resumeElement = view.rootElement.find(".downloadPauseResume");
    });

    notificationCenter.addObserver("PatchView", "Bind", function(task, view) {
        view.rootElement = $("#footer");
        view.statusElement = view.rootElement.find(".patchStatus");
        view.timeEstElement = view.rootElement.find(".patchTimeRemaining");
        view.bytesLeftElement = view.rootElement.find(".patchBytesRemaining");
        view.transferSpeedElement = view.rootElement.find(".patchWriteSpeed");
        view.progressBarElement = view.rootElement.find(".patchProgress");
        view.progressElement = view.rootElement.find(".patchPercent");
        view.patchesLeftElement = view.rootElement.find(".patchesLeft");
        view.titleElement = view.rootElement.find(".patchTitle");
        view.repairElement = $("#repairModal .modalOk");
        view.launchElement = $("#buttonLaunch");

        // Assume the allowPartial denotes a launcher task - don't allow the state to be set for the launch button
        if (hasOwnProperty(task.args, "allowPartial") && task.args.allowPartial === false) {
            notificationCenter.addInstanceObserver("PatchController", "Complete", task.controller, function(controller) {
                view.rootElementClass.apply(null);
            });
        }
    });

    notificationCenter.addObserver("PerformanceView", "Bind", function(sender, view) {
        view.incomingAvgSpeedElement = $("#incomingSpeed .avgSpeed");
        view.outgoingAvgSpeedElement = $("#outgoingSpeed .avgSpeed");
        view.incomingCurSpeedElement = $("#incomingSpeed .curSpeed");
        view.outgoingCurSpeedElement = $("#outgoingSpeed .curSpeed");
        view.incomingMaxSpeedElement = $("#incomingSpeed .maxSpeed");
        view.outgoingMaxSpeedElement = $("#outgoingSpeed .maxSpeed");
        view.graphElement = $("#downloadGraph");
    });

    // load the saved username in the login form
    notificationCenter.addInstanceObserver("Settings", "DidChange", settings, function (sender, info) {
        if (info.key == 'username') {
            $("#loginUsername").val(info.newValue);
            if (window.settings.get("usertoken"))
            {
                $('#savedLoginName').text(info.newValue);
            }
        }
        if (info.key == 'usertoken') {
            if (info.newValue)
            {
                var username = window.settings.get("username");
                $('#loggedin').show();
                $('#savedLoginName').text(username);
            }
        }
        if (info.key == "language") { $("#langSelect").val(info.newValue); }
        if (info.key == 'remember_username') { $("#saveUsernameCheck").each(function () { this.checked = info.newValue; $(this).change(); }); }
        if (info.key == "debugFile") {  $(".debugFile").each(function() { this.checked = info.newValue; $(this).change(); }); }
        if (info.key == "debugConsole") {  $(".debugConsole").each(function() { this.checked = info.newValue; $(this).change(); }); }
    });

    notificationCenter.addObserver("Download", "WillBrowseForFolder", function(sender, info) {
        info.folder = skinWindow.browseForFolder(host.getLanguageString("Download_BrowseForFolder"), info.folder);
    });
} ());
