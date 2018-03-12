var MessageNumber = 1;
var KeepaliveInterval = 1000 * 60 * 15;

// set the following variables in _js_configs.erb
// so this file can be game agnostic
var SLS_URL = "";//http://sls.tera-europe.de:4566/servers/list.uk";
//SLS_URL = "http://devt2-web-sls.tera.gfsrv.net:4566/servers/list.uk";
var CURRENT_LANGUAGE = "";
var CUSTOMER_SUPPORT_URL = "";
var GAME_EXE = "";
var GAME_ID = 1;
var ACCOUNT_NAME = "";
var ACCOUNT_EMAIL = "";
var LAUNCHER_EXIT_MSGS = {};
var GACCT_ACCESS_TYPE = 0;
var ACCOUNT_ID = 0;
var GACCT_ID = 0;
var GACCT_IS_TRIAL = false;
var DISPLAY_INFO_TITLE = "";
var DISPLAY_INFO_BODY = "";

var AMS_HOST = 'account.tera.gameforge.com';
var AMS_HOSTS = [];
AMS_HOSTS['t1'] = 'devt1-web-ams.tera.gfsrv.net';
AMS_HOSTS['t2'] = 'devt2-web-ams.tera.gfsrv.net';
AMS_HOSTS['t3'] = 'devt3-web-ams.tera.gfsrv.net';

//https://devt2-web-ams.tera.gfsrv.net/launcher/1/authenticate_shadow

var cookie="";

function testInterface() {
  alert("Message Received by AMS Hosted IFrame!");
}

function serverPing() {
  $.ajax({
    url:"/launcher/" + GAME_ID + "/keepalive",
    success: function(data) {
      setTimeout(serverPing, KeepaliveInterval);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      setTimeout(serverPing, KeepaliveInterval);
    }
  });
}

var LockPlayButton = false;
function gameLaunch() {
  if (LockPlayButton) return;

  LockPlayButton = true;

  switch(GACCT_ACCESS_TYPE) {
    case 0: // full access
      launchGameExe();
      LockPlayButton = false;
      break;

    case 1: // limited play times
      // make ajax call to server to confirm user can play now
      if (canPlay()) {
        launchGameExe();
      } else {
        endPopup(0x8000, 0x0002);
      }
      LockPlayButton = false;

      break;

    default: // download only
      // show error message
      endPopup(0x8000, 0x0001);
      LockPlayButton = false;
  }
}

function launchGameExe() {
  parent.copyCub.launchGame(GAME_EXE);
  MessageNumber++;
}

function canPlay() {
  var res = false;

  $.ajax({
    async: false,
    url:"/launcher/" + GAME_ID + "/account_can_play",
    success: function(data) {
      res = (data == "1");
    },
    error: function(jqXHR, textStatus, errorThrown) {
      res = false;
    }
  });
  return res;
}

function gameSendMessage() {
  parent.copyCub.sendMessage("Some data: " + MessageNumber);
  MessageNumber++;
}

// This returns the location of SLS specific to the selected game and
// the current user's language
function getSLSURL() {
  return SLS_URL;
}


function endPopup(endType1, endType2) {
  var str_e1 = new Number(endType1).toString(16);
  var str_e2 = new Number(endType2).toString(16);
  var str_e2_opt= new Number(endType2 & 0x7fff).toString(16);

  str_e1 = rPadString(str_e1, 4, "0");
  str_e2 = rPadString(str_e2, 4, "0");
  str_e2_opt = rPadString(str_e2_opt, 4, "0");

  reportLauncherErrorToGA(str_e1, str_e2);

  var msg = getErrorMsgFromTypes(str_e1, str_e2, str_e2_opt);
  if (msg != null) {
    err_data = { 'user_id': ACCOUNT_ID,
                 'game_account_id': GACCT_ID,
                 'error' : str_e1 + ':' + str_e2 };

    reportLauncherError(err_data);

    var title = "Error: " + str_e1 + ":" + str_e2;
    parent.displayError(title, msg);
  }
  else if (GACCT_IS_TRIAL) {
    parent.displayInfo(DISPLAY_INFO_TITLE, DISPLAY_INFO_BODY);
  }
}

function reportGameEventToGA(value) {
  _gaq.push(['_trackPageview', '/game_event/' + value.toString()]);
}

