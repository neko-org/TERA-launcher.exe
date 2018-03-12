// copyCub is in the global namespace
var copyCub = null;

function CopyCub(instanceId) {
    var self = this;
    //console.log("DEBUG CopyCub instanceId", instanceId);
    this.instanceId = instanceId;

    this.observers = [];
    this.observers.push(notificationCenter.addObserver("CopyCub", "onReceiveMessage", self.onReceiveMessage));
    this.observers.push(notificationCenter.addObserver("CopyCub", "onSendMessageResult", self.onSendMessageResult));
    this.observers.push(notificationCenter.addObserver("CopyCub", "onLaunchGameResult", self.onLaunchGameResult));
}

// This function should probably never be called since
// the copyCub function has the same lifespan as the app.
CopyCub.prototype.release = function () {
    interop.releaseInstance(this.instanceId);
    this.observers.forEach(function (observer) {
        observer.release();
    });
    this.observers = [];
};

CopyCub.prototype.getString = function (index) {
    var methodBinding = {
        "method": "getString",
        "value": index
    };
    return interop.invoke(this.instanceId, methodBinding);
};

// Launch game (not for launching web browser and diagnostic tools)




CopyCub.prototype.launchGame = function () {

    var path = "Client/TL.exe";
    var methodBinding = {
        "method": "launchGame",
        "value": path
    };
    var ret = interop.invoke(this.instanceId, methodBinding);
    //console.log("Game launched");
    //console.log("DEBUG Launching interop", ret);
    return ret;

};


// Receive result from launching game
CopyCub.prototype.onLaunchGameResult = function (sender, info) {
    //console.log("DEBUG onLaunchGameResult:\n" + info.value);
    return "onLaunchGameRsult:\n" + info.value;
};

// Send message to the game
CopyCub.prototype.sendMessage = function (value) {
    var methodBinding = {
        "method": "sendMessage",
        "value": value
    };
    return interop.invoke(this.instanceId, methodBinding);
};

// Receive result from sending message to the game
CopyCub.prototype.onSendMessageResult = function (sender, info) {
    alert("onSendMessageResult:\n" + info.value);
};

CopyCub.prototype.LogMsg = function (msg) {
    return interop.invoke(this.instanceId, { "method": "LogMsg", "value": msg });
};
// Receive async request message from game
CopyCub.prototype.onReceiveMessage = function (sender, info) {
    var self = this;
    //console.log("DEBUG CopyCub info: ", info);
    if (info.job_id == 0) {
        var patt = /^(\w+)\((\d*)\)$/g;
        var m = patt.exec(info.value);
        if (m == null) return;
        switch (m[1]) {
            case "csPopup":
                loginIFrame.csPopup();
                break;
            case "endPopup":
                //console.log("End Popup");
                //console.log(m[2]& 0xffff);
                //console.log(m[2]>>> 16);
                var error = m[2]& 0xffff;
                if (error !== 0 && error !== 7)
                {
                    StartupController.self.showTerminationError(error);
                }
                else if (StartupController.steamMode === true)
                {
                    skinWindow.minimize();
                }
                LoginController.self.checkIHH();
                break;
            case "gameEvent":
                //console.log("DEBUG gameEvent: ", m[2]);
                if (m[2] == 1003 && StartupController.steamMode === true)
                {
                    skinWindow.minimize();
                }
                if (m[2] == 1003)
                {
                    LoginController.self.hideIHH();
                }
                break;
        }
        return;
    }
    setTimeout(function () {
        var v;
        switch (info.value) {
            case "ticket":
                refreshAuthTicket(function (data, job_id){
                    returnValue(data, job_id);
                }, info.job_id);
                break;
            case "slsurl":
                returnValue(getSLSURL(), info.job_id);
                //"http://sls.tera-europe.de:4566/servers/list.uk";
                break;
            case "gamestr":
                returnValue(getGameString(), info.job_id);
                break;
            case "last_svr":
                returnValue(getLastConnectedServerId(), info.job_id);
                break;
            case "char_cnt":
                returnValue(getListOfCharacterCount(), info.job_id);
                break;
            case "getWebLinkUrl(130,)":
                if (StartupController.steamMode === true)
                {
                    window.steamLogin.openPayment();
                }
                break;
            case "getWebLinkUrl(140,)":
                if (StartupController.steamMode === true)
                {
                    window.steamLogin.openClub();
                }
                break;
            default:
                v = { "result-code": 0, "result-message": "No handler on " + info.value };
                returnValue(v, info.job_id);
                break;
        }

    }, 1);
};

function returnValue(message, jobId) {
    //console.log("DEBUG Send to client", jobId, message);
    interop.invoke(copyCub.instanceId, {
        "method": "ReturnValue",
        "value": message,
        "job_id": jobId
    });
}

function copyCubError() {
    alert("The TERA Launcher is unable to load the CopyCub.dll file.\n\nIf this problem persists please visit http://support.tera-europe.com for additional help");
}

function getLaunchObject(copyCub) {
    var CCLaunch = function (task, args) {
        var self = this;
        this.copyCub = copyCub;
        this.instanceId = app.expandString("{Guid}");
        this.observers = [];
        this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function (sender, info) { self.onStart(task, info) }))
    }

    CCLaunch.prototype.release = function () {
        this.observers.forEach(function (observer) {
            observer.release();
        });
        this.observers = [];
    }

    CCLaunch.prototype.onStart = function (task, info) {
        this.copyCub.launchGame();
        task.complete();
    }

    return CCLaunch;
}


// Load the CopyCub Interop DLL
function loadCopyCub() {
    //return; //JLTODO: going to disable copycub for testing

    var interopLoadComplete = function (sender, info) {
		app.debugPrint("CopyCub loaded.\n");
        copyCub = interop.createInstance("EME.CopyCub", CopyCub);
        registerTaskController("ccLaunchGame", getLaunchObject(copyCub));
    };

    var interopUnload = function (sender, info) {
        if (!isNull(copyCub)) {
            interop.releaseInstance(copyCub.instanceId);
            copyCub = null;
        }
		app.debugPrint("CopyCub unloaded.\n");
    };

    //host.addInteropLoadedEventHandler(interopLoadComplete);
    notificationCenter.addObserver("Workflow", "DidLoad", interopLoadComplete);
    notificationCenter.addObserver("Workflow", "DidUnload", interopUnload);
    // NOTE: copyCub global var isn't set yet; the load completion callback occurs later
}
