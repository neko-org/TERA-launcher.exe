/**
 * @preserve Modifications performed to this file by anyone other than Solid State Networks
 * are unsupported and may void your software warranty.
 */
$(document).ready(function() {
    host.assert(app.expandString("{AppVersion}") === "3.6.8.1", "Invalid application version");
});

/*!
* \file Patch.js
* \brief File containing Patch class and creation function
*/

/*!
* \class Patch
* \brief Extract a patch
*/




function Patch(instanceId)
{
   /*!
   * Instance id used to bind proxy object to native object
   * \type string
   */
   this.instanceId = instanceId;
}

/*!
* releases the object
*/
Patch.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the file name of path
* \type string
* \returns file name of path
*/
Patch.prototype.getFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileName"
   });
};

/*!
* sets the file name of path
* \tparam string(in) value file name of path
*/
Patch.prototype.setFileName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFileName", 
      "value":value
   });
};

/*!
* gets the short version of the filename
* \type string
* \returns short version of the filename
*/
Patch.prototype.getShortFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getShortFileName"
   });
};

/*!
* gets the time elapsed in runnable state
* \type double
* \returns time elapsed in runnable state
*/
Patch.prototype.getRunningTime = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRunningTime"
   });
};

/*!
* gets the current location in the zip file
* \type string
* \returns current location in the zip file
*/
Patch.prototype.getCurrentItemName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getCurrentItemName"
   });
};

/*!
* gets the location where patch is applied
* \type string
* \returns location where patch is applied
*/
Patch.prototype.getOutputDirectory = function(){
   return interop.invoke(this.instanceId, {
      "method":"getOutputDirectory"
   });
};

/*!
* sets the location where patch is applied
* \tparam string(in) value location where patch is applied
*/
Patch.prototype.setOutputDirectory = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setOutputDirectory", 
      "value":value
   });
};

/*!
* gets the json object containing the rate of the current/average/max throughput for patch writes
* \type string
* \returns json object containing the rate of the current/average/max throughput for patch writes
*/
Patch.prototype.getWriteRates = function(){
   return interop.invoke(this.instanceId, {
      "method":"getWriteRates"
   });
};

/*!
* gets the checks if a mask exists
* \type bool
* \returns checks if a mask exists
*/
Patch.prototype.getMaskExists = function(){
   return interop.invoke(this.instanceId, {
      "method":"getMaskExists"
   });
};

/*!
* gets the estimated time remaining in a patch
* \type double
* \returns estimated time remaining in a patch
*/
Patch.prototype.getRemainingTime = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRemainingTime"
   });
};

/*!
* gets the size of the patch
* \type int
* \returns size of the patch
*/
Patch.prototype.getTotalBytes = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTotalBytes"
   });
};

/*!
* gets the bytes left in the patch
* \type int
* \returns bytes left in the patch
*/
Patch.prototype.getBytesLeft = function(){
   return interop.invoke(this.instanceId, {
      "method":"getBytesLeft"
   });
};

/*!
* gets the error corresponding to the error type
* \type int
* \returns error corresponding to the error type
*/
Patch.prototype.getLastErrorType = function(){
   return interop.invoke(this.instanceId, {
      "method":"getLastErrorType"
   });
};

/*!
* gets the error corresponding to the error type
* \type int
* \returns error corresponding to the error type
*/
Patch.prototype.getLastError = function(){
   return interop.invoke(this.instanceId, {
      "method":"getLastError"
   });
};

/*!
* gets the number of attempts for the current file
* \type int
* \returns number of attempts for the current file
*/
Patch.prototype.getFileAttempt = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileAttempt"
   });
};

/*!
* gets the value checking if the patch contains the current running application (only valid after complete)
* \type bool
* \returns value checking if the patch contains the current running application (only valid after complete)
*/
Patch.prototype.getSelfUpdate = function(){
   return interop.invoke(this.instanceId, {
      "method":"getSelfUpdate"
   });
};

/*!
* Get disk information for a specific file
* \tparam string(in) filename filename of item in the zip file
* \tparam string(inout) diskname disk path where the file is located
* \tparam int(inout) diskoffset offset to where the file begins
* \tparam int(inout) disksize size of file on disk
* \type bool
* \returns true if successful, false otherwise
*/
Patch.prototype.getItemDiskInfo = function(filename,inOutParams){
   return interop.invoke(this.instanceId, {
      "method":"getItemDiskInfo", 
      "filename":filename, 
      "inOutParams":inOutParams
   });
};

/*!
* Reset disk information for the patch
*/
Patch.prototype.resetDiskInfo = function(){
   return interop.invoke(this.instanceId, {
      "method":"resetDiskInfo"
   });
};

/*!
* Starts the patch
*/
Patch.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};

/*!
* Resume the patch file after an action has stalled
*/
Patch.prototype.resume = function(){
   return interop.invoke(this.instanceId, {
      "method":"resume"
   });
};

/*!
* Skip the patch file after an action has stalled
*/
Patch.prototype.skip = function(){
   return interop.invoke(this.instanceId, {
      "method":"skip"
   });
};

/*!
* Fail the patch after an action has stalled
*/
Patch.prototype.fail = function(){
   return interop.invoke(this.instanceId, {
      "method":"fail"
   });
};

/*!
* Reset the file mask
*/
Patch.prototype.maskReset = function(){
   return interop.invoke(this.instanceId, {
      "method":"maskReset"
   });
};

/*!
* Add to the file inclusion mask
* \tparam string(in) filename filename to add
*/
Patch.prototype.maskAdd = function(filename){
   return interop.invoke(this.instanceId, {
      "method":"maskAdd", 
      "filename":filename
   });
};


/*!
* Create instance of patch
*/
function createPatch()
{
   return interop.createInstance("SSN.Patch", Patch);
}


