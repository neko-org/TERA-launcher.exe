/**
 * Steam Interop Prototype
 *
 * @constructor
 *
 * @author Hannes Anders <hannes.anders@gameforge.com>
 */
function SteamController(instanceId) {
    var self = this;
    this.observers = [];
    this.instanceId = instanceId;
    this.observers.push(notificationCenter.addObserver("Steam.Auth", "onReceiveMessage", self.onReceiveMessage));

    $('#interop_loaded').html("yes");
}

/**
 * Releases the context for the interop
 */
SteamController.prototype.release = function () {
    window.interop.releaseInstance(this.instanceId);
};

/**
 * Checks if the client is logged into steam
 * @returns {*}
 */
SteamController.prototype.isLoggedOn = function () {
    var methodBinding = {
        "method": "isLoggedOn"
    };
    return interop.invoke(this.instanceId, methodBinding);
};

/**
 * Gets the SteamID for the current player
 * @returns {*}
 */
SteamController.prototype.getSteamId = function () {
    var methodBinding = {
        "method": "getSteamID"
    };
    return window.interop.invoke(this.instanceId, methodBinding);
};

/**
 * Gets a session Ticket for the current player
 * @returns {*}
 */
SteamController.prototype.getSessionTicket = function () {
    var methodBinding = {
        "method": "getAuthSessionTicket"
    };
    return window.interop.invoke(this.instanceId, methodBinding);
};

/**
 * Cancels a session Ticket for the current player
 * @returns {*}
 */
SteamController.prototype.cancelSessionTicket = function () {
    var methodBinding = {
        "method": "cancelAuthTicket"
    };
    return window.interop.invoke(this.instanceId, methodBinding);
};

/**
 * Gets Debug Login information
 * @returns {*}
 */
SteamController.prototype.getDebugData = function () {
    var methodBinding = {
        "method": "getDebugData"
    };
    return window.interop.invoke(this.instanceId, methodBinding);
};

SteamController.prototype.onReceiveMessage = function (sender, info) {

    switch (info.type) {
        case "onOverlayOpened":
            info.returnValue = "ok";
            break;
    }
};

/**
 * Opens the steam overlay with a browser attached to it
 * @returns {*}
 */
SteamController.prototype.openWebBrowserToUrl = function (url) {
    var methodBinding = {
        "method": "activateGameOverlayToWebPage",
        "value": String(url)
    };
    return window.interop.invoke(this.instanceId, methodBinding);
};

/**
 * Initializes the Steam Interop
 * @param appId App ID to initialize
 * @returns {*}
 */
SteamController.prototype.init = function (appId) {
	console.log(appId);
    var methodBinding = {
        "method": "initSteam",
        "value": appId
    };
    return window.interop.invoke(this.instanceId, methodBinding);
};