function reportLauncherErrorToGA(str_e1, str_e2) {
  _gaq.push(['_trackEvent', 'endPopup', str_e1, str_e2]);
}

function reportLauncherError(data) {
  $.ajax({
    url: '/report_launcher_error',
    data: data,
    type: "POST",
    success: function(data) {},
    error: function(jqXHR, textStatus, errorThrown) {}
  });
}

function getErrorMsgFromTypes(str_e1, str_e2, str_e2_opt) {
  return LAUNCHER_EXIT_MSGS[str_e1+"_"+str_e2] || LAUNCHER_EXIT_MSGS[str_e1+"_"+str_e2_opt] || LAUNCHER_EXIT_MSGS[str_e1] || null;
}

function rPadString(str, len, chr) {
  var pad = [];
  while ( pad.length + str.length < len ) {
    pad[pad.length] = chr;
  }
  return pad.join('') + str;
}

function csPopup() {
  parent.navigateDefaultBrowser(CUSTOMER_SUPPORT_URL);
}

function handleNewWindowLinkClick(event) {
  var link = $(this);
  var tgt = link.attr("target");

  if (tgt == "blank" || tgt == "_blank") {
    parent.navigateDefaultBrowser(link.attr("href"));
    event.preventDefault();
  }
}

var serverInfo = {};
var authData = {};
function loadServerInfo(next) {
  getAccountServerInfo(true, function(err, data) {
    serverInfo = $.parseJSON(data);
    //console.log("DEBUG loadServerInfo serverInfo: ",serverInfo);
    next(err);
    /*loadAuthTicket(function(data) {
      authData = $.parseJSON(data);
      next();
    });*/

  });
}



function getAccountServerInfo(attach_auth_ticket, next) {
  //console.log("Call gASI 1");

  var out = "";

  if(!next) { next = function(){} }

  var jqhxr;
  jqxhr = $.ajax({
          url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/account_server_info",
          data: "attach_auth_ticket=" + (attach_auth_ticket ? 1 : 0),
          headers:{"Cookie": window.ams_cookie}
      }).done(function (data, jqxhr) {
          //console.log("DEBUG getAccountServerInfo success: ", data);
          next(null, data);
      }).fail(function (jqxhr, statusTxt, errTxt) {
        //console.log("DEBUG getAccountServerInfo fail: ", + statusTxt + " " + errTxt + "" + jqxhr);
          next(jqxhr.status);
      });

}

function checkActivation(code, remember, next) {
  //console.log("Call cA 1");
  $.ajax({
      url:"https://" + AMS_HOST + "/users/account/submit_engarde_verification_shadow",
      method:"POST",
      type:"POST",
      data: "engarde_ticket=" + code + "&remember_device=" + remember,
      headers:{"Cookie": window.ams_cookie}
  }).done(function (data, status, jqxhr) {
    //check for success
    if(jqxhr.status === 200) {
      return next(null);
    }

    next(jqxhr.status);
  }).fail(function(jqxhr, statusText, errTxt) {
    //handle failure
    next(jqxhr.status);
  });

}

function resendVerification(next) {
  //console.log("Call rV 1");

  next = !next?function() {}:next;

  $.ajax({
      url:"https://" + AMS_HOST + "/users/account/resend_engarde_ticket_shadow",
      method:"GET",
      type:"GET",
      headers:{"Cookie": window.ams_cookie}
  }).done(function (data, status, jqxhr) {
    //check for success
    if(jqxhr.status === 200) {
      next(null);
    }

    next(jqxhr.status);
  }).fail(function(jqxhr, statusText, errTxt) {
    //handle failure
    next(jqxhr.status);
  });

}

function initializeAccount(username, password, token, next) {
  //console.log("Call iA 2");

  if(!next) { next = function(){} }

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

  $.ajax({
      url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/authenticate_shadow",
      method:"POST",
      type:"POST",
      data: "user[email]=" + encodeURIComponent(username) + "&user[password]=" + encodeURIComponent(password) + "&user[language]=" + langCode + requestToken + tokenStr + "&authenticity_token=00&user[io_black_box]=" + window.blackBox
  }).done(function (data, status, jqxhr) {

    //console.log('DEBUG initializeAccount success: ' + jqxhr.status + ' ' + data);

    if(jqxhr.status !== 200) {
      return next(jqxhr.status, data);
    }

    if ($("#saveUsernameCheck").prop('checked')) {
      $('#savedLoginName').text(username);
      window.settings.set("usertoken", data);
    }

    window.ams_cookie = jqxhr.getResponseHeader('Set-Cookie');
    setTimeout(function() {initSession(null,next)}, 1);
  }).fail(function (jqxhr, statusTxt, errTxt) {
      //console.log('DEBUG initializeAccount fail: ' + jqxhr.status + ' ' + statusTxt + " " + errTxt);
      next(jqxhr.status);
  });
}