function PatchChannel() {
    this.instanceId = app.expandString("{Guid}");
    this.currentState = -1;
    this.isRunning = false;
    this.fastVerify = false;
    this.versionVerify = createPatchVersionVerify();
    this.manifest = createPatchManifest();
    this.httpRequest = createHttpRequest();
    this.httpRequest.setUseCache(true);
    this.httpRequest.setType(httpRequestType.GET);
    this.maskedFiles = [];
    this.patchesRequired = [];
    this.patchesUpcoming = [];
    this.observers = [];
    this.timeStart = 0;
    this.timeStop = 0;
    this.allowPartial = true;

    var self = this;

    this.observers.push(notificationCenter.addInstanceObserver("PatchManifest", "LoadComplete", this.manifest, function(sender, info) { self.onManifestLoadComplete(info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchManifest", "Patch", this.manifest, function(sender, info) { self.onManifestPatch(info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchManifest", "Complete", this.manifest, function(sender, info) { self.onManifestComplete(info); }));

    this.observers.push(notificationCenter.addInstanceObserver("HttpRequest", "Complete", this.httpRequest, function(sender, info) { self.onManifestDownloadComplete(info); }));

    this.observers.push(notificationCenter.addInstanceObserver("PatchVersionVerify", "Start", this.versionVerify, function(sender, info) { self.onVerifyStart(info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchVersionVerify", "CorruptFile", this.versionVerify, function(sender, info) { self.onVerifyCorruptFile(info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchVersionVerify", "Complete", this.versionVerify, function(sender, info) { self.onVerifyComplete(info); }));
}

PatchChannel.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.versionVerify)) {
        this.versionVerify.release();
        this.versionVerify = null;
    }

    if (!isNull(this.manifest)) {
        this.manifest.release();
        this.manifest = null;
    }

    if (!isNull(this.httpRequest)) {
        this.httpRequest.release();
        this.httpRequest = null;
    }
};

PatchChannel.prototype.cleanLocalManifest = function() {
    this.manifest.clean(true, false);
};

PatchChannel.prototype.changeState = function(state) {
    var previousState;
    if (state === this.currentState) {
        return;
    }

    previousState = this.currentState;
    this.currentState = state;
    notificationCenter.fire("PatchChannel", "StateChange", this, { "state": state, "previousState": previousState });

    switch (state) {
        case patchChannelState.COMPLETE:
            this.manifest.clean(true, this.manifest.getUpcomingReleaseId() < 0);
            this.timeStop = app.getCurrentTime();
            this.isRunning = false;
            notificationCenter.fire("PatchChannel", "Complete", this, { "successful": true });
            break;

        case patchChannelState.FAIL:
            this.manifest.clean(true, false);
            this.timeStop = app.getCurrentTime();
            this.isRunning = false;
            notificationCenter.fire("PatchChannel", "Complete", this, { "successful": false });
            break;
    }
};

PatchChannel.prototype.onManifestLoadComplete = function(info) {
    if (!isNull(this.requiredReleaseId)) {
        this.manifest.setRequiredReleaseId(this.requiredReleaseId);
    }

    if (!isNull(this.upcomingReleaseId)) {
        this.manifest.setUpcomingReleaseId(this.upcomingReleaseId);
    }

    this.manifest.setSourceReleaseSHA1(this.manifest.expandString(this.sourceRelease));
    this.manifest.setTargetReleaseSHA1(this.manifest.expandString(this.targetRelease));
};

PatchChannel.prototype.onManifestPatch = function(info) {
    var self, patchName, patchDirectory, patchFilename, patchInfo;

    patchInfo = {};
    patchInfo.name = "{0}_{1}to{2}".format(this.manifest.getName(), info.fromId, info.toId);
    patchInfo.fromId = info.fromId;
    patchInfo.toId = info.toId;
    patchInfo.size = info.size;
    patchInfo.outputDirectory = app.expandString(this.manifest.getTargetDirectory());
    patchInfo.patchDirectory = this.manifest.expandString("{PatchDirectory}");
    patchInfo.filename = patchInfo.patchDirectory + patchInfo.name + ".zip";
    patchInfo.metafileUrl = app.expandString(this.manifest.getExtraDataValue(info.fromId, info.toId, "MetafileUrl"));
    patchInfo.versionFilename = this.manifest.expandString("{VersionPath}");
    patchInfo.versionName = this.manifest.expandString("{VersionName}");
    patchInfo.uninstall = false;
    patchInfo.versionUpdate = false;
    patchInfo.allowPartial = this.allowPartial;
    patchInfo.isUpcoming = this.manifest.getTargetReleaseId() === this.manifest.getUpcomingReleaseId();
    patchInfo.maskedFiles = this.maskedFiles;

    notificationCenter.fire("PatchChannel", "PatchConfigure", this, { "patchInfo": patchInfo });

    if (patchInfo.metafileUrl.length <= 0) {
        app.debugPrint("Unable to find metafile for {0}\n".format(patchInfo.name));

        this.lastError = patcherError.getPatchManifestError(patchManifestError.MISSINGMETAFILE);
        return;
    }

    if (patchInfo.isUpcoming === true) {
        patchInfo.maskedFiles = [];
        this.patchesUpcoming.push(patchInfo);
    } else {
        if (patchInfo.maskedFiles.length === 0 && this.patchesRequired.length === 0 && this.isUninstalling === true) {
            patchInfo.uninstall = true;
            patchInfo.maskedFiles = [];
        }

        this.patchesRequired.push(patchInfo);
    }
};

PatchChannel.prototype.onManifestComplete = function(info) {
    var lastManifestError, versionFilename;

    if (this.manifest.getRequiredReleaseId() >= 0) {
        if (this.isUninstalling === true &&
            this.manifest.getTargetReleaseId() === this.manifest.getRequiredReleaseId() &&
            this.manifest.getCurrentReleaseId() !== this.manifest.getRequiredReleaseId() &&
            this.manifest.getSourceReleaseId() >= 0) {
            this.maskedFiles = [];
            this.patchesRequired = [];
            this.patchesUpcoming = [];
            this.sourceRelease = "{EmptyReleaseSHA1}";
            this.targetRelease = "{RequiredReleaseSHA1}";
            this.manifest.start();
            return;
        }
    }

    if (info.successful === false) {
        lastManifestError = this.manifest.getLastError();
        this.lastError = patcherError.getPatchManifestError(lastManifestError);

        if (lastManifestError === patchManifestError.REQUIRESELEVATION) {
            host.elevate();
        }

        this.changeState(patchChannelState.FAIL);
        return;
    }

    if (this.lastError !== 0) {
        this.changeState(patchChannelState.FAIL);
        return;
    }

    if (this.manifest.getRequiredReleaseId() >= 0) {
        if (this.isUpdatingVersion === true) {
            if (this.manifest.getCurrentReleaseId() !== this.manifest.getRequiredReleaseId()) {
                this.patchesUpcoming = [];
                while (this.patchesRequired.length > 1) {
                    this.patchesRequired.shift();
                }

                this.patchesRequired[0].maskedFiles = [this.manifest.expandString("{VersionName}")];
                this.patchesRequired[0].uninstall = false;
                this.patchesRequired[0].versionUpdate = true;
            } else {
                this.patchesRequired = [];
                this.patchesUpcoming = [];
            }
        } else if (this.isRepairing === true) {
            this.isRepairing = false;
            this.isVerifying = true;
        } else if (this.manifest.getTargetReleaseId() === this.manifest.getRequiredReleaseId()) {
            this.sourceRelease = "{RequiredReleaseSHA1}";
            this.targetRelease = "{UpcomingReleaseSHA1}";
            this.manifest.start();
            return;
        } else {
            this.sourceRelease = "{CurrentReleaseSHA1}";
            this.targetRelease = "{RequiredReleaseSHA1}";
        }

        if (this.isVerifying === true) {
            this.isVerifying = false;
            versionFilename = this.manifest.expandString("{VersionPath}");
            if (platform.fileExists(versionFilename) === true) {
                this.changeState(patchChannelState.VERIFY);
                this.versionVerify.setFileName(versionFilename);
                this.versionVerify.setAllowQuickScan(this.fastVerify);
                this.versionVerify.setAllowDeepScan(true);
                this.versionVerify.start();
                return;
            }
        }

        if (this.patchesRequired.length > 0 || this.patchesUpcoming.length > 0) {
            versionFilename = this.manifest.expandString("{VersionPath}");
            this.changeState(patchChannelState.QUEUED);
            notificationCenter.fire("PatchChannel", "PatchPending", this, {
                "required": this.patchesRequired,
                "upcoming": this.patchesUpcoming
            });
            this.patchesRequired = [];
            this.patchesUpcoming = [];
            return;
        } else {
            this.patchesRequired = [];
            this.patchesUpcoming = [];
            notificationCenter.fire("PatchChannel", "UpToDate", this, {});
            return;
        }
    }

    this.httpRequest.reset();
    this.httpRequest.start();
};

PatchChannel.prototype.onManifestDownloadComplete = function(info) {
    if (info.httpCode === 304) {
        this.changeState(patchChannelState.COMPLETE);
        return;
    } else if (info.httpCode !== 200) {
        this.lastError = patcherError.getPatchManifestError(patchManifestError.DOWNLOADFAIL);
        this.changeState(patchChannelState.FAIL);
        return;
    }

    this.manifest.start();
};

PatchChannel.prototype.onVerifyStart = function(info) {
    this.patchesRequired = [];
    this.patchesUpcoming = [];
    this.maskedFiles = [];
};

PatchChannel.prototype.onVerifyCorruptFile = function(info) {
    this.maskedFiles.push(info.name);
};

PatchChannel.prototype.onVerifyComplete = function(info) {
    if (this.maskedFiles.length === 0) {
        this.reset();
    } else {
        if (this.versionVerify.getSelfUpdate() === true) {
            // Force self-updates to be uninstall for repair to work properly
            this.setUninstall(true);
        }

        if (this.isUninstalling === true) {
            this.maskedFiles = [];
            this.isUpdatingVersion = false;
            this.isRepairing = false;
            this.sourceRelease = "{EmptyReleaseSHA1}";
            this.targetRelease = "{RequiredReleaseSHA1}";
        }
    }

    this.changeState(patchChannelState.GETMANIFEST);
    this.manifest.start();
};

PatchChannel.prototype.getRequiredCount = function() {
    return this.patchesRequired.length;
};

PatchChannel.prototype.getState = function() {
    return this.currentState;
};

PatchChannel.prototype.getLastError = function() {
    return this.lastError;
};

PatchChannel.prototype.setUrl = function(url) {
    if (this.isRunning === true) {
        host.assert(false, "Unable to update patch channel url while already running");
        return;
    }

    var filename = host.urlToFileName(url, "{LocalStorage}", ".patchmanifest");

    this.manifest.setFilename(filename);

    this.httpRequest.setUrl(url);
    this.httpRequest.setFileName(filename);
};

PatchChannel.prototype.setUninstall = function(uninstall) {
    this.isUninstalling = uninstall;
};

PatchChannel.prototype.setFastVerify = function(fastVerify) {
    this.fastVerify = fastVerify;
};

PatchChannel.prototype.setAllowPartial = function(allowPartial) {
    this.allowPartial = allowPartial;
};

PatchChannel.prototype.setRequiredReleaseId = function(id) {
    this.requiredReleaseId = id;
};

PatchChannel.prototype.setUpcomingReleaseId = function(id) {
    this.upcomingReleaseId = id;
};

PatchChannel.prototype.reset = function() {
    this.isUpdatingVersion = false;
    this.isRepairing = false;
    this.isVerifying = false;
    this.lastError = 0;
    this.maskedFiles = [];
    this.patchesRequired = [];
    this.patchesUpcoming = [];
    this.timeStart = app.getCurrentTime();
    this.timeStop = 0;
    this.sourceRelease = "{CurrentReleaseSHA1}";
    this.targetRelease = "{RequiredReleaseSHA1}";
};

PatchChannel.prototype.resume = function(successful, lastError) {
    if (this.isRunning === false) {
        host.assert(false, "Unable to resume patch channel while not running");
        return;
    }

    if (successful === true) {
        if (this.isUpdatingVersion === true) {
            this.isUpdatingVersion = false;
            this.isRepairing = true;
            this.changeState(patchChannelState.GETMANIFEST);
            this.manifest.start();
            return;
        }

        if (this.isRepairing === false && this.isUpdatingVersion === false) {
            this.sourceRelease = "{CurrentReleaseSHA1}";
        }

        if (this.manifest.getTargetReleaseId() !== this.manifest.getCurrentReleaseId() &&
            this.manifest.getTargetReleaseId() !== this.manifest.getUpcomingReleaseId()) {
            this.changeState(patchChannelState.GETMANIFEST);
            this.manifest.start();
            return;
        }

        this.httpRequest.reset();
        this.httpRequest.start();
    } else {
        this.lastError = lastError;
        this.changeState(patchChannelState.FAIL);
    }
};

PatchChannel.prototype.update = function() {
    if (this.isRunning === true) {
        host.assert(false, "Unable to update patch channel while already running");
        return;
    }

    this.reset();

    this.isRunning = true;

    notificationCenter.fire("PatchChannel", "Start", this, {
        "repair": false
    });
    this.changeState(patchChannelState.GETMANIFEST);
    this.manifest.start();
};

PatchChannel.prototype.repair = function() {
    if (this.isRunning === true) {
        host.assert(false, "Unable to repair patch channel while already running");
        return;
    }

    this.reset();
    
    this.isRunning = true;
    this.isUpdatingVersion = true;
    this.sourceRelease = "{EmptyReleaseSHA1}";

    notificationCenter.fire("PatchChannel", "Start", this, {
        "repair": true 
    });
    this.changeState(patchChannelState.GETMANIFEST);
    this.manifest.start();
};

PatchChannel.prototype.getRunningTime = function() {
    if (this.timeStop > 0) {
        return this.timeStop - this.timeStart;
    }
    
    return app.getCurrentTime() - this.timeStart;
};

function createPatchChannel() {
    return new PatchChannel();
}
/*!
* \file patchchannelstate.js
* \brief File containing patch channel state constants and helper functions
*/

/*!
* \class PatchChannelState
* \brief Patch channel state constants and helper functions
*/

function PatchChannelState() {
    /*!
    * Get manifest state
    * \type int
    */
    this.GETMANIFEST = 0;
    /*!
    * Queued state
    * \type int
    */
    this.QUEUED = 1;
    /*!
    * Verify patch
    * \type int
    */
    this.VERIFY = 2;
    /*
    * Patch Complete
    * \type int
    */
    this.COMPLETE = 3;
    /*!
    * Patch Fail
    * \type int
    */
    this.FAIL = 4;
}

/*!
* converts a patch channel state to a string
* \tparam int id patch channel state
* \type string
* \returns stringified name of file error.
*/
PatchChannelState.prototype.nameFromId = function(id) {
    var nameMap = [
        "GetManifest",
        "Optional",
        "Verifying",
        "Complete",
        "Fail"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of PatchChannelState
* \type PatchChannelState
*/
var patchChannelState = new PatchChannelState();

function PatchController(task, args) {
    var self = this;

    this.instanceId = app.expandString("{Guid}");
    this.observers = [];
    this.isLaunching = false;
    this.uninstall = false;
    this.fastVerify = false;
    this.currentState = patchControllerState.IDLE;
    this.patchChannel = createPatchChannel();
    this.patchQueue = createPatchQueue();
    this.download = this.patchQueue.download;
    this.updateIntervalId = null;
    this.requiresUpdate = false;
    this.url = null;
    this.lastError = 0;
    this.isUpcoming = false;
    this.isLaunching = false;
    this.allowPartial = true;

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("PatchChannel", "Complete", this.patchChannel, function(sender, info) { self.onPatchChannelComplete(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchChannel", "PatchPending", this.patchChannel, function(sender, info) { self.onPatchChannelPatchPending(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchChannel", "UpToDate", this.patchChannel, function(sender, info) { self.onPatchChannelUpToDate(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchChannel", "PatchConfigure", this.patchChannel, function(sender, info) { self.onPatchChannelPatchConfigure(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchChannel", "StateChange", this.patchChannel, function(sender, info) { self.onPatchChannelStateChange(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "Start", this.patchQueue, function(sender, info) { self.onPatchQueueStart(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "StateChange", this.patchQueue, function(sender, info) { self.onPatchQueueStateChange(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "ConfigureDownload", this.patchQueue, function(sender, info) { self.onPatchQueueConfigureDownload(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "DidProcessPatch", this.patchQueue, function(sender, info) { self.onPatchQueueDidProcessPatch(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "RequiredComplete", this.patchQueue, function(sender, info) { self.onPatchQueueRequiredComplete(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "Complete", this.patchQueue, function(sender, info) { self.onPatchQueueComplete(task, info); }));
}

PatchController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
    
    if (!isNull(this.updateIntervalId)) {
        clearInterval(this.updateIntervalId);
        this.updateIntervalId = null;
    }

    if (!isNull(this.patchChannel)) {
        this.patchChannel.release();
        this.patchChannel = null;
    }

    if (!isNull(this.patchQueue)) {
        this.patchQueue.release();
        this.patchQueue = null;
    }

    this.download = null;
};

PatchController.prototype.changeState = function(state) {
    var previousState;
    if (state === this.currentState) {
        return;
    }

    previousState = this.currentState;
    this.currentState = state;
    notificationCenter.fire("PatchController", "StateChange", this, { "state": state, "previousState": previousState });
    
    switch (state) {
        case patchControllerState.COMPLETE:
            this.timeStop = app.getCurrentTime();
            notificationCenter.fire("PatchController", "Complete", this, { "successful": true });
            break;

        case patchControllerState.FAIL:
            this.timeStop = app.getCurrentTime();
            notificationCenter.fire("PatchController", "Complete", this, { "successful": false });
            break;
    }
};

PatchController.prototype.onChannelStart = function(task, info) {
    var self = this;

    if (hasOwnProperty(task.args, "updateInterval") && task.args.updateInterval > 0) {
        this.updateIntervalId = setInterval(function() {
            self.update();
        }, task.args.updateInterval * 1000);
    }

    if (hasOwnProperty(task.args, "repair") && task.args.repair === true) {
        this.repair();
    } else {
        this.update();
    }
};

PatchController.prototype.onStart = function(task, info) {
    task.assertArgument("url");

    this.url = task.args.url;

    if (hasOwnProperty(task.args, "allowPartial") && task.args.allowPartial === false) {
        this.allowPartial = false;
    }

    if (hasOwnProperty(task.args, "uninstall") && task.args.uninstall === true) {
        this.uninstall = true;
    } else {
        this.uninstall = false;
    }

    if (hasOwnProperty(task.args, "fastVerify") && task.args.fastVerify === true) {
        this.fastVerify = true;
    } else {
        this.fastVerify = false;
    }

    if (hasOwnProperty(task.args, "requiredReleaseId")) {
        this.patchChannel.setRequiredReleaseId(task.args.requiredReleaseId);
    }

    if (hasOwnProperty(task.args, "upcomingReleaseId")) {
        this.patchChannel.setUpcomingReleaseId(task.args.upcomingReleaseId);
    }

    this.onChannelStart(task, info);
};

PatchController.prototype.onAddPatchesToQueue = function(task, info) {
    var self = this;

    this.patchQueue.reset();
    this.patchQueue.add(info.required, info.upcoming);

    if (this.patchQueue.patchesRequired.length > 0 && this.patchChannel.isUpdatingVersion === false) {
        task.runSubAction("patchRequired", null, function(completeTask, completeInfo) {
            if (isNull(completeTask) || !completeTask.hasError()) {
                self.patchQueue.start();
            } else {
                self.resume(false, patcherError.USERABORT);
            }
        });
    } else {
        self.patchQueue.start();
    }
};

PatchController.prototype.onPatchChannelComplete = function(task, info) {
    if (this.requiresUpdate === true) {
        this.update();
        return;
    }

    if (info.successful === true) {
        if (this.currentState != patchControllerState.FAIL) {
            this.changeState(patchControllerState.COMPLETE);
        }
        task.complete();
    } else {
        this.lastError = this.patchChannel.lastError;
        this.changeState(patchControllerState.FAIL);
        if(this.lastError == (patcherError.errorBasePatchManifest + patchManifestError.VERSIONFAIL)) {
            task.runSubAction("versionfail", null, function(subTask, subTaskInfo) {
                task.complete();
            });
        }
        else
            task.complete();
    }
};

PatchController.prototype.onPatchChannelPatchPending = function(task, info) {
    var self = this;

    info.required.forEach(function(patchInfo) {
        patchInfo.controller = self;
    });

    info.upcoming.forEach(function(patchInfo) {
        patchInfo.controller = self;
    });

    self.onAddPatchesToQueue(task, info);
};

PatchController.prototype.onPatchChannelUpToDate = function(task, info) {
    this.patchQueue.start();
};

PatchController.prototype.onPatchChannelPatchConfigure = function(task, info) {
    var config = {};
    if (hasOwnProperty(task.args, "config")) {
        mergeObjectProperties(config, task.args.config, true);
    }

    if (hasOwnProperty(task.args, "config_{0}toX".format(info.patchInfo.fromId))) {
        mergeObjectProperties(config, task.args["config_{0}toX".format(info.patchInfo.fromId)], true);
    }

    if (hasOwnProperty(task.args, "config_Xto{0}".format(info.patchInfo.toId))) {
        mergeObjectProperties(config, task.args["config_Xto{0}".format(info.patchInfo.toId)], true);
    }

    if (hasOwnProperty(task.args, "config_{0}to{1}".format(info.patchInfo.fromId, info.patchInfo.toId))) {
        mergeObjectProperties(config, task.args["config_{0}to{1}".format(info.patchInfo.fromId, info.patchInfo.toId)], true);
    }

    info.patchInfo.config = config;
    info.patchInfo.allowDownloadEvents = false;
    info.patchInfo.title = "";

    if (hasOwnProperty(task.args, "title")) {
        info.patchInfo.title = task.args.title;
    }
    
    if (hasOwnProperty(task.args, "allowDownloadEvents")) {
        info.patchInfo.allowDownloadEvents = task.args.allowDownloadEvents;
    }
};

PatchController.prototype.onPatchChannelStateChange = function(task, info) {
    switch (info.state) {
        case patchChannelState.VERIFY:
            this.changeState(patchControllerState.VERIFY);
            break;
    }
};

PatchController.prototype.onPatchQueueConfigureDownload = function(task, info) {
    this.patchQueue.configureDownload(this.download, info.patchInfo.config, info.patchInfo.allowDownloadEvents);
};

PatchController.prototype.onPatchQueueStart = function(task, info) {
    this.isUpcoming = false;
};

PatchController.prototype.onPatchQueueRequiredComplete = function(task, info) {
    this.isUpcoming = true;
};

PatchController.prototype.onPatchQueueStateChange = function(task, info) {
    switch (info.state) {
        case patchQueueState.DOWNLOAD:
            if (this.isUpcoming === true) {
                this.changeState(patchControllerState.DOWNLOADUPCOMING);
            } else {
                this.changeState(patchControllerState.DOWNLOAD);
            }
            break;

        case patchQueueState.MASK:
            this.changeState(patchControllerState.MASK);
            break;

        case patchQueueState.PATCH:
            this.changeState(patchControllerState.PATCH);
            break;

        case patchQueueState.UNINSTALL:
            this.changeState(patchControllerState.UNINSTALL);
            break;

        case patchQueueState.UPDATINGVERSION:
            this.changeState(patchControllerState.UPDATEVERSION);
            break;
    }
};

PatchController.prototype.onPatchQueueDidProcessPatch = function(task, info) {
    if (info.patchInfo.isUpcoming === false) {
        this.download.setOptionBoolean("autoDelete", true);
    } else {
        this.download.setOptionBoolean("autoDelete", false);
    }
    this.download.stop();
};

PatchController.prototype.onPatchQueueComplete = function(task, info) {
    this.isUpcoming = false;
    this.resume(info.successful, this.patchQueue.getLastError());
};

PatchController.prototype.isComplete = function() {
    switch (this.patchChannel.getState()) {
        case patchChannelState.FAIL:
        case patchChannelState.COMPLETE:
            return true;
    }

    return false;
};

PatchController.prototype.isRunning = function() {
    return this.patchChannel.isRunning || this.patchQueue.isRunning || this.isLaunching;
};

PatchController.prototype.getRunningTime = function() {
    if (this.timeStop > 0) {
        return this.timeStop - this.timeStart;
    }

    return app.getCurrentTime() - this.timeStart;
};

PatchController.prototype.getVerifyBytesLeft = function() {
    return this.patchChannel.versionVerify.getBytesLeft();
};

PatchController.prototype.getVerifyTotalBytes = function() {
    return this.patchChannel.versionVerify.getTotalBytes();
};

PatchController.prototype.resume = function(successful, lastError) {
    this.patchChannel.resume(successful, lastError);
};

PatchController.prototype.update = function() {
    if (this.isRunning() === true) {
        this.requiresUpdate = true;
        return;
    }

    this.timeStart = app.getCurrentTime();
    this.timeStop = 0;
    this.requiresUpdate = false;
    this.lastError = 0;
    this.changeState(patchControllerState.UPDATE);
    this.patchChannel.setAllowPartial(this.allowPartial);
    this.patchChannel.setFastVerify(this.fastVerify);
    this.patchChannel.setUninstall(this.uninstall);
    this.patchChannel.setUrl(app.expandString(this.url));
    this.patchChannel.update();
};

PatchController.prototype.repair = function() {
    this.timeStart = app.getCurrentTime();
    this.timeStop = 0;
    this.lastError = 0;
    this.changeState(patchControllerState.REPAIR);
    this.patchChannel.setAllowPartial(this.allowPartial);
    this.patchChannel.setFastVerify(this.fastVerify);
    this.patchChannel.setUninstall(this.uninstall);
    this.patchChannel.setUrl(app.expandString(this.url));
    this.patchChannel.repair();
};

PatchController.prototype.launch = function(task) {
    var self = this;

    if (this.isRunning === true && this.isUpcoming === false) {
        host.assert(false, "Unable to launch application while patch channel active");
        return;
    }

    if (!isNull(task.args.launch)) {
        // Stop upcoming releases
        this.download.stop();

        this.changeState(patchControllerState.LAUNCH);
        this.isLaunching = true;
        task.runSubAction("launch", null, function(launchTask, launchInfo) {
            launchInfo.launchTask = launchTask;
            self.changeState(patchControllerState.COMPLETE);
            self.isLaunching = false;

            if (self.isUpcoming === true) {
                // Restart upcoming releases
                self.download.start();
            }
        });
    }
};

PatchController.prototype.getDownload = function() {
    return this.download;
};

registerTaskController("patch", PatchController);

/*!
* \file patchcontrollerstate.js
* \brief File containing patch controller state constants and helper functions
*/

/*!
* \class PatchControllerState
* \brief Patch controller state constants and helper functions
*/

function PatchControllerState() {
    /*!
    * Idle State
    * \type int
    */
    this.IDLE = 0;
    /*!
    * Download State
    * \type int
    */
    this.DOWNLOAD = 1;
    /*!
    * Download Upcoming Release
    * \type int
    */
    this.DOWNLOADUPCOMING = 2;
    /*!
    * Uninstall
    * \type int
    */
    this.UNINSTALL = 3;
    /*!
    * Mask State
    * \type int
    */
    this.MASK = 4;
    /*!
    * Patch State
    * \type int
    */
    this.PATCH = 5;
    /*!
    * Update Version State
    * \type int
    */
    this.UPDATEVERSION = 6;
    /*!
    * Update State
    * \type int
    */
    this.UPDATE = 7;
    /*!
    * Repair State
    * \type int
    */
    this.REPAIR = 8;
    /*!
    * Verify State
    * \type int
    */
    this.VERIFY = 9;
    /*!
    * Fail State
    * \type int
    */
    this.FAIL = 10;
    /*!
    * Complete State
    * \type int
    */
    this.COMPLETE = 11;
    /*!
    * Launch State
    * \type int
    */
    this.LAUNCH = 12;
}

/*!
* converts a patch controller state to a string
* \tparam int id patch channel state
* \type string
* \returns stringified name of file error.
*/
PatchControllerState.prototype.nameFromId = function(id) {
    var nameMap = [
        "Idle",
        "Downloading",
        "DownloadingUpcoming",
        "Uninstalling",
        "Masking",
        "Patching",
        "UpdatingVersion",
        "Updating",
        "Repairing",
        "Verifying",
        "Fail",
        "Complete",
        "Launching"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of PatchControllerState
* \type PatchControllerState
*/
var patchControllerState = new PatchControllerState();

/*!
* \file PatcherError.js
* \brief File containing patcher error constants and helper functions
*/

/*!
* \class PatcherError
* \brief Patcher error constants and helper functions
*/
function PatcherError() {
    this.USERABORT = 1;

    this.errorBaseDownload = 100;
    this.errorBasePatchManifest = 200;
    this.errorBasePatch = 300;
    this.errorBaseOS = 1000;
}

PatcherError.prototype.getDownloadError = function(error) {
    return this.errorBaseDownload + error;
}

PatcherError.prototype.getPatchManifestError = function(error) {
    return this.errorBasePatchManifest + error;
}

PatcherError.prototype.getPatchError = function(error) {
    return this.errorBasePatch + error;
}

PatcherError.prototype.getOSError = function(error) {
    return this.errorBaseOS + error;
}

PatcherError.prototype.errorStringFromId = function(id) {
    if (id >= this.errorBaseOS) {
        return "OSError_" + osError.nameFromId(id - this.errorBaseOS);
    }
    if (id >= this.errorBasePatch) {
        return "PatchError_" + patchError.nameFromId(id - this.errorBasePatch);
    }
    if (id >= this.errorBasePatchManifest) {
        return "PatchManifestError_" + patchManifestError.nameFromId(id - this.errorBasePatchManifest);
    }
    if (id >= this.errorBaseDownload) {
        return "DownloadError_" + downloadError.nameFromId(id - this.errorBaseDownload);
    }
    if (id === patcherError.USERABORT) {
        return "PatcherError_UserAbort";
    }

    return "PatcherError_Unknown";
};

/*!
* precreated global instance of PatcherError
* \type PatcherError
*/
var patcherError = new PatcherError();

/*!
* \file PatchError.js
* \brief File containing patch error constants and helper functions
*/

/*!
* \class PatchError
* \brief Patch error constants and helper functions
*/

function PatchError() {
    /*!
    * Unknown
    * \type int
    */
    this.UNKNOWN = 0;
    /*!
    * Corrupt Source
    * \type int
    */
    this.CORRUPTSOURCE = 1;
    /*!
    * Corrupt Source
    * \type int
    */
    this.CORRUPTDEST = 2;
    /*!
    * Failed to unzip patch
    * \type int
    */
    this.UNZIPFAIL = 3;
}

/*!
* converts a patch error to a string
* \tparam int id patch error
* \type string
* \returns stringified name of patch error.
*/
PatchError.prototype.nameFromId = function(id) {
    var nameMap = [
        "Unknown",
        "CorruptSource",
        "CorruptDest",
        "UnzipFail"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of PatchError
* \type PatchError
*/
var patchError = new PatchError();

/*!
* \file PatchErrorType.js
* \brief File containing patch error type constants and helper functions
*/

/*!
* \class PatchErrorType
* \brief Patch error type constants and helper functions
*/

function PatchErrorType() {
    /*!
    * Unknown
    * \type int
    */
    this.UNKNOWN = 0;
    /*!
    * Patch Error
    * \type int
    */
    this.PATCH = 1;
    /*!
    * OS Error
    * \type int
    */
    this.OSERROR = 2;
}

/*!
* converts a patch error type to a string
* \tparam int id patch error type
* \type string
* \returns stringified name of error type.
*/
PatchErrorType.prototype.nameFromId = function(id) {
    var nameMap = [
        "Unknown",
        "PatchError",
        "OSError"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of PatchErrorType
* \type PatchErrorType
*/
var patchErrorType = new PatchErrorType();

function PatchExistsController(task, args) {
    var self = this, origStateChange;

    this.observers = [];
    this.removeManifest = false;

    this.patchChannel = createPatchChannel();

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("PatchChannel", "UpToDate", this.patchChannel, function(sender, info) { self.onPatchUpToDate(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchChannel", "PatchPending", this.patchChannel, function(sender, info) { self.onPatchPending(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchChannel", "Complete", this.patchChannel, function(sender, info) { self.onPatchComplete(task, info); }));
}

PatchExistsController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
    if (!isNull(this.patchChannel)) {
        this.patchChannel.release();
        this.patchChannel = null;
    }
};

PatchExistsController.prototype.cleanLocalManifest = function() {
    if (!isNull(this.patchChannel)) {
        if (this.removeManifest === true) {
            this.removeManifest = false;
            this.patchChannel.cleanLocalManifest();
        }
    }
};

PatchExistsController.prototype.onPatchComplete = function(task, info) {
    this.cleanLocalManifest();
    
    if (false === info.successful) {
        task.error(patcherError.errorStringFromId(this.patchChannel.getLastError()));
        if(this.patchChannel.getLastError() == (patcherError.errorBasePatchManifest + patchManifestError.VERSIONFAIL)) {
            task.runSubAction("versionfail", null, function(subTask, subTaskInfo) {
                task.complete();
            });
        }
        else
        task.complete();
    }
};

PatchExistsController.prototype.onPatchUpToDate = function(task, info) {
    this.cleanLocalManifest();

    task.runSubAction("uptodate", null, function(subTask, subTaskInfo) {
        task.complete();
    });
};

PatchExistsController.prototype.onPatchPending = function(task, info) {
    this.cleanLocalManifest();

    if (info.required.length > 0) {
        if (info.required[0].fromId < 0) {
            task.runSubAction("missing", null, function(subTask, subTaskInfo) {
                task.complete();
            });
        } else {
            task.runSubAction("required", null, function(subTask, subTaskInfo) {
                task.complete();
            });
        }
    } else if (info.upcoming.length > 0) {
        task.runSubAction("upcoming", null, function(subTask, subTaskInfo) {
            task.complete();
        });
    }
};

PatchExistsController.prototype.onStart = function(task, info) {
    task.assertArgument("url");

    this.patchChannel.setUrl(app.expandString(task.args.url));
    this.removeManifest = platform.fileExists(this.patchChannel.manifest.getFilename()) === false;

    this.patchChannel.update();
};

registerTaskController("checkPatchExists", PatchExistsController);

function PatchGroupController(task, args) {
    var self = this;

    this.instanceId = app.expandString("{Guid}");
    this.observers = [];
    this.queueController = new QueueController(task, args);
    this.patchQueue = createPatchQueue();
    this.download = this.patchQueue.download;
    this.subControllers = [];
    this.activeSubControllers = [];
    this.patchesRequired = {};
    this.patchesUpcoming = {};
    this.currentState = patchControllerState.IDLE;
    this.requiresUpdate = false;
    this.updateIntervalId = null;
    this.isRepairing = false;
    this.isUpcoming = false;
    this.isLaunching = false;
    this.failed = false;
    this.lastError = 0;
    this.timeStart = 0;
    this.timeStop = 0;

    this.queueController.onQueueComplete = function(task, info) {
        if (task.hasError() === false) {
            if (hasOwnProperty(task.args, "updateInterval") && task.args.updateInterval > 0) {
                self.updateIntervalId = setInterval(function() {
                    self.update();
                }, task.args.updateInterval * 1000);
            }

            if (hasOwnProperty(task.args, "repair") && task.args.repair === true) {
                self.repair();
            } else {
                self.update();
            }
        }
    };

    this.observers.push(notificationCenter.addInstanceObserver("Task", "SubTaskCreate", task, function(sender, info) { self.onSubTaskCreate(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "Start", this.patchQueue, function(sender, info) { self.onPatchQueueStart(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "StateChange", this.patchQueue, function(sender, info) { self.onPatchQueueStateChange(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "ConfigureDownload", this.patchQueue, function(sender, info) { self.onPatchQueueConfigureDownload(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "DidProcessPatch", this.patchQueue, function(sender, info) { self.onPatchQueueDidProcessPatch(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "RequiredComplete", this.patchQueue, function(sender, info) { self.onPatchQueueRequiredComplete(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "Complete", this.patchQueue, function(sender, info) { self.onPatchQueueComplete(task, info); }));
}

PatchGroupController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.queueController)) {
        this.queueController.release();
        this.queueController = null;
    }

    if (!isNull(this.updateIntervalId)) {
        clearInterval(this.updateIntervalId);
        this.updateIntervalId = null;
    }

    if (!isNull(this.patchQueue)) {
        this.patchQueue.release();
        this.patchQueue = null;
    }

    this.subControllers = [];
    this.download = null;
};

PatchGroupController.prototype.removeActiveController = function(subController, completeCallback) {
    this.activeSubControllers.removeElement(subController);

    if (this.activeSubControllers.length === 0) {
        completeCallback();
    }
};

PatchGroupController.prototype.onSubTaskCreate = function(task, info) {
    var self = this, subTask = info.subTask;

    if (subTask.args.type.toLowerCase() === "patch") {
        function patchQueueStart() {
            if (self.isComplete() === true) {
                if (self.failed === true) {
                    self.changeState(patchControllerState.FAIL);
                } else {
                    self.changeState(patchControllerState.COMPLETE);
                }

                task.complete();
                return;
            }

            self.patchQueue.reset();
            self.subControllers.forEach(function(subController) {
                self.patchQueue.add(self.patchesRequired[subController.instanceId], self.patchesUpcoming[subController.instanceId]);
            });

            if (self.patchQueue.patchesRequired.length > 0 && subTask.controller.patchChannel.isUpdatingVersion === false) {
                task.runSubAction("patchRequired", null, function(completeTask, completeInfo) {
                    if (isNull(completeTask) || !completeTask.hasError()) {
                        self.patchQueue.start();
                    } else {
                        self.resume(false, patcherError.USERABORT);
                    }
                });
            } else {
                self.patchQueue.start();
            }
        }

        var oldRelease = subTask.controller.release;
        subTask.controller.release = function() {
            self.subControllers.removeElement(subTask.controller);
            oldRelease.call(subTask.controller);
        };

        subTask.controller.onChannelStart = function(task, info) {
            subTask.controller.download = self.download;

            subTask.complete();
        };

        subTask.controller.onAddPatchesToQueue = function(task, info) {
            self.patchesRequired[subTask.controller.instanceId] = info.required;
            self.patchesUpcoming[subTask.controller.instanceId] = info.upcoming;
            self.removeActiveController(subTask.controller, patchQueueStart);
        };

        subTask.controller.onPatchChannelUpToDate = function(task, info) {
            self.patchesRequired[subTask.controller.instanceId] = [];
            self.patchesUpcoming[subTask.controller.instanceId] = [];
            self.removeActiveController(subTask.controller, patchQueueStart);
        };

        subTask.controller.onPatchChannelStateChange = function(task, info) {
            switch (info.state) {
                case patchChannelState.VERIFY:
                    self.changeState(patchControllerState.VERIFY);
                    break;
            }
        };

        subTask.controller.onPatchChannelComplete = function(task, info) {
            switch (self.currentState) {
                case patchControllerState.COMPLETE:
                case patchControllerState.FAIL:
                    break;

                default:
                    if (info.successful === false) {
                        self.failed = true;
                        self.lastError = this.patchChannel.lastError;
                    }
                    break;
            }

            self.removeActiveController(subTask.controller, patchQueueStart);
        };

        this.subControllers.push(subTask.controller);
    }
};

PatchGroupController.prototype.onPatchQueueStart = function(task, info) {
    this.isUpcoming = false;
};

PatchGroupController.prototype.onPatchQueueRequiredComplete = function(task, info) {
    this.isUpcoming = true;
};

PatchGroupController.prototype.onPatchQueueStateChange = function(task, info) {
    switch (info.state) {
        case patchQueueState.DOWNLOAD:
            if (this.isUpcoming === true) {
                this.changeState(patchControllerState.DOWNLOADUPCOMING);
            } else {
                this.changeState(patchControllerState.DOWNLOAD);
            }
            break;

        case patchQueueState.MASK:
            this.changeState(patchControllerState.MASK);
            break;

        case patchQueueState.PATCH:
            this.changeState(patchControllerState.PATCH);
            break;

        case patchQueueState.UNINSTALL:
            this.changeState(patchControllerState.UNINSTALL);
            break;

        case patchQueueState.UPDATINGVERSION:
            this.changeState(patchControllerState.UPDATEVERSION);
            break;
    }
};

PatchGroupController.prototype.onPatchQueueConfigureDownload = function(task, info) {
    this.patchQueue.configureDownload(this.download, info.patchInfo.config, info.patchInfo.allowDownloadEvents);
};

PatchGroupController.prototype.onPatchQueueDidProcessPatch = function(task, info) {
    if (info.patchInfo.isUpcoming === false) {
        this.download.setOptionBoolean("autoDelete", true);
    } else {
        this.download.setOptionBoolean("autoDelete", false);
    }
    this.download.stop();
};

PatchGroupController.prototype.onPatchQueueComplete = function(task, info) {
    this.patchesRequired = {};
    this.patchesUpcoming = {};
    this.isUpcoming = false;

    this.resume(info.successful, this.patchQueue.getLastError());
};

PatchGroupController.prototype.getVerifyBytesLeft = function() {
    var retVal = 0;

    this.subControllers.forEach(function(subController) {
        retVal += subController.getVerifyBytesLeft();
    });

    return retVal;
};

PatchGroupController.prototype.getVerifyTotalBytes = function() {
    var retVal = 0;
    var calc = false;

    this.subControllers.forEach(function(subController) {
        var totalBytes = 0;
        totalBytes = subController.getVerifyTotalBytes();
        if (totalBytes == 0) {
            calc = true;
        }
        retVal += totalBytes;
    });

    if (calc == true) {
        return 0;
    }

    return retVal;
};

PatchGroupController.prototype.changeState = function(state) {
    var previousState;
    if (state === this.currentState) {
        return;
    }

    previousState = this.currentState;
    this.currentState = state;
    notificationCenter.fire("PatchController", "StateChange", this, { "state": state, "previousState": previousState });

    switch (state) {
        case patchControllerState.COMPLETE:
            this.timeStop = app.getCurrentTime();
            notificationCenter.fire("PatchController", "Complete", this, { "successful": true });
            if (this.requiresUpdate === true) {
                this.update();
            }
            break;

        case patchControllerState.FAIL:
            this.timeStop = app.getCurrentTime();
            notificationCenter.fire("PatchController", "Complete", this, { "successful": false });
            break;
    }
};

PatchGroupController.prototype.resume = function(successful, lastError) {
    var self = this;

    host.assert(this.activeSubControllers.length === 0, "Trying to reset subcontrollers while some are still active (resume)");
    this.subControllers.forEach(function(subController) {
        if (subController.isComplete() === false) {
            self.activeSubControllers.push(subController);
        }
    });

    this.subControllers.forEach(function(subController) {
        if (subController.isComplete() === false) {
            subController.resume(successful, lastError);
        }
    });
};

PatchGroupController.prototype.update = function() {
    if (this.isRunning() === true) {
        this.requiresUpdate = true;
        return;
    }

    var self = this;
    this.patchQueue.reset();
    this.patchesRequired = {};
    this.patchesUpcoming = {};
    this.timeStart = app.getCurrentTime();
    this.timeStop = 0;
    this.isRepairing = false;
    this.requiresUpdate = false;
    this.lastError = 0;
    this.failed = false;
    
    this.changeState(patchControllerState.UPDATE);

    host.assert(this.activeSubControllers.length === 0, "Trying to reset subcontrollers while some are still active (update)");
    this.subControllers.forEach(function(subController) {
        self.activeSubControllers.push(subController);
    });
    
    this.subControllers.forEach(function(subController) {
        subController.update();
    });
};

PatchGroupController.prototype.repair = function() {
    if (this.isRunning() === true) {
        host.assert(false, "Trying to repair patch group that is still active");
        return;
    }

    var self = this;
    this.patchQueue.reset();
    this.timeStart = app.getCurrentTime();
    this.timeStop = 0;
    this.isRepairing = true;
    this.lastError = 0;
    this.failed = false;
    this.changeState(patchControllerState.REPAIR);

    host.assert(this.activeSubControllers.length === 0, "Trying to reset subcontrollers while some are still active (repair)");
    this.subControllers.forEach(function(subController) {
        self.activeSubControllers.push(subController);
    });
    
    this.subControllers.forEach(function(subController) {
        subController.repair();
    });
};

PatchGroupController.prototype.launch = function(task) {
    var self = this;

    if (this.isRunning() === true && this.isUpcoming === false) {
        host.assert(false, "Unable to launch application while patch group active");
        return;
    }

    if (!isNull(task.args.launch)) {
        // Stop upcoming releases
        this.download.stop();

        this.changeState(patchControllerState.LAUNCH);
        this.isLaunching = true;
        task.runSubAction("launch", null, function(launchTask, launchInfo) {
            launchInfo.launchTask = launchTask;
            self.changeState(patchControllerState.COMPLETE);
            self.isLaunching = false;

            if (self.isUpcoming === true) {
                // Restart upcoming releases
                self.download.start();
            }
        });
    }
};

PatchGroupController.prototype.getRunningTime = function() {
    if (this.timeStop > 0) {
        return this.timeStop - this.timeStart;
    }

    return app.getCurrentTime() - this.timeStart;
};

PatchGroupController.prototype.isComplete = function() {
    var retVal = true;

    if (retVal === true) {
        this.subControllers.forEach(function(subController) {
            if (subController.isComplete() === false) {
                retVal = false;
            }
        });
    }

    return retVal;
};

PatchGroupController.prototype.isRunning = function() {
    var retVal = this.isLaunching;

    if (retVal === false) {
        retVal = this.activeSubControllers.length !== 0;
    }

    if (retVal === false) {
        this.subControllers.forEach(function(subController) {
            if (subController.isRunning() === true) {
                retVal = true;
            }
        });
    }

    return retVal;
};

PatchGroupController.prototype.getDownload = function() {
    return this.download;
};

registerTaskController("patchgroup", PatchGroupController);

/*!
* \file PatchManifest.js
* \brief File containing PatchManifest class and creation function
*/

/*!
* \class PatchManifest
* \brief Process a patch manifest
*/




function PatchManifest(instanceId)
{
   /*!
   * Instance id used to bind proxy object to native object
   * \type string
   */
   this.instanceId = instanceId;
}

/*!
* releases the object
*/
PatchManifest.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the location for patch manifest
* \type string
* \returns location for patch manifest
*/
PatchManifest.prototype.getFilename = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFilename"
   });
};

/*!
* sets the location for patch manifest
* \tparam string(in) value location for patch manifest
*/
PatchManifest.prototype.setFilename = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFilename", 
      "value":value
   });
};

/*!
* gets the last error encountered by the manifest
* \type int
* \returns last error encountered by the manifest
*/
PatchManifest.prototype.getLastError = function(){
   return interop.invoke(this.instanceId, {
      "method":"getLastError"
   });
};

/*!
* gets the directory patch will be installed in
* \type string
* \returns directory patch will be installed in
*/
PatchManifest.prototype.getTargetDirectory = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTargetDirectory"
   });
};

/*!
* sets the directory patch will be installed in
* \tparam string(in) value directory patch will be installed in
*/
PatchManifest.prototype.setTargetDirectory = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setTargetDirectory", 
      "value":value
   });
};

/*!
* gets the manifest maintenance mode
* \type bool
* \returns manifest maintenance mode
*/
PatchManifest.prototype.getMaintenance = function(){
   return interop.invoke(this.instanceId, {
      "method":"getMaintenance"
   });
};

/*!
* gets the manifest elevation requirement
* \type bool
* \returns manifest elevation requirement
*/
PatchManifest.prototype.getRequiresElevation = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRequiresElevation"
   });
};

/*!
* gets the name of the payload
* \type string
* \returns name of the payload
*/
PatchManifest.prototype.getName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getName"
   });
};

/*!
* gets the sha1 of the source release
* \type string
* \returns sha1 of the source release
*/
PatchManifest.prototype.getSourceReleaseSHA1 = function(){
   return interop.invoke(this.instanceId, {
      "method":"getSourceReleaseSHA1"
   });
};

/*!
* sets the sha1 of the source release
* \tparam string(in) value sha1 of the source release
*/
PatchManifest.prototype.setSourceReleaseSHA1 = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setSourceReleaseSHA1", 
      "value":value
   });
};

/*!
* gets the id of the source release
* \type int
* \returns id of the source release
*/
PatchManifest.prototype.getSourceReleaseId = function(){
   return interop.invoke(this.instanceId, {
      "method":"getSourceReleaseId"
   });
};

/*!
* sets the id of the source release
* \tparam int(in) value id of the source release
*/
PatchManifest.prototype.setSourceReleaseId = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setSourceReleaseId", 
      "value":value
   });
};

/*!
* gets the name of the source release
* \type string
* \returns name of the source release
*/
PatchManifest.prototype.getSourceReleaseName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getSourceReleaseName"
   });
};

/*!
* sets the name of the source release
* \tparam string(in) value name of the source release
*/
PatchManifest.prototype.setSourceReleaseName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setSourceReleaseName", 
      "value":value
   });
};

/*!
* gets the sha1 of the target release
* \type string
* \returns sha1 of the target release
*/
PatchManifest.prototype.getTargetReleaseSHA1 = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTargetReleaseSHA1"
   });
};

