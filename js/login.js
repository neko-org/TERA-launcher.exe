var AMS = "account.tera.gameforge.com";	//Live
//var AMS = "dev1.account.tera.gameforge.com"; //T1
//var AMS = "dev3.account.tera.gameforge.com";	//T3

/*
window.onerror = Errorhandling;

function Errorhandling (message, file, line) {
  Error = "Errormessage:\n" + message + "\n" + file + "\n" + line;
  showError();
  return true;
}

function showError () {
  alert(Error);
}
*/


function displayConnectivityError(loading, response) {
  loading.hide();
  response.show();
}

//Returns the value of the parameter, if it exists. Otherwise it returns "". 
function getURLParameters(paramName) 
{
        var sURL = window.document.URL.toString();  
    if (sURL.indexOf("?") > 0)
    {
       var arrParams = sURL.split("?");         
       var arrURLParams = arrParams[1].split("&");      
       var arrParamNames = new Array(arrURLParams.length);
       var arrParamValues = new Array(arrURLParams.length);     
       var i = 0;
       for (i=0;i<arrURLParams.length;i++)
       {
        var sParam =  arrURLParams[i].split("=");
        arrParamNames[i] = sParam[0];
        if (sParam[1] != "")
            arrParamValues[i] = unescape(sParam[1]);
        else
            arrParamValues[i] = "";
       }

       for (i=0;i<arrURLParams.length;i++)
       {
                if(arrParamNames[i] == paramName){
            //alert("Param:"+arrParamValues[i]);
                return arrParamValues[i];
             }
       }
       return "";
    }

}

function loadLoginForm() {





//"https://" + AMS + "/login_form.js?lang="+getURLParameters("lang")+"&email="+getURLParameters("email")+"&rememberme="+getURLParameters("rememberme")
if (getURLParameters("ams")=="")	{
	//var scriptLoc   = "https://" + AMS + "/login_form.js?lang="+getURLParameters("lang")+"&email=skopetschke@frogster.de",
	var scriptLoc   = "https://" + AMS + "/launcher/1/login_form.js?lang="+getURLParameters("lang")+"&email="+getURLParameters("email")+"&kid="+getURLParameters("kid"),
      loading = $("#loading-icon"),
      response = $("#response-container");
}	else	{
		  var scriptLoc   = "https://" + getURLParameters("ams") + "/launcher/1/login_form.js?lang="+getURLParameters("lang")+"&email="+getURLParameters("email")+"&kid="+getURLParameters("kid"),
			  loading = $("#loading-icon"),
			  response = $("#response-container");
		  }
	  
  
  response.hide();
  loading.show();
  
  //alert(document.getElementById("response-container").attributes);
  
  $.get(scriptLoc, function(data) {
    response.html(data);
  }).error(function() { displayConnectivityError(loading, response) });    
  
  //window.location.reload();
  
}

/* Bootstrap */
$(function() {
  $(".login-form-retry").click(loadLoginForm);
  loadLoginForm();
});   