function initSession(gid, next) {
  //console.log("Call iS 1");

  url = "https://" + AMS_HOST + "/launchershadow/" + GAME_ID;

  if(gid) url += '?gid=' + gid;

  $.ajax({
    url:url,
    headers:{"Cookie": window.ams_cookie}
  }).done(function (data, status, jqxhr) {
    //console.log("xhr3", status, jqxhr.responseText);
    var launcherText = jqxhr.responseText;
    var sls_index = launcherText.indexOf('SLS_URL');
    var sls_end = launcherText.indexOf(';', sls_index);

    SLS_URL = launcherText.substring(sls_index+11, sls_end-1);

    //console.log('DEBUG SLS URL: '+SLS_URL);

    setTimeout(function() {loadServerInfo(next)}, 1);
  }).fail(function (jqxhr, statusTxt, errTxt) {

    //console.log("'DEBUG SLS URL FAIL: " + jqxhr.status + " " + statusTxt + " " + errTxt);

    var data = null;
    if(jqxhr.status === 409) {
      data = JSON.parse(jqxhr.responseText);
    }

    next(jqxhr.status, data);
  });
}

// the following methods all more or less have to make the same call to server info
// as such, we call getAccountServerInfo and strip out what we don't need.
// Also, because I'm not sure the frequency or order these are called in, the response
// from getAccountServerInfo is cached (server side) for 1 minute so we don't have
// to make repeated requests to the game web services.
// TODO : discuss w/ BHS why these are even needed
function getGameString(next) {
  return JSON.stringify(serverInfo);
}


function refreshAuthTicket(next, jobid) {
  //console.log("Call rAT 1");

  var jqhxr;
  jqxhr = $.ajax({
    url:"https://" + AMS_HOST + "/launcher/" + GAME_ID + "/account_server_info",
    data: "attach_auth_ticket=1",
    headers:{"Cookie": window.ams_cookie}
  }).done(function (data, jqxhr) {

    //console.log("DEBUG refreshAuthTicket call sucessfull", data);
    serverInfo = $.parseJSON(data);
    var out = $.extend({}, serverInfo);

    var json_result = JSON.stringify({ticket: out.ticket, "result-code": 200})
    //console.log("DEBUG refreshAuthTicket json ", json_result);
    next(json_result, jobid);

  }).fail(function (jqxhr, statusTxt, errTxt) {
    var json_result = JSON.stringify({ticket: "", "result-code": 0})
    //console.log("DEBUG refreshAuthTicket json ", json_result);
      next(json_result, jobid);
  });
}

/*function loadAuthTicket(next) {
  var out = "";
  var jqhxr;

  //
  jqxhr = $.ajax({
          url:"http://" + AMS_HOST + "/launcher/" + GAME_ID + "/auth_ticket",
          headers:{"Cookie": cookie}
      }).done(function (data, jqxhr) {
          next(data);
      }).fail(function (jqxhr, statusTxt, errTxt) {
          next(jqxhr.responseText);
      });


}*/

function getLastConnectedServerId(next) {
  //var out = $.parseJSON(getAccountServerInfo(false));
  var out = $.extend({}, serverInfo);
  delete out.user_permission;
  delete out.chars_per_server;
  delete out.ticket;
  return JSON.stringify(out);

}

function getListOfCharacterCount() {
  //var out = $.parseJSON(getAccountServerInfo(false));
  var out = $.extend({}, serverInfo);
  delete out.user_permission;
  delete out.last_connected_server_id;
  delete out.ticket;
  return JSON.stringify(out);
}

// BOOTSTRAP
$(function() {
  $("a").live("click", handleNewWindowLinkClick);
  $("#user_email").focus();
});