/*!
* sets the sha1 of the target release
* \tparam string(in) value sha1 of the target release
*/
PatchManifest.prototype.setTargetReleaseSHA1 = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setTargetReleaseSHA1", 
      "value":value
   });
};

/*!
* gets the id of the target release
* \type int
* \returns id of the target release
*/
PatchManifest.prototype.getTargetReleaseId = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTargetReleaseId"
   });
};

/*!
* sets the id of the target release
* \tparam int(in) value id of the target release
*/
PatchManifest.prototype.setTargetReleaseId = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setTargetReleaseId", 
      "value":value
   });
};

/*!
* gets the name of the target release
* \type string
* \returns name of the target release
*/
PatchManifest.prototype.getTargetReleaseName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTargetReleaseName"
   });
};

/*!
* sets the name of the target release
* \tparam string(in) value name of the target release
*/
PatchManifest.prototype.setTargetReleaseName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setTargetReleaseName", 
      "value":value
   });
};

/*!
* gets the required release declared in the patch manifest
* \type int
* \returns required release declared in the patch manifest
*/
PatchManifest.prototype.getRequiredReleaseId = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRequiredReleaseId"
   });
};

/*!
* sets the required release declared in the patch manifest
* \tparam int(in) value required release declared in the patch manifest
*/
PatchManifest.prototype.setRequiredReleaseId = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setRequiredReleaseId", 
      "value":value
   });
};

/*!
* gets the upcoming release declared in the patch manifest
* \type int
* \returns upcoming release declared in the patch manifest
*/
PatchManifest.prototype.getUpcomingReleaseId = function(){
   return interop.invoke(this.instanceId, {
      "method":"getUpcomingReleaseId"
   });
};

/*!
* sets the upcoming release declared in the patch manifest
* \tparam int(in) value upcoming release declared in the patch manifest
*/
PatchManifest.prototype.setUpcomingReleaseId = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setUpcomingReleaseId", 
      "value":value
   });
};

/*!
* gets the current release declared in the version file
* \type int
* \returns current release declared in the version file
*/
PatchManifest.prototype.getCurrentReleaseId = function(){
   return interop.invoke(this.instanceId, {
      "method":"getCurrentReleaseId"
   });
};

/*!
* Clean the patch manifest and any orphaned patch data
* \tparam bool(in) cleanManifest TRUE to clean patch manifest, FALSE otherwise
* \tparam bool(in) cleanPatches TRUE to clean patch data, FALSE otherwise
*/
PatchManifest.prototype.clean = function(cleanManifest,cleanPatches){
   return interop.invoke(this.instanceId, {
      "method":"clean", 
      "cleanManifest":cleanManifest, 
      "cleanPatches":cleanPatches
   });
};

/*!
* Start processing the patch manifest
*/
PatchManifest.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};

/*!
* This method expands the string with the current macros
* \tparam string(in) expand Name of string to be expanded
* \type string
* \returns expanded string
*/
PatchManifest.prototype.expandString = function(expand){
   return interop.invoke(this.instanceId, {
      "method":"expandString", 
      "expand":expand
   });
};

/*!
* Gets the name for the specified release
* \tparam int(in) id Release id
* \type string
* \returns Name of the specified release (Empty string if not found)
*/
PatchManifest.prototype.getReleaseName = function(id){
   return interop.invoke(this.instanceId, {
      "method":"getReleaseName", 
      "id":id
   });
};

/*!
* Gets extra data value from the specified update path
* \tparam int(in) fromId Release id
* \tparam int(in) toId Release id
* \tparam string(in) key Key associated with value
* \type string
* \returns Value of key stored in extra data for a release path (Empty string if not found)
*/
PatchManifest.prototype.getExtraDataValue = function(fromId,toId,key){
   return interop.invoke(this.instanceId, {
      "method":"getExtraDataValue", 
      "fromId":fromId, 
      "toId":toId, 
      "key":key
   });
};


/*!
* Create instance of patchManifest
*/
function createPatchManifest()
{
   return interop.createInstance("SSN.PatchManifest", PatchManifest);
}


/*!
* \file patchmanifesterror.js
* \brief File containing patch manifest error constants and helper functions
*/

/*!
* \class PatchManifestError
* \brief Patch manifest error constants and helper functions
*/

function PatchManifestError() {
    /*!
    * No error
    * \type int
    */
    this.NONE = 0;
    /*!
    * Invalid argument
    * \type int
    */
    this.INVALIDARGUMENT = 1;
    /*!
    * Source release undefined
    * \type int
    */
    this.SOURCERELEASEUNDEFINED = 2;
    /*!
    * Target release undefined
    * \type int
    */
    this.TARGETRELEASEUNDEFINED = 3;
    /*!
    * Update path unavailable
    * \type int
    */
    this.UPDATEPATHUNAVAILABLE = 4;
    /*!
    * Maintenance flag turned on
    * \type int
    */
    this.MAINTENANCE = 5;
    /*!
    * Unzip failed
    * \type int
    */
    this.UNZIPFAIL = 6;
    /*!
    * Parsing failed
    * \type int
    */
    this.XMLPARSEFAIL = 7;
    /*!
    * Elevation required
    * \type int
    */
    this.REQUIRESELEVATION = 8;
    /*!
    * Version check failed
    * \type int
    */
    this.VERSIONFAIL = 9;
    /*!
    * Download failed
    * \type int
    */
    this.DOWNLOADFAIL = 10;
    /*!
    * Missing metafile
    * \type int
    */
    this.MISSINGMETAFILE = 11;
}

/*!
* converts a patch manifest error to a string
* \tparam int id patch manifest error
* \type string
* \returns stringified name of file error.
*/
PatchManifestError.prototype.nameFromId = function(id) {
    var nameMap = [
        "None",
        "InvalidArgument",
        "SourceReleaseUndefined",
        "TargetReleaseUndefined",
        "UpdatePathUnavailable",
        "Maintenance",
        "UnzipFailed",
        "XmlParseFail",
        "RequiresElevation",
        "VersionFail",
        "DownloadFail",
        "MissingMetafile"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of PatchManifestError
* \type PatchManifestError
*/
var patchManifestError = new PatchManifestError();

/*!
* \file patchmanifeststate.js
* \brief File containing patch manifest state constants and helper functions
*/

/*!
* \class PatchManifestState
* \brief Patch manifest state constants and helper functions
*/

function PatchManifestState() {
    /*!
    * Get manifest state
    * \type int
    */
    this.GETMANIFEST = 0;
    /*!
    * Patch dependency required
    * \type int
    */
    this.DEPENDENCY = 1;
    /*!
    * Patch downloading
    * \type int
    */
    this.DOWNLOAD = 2;
    /*!
    * Applying patch
    * \type int
    */
    this.PATCH = 3;
    /*!
    * Patch Complete
    * \type int
    */
    this.COMPLETE = 4;
}

/*!
* converts a patch manifest state to a string
* \tparam int id patch manifest state
* \type string
* \returns stringified name of file error.
*/
PatchManifestState.prototype.nameFromId = function(id) {
    var nameMap = [
        "GetManifest",
        "Dependency",
        "Downloading",
        "Patching",
        "Complete"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of PatchManifestState
* \type PatchManifestState
*/
var patchManifestState = new PatchManifestState();

function PatchQueue() {
    this.instanceId = app.expandString("{Guid}");
    this.currentState = -1;
    this.isRunning = false;
    this.isPartial = false;
    this.requiredComplete = false;
    this.download = createDownload();
    this.versionUninstall = createPatchVersionUninstall();
    this.versionUpdate = createPatchVersionUpdate();
    this.patch = createPatch();
    this.patchesRequired = [];
    this.patchesUpcoming = [];
    this.observers = [];
    this.cancel = false;
    this.currentPatchInfo = null;
    this.maskIntervalId = null;
    this.resumeTimeoutId = null;
    this.timeStart = 0;
    this.timeStop = 0;
    this.failureCount = 0;

    var self = this;

    this.observers.push(notificationCenter.addInstanceObserver("Download", "ConfigComplete", this.download, function(sender, info) { self.onPatchDownloadConfigComplete(info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Download", "Complete", this.download, function(sender, info) { self.onPatchDownloadComplete(info); }));

    this.observers.push(notificationCenter.addInstanceObserver("PatchVersionUninstall", "Start", this.versionUninstall, function(sender, info) { self.onVersionUninstallStart(info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchVersionUninstall", "StateChange", this.versionUninstall, function(sender, info) { self.onVersionUninstallStateChange(info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchVersionUninstall", "Complete", this.versionUninstall, function(sender, info) { self.onVersionUninstallComplete(info); }));

    this.observers.push(notificationCenter.addInstanceObserver("PatchVersionUpdate", "StateChange", this.versionUpdate, function(sender, info) { self.onVersionUpdateStateChange(info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchVersionUpdate", "Complete", this.versionUpdate, function(sender, info) { self.onVersionUpdateComplete(info); }));

    this.observers.push(notificationCenter.addInstanceObserver("Patch", "Start", this.patch, function(sender, info) { self.onPatchStart(info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Patch", "StateChange", this.patch, function(sender, info) { self.onPatchStateChange(info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Patch", "Complete", this.patch, function(sender, info) { self.onPatchComplete(info); }));
}

PatchQueue.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.resumeTimeoutId)) {
        clearTimeout(this.resumeTimeoutId);
        this.resumeTimeoutId = null;
    }

    if (!isNull(this.maskIntervalId)) {
        clearInterval(this.maskIntervalId);
        this.maskIntervalId = null;
    }

    if (!isNull(this.download)) {
        this.download.stop();
        this.download.release();
        this.download = null;
    }

    if (!isNull(this.versionUninstall)) {
        this.versionUninstall.release();
        this.versionUninstall = null;
    }

    if (!isNull(this.versionUpdate)) {
        this.versionUpdate.release();
        this.versionUpdate = null;
    }

    if (!isNull(this.patch)) {
        this.patch.release();
        this.patch = null;
    }
};

PatchQueue.prototype.changeState = function(state) {
    var previousState;
    if (state === this.currentState) {
        return;
    }

    previousState = this.currentState;
    this.currentState = state;
    notificationCenter.fire("PatchQueue", "StateChange", this, { "state": state, "previousState": previousState });

    switch (state) {
        case patchQueueState.COMPLETE:
            this.timeStop = app.getCurrentTime();
            this.isRunning = false;
            this.isPartial = false;
            notificationCenter.fire("PatchQueue", "Complete", this, { "successful": true });
            break;

        case patchQueueState.FAIL:
            this.timeStop = app.getCurrentTime();
            this.isRunning = false;
            this.isPartial = false;
            notificationCenter.fire("PatchQueue", "Complete", this, { "successful": false });
            break;
    }
};

PatchQueue.prototype.resumeAfterDelay = function(obj) {
    var self = this;

    host.assert(this.resumeTimeoutId === null, "Resume timeout already active");

    this.resumeTimeoutId = setTimeout(function() {
        self.resumeTimeoutId = null;
        obj.resume();
    }, 1000);
};

PatchQueue.prototype.resumePatchAfterDelay = function() {
    this.resumeAfterDelay(this.patch);
};

PatchQueue.prototype.resumeUninstallAfterDelay = function() {
    this.resumeAfterDelay(this.versionUninstall);
};

PatchQueue.prototype.resumeUpdateAfterDelay = function() {
    this.resumeAfterDelay(this.versionUpdate);
};

PatchQueue.prototype.onMaskDownload = function(maskedFiles, completeCallback) {
    var self = this, maskedFile, diskInfo, i;

    i = 0;
    this.maskIntervalId = whileInterval(function() {
        maskedFile = maskedFiles[i];
        diskInfo = { diskname: "", diskoffset: 0, disksize: 0 };

        if (self.patch.getItemDiskInfo(maskedFile, diskInfo) === true) {
            diskInfo.diskname = diskInfo.diskname.substring(self.download.getOptionString("OutputPath").length);

            self.download.maskFileRange(diskInfo.diskname, diskInfo.diskoffset, diskInfo.disksize);
        }

        i += 1;
        if (i >= maskedFiles.length) {
            completeCallback();
            self.maskIntervalId = null;
            return false;
        }
        return true;
    }, 10, 1);
};

PatchQueue.prototype.onPatchDownloadConfigComplete = function(info) {
    var self = this, zipFilename = this.patch.getFileName().substring(this.download.getOptionString("OutputPath").length);

    this.patch.resetDiskInfo();
    this.patch.maskReset();

    if (this.currentPatchInfo.maskedFiles.length > 0) {
        this.currentPatchInfo.maskedFiles.forEach(function(maskedFile) {
            self.patch.maskAdd(maskedFile);
        });

        this.download.setMaskEnabled(true);
        this.download.maskFile(zipFilename);
        this.download.syncToMask();
        this.changeState(patchQueueState.DOWNLOAD);
    } else {
        this.download.setMaskEnabled(false);
    }

    this.download.setActive(true);
};

PatchQueue.prototype.onPatchMaskComplete = function(info) {
    if (this.currentPatchInfo.uninstall === true) {
        if (platform.fileExists(this.currentPatchInfo.versionFilename) === true) {
            this.changeState(patchQueueState.UNINSTALL);
            this.versionUninstall.setFileName(this.currentPatchInfo.versionFilename);
            this.versionUninstall.start();
            return;
        }
    }

    if (this.currentPatchInfo.isUpcoming === false) {
        this.failureCount = 0;
        this.patch.start();
    } else {
        this.onPatchComplete({ "successful": true });
    }
};

PatchQueue.prototype.onPatchDownloadComplete = function(info) {
    var self = this, versionFilename;

    if (info.successful === true) {
        if (self.currentPatchInfo.maskedFiles.length > 0) {
            this.changeState(patchQueueState.MASK);
            this.onMaskDownload(self.currentPatchInfo.maskedFiles, function() {
                self.currentPatchInfo.maskedFiles = [];
                self.download.syncToMask();
                self.changeState(patchQueueState.DOWNLOAD);
            });

            return;
        }

        if (this.currentPatchInfo.versionUpdate === true) {
            this.changeState(patchQueueState.UPDATINGVERSION);

            this.versionUpdate.setFileName(this.currentPatchInfo.filename);
            this.versionUpdate.setVersionPath(this.currentPatchInfo.versionFilename);
            this.versionUpdate.setVersionName(this.currentPatchInfo.versionName);
            this.versionUpdate.start();
            return;
        }
        
        this.onPatchMaskComplete(info);
    } else {
        this.lastError = patcherError.getDownloadError(this.download.getLastError());
        this.changeState(patchQueueState.FAIL);
    }
};

PatchQueue.prototype.onPatchFailure = function() {
    switch (this.patch.getLastErrorType()) {
        case patchErrorType.PATCH:
            this.lastError = patcherError.getPatchError(this.patch.getLastError());
            break;

        case patchErrorType.OSERROR:
            this.lastError = patcherError.getOSError(this.patch.getLastError());
            break;

        default:
            this.lastError = patcherError.getPatchError(0);
            host.assert(false, "Unknown patch error type ({0})".format(this.patch.getLastErrorType()));
            break;
    }
};

PatchQueue.prototype.onPatchStart = function(info) {
    if (this.currentPatchInfo.allowPartial === false) {
        this.isPartial = true;
    }
}

PatchQueue.prototype.onPatchStateChange = function(info) {
    var self = this;

    switch (info.state) {
        case patchState.STALLED:
            this.changeState(patchQueueState.STALLED);

            if (this.patch.getFileAttempt() < 3) {
                this.resumePatchAfterDelay();
            } else {
                this.failureCount += 1;

                setTimeout(function() {
                    if (!isNull(self.patch)) {
                        if (self.failureCount > 10) {
                            // More than ten files failed - just fail... somethings gone really wrong
                            self.patch.fail();
                        } else {
                            self.patch.skip();
                        }
                    }
                }, 1);
            }
            break;

        case patchState.COMPLETE:
        case patchState.FAILED:
            break;

        default:
            this.changeState(patchQueueState.PATCH);
            break;
    }
};

PatchQueue.prototype.onPatchComplete = function(info) {
    if (this.currentPatchInfo.allowPartial === false) {
        this.isPartial = false;
    }

    if (info.successful === true) {
        notificationCenter.fire("PatchQueue", "DidProcessPatch", this, { "patchInfo": this.currentPatchInfo });

        if (this.currentPatchInfo.isUpcoming === false && this.patch.getSelfUpdate() === true) {
            app.setRestart(true);
        } else {
            this.onProcessPatches();
        }
    } else {
        this.onPatchFailure();
        this.changeState(patchQueueState.FAIL);
    }
};

PatchQueue.prototype.onUninstallFailure = function() {
    this.lastError = patcherError.getOSError(this.versionUninstall.getLastFileError());
    this.versionUninstall.fail();
};

PatchQueue.prototype.onVersionUninstallStart = function(info) {
    if (this.currentPatchInfo.allowPartial === false) {
        this.isPartial = true;
    }
};

PatchQueue.prototype.onVersionUninstallStateChange = function(info) {
    switch (info.state) {
        case patchVersionUninstallState.STALLED:
            this.changeState(patchQueueState.UNINSTALLSTALLED);

            if (this.versionUninstall.getFileAttempt() < 3) {
                this.resumeUninstallAfterDelay();
            } else {
                this.onUninstallFailure();
            }
            break;

        case patchVersionUninstallState.COMPLETE:
        case patchVersionUninstallState.FAILED:
            break;

        default:
            this.changeState(patchQueueState.UNINSTALL);
            break;
    }
};

PatchQueue.prototype.onVersionUninstallComplete = function(info) {
    if (info.successful === true) {
        this.onPatchMaskComplete(info);
    } else {
        if (this.lastError === 0) {
            this.lastError = patcherError.getOSError(this.versionUninstall.getLastFileError());
        }
        this.changeState(patchQueueState.FAIL);
    }
};

PatchQueue.prototype.onUpdateFailure = function() {
    this.lastError = patcherError.getOSError(this.versionUpdate.getLastFileError());
    this.versionUpdate.fail();
};

PatchQueue.prototype.onVersionUpdateStateChange = function(info) {
    switch (info.state) {
        case patchVersionUpdateState.STALLED:
            this.changeState(patchQueueState.UPDATEVERSIONSTALLED);

            if (this.versionUpdate.getFileAttempt() < 3) {
                this.resumeUpdateAfterDelay();
            } else {
                this.onUpdateFailure();
            }
            break;

        case patchVersionUpdateState.COMPLETE:
        case patchVersionUpdateState.FAILED:
            break;

        default:
            this.changeState(patchQueueState.UPDATINGVERSION);
            break;
    }
};

PatchQueue.prototype.onVersionUpdateComplete = function(info) {
    if (info.successful === true) {
        this.onProcessPatches();
    } else {
        if (this.lastError === 0) {
            this.lastError = patcherError.getOSError(this.versionUpdate.getLastFileError());
        }
        this.changeState(patchQueueState.FAIL);
    }
};

PatchQueue.prototype.onProcessPatches = function() {
    if (this.cancel === true) {
        return;
    }

    if (this.patchesRequired.length === 0 && this.requiredComplete == false) {
        this.requiredComplete = true;
        notificationCenter.fire("PatchQueue", "RequiredComplete", this, {});
    }

    if (this.patchesRequired.length > 0) {
        notificationCenter.fire("PatchQueue", "WillProcessPatch", this, { "patchInfo": this.patchesRequired[0] });
    } else if (this.patchesUpcoming.length > 0) {
        notificationCenter.fire("PatchQueue", "WillProcessPatch", this, { "patchInfo": this.patchesUpcoming[0] });
    }

    if (this.patchesRequired.length > 0) {
        this.currentPatchInfo = this.patchesRequired.shift();
    } else if (this.patchesUpcoming.length > 0) {
        this.currentPatchInfo = this.patchesUpcoming.shift();
    } else {
        this.currentPatchInfo = null;
    }

    if (!isNull(this.currentPatchInfo)) {
        this.onProcessPatch(this.currentPatchInfo);
    } else {
        this.changeState(patchQueueState.COMPLETE);
    }
};

PatchQueue.prototype.onProcessPatch = function(patchInfo) {
    this.patch.setFileName(patchInfo.filename);
    this.patch.setOutputDirectory(patchInfo.outputDirectory);

    this.changeState(patchQueueState.DOWNLOAD);

    this.download.stop();
    this.download.setMaskEnabled(false);

    app.debugPrint("Patching {0}\n".format(patchInfo.name));

    notificationCenter.fire("PatchQueue", "ConfigureDownload", this, { "patchInfo": patchInfo });

    if (patchInfo.maskedFiles.length > 0) {
        this.download.setMaskEnabled(true);
    }

    this.download.setMetafileSource(patchInfo.metafileUrl);
    this.download.setOptionString("OutputPath", patchInfo.patchDirectory);
    this.download.start();
};

PatchQueue.prototype.getRequiredCount = function() {
    return this.patchesRequired.length;
};

PatchQueue.prototype.getState = function() {
    return this.currentState;
};

PatchQueue.prototype.getLastError = function() {
    return this.lastError;
};

PatchQueue.prototype.configureDownload = function(download, config, allowEvents) {
    download.resetOptions();

    for (name in config) {
        if (hasOwnProperty(config, name)) {
            value = config[name];
            switch (getObjectType(value)) {
                case "string":
                    download.setOptionString(name, app.expandString(value));
                    break;

                case "number":
                    download.setOptionInt32(name, value);
                    break;

                case "boolean":
                    download.setOptionBoolean(name, value);
                    break;

                default:
                    host.app.debugPrint("Unable to set property {0} on download (unknown type)\n".format(name));
                    break;
            }
        }
    }

    if (!isNull(allowEvents) && getObjectType(allowEvents.forEach) === "function") {
        allowEvents.forEach(function(eventType) {
            download.allowEvent(eventType);
        });
    }
};

PatchQueue.prototype.start = function() {
    if (this.isRunning === true) {
        host.assert(false, "Unable to update patch channel while already running");
        return;
    }

    this.currentState = -1;
    this.lastError = 0;
    this.requiredComplete = false;
    this.isRunning = true;
    this.cancel = false;

    notificationCenter.fire("PatchQueue", "Start", this, {});
    this.onProcessPatches();
};

PatchQueue.prototype.reset = function() {
    this.patchesRequired = [];
    this.patchesUpcoming = [];
};

PatchQueue.prototype.add = function(required, upcoming) {
    if (!isNull(required) && required.length > 0) {
        this.patchesRequired = this.patchesRequired.concat(required);
    }
    if (!isNull(upcoming) && upcoming.length > 0) {
        this.patchesUpcoming = this.patchesUpcoming.concat(upcoming);
    }
};

PatchQueue.prototype.getRunningTime = function() {
    if (this.timeStop > 0) {
        return this.timeStop - this.timeStart;
    }
    
    return app.getCurrentTime() - this.timeStart;
};

function createPatchQueue() {
    return new PatchQueue();
}
/*!
* \file patchqueuestate.js
* \brief File containing patch queue state constants and helper functions
*/

/*!
* \class PatchQueueState
* \brief Patch queue state constants and helper functions
*/

function PatchQueueState() {
    /*!
    * Uninstall patch
    * \type int
    */
    this.UNINSTALL = 0;
    /*!
    * Uninstall Stalled
    * \type int
    */
    this.UNINSTALLSTALLED = 1;
    /*!
    * Updating version
    * \type int
    */
    this.UPDATINGVERSION = 2;
    /*!
    * Update version stalled
    * \type int
    */
    this.UPDATEVERSIONSTALLED = 3;
    /*!
    * Mask patch for repair
    * \type int
    */
    this.MASK = 4;
    /*!
    * Patch downloading
    * \type int
    */
    this.DOWNLOAD = 5;
    /*!
    * Applying patch
    * \type int
    */
    this.PATCH = 6;
    /*!
    * Stalled
    * \type int
    */
    this.STALLED = 7;
    /*!
    * Queue Complete
    * \type int
    */
    this.COMPLETE = 8;
    /*!
    * Queue Fail
    * \type int
    */
    this.FAIL = 9;
}

/*!
* converts a patch queue state to a string
* \tparam int id patch queue state
* \type string
* \returns stringified name of file error.
*/
PatchQueueState.prototype.nameFromId = function(id) {
    var nameMap = [
        "Uninstalling",
        "UninstallStalled",
        "UpdatingVersion",
        "UpdatingVersionStalled",
        "Masking",
        "Downloading",
        "Patching",
        "Stalled",
        "Complete",
        "Fail"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of PatchQueueState
* \type PatchQueueState
*/
var patchQueueState = new PatchQueueState();

/*!
* \file patchstate.js
* \brief File containing patch state constants and helper functions
*/

/*!
* \class PatchState
* \brief Patch state constants and helper functions
*/

function PatchState() {
    /*!
    * Idle
    * \type int
    */
    this.IDLE = 0;
    /*!
    * Authenticating
    * \type int
    */
    this.AUTHENTICATING = 1;
    /*!
    * Patching
    * \type int
    */
    this.PATCHING = 2;
    /*!
    * Stalled
    * \type int
    */
    this.STALLED = 3;
    /*!
    * Complete
    * \type int
    */
    this.COMPLETE = 4;
    /*!
    * Failed
    * \type int
    */
    this.FAILED = 5;
}

/*!
* converts a patch state to a string
* \tparam int id patch state
* \type string
* \returns stringified name of file error.
*/
PatchState.prototype.nameFromId = function(id) {
    var nameMap = [
        "Idle",
        "Authenticating",
        "Patching",
        "Stalled",
        "Complete",
        "Failed"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of PatchState
* \type PatchState
*/
var patchState = new PatchState();

function PatchUninstallController(task, args) {
    var self = this, origStateChange;

    this.observers = [];
    this.resumeTimeoutId = null;

    this.versionUninstall = createPatchVersionUninstall();

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("PatchVersionUninstall", "StateChange", this.versionUninstall, function(sender, info) { self.onVersionUninstallStateChange(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchVersionUninstall", "Complete", this.versionUninstall, function(sender, info) { self.onVersionUninstallComplete(task, info); }));
}

PatchUninstallController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.resumeTimeoutId)) {
        clearTimeout(this.resumeTimeoutId);
        this.resumeTimeoutId = null;
    }

    if (!isNull(this.versionUninstall)) {
        this.versionUninstall.release();
        versionUninstall = null;
    }
};

PatchUninstallController.prototype.onUninstallFailure = function(task) {
    task.error("OSError_" + osError.nameFromId(this.versionUninstall.getLastFileError()));
    this.versionUninstall.fail();
};

PatchUninstallController.prototype.resumeUninstallAfterDelay = function(task, info) {
    var self = this;

    host.assert(this.resumeTimeoutId == null, "Resume timeout already active");

    this.resumeTimeoutId = setTimeout(function() {
        self.resumeTimeoutId = null;
        self.versionUninstall.resume();
    }, 1000 * 10);
};

PatchUninstallController.prototype.onVersionUninstallStateChange = function(task, info) {
    switch (info.state) {
        case patchVersionUninstallState.STALLED:
            if (this.versionUninstall.getFileAttempt() < 3) {
                this.resumeUninstallAfterDelay(task, info);
            } else {
                this.onUninstallFailure(task, info);
            }
            break;
    }
};

PatchUninstallController.prototype.onVersionUninstallComplete = function(task, info) {
    if (info.successful === false) {
        task.error("PatchUninstall_Fail");
    }
    
    task.complete();
};

PatchUninstallController.prototype.onStart = function(task, info) {
    task.assertArgument("filename");

    this.versionUninstall.setFileName(app.expandString(task.args.filename));
    this.versionUninstall.start();
};

registerTaskController("patchUninstall", PatchUninstallController);

/*!
* \file PatchVersion.js
* \brief File containing PatchVersion class and creation function
*/

/*!
* \class PatchVersion
* \brief Enumerate a version file
*/




function PatchVersion(instanceId)
{
   /*!
   * Instance id used to bind proxy object to native object
   * \type string
   */
   this.instanceId = instanceId;
}

/*!
* releases the object
*/
PatchVersion.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the file name of the version file
* \type string
* \returns file name of the version file
*/
PatchVersion.prototype.getFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileName"
   });
};

/*!
* sets the file name of the version file
* \tparam string(in) value file name of the version file
*/
PatchVersion.prototype.setFileName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFileName", 
      "value":value
   });
};

/*!
* gets the sHA1 of the version file
* \type string
* \returns SHA1 of the version file
*/
PatchVersion.prototype.getSha1 = function(){
   return interop.invoke(this.instanceId, {
      "method":"getSha1"
   });
};

/*!
* Starts the patch version enumeration
*/
PatchVersion.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};

/*!
* Resume the file enumeration
*/
PatchVersion.prototype.resume = function(){
   return interop.invoke(this.instanceId, {
      "method":"resume"
   });
};


/*!
* Create instance of patchVersion
*/
function createPatchVersion()
{
   return interop.createInstance("SSN.PatchVersion", PatchVersion);
}


/*!
* \file PatchVersionUninstall.js
* \brief File containing PatchVersionUninstall class and creation function
*/

/*!
* \class PatchVersionUninstall
* \brief Uninstall a version file
*/




function PatchVersionUninstall(instanceId)
{
   /*!
   * Instance id used to bind proxy object to native object
   * \type string
   */
   this.instanceId = instanceId;
}

/*!
* releases the object
*/
PatchVersionUninstall.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the file name of the version file
* \type string
* \returns file name of the version file
*/
PatchVersionUninstall.prototype.getFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileName"
   });
};

/*!
* sets the file name of the version file
* \tparam string(in) value file name of the version file
*/
PatchVersionUninstall.prototype.setFileName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFileName", 
      "value":value
   });
};

/*!
* gets the short version of the filename
* \type string
* \returns short version of the filename
*/
PatchVersionUninstall.prototype.getShortFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getShortFileName"
   });
};

/*!
* gets the time elapsed in runnable state
* \type double
* \returns time elapsed in runnable state
*/
PatchVersionUninstall.prototype.getRunningTime = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRunningTime"
   });
};

/*!
* gets the current location in the version file
* \type string
* \returns current location in the version file
*/
PatchVersionUninstall.prototype.getCurrentItemName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getCurrentItemName"
   });
};

/*!
* gets the checks if a mask exists
* \type bool
* \returns checks if a mask exists
*/
PatchVersionUninstall.prototype.getMaskExists = function(){
   return interop.invoke(this.instanceId, {
      "method":"getMaskExists"
   });
};

/*!
* gets the total size of the verification
* \type int
* \returns total size of the verification
*/
PatchVersionUninstall.prototype.getTotalBytes = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTotalBytes"
   });
};

/*!
* gets the number of bytes left
* \type int
* \returns number of bytes left
*/
PatchVersionUninstall.prototype.getBytesLeft = function(){
   return interop.invoke(this.instanceId, {
      "method":"getBytesLeft"
   });
};

/*!
* gets the last file error
* \type int
* \returns last file error
*/
PatchVersionUninstall.prototype.getLastFileError = function(){
   return interop.invoke(this.instanceId, {
      "method":"getLastFileError"
   });
};

/*!
* gets the number of attempts for the current file
* \type int
* \returns number of attempts for the current file
*/
PatchVersionUninstall.prototype.getFileAttempt = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileAttempt"
   });
};

/*!
* Starts the version verification
*/
PatchVersionUninstall.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};

/*!
* Resume the uninstall after an action has stalled
*/
PatchVersionUninstall.prototype.resume = function(){
   return interop.invoke(this.instanceId, {
      "method":"resume"
   });
};

/*!
* Fail the uninstall an action has stalled
*/
PatchVersionUninstall.prototype.fail = function(){
   return interop.invoke(this.instanceId, {
      "method":"fail"
   });
};

/*!
* Reset the file mask
*/
PatchVersionUninstall.prototype.maskReset = function(){
   return interop.invoke(this.instanceId, {
      "method":"maskReset"
   });
};

/*!
* Add to the file exclusion mask
* \tparam string(in) filename filename to add
*/
PatchVersionUninstall.prototype.maskAdd = function(filename){
   return interop.invoke(this.instanceId, {
      "method":"maskAdd", 
      "filename":filename
   });
};


/*!
* Create instance of patchVersionUninstall
*/
function createPatchVersionUninstall()
{
   return interop.createInstance("SSN.PatchVersionUninstall", PatchVersionUninstall);
}


/*!
* \file patchversionuninstallstate.js
* \brief File containing patch version uninstall state constants and helper functions
*/

/*!
* \class PatchVersionUninstallState
* \brief Patch version uninstall state constants and helper functions
*/

function PatchVersionUninstallState() {
    /*!
    * Idle
    * \type int
    */
    this.IDLE = 0;
    /*!
    * Calculating size
    * \type int
    */
    this.CALCULATESZE = 1;
    /*!
    * Uninstall
    * \type int
    */
    this.UNINSTALL = 2;
    /*!
    * Stalled
    * \type int
    */
    this.STALLED = 3;
    /*!
    * Complete
    * \type int
    */
    this.COMPLETE = 4;
    /*!
    * Failed
    * \type int
    */
    this.FAILED = 5;
}

/*!
* converts a patch version uninstall state to a string
* \tparam int id patch version uninstall state
* \type string
* \returns stringified name of file error.
*/
PatchVersionUninstallState.prototype.nameFromId = function(id) {
    var nameMap = [
        "Idle",
        "CalculatingSize",
        "Uninstalling",
        "Stalled",
        "Complete",
        "Failed"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of PatchVersionUninstallState
* \type PatchVersionUninstallState
*/
var patchVersionUninstallState = new PatchVersionUninstallState();

/*!
* \file PatchVersionUpdate.js
* \brief File containing PatchVersionUpdate class and creation function
*/

/*!
* \class PatchVersionUpdate
* \brief Update a version file
*/




function PatchVersionUpdate(instanceId)
{
   /*!
   * Instance id used to bind proxy object to native object
   * \type string
   */
   this.instanceId = instanceId;
}

/*!
* releases the object
*/
PatchVersionUpdate.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the file name of the patch
* \type string
* \returns file name of the patch
*/
PatchVersionUpdate.prototype.getFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileName"
   });
};

/*!
* sets the file name of the patch
* \tparam string(in) value file name of the patch
*/
PatchVersionUpdate.prototype.setFileName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFileName", 
      "value":value
   });
};

/*!
* gets the name of the version file
* \type string
* \returns name of the version file
*/
PatchVersionUpdate.prototype.getVersionName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getVersionName"
   });
};

/*!
* sets the name of the version file
* \tparam string(in) value name of the version file
*/
PatchVersionUpdate.prototype.setVersionName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setVersionName", 
      "value":value
   });
};

/*!
* gets the file name of the version file
* \type string
* \returns file name of the version file
*/
PatchVersionUpdate.prototype.getVersionPath = function(){
   return interop.invoke(this.instanceId, {
      "method":"getVersionPath"
   });
};

/*!
* sets the file name of the version file
* \tparam string(in) value file name of the version file
*/
PatchVersionUpdate.prototype.setVersionPath = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setVersionPath", 
      "value":value
   });
};

/*!
* gets the short version of the filename
* \type string
* \returns short version of the filename
*/
PatchVersionUpdate.prototype.getShortFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getShortFileName"
   });
};

/*!
* gets the time elapsed in runnable state
* \type double
* \returns time elapsed in runnable state
*/
PatchVersionUpdate.prototype.getRunningTime = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRunningTime"
   });
};

/*!
* gets the current location in the version file
* \type string
* \returns current location in the version file
*/
PatchVersionUpdate.prototype.getCurrentItemName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getCurrentItemName"
   });
};

/*!
* gets the total size of the verification
* \type int
* \returns total size of the verification
*/
PatchVersionUpdate.prototype.getTotalBytes = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTotalBytes"
   });
};

/*!
* gets the number of bytes left
* \type int
* \returns number of bytes left
*/
PatchVersionUpdate.prototype.getBytesLeft = function(){
   return interop.invoke(this.instanceId, {
      "method":"getBytesLeft"
   });
};

/*!
* gets the last file error
* \type int
* \returns last file error
*/
PatchVersionUpdate.prototype.getLastFileError = function(){
   return interop.invoke(this.instanceId, {
      "method":"getLastFileError"
   });
};

/*!
* gets the number of attempts for the current file
* \type int
* \returns number of attempts for the current file
*/
PatchVersionUpdate.prototype.getFileAttempt = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileAttempt"
   });
};

/*!
* Starts the version verification
*/
PatchVersionUpdate.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};

/*!
* Resume the uninstall after an action has stalled
*/
PatchVersionUpdate.prototype.resume = function(){
   return interop.invoke(this.instanceId, {
      "method":"resume"
   });
};

/*!
* Fail the uninstall an action has stalled
*/
PatchVersionUpdate.prototype.fail = function(){
   return interop.invoke(this.instanceId, {
      "method":"fail"
   });
};


/*!
* Create instance of patchVersionUpdate
*/
function createPatchVersionUpdate()
{
   return interop.createInstance("SSN.PatchVersionUpdate", PatchVersionUpdate);
}


/*!
* \file patchversionupdatestate.js
* \brief File containing patch version update state constants and helper functions
*/

/*!
* \class PatchVersionUpdateState
* \brief Patch version update state constants and helper functions
*/

function PatchVersionUpdateState() {
    /*!
    * Idle
    * \type int
    */
    this.IDLE = 0;
    /*!
    * Masking
    * \type int
    */
    this.MASKING = 1;
    /*!
    * Extracting
    * \type int
    */
    this.EXTRACTVERSION = 2;
    /*!
    * Calculating size
    * \type int
    */
    this.CALCULATESZE = 3;
    /*!
    * Uninstall
    * \type int
    */
    this.UNINSTALL = 4;
    /*!
    * Uninstall
    * \type int
    */
    this.UPDATEVERSION = 5;
    /*!
    * Stalled
    * \type int
    */
    this.STALLED = 6;
    /*!
    * Complete
    * \type int
    */
    this.COMPLETE = 7;
    /*!
    * Failed
    * \type int
    */
    this.FAILED = 8;
}

/*!
* converts a patch version update state to a string
* \tparam int id patch version update state
* \type string
* \returns stringified name of file error.
*/
PatchVersionUpdateState.prototype.nameFromId = function(id) {
    var nameMap = [
        "Idle",
        "Masking",
        "Extracting",
        "CalculatingSize",
        "Uninstalling",
        "Updating",
        "Stalled",
        "Complete",
        "Failed"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of PatchVersionUpdateState
* \type PatchVersionUpdateState
*/
var patchVersionUpdateState = new PatchVersionUpdateState();

/*!
* \file PatchVersionVerify.js
* \brief File containing PatchVersionVerify class and creation function
*/

/*!
* \class PatchVersionVerify
* \brief Verify a version file
*/




function PatchVersionVerify(instanceId)
{
   /*!
   * Instance id used to bind proxy object to native object
   * \type string
   */
   this.instanceId = instanceId;
}

/*!
* releases the object
*/
PatchVersionVerify.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the file name of the version file
* \type string
* \returns file name of the version file
*/
PatchVersionVerify.prototype.getFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileName"
   });
};

/*!
* sets the file name of the version file
* \tparam string(in) value file name of the version file
*/
PatchVersionVerify.prototype.setFileName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFileName", 
      "value":value
   });
};

/*!
* gets the short version of the filename
* \type string
* \returns short version of the filename
*/
PatchVersionVerify.prototype.getShortFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getShortFileName"
   });
};

/*!
* gets the time elapsed in runnable state
* \type double
* \returns time elapsed in runnable state
*/
PatchVersionVerify.prototype.getRunningTime = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRunningTime"
   });
};

/*!
* gets the allow quick scan during verify (FALSE to force SHA1)
* \type bool
* \returns allow quick scan during verify (FALSE to force SHA1)
*/
PatchVersionVerify.prototype.getAllowQuickScan = function(){
   return interop.invoke(this.instanceId, {
      "method":"getAllowQuickScan"
   });
};

/*!
* sets the allow quick scan during verify (FALSE to force SHA1)
* \tparam bool(in) value allow quick scan during verify (FALSE to force SHA1)
*/
PatchVersionVerify.prototype.setAllowQuickScan = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setAllowQuickScan", 
      "value":value
   });
};

/*!
* gets the allow deep scan during verify
* \type bool
* \returns allow deep scan during verify
*/
PatchVersionVerify.prototype.getAllowDeepScan = function(){
   return interop.invoke(this.instanceId, {
      "method":"getAllowDeepScan"
   });
};

/*!
* sets the allow deep scan during verify
* \tparam bool(in) value allow deep scan during verify
*/
PatchVersionVerify.prototype.setAllowDeepScan = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setAllowDeepScan", 
      "value":value
   });
};

/*!
* gets the total size of the verification
* \type int
* \returns total size of the verification
*/
PatchVersionVerify.prototype.getTotalBytes = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTotalBytes"
   });
};

/*!
* gets the value checking if the version file contains the current running application (only valid after complete)
* \type bool
* \returns value checking if the version file contains the current running application (only valid after complete)
*/
PatchVersionVerify.prototype.getSelfUpdate = function(){
   return interop.invoke(this.instanceId, {
      "method":"getSelfUpdate"
   });
};

/*!
* gets the number of bytes left
* \type int
* \returns number of bytes left
*/
PatchVersionVerify.prototype.getBytesLeft = function(){
   return interop.invoke(this.instanceId, {
      "method":"getBytesLeft"
   });
};

/*!
* Starts the version verification
*/
PatchVersionVerify.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};


/*!
* Create instance of patchVersionVerify
*/
function createPatchVersionVerify()
{
   return interop.createInstance("SSN.PatchVersionVerify", PatchVersionVerify);
}



function PatchView(task, args) {
    var self = this;

    this.instanceId = app.expandString("{Guid}");
    this.rootElement = null;
    this.titleElement = null;
    this.launchElement = null;
    this.repairElement = null;
    this.updateElement = null;
    this.statusElement = null;
    this.patchesLeftElement = null;
    this.timeEstElement = null;
    this.bytesLeftElement = null;
    this.progressElement = null;
    this.progressBarElement = null;
    this.transferSpeedElement = null;
    this.controller = task.controller;
    this.isUpcoming = false;
    this.releaseIntervalId = null;
    this.allowViewBinding = true;
    this.normalizeProgress = false;

    this.subViews = [];
    this.observers = [];

    this.downloadView = new DownloadView(task, args);
    this.downloadView.onUpdateElementOriginal = this.downloadView.onUpdateElement;
    this.downloadView.onUpdateElement = function(element, value) { self.onDownloadUpdateElement(task, element, value); }
    this.downloadView.onUpdateProgressOriginal = this.downloadView.onUpdateProgress;
    this.downloadView.onUpdateProgress = function(value) { self.onDownloadUpdateProgress(task, value); }
    this.downloadView.onChangeClassOriginal = this.downloadView.onChangeClass;
    this.downloadView.onChangeClass = function(newStateName) { self.onDownloadChangeClass(task, newStateName); }
    this.downloadView.onWorkflowUnload = function(task, info) { };
    this.downloadView.superView = this;

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Task", "SubTaskCreate", task, function(sender, info) { self.onSubTaskCreate(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("Workflow", "WillUnload", workflow, function(sender, info) { self.onWorkflowUnload(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "Start", task.controller.patchQueue, function(sender, info) { self.onPatchQueueStart(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "StateChange", task.controller.patchQueue, function(sender, info) { self.onPatchQueueStateChange(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "WillProcessPatch", task.controller.patchQueue, function(sender, info) { self.onPatchQueueWillProcessPatch(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "DidProcessPatch", task.controller.patchQueue, function(sender, info) { self.onPatchQueueDidProcessPatch(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("PatchQueue", "RequiredComplete", task.controller.patchQueue, function(sender, info) { self.onPatchQueueRequiredComplete(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("PatchController", "StateChange", task.controller, function(sender, info) { self.onPatchControllerStateChange(task, info); }));
}

PatchView.prototype.release = function() {
    if (!isNull(this.controller) && !isNull(this.controller.patchQueue)) {
        if (this.controller.patchQueue.isPartial === true) {
            if (isNull(this.releaseIntervalId)) {
                var self = this;
                this.releaseIntervalId = setInterval(function() { self.release(); }, 500);
            }
            return;
        }
    }

    if (!isNull(this.releaseIntervalId)) {
        clearInterval(this.releaseIntervalId);
        this.releaseIntervalId = null;
    }

    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    this.subViews.forEach(function(view) {
        view.release();
    });
    this.subViews = [];

    this.onTimerStop();

    if (!isNull(this.rootElementClass)) {
        this.rootElementClass.release();
        this.rootElementClass = null;
    }

    if (!isNull(this.progressBarElementClass)) {
        this.progressBarElementClass.release();
        this.progressBarElementClass = null;
    }

    if (!isNull(this.downloadView)) {
        this.downloadView.release();
        this.downloadView = null;
    }

    if (!isNull(this.controller)) {
        this.controller.release();
        this.controller = null;
    }
};

PatchView.prototype.patchProgressState = {DOWNLOAD: 0, PATCH: 1, DISABLE: -1};

PatchView.prototype.onStart = function(task, info) {
    var self = this;

    this.onPatchStart(task);

    notificationCenter.fire("PatchView", "Bind", task, this);

    host.assert(!isNull(this.rootElement), "PatchView binding did not assign root element");

    this.rootElementClass = new ChangeClass(this.rootElement);
    if (!isNull(this.progressBarElement)) {
        this.progressBarElementClass = new ChangeClass(this.progressBarElement);
    }

    if (!isNull(this.repairElement)) {
        this.repairElement.unbind(".patchview");
    }

    if (!isNull(this.updateElement)) {
        this.updateElement.unbind(".patchview");
    }

    if (!isNull(this.launchElement)) {
        this.launchElement.unbind(".patchview");
    }

    if (!isNull(this.repairElement)) {
        this.repairElement.bind("click.patchview", null, function() {
            task.controller.repair();
        });
    }

    if (!isNull(this.updateElement)) {
        this.updateElement.bind("click.patchview", null, function() {
            task.controller.update();
        });
    }

    if (!isNull(this.launchElement)) {
        this.launchElement.bind("click.patchview", null, function() {
            self.launch(task);
        });
    }

    this.onChangeClass("patchControllerStateIdle");
    this.onUpdateStatus(host.getLanguageString("PatchControllerState_Idle"));
    this.onUpdateProgressInternal(-1);
};

PatchView.prototype.onPatchStart = function(task) {
    var taskView = task.view;

    if (task.args.type.toLowerCase() == "patchgroup") {
        taskView.allowViewBinding = false;
    }
    if (hasOwnProperty(task.args, "normalizeProgress")) {
        taskView.normalizeProgress = task.args.normalizeProgress;
        taskView.downloadView.normalizeProgress = taskView.normalizeProgress;
    }
};

PatchView.prototype.onWorkflowUnload = function(task, info) {
    if (!isNull(this.controller) && !isNull(this.controller.patchQueue)) {
        this.controller.patchQueue.cancel = true;
    }
    this.release();
};

PatchView.prototype.onSubTaskCreate = function(task, info) {
    var self = this, subTask = info.subTask;

    this.onPatchStart(subTask);
    if (self.allowViewBinding === false && subTask.args.type.toLowerCase() === "patch") {
        subTask.view.allowViewBinding = self.allowViewBinding;

        var oldRelease = subTask.view.release;
        subTask.view.release = function() {
            if (!isNull(self.controller) && !isNull(self.controller.patchQueue) && (self.controller.patchQueue.isPartial === true)) {
                if (isNull(subTask.view.releaseIntervalId)) {
                    this.releaseIntervalId = setInterval(function() { subTask.view.release(); }, 500);
                }
                return;
            }

            self.subViews.removeElement(subTask.view);
            oldRelease.call(subTask.view);
        };

        // Stop the view from ever binding
        subTask.view.onStart = function(task, info) { };
        subTask.view.onPatchControllerStateChange = function(task, info) {};

        this.subViews.push(subTask.view);
    }
};

PatchView.prototype.onTimerStart = function() {
    var self = this;

    if (isNull(this.timerId)) {
        // Force it to run thru once at the very beginning
        self.onTimer();
        this.timerId = setInterval(function() { self.onTimer(); }, 250);
    }
};

PatchView.prototype.onTimerUpdate = function(obj) {
    var totalBytes = obj.getTotalBytes();
    var bytesLeft = obj.getBytesLeft();

    this.onUpdateBytesLeft(messageFormat.getBytesLeft(bytesLeft));

    if (totalBytes === 0) {
        this.onUpdateProgressInternal(-1);
    } else {
        this.onUpdateProgressInternal((totalBytes - bytesLeft) / totalBytes);
    }
};

PatchView.prototype.onTimerUninstall = function() {
    this.onTimerUpdate(this.controller.patchQueue.versionUninstall);
};

PatchView.prototype.onTimerUpdateVersion = function() {
    this.onTimerUpdate(this.controller.patchQueue.versionUpdate);
};

PatchView.prototype.onTimerPatch = function() {
    var patch = this.controller.patchQueue.patch;
    var totalBytes = patch.getTotalBytes();
    var bytesLeft = patch.getBytesLeft();


    this.onTimerUpdate(patch);

    this.onUpdateTimeEst(messageFormat.getTimeEstimate(patch.getRemainingTime()));
    this.onUpdateBytesLeft(messageFormat.getBytesLeft(bytesLeft));
    this.onUpdateTransferSpeed(messageFormat.getTransferSpeed(interop.parseJSON(patch.getWriteRates()).average));

    if (totalBytes === 0) {
        this.onUpdateProgressInternal(-1);
    } else {
        this.onUpdateProgressInternal((totalBytes - bytesLeft) / totalBytes, this.patchProgressState.PATCH);
    }
};

PatchView.prototype.onTimerVerify = function() {
    var totalBytes = this.controller.getVerifyTotalBytes();
    var bytesLeft = this.controller.getVerifyBytesLeft();

    this.onUpdateBytesLeft(messageFormat.getBytesLeft(bytesLeft));

    if (totalBytes === 0) {
        this.onUpdateProgressInternal(-1);
    } else {
        this.onUpdateProgressInternal((totalBytes - bytesLeft) / totalBytes);
    }
};

PatchView.prototype.onTimerStop = function() {
    if (!isNull(this.timerId)) {
        clearInterval(this.timerId);
        this.timerId = null;
    }
};

PatchView.prototype.onTimerQueue = function() {
    switch (this.controller.patchQueue.getState()) {
        case patchQueueState.PATCH:
            this.onTimerPatch();
            break;

        case patchQueueState.UNINSTALL:
            this.onTimerUninstall();
            break;

        case patchQueueState.UPDATINGVERSION:
            this.onTimerUpdateVersion();
            break;
    };
};

PatchView.prototype.onTimer = function() {
    if (this.controller.patchQueue.isRunning === true) {
        this.onTimerQueue();
    } else {
        this.onTimerVerify();
    }
};

PatchView.prototype.onUpdateElement = function(element, value) {
    if (!isNull(element)) {
        var oldValue = element.html();
        if (oldValue !== value) {
            element.html(value);
            element.trigger("changed", [oldValue, value]);
        }
    }
};

PatchView.prototype.onUpdateTitle = function(value) {
    this.onUpdateElement(this.titleElement, value);
};

PatchView.prototype.onUpdateStatus = function(value) {
    this.onUpdateElement(this.statusElement, value);
};

PatchView.prototype.onUpdateTimeEst = function(value) {
    this.onUpdateElement(this.timeEstElement, value);
};

PatchView.prototype.onUpdateBytesLeft = function(value) {
    this.onUpdateElement(this.bytesLeftElement, value);
};

PatchView.prototype.onUpdateTransferSpeed = function(value) {
    this.onUpdateElement(this.transferSpeedElement, value);
};

PatchView.prototype.onUpdatePatchesLeft = function(value) {
    this.onUpdateElement(this.patchesLeftElement, value);
};

PatchView.prototype.onUpdateProgress = function(value) {
    var info, percent = parseInt(value * 100, 10);
    
    info = { "percent": percent };

    notificationCenter.fire("TaskView", "WillUpdateProgress", this, info);

    if (isNull(this.progressElement) && isNull(this.progressBarElement)) {
        return;
    }

    if (info.percent !== this.lastPercent) {
        this.lastPercent = info.percent;

        this.onUpdateElement(this.progressElement, Math.max(info.percent, 0) + "%");

        if (!isNull(this.progressBarElement)) {
            if (info.percent < 0) {
                this.progressBarElement.width("100%");
                this.progressBarElementClass.apply("indefinite");
            } else {
                this.progressBarElementClass.apply(null);
                if (host.isIE6 === true) {
                    // IE6 doesn't like 0% widths on transparent pngs
                    this.progressBarElement.width(Math.max(info.percent, 1) + "%");
                } else {
                    this.progressBarElement.width(info.percent + "%");
                }
            }

            this.progressBarElement.trigger("updateProgress", info.percent);
        }
    }
};

PatchView.prototype.onUpdateProgressInternal = function(value, currentState) {
    var progress = 0.0, productProgress = 0.0, product, productCount = 0, item, patchInfo;
    var state = currentState, stateMultiplier = [
        0.5, // patchProgressState.DOWNLOAD,
        0.5  // patchProgressState.PATCH
    ];

    //app.debugPrint("patchProgress value {0} currentState {1}\n".format(value.toFixed(2), currentState));

    if (!this.normalizeProgress) {
        this.onUpdateProgress(value);
        return;
    }
    if ((value <= 0) || isNull(this.products) || isNull(currentState)) {
        return;
    }
    patchInfo = this.controller.patchQueue.currentPatchInfo;
    if (isNull(patchInfo)) {
        // Occurs when final patch completes
        this.onUpdateProgress(value);
        return;
    }
    if (isNull(patchInfo.filename)) {
        return;
    }
    for (var name in this.products) {
        productCount += 1;
    }
    for (var name in this.products) {
        product = this.products[name], productProgress = 0, stop = false;
        for (var x = 0; x < product.items.length; x += 1) {
            item = product.items[x];
            for (var i = 0; i < item.progress.length && i != state; i += 1) {
                productProgress += (stateMultiplier[i] * item.progress[i]);
            }
            if (item.id == patchInfo.filename) {
                stop = true;
                break;
            }
        }
        if (stop) {
            break;
        }
        progress += 1;
    }

    item.progress[state] = parseFloat(value);
    productProgress += (stateMultiplier[state] * item.progress[state]);
    productProgress /= product.items.length;
    progress = (progress + productProgress) / productCount;

    /*app.debugPrint("patchProgress product {0}\n".format(JSON.stringify(product)));
    app.debugPrint("patchProgress product state {0}\n".format(currentState, state));
    app.debugPrint("patchProgress product state progress {0}\n".format(item.progress[state].toFixed(2)));
    app.debugPrint("patchProgress product progress {0}\n".format(productProgress.toFixed(2)));
    app.debugPrint("patchProgress progress {0}\n".format(progress.toFixed(2)));*/

    this.onUpdateProgress(progress);
};

PatchView.prototype.onPatchQueueStart = function(task, info) {
    this.isUpcoming = false;
};

PatchView.prototype.onPatchQueueWillProcessPatch = function(task, info) {
    var remainingProductNames = [], remainingProducts = [];
    var queue = task.controller.patchQueue;

    queue.patchesRequired.forEach(function(patchRequired) {
        var versionName = patchRequired.versionName;
        if (patchRequired.versionName.endsWith(".version")) {
            remainingProductNames.push(versionName.substring(0, versionName.lastIndexOf(".version")));
        } else {
            remainingProductNames.push(versionName);
        }
        remainingProducts.push(patchRequired);
        //app.debugPrint("patchProgress versionName {0}\n".format(versionName));
    });

    if (isNull(this.products)) {
        this.products = {};
        for (var i = 0; i < remainingProducts.length; i += 1) {
            if (isNull(this.products[remainingProductNames[i]])) {
                this.products[remainingProductNames[i]] = {
                    "name": remainingProductNames[i], "items": []
                };
            }
            this.products[remainingProductNames[i]].items.push({
                "id": remainingProducts[i].filename, "progress": [0.0, 0.0]
            });
            //app.debugPrint("patchProgress name {0} id {1}\n".format(remainingProductNames[i], remainingProducts[i].filename));
        }
    }

    if (!isNull(info.patchInfo.title)) {
        this.onUpdateTitle(messageFormat.getPatchTitle(info.patchInfo.title, this.controller.isRepairing));
    }
    this.onUpdatePatchesLeft(messageFormat.getPatchesLeft(this.controller.patchQueue.getRequiredCount()));
};

PatchView.prototype.onPatchQueueDidProcessPatch = function(task, info) {
    this.onUpdatePatchesLeft(messageFormat.getPatchesLeft(this.controller.patchQueue.getRequiredCount()));
};

PatchView.prototype.onPatchQueueRequiredComplete = function(task, info) {
    this.isUpcoming = true;
    this.requiredComplete = true;
};

PatchView.prototype.onPatchQueueStateChange = function(task, info) {
    if (info.state !== patchQueueState.DOWNLOAD) {
        // Clear the download state because I don't want to support dashed naming for all the channel states in IE6
        this.downloadView.onChangeClassOriginal(null);
    }

    switch (info.state) {
        case patchQueueState.PATCH:
        case patchQueueState.UNINSTALL:
        case patchQueueState.UPDATINGVERSION:
            this.onTimerStart();
            break;

        case patchQueueState.DOWNLOAD:
            this.onTimerStop();
            this.onUpdateProgressInternal(0);
            break;

        case patchQueueState.STALLED:
        case patchQueueState.UNINSTALLSTALLED:
        case patchQueueState.UPDATINGVERSIONSTALLED:
            // Do nothing for the stalled states
            this.onTimerStop();
            break;

        default:
            this.onTimerStop();
            this.onUpdateProgressInternal(-1);
            break;
    }
};

PatchView.prototype.onPatchControllerStateChange = function(task, info) {
    var controllerStateName = patchControllerState.nameFromId(info.state);
    this.onChangeClass("patchControllerState" + controllerStateName);

    switch (info.state) {
        case patchControllerState.PATCH:
        case patchControllerState.VERIFY:
            this.onTimerStart();
            break;

        case patchControllerState.COMPLETE:
        case patchControllerState.FAIL:
            this.onTimerStop();
            this.onUpdateProgressInternal(1, this.patchProgressState.PATCH);
            break;

        case patchControllerState.UPDATE:
        case patchControllerState.REPAIR:
            this.onTimerStop();
            this.onUpdateProgressInternal(1);
            break;

        default:
            this.onTimerStop();
            this.onUpdateProgressInternal(1);
            break;
    }

    switch (info.state) {
        case patchControllerState.FAIL:
            this.onUpdateStatus(host.getLanguageString(patcherError.errorStringFromId(this.controller.lastError)));
            break;

        default:
            this.onUpdateStatus(host.getLanguageString("PatchControllerState_" + controllerStateName));
            break;
    }
};

PatchView.prototype.onDownloadUpdateElement = function(task, element, value) {
    if (task.controller.patchQueue.getState() === patchQueueState.DOWNLOAD) {
        this.downloadView.onUpdateElementOriginal(element, value);
    }
};

PatchView.prototype.onDownloadUpdateProgress = function(task, value) {
    if (task.controller.patchQueue.getState() === patchQueueState.DOWNLOAD) {
        this.onUpdateProgressInternal(value, this.patchProgressState.DOWNLOAD);
    }
};

PatchView.prototype.onDownloadChangeClass = function(task, newStateName) {
    if (task.controller.patchQueue.getState() === patchQueueState.DOWNLOAD) {
        this.downloadView.onChangeClassOriginal(newStateName);
    }
};


PatchView.prototype.launch = function(task) {
    var self = this;

    if (!isNull(task.args.launch)) {
        // Stop upcoming releases
        this.downloadView.onChangeClassOriginal(null);

        task.controller.launch(task);
    }
};

PatchView.prototype.onChangeClass = function(newStateName) {
    if (!isNull(this.rootElementClass)) {
        this.rootElementClass.apply(newStateName);
    }
};

registerTaskView("patch", PatchView);
registerTaskView("patchgroup", PatchView);


