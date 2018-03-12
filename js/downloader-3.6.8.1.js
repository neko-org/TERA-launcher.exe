/**
 * @preserve Modifications performed to this file by anyone other than Solid State Networks
 * are unsupported and may void your software warranty.
 */
$(document).ready(function() {
    host.assert(app.expandString("{AppVersion}") === "3.6.8.1", "Invalid application version");
});

/*!
* \file Download.js
* \brief File containing Download class and creation function
*/

/*!
* \class Download
* \brief Download a file system
*/




function Download(instanceId)
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
Download.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the get friendly identifier for downloader
* \type string
* \returns get friendly identifier for downloader
*/
Download.prototype.getIdentifier = function(){
   return interop.invoke(this.instanceId, {
      "method":"getIdentifier"
   });
};

/*!
* gets the source to metafile
* \type string
* \returns source to metafile
*/
Download.prototype.getMetafileSource = function(){
   return interop.invoke(this.instanceId, {
      "method":"getMetafileSource"
   });
};

/*!
* sets the source to metafile
* \tparam string(in) value source to metafile
*/
Download.prototype.setMetafileSource = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setMetafileSource", 
      "value":value
   });
};

/*!
* gets the url to file (instead of metafile)
* \type string
* \returns url to file (instead of metafile)
*/
Download.prototype.getUrl = function(){
   return interop.invoke(this.instanceId, {
      "method":"getUrl"
   });
};

/*!
* sets the url to file (instead of metafile)
* \tparam string(in) value url to file (instead of metafile)
*/
Download.prototype.setUrl = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setUrl", 
      "value":value
   });
};

/*!
* gets the active state of the download (only available after accessible is true)
* \type bool
* \returns active state of the download (only available after accessible is true)
*/
Download.prototype.getActive = function(){
   return interop.invoke(this.instanceId, {
      "method":"getActive"
   });
};

/*!
* sets the active state of the download (only available after accessible is true)
* \tparam bool(in) value active state of the download (only available after accessible is true)
*/
Download.prototype.setActive = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setActive", 
      "value":value
   });
};

/*!
* gets the allow seeding for the download (only available after accessible is true)
* \type bool
* \returns allow seeding for the download (only available after accessible is true)
*/
Download.prototype.getAllowSeeding = function(){
   return interop.invoke(this.instanceId, {
      "method":"getAllowSeeding"
   });
};

/*!
* gets the upload limit for the download (only available after accessible is true)
* \type int
* \returns upload limit for the download (only available after accessible is true)
*/
Download.prototype.getUploadLimit = function(){
   return interop.invoke(this.instanceId, {
      "method":"getUploadLimit"
   });
};

/*!
* sets the upload limit for the download (only available after accessible is true)
* \tparam int(in) value upload limit for the download (only available after accessible is true)
*/
Download.prototype.setUploadLimit = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setUploadLimit", 
      "value":value
   });
};

/*!
* gets the download limit for the download (only available after accessible is true)
* \type int
* \returns download limit for the download (only available after accessible is true)
*/
Download.prototype.getDownloadLimit = function(){
   return interop.invoke(this.instanceId, {
      "method":"getDownloadLimit"
   });
};

/*!
* sets the download limit for the download (only available after accessible is true)
* \tparam int(in) value download limit for the download (only available after accessible is true)
*/
Download.prototype.setDownloadLimit = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setDownloadLimit", 
      "value":value
   });
};

/*!
* gets the reliable source upload limit for the download (only available after accessible is true)
* \type int
* \returns reliable source upload limit for the download (only available after accessible is true)
*/
Download.prototype.getWebUploadLimit = function(){
   return interop.invoke(this.instanceId, {
      "method":"getWebUploadLimit"
   });
};

/*!
* sets the reliable source upload limit for the download (only available after accessible is true)
* \tparam int(in) value reliable source upload limit for the download (only available after accessible is true)
*/
Download.prototype.setWebUploadLimit = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setWebUploadLimit", 
      "value":value
   });
};

/*!
* gets the reliable source download limit for the download (only available after accessible is true)
* \type int
* \returns reliable source download limit for the download (only available after accessible is true)
*/
Download.prototype.getWebDownloadLimit = function(){
   return interop.invoke(this.instanceId, {
      "method":"getWebDownloadLimit"
   });
};

/*!
* sets the reliable source download limit for the download (only available after accessible is true)
* \tparam int(in) value reliable source download limit for the download (only available after accessible is true)
*/
Download.prototype.setWebDownloadLimit = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setWebDownloadLimit", 
      "value":value
   });
};

/*!
* gets the bittorrent peer upload limit for the download (only available after accessible is true)
* \type int
* \returns bittorrent peer upload limit for the download (only available after accessible is true)
*/
Download.prototype.getBitUploadLimit = function(){
   return interop.invoke(this.instanceId, {
      "method":"getBitUploadLimit"
   });
};

/*!
* sets the bittorrent peer upload limit for the download (only available after accessible is true)
* \tparam int(in) value bittorrent peer upload limit for the download (only available after accessible is true)
*/
Download.prototype.setBitUploadLimit = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setBitUploadLimit", 
      "value":value
   });
};

/*!
* gets the bittorrent peer download limit for the download (only available after accessible is true)
* \type int
* \returns bittorrent peer download limit for the download (only available after accessible is true)
*/
Download.prototype.getBitDownloadLimit = function(){
   return interop.invoke(this.instanceId, {
      "method":"getBitDownloadLimit"
   });
};

/*!
* sets the bittorrent peer download limit for the download (only available after accessible is true)
* \tparam int(in) value bittorrent peer download limit for the download (only available after accessible is true)
*/
Download.prototype.setBitDownloadLimit = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setBitDownloadLimit", 
      "value":value
   });
};

/*!
* gets the reason the download is stalled (only available after accessible is true)
* \type int
* \returns reason the download is stalled (only available after accessible is true)
*/
Download.prototype.getStallReason = function(){
   return interop.invoke(this.instanceId, {
      "method":"getStallReason"
   });
};

/*!
* gets the is the download complete (only available after accessible is true)
* \type bool
* \returns is the download complete (only available after accessible is true)
*/
Download.prototype.getCompleted = function(){
   return interop.invoke(this.instanceId, {
      "method":"getCompleted"
   });
};

/*!
* gets the is the download currently running
* \type bool
* \returns is the download currently running
*/
Download.prototype.getIsRunning = function(){
   return interop.invoke(this.instanceId, {
      "method":"getIsRunning"
   });
};

/*!
* gets the enable/disable download mask
* \type bool
* \returns Enable/disable download mask
*/
Download.prototype.getMaskEnabled = function(){
   return interop.invoke(this.instanceId, {
      "method":"getMaskEnabled"
   });
};

/*!
* sets the enable/disable download mask
* \tparam bool(in) value Enable/disable download mask
*/
Download.prototype.setMaskEnabled = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setMaskEnabled", 
      "value":value
   });
};

/*!
* gets the download accessibility and configuration has completed
* \type bool
* \returns download accessibility and configuration has completed
*/
Download.prototype.getAccessible = function(){
   return interop.invoke(this.instanceId, {
      "method":"getAccessible"
   });
};

/*!
* gets the download state (only available after accessible is true)
* \type int
* \returns download state (only available after accessible is true)
*/
Download.prototype.getState = function(){
   return interop.invoke(this.instanceId, {
      "method":"getState"
   });
};

/*!
* gets the download session state (only available after accessible is true)
* \type string
* \returns download session state (only available after accessible is true)
*/
Download.prototype.getSessionState = function(){
   return interop.invoke(this.instanceId, {
      "method":"getSessionState"
   });
};

/*!
* gets the download session time elapsed states (only available after accessible is true)
* \type string
* \returns download session time elapsed states (only available after accessible is true)
*/
Download.prototype.getSessionTimeElapsed = function(){
   return interop.invoke(this.instanceId, {
      "method":"getSessionTimeElapsed"
   });
};

/*!
* gets the json object with the number of bytes read/sent/confirmed/corrupt/discarded (only available after accessible is true)
* \type string
* \returns json object with the number of bytes read/sent/confirmed/corrupt/discarded (only available after accessible is true)
*/
Download.prototype.getTransferTotal = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTransferTotal"
   });
};

/*!
* gets the json object containing the rate of the current/average/max throughput for incoming/outgoing connections (only available after accessible is true)
* \type string
* \returns json object containing the rate of the current/average/max throughput for incoming/outgoing connections (only available after accessible is true)
*/
Download.prototype.getTransferRates = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTransferRates"
   });
};

/*!
* gets the size of the download (only available after accessible is true)
* \type int
* \returns size of the download (only available after accessible is true)
*/
Download.prototype.getTotalBytes = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTotalBytes"
   });
};

/*!
* gets the bytes left in the download (only available after accessible is true)
* \type int
* \returns bytes left in the download (only available after accessible is true)
*/
Download.prototype.getBytesLeft = function(){
   return interop.invoke(this.instanceId, {
      "method":"getBytesLeft"
   });
};

/*!
* gets the estimated time remaining in a download (only available after accessible is true)
* \type double
* \returns estimated time remaining in a download (only available after accessible is true)
*/
Download.prototype.getRemainingTime = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRemainingTime"
   });
};

/*!
* gets the progress of the current state (only available after accessible is true)
* \type double
* \returns progress of the current state (only available after accessible is true)
*/
Download.prototype.getStateProgress = function(){
   return interop.invoke(this.instanceId, {
      "method":"getStateProgress"
   });
};

/*!
* gets the last error encountered by the downloader
* \type int
* \returns last error encountered by the downloader
*/
Download.prototype.getLastError = function(){
   return interop.invoke(this.instanceId, {
      "method":"getLastError"
   });
};

/*!
* Starts the download
*/
Download.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};

/*!
* Stops the download
*/
Download.prototype.stop = function(){
   return interop.invoke(this.instanceId, {
      "method":"stop"
   });
};

/*!
* This method expands the string with the current macros
* \tparam string(in) expand Name of string to be expanded
* \type string
* \returns expanded string
*/
Download.prototype.expandString = function(expand){
   return interop.invoke(this.instanceId, {
      "method":"expandString", 
      "expand":expand
   });
};

/*!
* clears the metafile buffer
*/
Download.prototype.clearMetafileBuffer = function(){
   return interop.invoke(this.instanceId, {
      "method":"clearMetafileBuffer"
   });
};

/*!
* appends data to a metafile buffer
* \tparam string(in) metafileData hex encoded data for buffer
*/
Download.prototype.appendMetafileBuffer = function(metafileData){
   return interop.invoke(this.instanceId, {
      "method":"appendMetafileBuffer", 
      "metafileData":metafileData
   });
};

/*!
* Mask portion of download by filename
* \tparam string(in) fileName filename in metafile to mask
* \type bool
* \returns true if successful, false otherwise
*/
Download.prototype.maskFile = function(fileName){
   return interop.invoke(this.instanceId, {
      "method":"maskFile", 
      "fileName":fileName
   });
};

/*!
* Mask portion of download by filename and range
* \tparam string(in) fileName filename in metafile to mask
* \tparam int(in) offset offset in the file to start at
* \tparam int(in) length length of the bytes to include
* \type bool
* \returns true if successful, false otherwise
*/
Download.prototype.maskFileRange = function(fileName,offset,length){
   return interop.invoke(this.instanceId, {
      "method":"maskFileRange", 
      "fileName":fileName, 
      "offset":offset, 
      "length":length
   });
};

/*!
* Synchronizes the downloaded content pieces
*/
Download.prototype.syncToMask = function(){
   return interop.invoke(this.instanceId, {
      "method":"syncToMask"
   });
};

/*!
* Resets the options for the download
*/
Download.prototype.resetOptions = function(){
   return interop.invoke(this.instanceId, {
      "method":"resetOptions"
   });
};

/*!
* Allow download event
* \tparam int(in) type type of download event
*/
Download.prototype.allowEvent = function(type){
   return interop.invoke(this.instanceId, {
      "method":"allowEvent", 
      "type":type
   });
};

/*!
* Deny download event
* \tparam int(in) type type of download event
*/
Download.prototype.denyEvent = function(type){
   return interop.invoke(this.instanceId, {
      "method":"denyEvent", 
      "type":type
   });
};

/*!
* Gets a string option from a download
* \tparam string(in) name name of the option
* \type string
* \returns value of the option
*/
Download.prototype.getOptionString = function(name){
   return interop.invoke(this.instanceId, {
      "method":"getOptionString", 
      "name":name
   });
};

/*!
* Sets a string option from a download
* \tparam string(in) name name of the option
* \tparam string(in) value value of the option
* \type bool
* \returns true if successful, false otherwise
*/
Download.prototype.setOptionString = function(name,value){
   return interop.invoke(this.instanceId, {
      "method":"setOptionString", 
      "name":name, 
      "value":value
   });
};

/*!
* Gets an integer option from a download
* \tparam string(in) name name of the option
* \type int
* \returns value of the option
*/
Download.prototype.getOptionInt32 = function(name){
   return interop.invoke(this.instanceId, {
      "method":"getOptionInt32", 
      "name":name
   });
};

/*!
* Sets an integer option from a download
* \tparam string(in) name name of the option
* \tparam int(in) value value of the option
* \type bool
* \returns true if successful, false otherwise
*/
Download.prototype.setOptionInt32 = function(name,value){
   return interop.invoke(this.instanceId, {
      "method":"setOptionInt32", 
      "name":name, 
      "value":value
   });
};

/*!
* Gets a boolean option from a download
* \tparam string(in) name name of the option
* \type bool
* \returns value of the option
*/
Download.prototype.getOptionBoolean = function(name){
   return interop.invoke(this.instanceId, {
      "method":"getOptionBoolean", 
      "name":name
   });
};

/*!
* Sets a boolean option from a download
* \tparam string(in) name name of the option
* \tparam bool(in) value value of the option
* \type bool
* \returns true if successful, false otherwise
*/
Download.prototype.setOptionBoolean = function(name,value){
   return interop.invoke(this.instanceId, {
      "method":"setOptionBoolean", 
      "name":name, 
      "value":value
   });
};


/*!
* Create instance of download
*/
function createDownload()
{
   return interop.createInstance("SSN.Download", Download);
}


function DownloadController(task, args, download) {
    var self = this;

    this.observers = [];

    if (isNull(download)) {
        this.ownsDownload = true;
        this.download = createDownload();
    } else {
        this.ownsDownload = false;
        this.download = download;
    }

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Complete", task, function(sender, info) { self.onComplete(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("Download", "Complete", this.download, function(sender, info) { self.onDownloadComplete(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Download", "ConfigComplete", this.download, function(sender, info) { self.onDownloadConfigComplete(task, info); }));
}

DownloadController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    this.download.stop();
    if (!isNull(this.download)) {
        if (this.ownsDownload === true) {
            this.download.release();
        }
        this.download = null;
    }
};

DownloadController.prototype.onStart = function(task, info) {
    var name, value, metafileData, chunkStart = 0, chunkSize = 8000, self = this;

    if (hasOwnProperty(task.args, "metafile")) {
        this.download.setMetafileSource(app.expandString(task.args.metafile));
        this.download.setUrl("");
    } else if (hasOwnProperty(task.args, "metafileData")) {
        this.download.setUrl("");
        this.download.setMetafileSource("");

        // Don't make this getStringArgument - I don't want it to expand the string
        if (getObjectType(task.args.metafileData) == "array") {
            metafileData = task.args.metafileData.join("");
        } else {
            metafileData = task.args.metafileData;
        }

        // Have to chunk this because the maximum size of the json to native conversion 8192
        while (chunkStart < metafileData.length) {
            this.download.appendMetafileBuffer(metafileData.substring(chunkStart, chunkStart + chunkSize));
            chunkStart = chunkStart + chunkSize;
        }
    } else if (hasOwnProperty(task.args, "url")) {
        this.download.setMetafileSource("");
        this.download.setUrl(app.expandString(task.args.url));
    } else {
        host.assert(false, "{0} not defined for ({1}) in ({2})".format("url/metafile/metafileData", task.type, task.name));
    }

    if (hasOwnProperty(task.args, "allowEvents") && getObjectType(task.args.allowEvents.forEach) === "function") {
        task.args.allowEvents.forEach(function(eventType) {
            self.download.allowEvent(eventType);
        });
    }

    if (hasOwnProperty(task.args, "config")) {
        for (name in task.args.config) {
            if (hasOwnProperty(task.args.config, name)) {
                value = task.args.config[name];
                switch (getObjectType(value)) {
                    case "string":
                        this.download.setOptionString(name, app.expandString(value));
                        break;

                    case "number":
                        this.download.setOptionInt32(name, value);
                        break;

                    case "boolean":
                        this.download.setOptionBoolean(name, value);
                        break;

                    default:
                        host.app.debugPrint("Unable to set property {0} on download (unknown type)\n".format(name));
                        break;
                }
            }
        }
    }

    this.download.start();
};

DownloadController.prototype.onComplete = function(task, info) {
    if (hasOwnProperty(task.args, "retain") && task.args.retain === false) {
        this.download.stop();
    }
};

DownloadController.prototype.onDownloadConfigComplete = function(task, info) {
    this.download.setActive(true);
};

DownloadController.prototype.onDownloadComplete = function(task, info) {
    if (info.successful === false) {
        task.error("DownloadError_" + downloadError.nameFromId(this.download.getLastError()));
        task.complete();
    } else {
        if (!isNull(task.args.autolaunch)) {
            notificationCenter.fire("DownloadTask", "Launch", task, {});
            task.runSubAction("autolaunch", null, function(launchTask, launchInfo) {
                launchInfo.launchTask = launchTask;
                notificationCenter.fire("DownloadTask", "LaunchComplete", task, launchInfo);
                task.complete();
            });
        } else {
            task.complete();
        }
    }
};

DownloadController.prototype.launch = function(task) {
    if (!isNull(task.args.launch)) {
        notificationCenter.fire("DownloadTask", "Launch", task, {});
        task.runSubAction("launch", null, function(launchTask, launchInfo) {
            launchInfo.launchTask = launchTask;
            notificationCenter.fire("DownloadTask", "LaunchComplete", task, launchInfo);
        });
    }
};

DownloadController.prototype.getDownload = function() {
    return this.download;
};

registerTaskController("download", DownloadController);
/*!
* \file Downloader.js
* \brief File containing Downloader class and creation function
*/

/*!
* \class Downloader
* \brief Download management class
*/



(function() {
var loadObs, unloadObs;
loadObs = notificationCenter.addObserver("Interop", "DidLoad", function(sender, info) {
if (info.name !== "downloader") { return; }
loadObs.release();



function Downloader(instanceId)
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
Downloader.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the active state of all downloads
* \type bool
* \returns active state of all downloads
*/
Downloader.prototype.getActive = function(){
   return interop.invoke(this.instanceId, {
      "method":"getActive"
   });
};

/*!
* sets the active state of all downloads
* \tparam bool(in) value active state of all downloads
*/
Downloader.prototype.setActive = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setActive", 
      "value":value
   });
};

/*!
* gets the active state of reliable sources in the download
* \type bool
* \returns active state of reliable sources in the download
*/
Downloader.prototype.getWebBaseActive = function(){
   return interop.invoke(this.instanceId, {
      "method":"getWebBaseActive"
   });
};

/*!
* sets the active state of reliable sources in the download
* \tparam bool(in) value active state of reliable sources in the download
*/
Downloader.prototype.setWebBaseActive = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setWebBaseActive", 
      "value":value
   });
};

/*!
* gets the active state of peers in the download
* \type bool
* \returns active state of peers in the download
*/
Downloader.prototype.getBitBaseActive = function(){
   return interop.invoke(this.instanceId, {
      "method":"getBitBaseActive"
   });
};

/*!
* sets the active state of peers in the download
* \tparam bool(in) value active state of peers in the download
*/
Downloader.prototype.setBitBaseActive = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setBitBaseActive", 
      "value":value
   });
};

/*!
* gets the number of content objects that are in a downloading state
* \type int
* \returns number of content objects that are in a downloading state
*/
Downloader.prototype.getDownloadingCount = function(){
   return interop.invoke(this.instanceId, {
      "method":"getDownloadingCount"
   });
};

/*!
* gets the upload limit for all downloads
* \type int
* \returns upload limit for all downloads
*/
Downloader.prototype.getUploadLimit = function(){
   return interop.invoke(this.instanceId, {
      "method":"getUploadLimit"
   });
};

/*!
* sets the upload limit for all downloads
* \tparam int(in) value upload limit for all downloads
*/
Downloader.prototype.setUploadLimit = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setUploadLimit", 
      "value":value
   });
};

/*!
* gets the download limit for all downloads
* \type int
* \returns download limit for all downloads
*/
Downloader.prototype.getDownloadLimit = function(){
   return interop.invoke(this.instanceId, {
      "method":"getDownloadLimit"
   });
};

/*!
* sets the download limit for all downloads
* \tparam int(in) value download limit for all downloads
*/
Downloader.prototype.setDownloadLimit = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setDownloadLimit", 
      "value":value
   });
};

/*!
* gets the json object containing the rate of the current/average/max throughput for incoming/outgoing connections (only available after accessible is true)
* \type string
* \returns json object containing the rate of the current/average/max throughput for incoming/outgoing connections (only available after accessible is true)
*/
Downloader.prototype.getTransferRates = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTransferRates"
   });
};

/*!
* Retry authentication
* \tparam string(in) webGetContextId webget context unqiue identifier
* \tparam bool(in) cancel TRUE to cancel, FALSE to retry
*/
Downloader.prototype.webGetRetryAuth = function(webGetContextId,cancel){
   return interop.invoke(this.instanceId, {
      "method":"webGetRetryAuth", 
      "webGetContextId":webGetContextId, 
      "cancel":cancel
   });
};


window.downloader = interop.createInstance("SSN.Downloader", Downloader);
unloadObs = notificationCenter.addObserver("Interop", "WillUnload", function(sender, info) {
   if (info.name !== "downloader") { return; }
   unloadObs.release();
   window.downloader.release();
   window.downloader = null;
});

});
}());


/*!
* \file downloaderror.js
* \brief File containing download error constants and helper functions
*/

/*!
* \class DownloadError
* \brief Download error constants and helper functions
*/

function DownloadError() {
    /*!
    * No error
    * \type int
    */
    this.NONE = 0;
    /*!
    * Unknown error
    * \type int
    */
    this.UNKNOWN = 1;
    /*!
    * Invalid metafile
    * \type int
    */
    this.INVALIDMETAFILE = 2;
    /*!
    * Download is already been started
    * \type int
    */
    this.ALREADYDOWNLOADING = 3;
    /*!
    * Output path does not have enough disk space
    * \type int
    */
    this.NOTENOUGHSPACE = 4;
    /*!
    * Source url is unauthorized
    * \type int
    */
    this.UNACCEPTABLESOURCE = 5;
    /*!
    * Source is invalid
    * \type int
    */
    this.INVALIDSOURCE = 6;
    /*!
    * Download failed for an unknown reason
    * \type int
    */
    this.DOWNLOADFAILED = 7;
    /*!
    * User aborted download through BrowseForFolder dialog
    * \type int
    */
    this.USERABORT = 8;
}

/*!
* converts a download error to a string
* \tparam int id download errors
* \type string
* \returns stringified name of download error
*/
DownloadError.prototype.nameFromId = function(id) {
    var nameMap = [
        "None",
        "Unknown",
        "InvalidMetafile",
        "AlreadyDownloading",
        "NotEnoughSpace",
        "UnacceptableSource",
        "InvalidSource",
        "DownloadFailed",
        "UserAbort"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of DownloadError
* \type DownloadError
*/
var downloadError = new DownloadError();

/*!
* \file downloadevent.js
* \brief File containing download event constants and helper functions
*/

/*!
* \class DownloadEvent
* \brief Download event constants and helper functions
*/

function DownloadEvent() {
    /*!
    * Disk Write
    * \type int
    */
    this.DISKWRITE = 0;
    /*!
    * Disk Read
    * \type int
    */
    this.DISKREAD = 1;
    /*!
    * Disk Flush
    * \type int
    */
    this.DISKFLUSH = 2;
    /*!
    * File Closed
    * \type int
    */
    this.DISKCLOSE = 3;
    /*!
    * Web Request
    * \type int
    */
    this.WEBREQUEST = 4;
    /*!
    * Web First Byte
    * \type int
    */
    this.WEBFIRSTBYTE = 5;
    /*!
    * Peer Connect
    * \type int
    */
    this.PEERCONNECT = 6;
    /*!
    * Peer encrypting
    * \type int
    */
    this.PEERENCRYPT = 7;
    /*!
    * Peer First Byte
    * \type int
    */
    this.PEERFIRSTBYTE = 8;
}

/*!
* converts an event type to a string
* \tparam int id event type
* \type string
* \returns stringified name of event type
*/
DownloadEvent.prototype.nameFromId = function(id) {
    var nameMap = [
        "DiskWrite",
        "DiskRead",
        "DiskFlush",
        "DiskClose",
        "WebRequest",
        "WebFirstByte",
        "PeerConnect",
        "PeerEncrypt",
        "PeerFirstByte"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of DownloadEvent
* \type DownloadEvent
*/
var downloadEvent = new DownloadEvent();

/*!
* \file downloadsessionstateflag.js
* \brief File containing download session state flag constants and helper functions
*/

/*!
* \class DownloadSessionStateFlag
* \brief DownloadSessionStateFlag constants and helper functions
*/
function DownloadSessionStateFlag() {
    /*!
    * None
    * \type int
    */
    this.NONE = 0x00000;
    /*!
    * P2P
    * \type int
    */
    this.P2P = 0x00001;
    /*!
    * HTTP
    * \type int
    */
    this.HTTP = 0x00002;
    /*!
    * UPNP
    * \type int
    */
    this.UPNP = 0x00004;
    /*!
    * NATPMP
    * \type int
    */
    this.NATPMP = 0x00008;
    /*!
    * Stun
    * \type int
    */
    this.STUN = 0x00010;
    /*!
    * Stun udp blocked
    * \type int
    */
    this.STUN_UDPBLOCKED = 0x00020;
    /*!
    * Stun open internet
    * \type int
    */
    this.STUN_OPENINTERNET = 0x00040;
    /*!
    * Symmetric firewall
    * \type int
    */
    this.STUN_SYMMETRICFIREWALL = 0x00080;
    /*!
    * Stun Full cone nat
    * \type int
    */
    this.STUN_FULLCONENAT = 0x00100;
    /*!
    * Stun Symmetric cone nat
    * \type int
    */
    this.STUN_SYMMETRICCONENAT = 0x00200;
    /*!
    * Stun Restricten Cone Nat
    * \type int
    */
    this.STUN_RESTRICTEDCONENAT = 0x00400;
    /*!
    * Stun Port Restricted Cone Nat
    * \type int
    */
    this.STUN_PORTRESTRICTEDCONENAT = 0x00800;
    /*!
    * Proxy
    * \type int
    */
    this.PROXY = 0x01000;
    /*!
    * Proxy Basic
    * \type int
    */
    this.PROXY_BASIC = 0x02000;
    /*!
    * Proxy Digest
    * \type int
    */
    this.PROXY_DIGEST = 0x04000;
    /*!
    * Proxy NTLM
    * \type int
    */
    this.PROXY_NTLM = 0x08000;
    /*!
    * Proxy Negotiate
    * \type int
    */
    this.PROXY_NEGOTIATE = 0x10000;
    /*!
    * Has seeds
    * \type int
    */
    this.P2P_HASSEEDS = 0x20000;
    /*!
    * Has leeches
    * \type int
    */
    this.P2P_HASLEECHES = 0x40000;
    /*!
    * Has incoming
    * \type int
    */
    this.P2P_HASINCOMING = 0x40000;
}

/*!
* converts a connectivity state to a string
* \type string
* \tparam int id flag in session state
* \tparam bool extended returns extended information about the connection (such as UPNP and STUN info)
*/
DownloadSessionStateFlag.prototype.connectivityFromId = function(id, extended) {
    if (id < 0) {
        return "Unknown";
    }

    if (id == downloadSessionStateFlag.NONE) {
        return "None";
    }

    var retVal = "";

    if (thisIs(id, downloadSessionStateFlag.P2P)) retVal += "P2P_";
    if (thisIs(id, downloadSessionStateFlag.HTTP)) retVal += "HTTP_";
    if (extended == true) {
        if (thisIs(id, downloadSessionStateFlag.UPNP)) retVal += "UPNP_";
        if (thisIs(id, downloadSessionStateFlag.NATPMP)) retVal += "NATPMP_";
        if (thisIs(id, downloadSessionStateFlag.STUN)) {
            retVal += "Stun";

            if (thisIs(id, downloadSessionStateFlag.STUN_UDPBLOCKED)) retVal += "UDPBlocked_";
            else if (thisIs(id, downloadSessionStateFlag.STUN_OPENINTERNET)) retVal += "OpenInternet_";
            else if (thisIs(id, downloadSessionStateFlag.STUN_SYMMETRICFIREWALL)) retVal += "SymmetricFirewall_";
            else if (thisIs(id, downloadSessionStateFlag.STUN_FULLCONENAT)) retVal += "FullConeNAT_";
            else if (thisIs(id, downloadSessionStateFlag.STUN_SYMMETRICCONENAT)) retVal += "SymmetricConeNAT_";
            else if (thisIs(id, downloadSessionStateFlag.STUN_RESTRICTEDCONENAT)) retVal += "RestrictedConeNAT_";
            else if (thisIs(id, downloadSessionStateFlag.STUN_PORTRESTRICTEDCONENAT)) retVal += "PortRestrictedConeNAT_";
        }
        if (thisIs(id, downloadSessionStateFlag.PROXY)) {
            retVal += "Proxy";

            if (thisIs(id, downloadSessionStateFlag.PROXY_BASIC)) retVal += "Basic";
            else if (thisIs(id, downloadSessionStateFlag.PROXY_DIGEST)) retVal += "Digest";
            else if (thisIs(id, downloadSessionStateFlag.PROXY_NTLM)) retVal += "NTLM";
            else if (thisIs(id, downloadSessionStateFlag.PROXY_NEGOTIATE)) retVal += "Negotiate";
        }
    }

    retVal = retVal.trimChars("_");
    return retVal;
};

/*!
* precreated global instance of DownloadSessionStateFlag
* \type DownloadSessionStateFlag
*/
var downloadSessionStateFlag = new DownloadSessionStateFlag();
/*!
* \file downloadstallreason.js
* \brief File containing download stall reason constants and helper functions
*/

/*!
* \class DownloadStallReason
* \brief Download stall reason constants and helper functions
*/
function DownloadStallReason() {
    /*!
    * No error
    * \type int
    */
    this.NONE = 0;
    /*!
    * Unable to contact reliable source
    * \type int
    */
    this.RELIABLESOURCECANTCONTACT = 1;
    /*!
    * Reliable source integrity error
    * \type int
    */
    this.RELIABLESOURCEBADINTEGRITY = 2;
    /*!
    * Reliable source not specified
    * \type int
    */
    this.RELIABLESOURCENOTSPECIFIED = 3;
    /*!
    * Tracker not specified
    * \type int
    */
    this.TRACKERNOTSPECIFIED = 4;
    /*!
    * Tracker list empty
    * \type int
    */
    this.TRACKERLISTEMPTY = 5;
    /*!
    * Unable to contact tracker
    * \type int
    */
    this.TRACKERCANTCONTACT = 6;
    /*!
    * Peer list empty
    * \type int
    */
    this.PEERLISTEMPTY = 7;
    /*!
    * No good peers found
    * \type int
    */
    this.PEERNOGOODONES = 8;
    /*!
    * Content write failed
    * \type int
    */
    this.CONTENTWRITE = 9;
    /*!
    * HTTP transport failed
    * \type int
    */
    this.TRANSPORTHTTP = 10;
    /*!
    * HTTP client transport failed
    * \type int
    */
    this.TRANSPORTHTTPCLIENT = 11;
    /*!
    * Socket transport failed
    * \type int
    */
    this.TRANSPORTSOCKET = 12;
}

/*!
* converts a download stall reason to a string
* \tparam int id download stall reason
* \type string
* \returns stringified name of download failure
*/
DownloadStallReason.prototype.nameFromId = function(id) {
    var nameMap = [
        "None",
        "ReliableSourceContact",
        "ReliableSourceBadIntegrity",
        "ReliableSourceNotSpecified",
        "TrackerNotSpecified",
        "TrackerListEmpty",
        "TrackerContact",
        "PeerListEmpty",
        "PeerNoGoodOnes",
        "ContentWrite",
        "TransportHttp",
        "TransportHttpClient",
        "TransportSocket"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of downloadStallReason
* \type DownloadStallReason
*/
var downloadStallReason = new DownloadStallReason();

/*!
* \file downloadstate.js
* \brief File containing download state constants and helper functions
*/

/*!
* \class DownloadState
* \brief Download state constants and helper functions
*/
function DownloadState() {
   /*!
   * Unknown state
   * \type int
   */
    this.UNKNOWN = -1;
   /*!
   * Idle state
   * \type int
   */
    this.IDLE = 0;
   /*!
   * Failure state
   * \type int
   */
    this.FAILURE = 1;
   /*!
   * Pause state
   * \type int
   */
    this.PAUSE = 2;
   /*!
   * Stop state
   * \type int
   */
    this.STOP = 3;
   /*!
   * Resume state
   * \type int
   */
    this.RESUME = 4;
   /*!
   * Start state
   * \type int
   */
    this.START = 5;
   /*!
   * Create state
   * \type int
   */
    this.CREATE = 6;
   /*!
   * Check state
   * \type int
   */
    this.CHECK = 7;
   /*!
   * Download with check state
   * \type int
   */
    this.DOWNLOADWITHCHECK = 8;
   /*!
   * Download state
   * \type int
   */
    this.DOWNLOAD = 9;
    /*!
    * Download stalled state
    * \type int
    */
    this.DOWNLOADSTALLED = 10;
    /*!
    * Complete state
    * \type int
    */
    this.COMPLETE = 11;
   /*!
   * Seed state
   * \type int
   */
    this.SEED = 12;
}

/*!
* converts a download state to a string
* \type string
* \tparam int id download state
*/
DownloadState.prototype.nameFromId = function(id) {
    if (id < 0) {
        return "Unknown";
    }

    var nameMap = [
        "Idle",
        "Failure",
        "Paused",
        "Stopping",
        "Resuming",
        "Starting",
        "Creating",
        "Checking",
        "DownloadingChecking",
        "Downloading",
        "DownloadingStalled",
        "Complete",
        "Seeding"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of DownloadState
* \type DownloadState
*/
var downloadState = new DownloadState();

function DownloadView(task, args, controller) {
    var self = this;

    this.instanceId = app.expandString("{Guid}");
    this.rootElement = null;
    this.statusElement = null;
    this.deliveryMethodElement = null;
    this.timeEstElement = null;
    this.bytesLeftElement = null;
    this.transferSpeedElement = null;
    this.uploadSpeedElement = null;
    this.progressBarElement = null;
    this.progressElement = null;
    this.titleElement = null;
    this.pauseElement = null;
    this.resumeElement = null;
    this.launchElement = null;
    this.normalizeProgress = false;

    if (isNull(controller)) {
        this.ownsController = true;
        this.controller = task.controller;
    } else {
        this.ownsController = false;
        this.controller = controller;
    }

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("Workflow", "WillUnload", workflow, function(sender, info) { self.onWorkflowUnload(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("DownloadTask", "Launch", task, function(sender, info) { self.onDownloadTaskLaunch(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("DownloadTask", "LaunchComplete", task, function(sender, info) { self.onDownloadTaskLaunchComplete(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("Download", "Stop", this.controller.getDownload(), function(sender, info) { self.onDownloadStop(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Download", "Complete", this.controller.getDownload(), function(sender, info) { self.onDownloadComplete(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Download", "ConfigComplete", this.controller.getDownload(), function(sender, info) { self.onDownloadConfigComplete(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Download", "StateChange", this.controller.getDownload(), function(sender, info) { self.onDownloadStateChange(task, info); }));
}

DownloadView.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    this.onTimerStop();

    if (!isNull(this.rootElementClass)) {
        this.rootElementClass.release();
        this.rootElementClass = null;
    }
    if (!isNull(this.rootElementLaunchClass)) {
        this.rootElementLaunchClass.release();
        this.rootElementLaunchClass = null;
    }
    if (!isNull(this.progressBarElementClass)) {
        this.progressBarElementClass.release();
        this.progressBarElementClass = null;
    }

    if (!isNull(this.controller)) {
        if (this.ownsController === true) {
            this.controller.release();
        }
        this.controller = null;
    }
};

DownloadView.prototype.onStart = function(task, info) {
    var self = this;

    if (hasOwnProperty(task.args, "normalizeProgress")) {
        this.normalizeProgress = task.args.normalizeProgress;
    }

    notificationCenter.fire("DownloadView", "Bind", task, this);

    host.assert(!isNull(this.rootElement), "DownloadView binding did not assign root element");

    this.rootElementClass = new ChangeClass(this.rootElement);
    this.rootElementLaunchClass = new ChangeClass(this.rootElement);
    if (!isNull(this.progressBarElement)) {
        this.progressBarElementClass = new ChangeClass(this.progressBarElement);
    }

    // Do unbind first just in case pause/resume share an element
    if (!isNull(this.pauseElement)) {
        this.pauseElement.unbind(".downloadview");
    }

    if (!isNull(this.resumeElement)) {
        this.resumeElement.unbind(".downloadview");
    }

    if (!isNull(this.launchElement)) {
        this.launchElement.unbind(".downloadview");
    }

    if (!isNull(this.pauseElement)) {
        this.pauseElement.bind("click.downloadview", null, function() {
            if (task.controller.getDownload().getState() !== downloadState.PAUSE) {
                task.controller.getDownload().setActive(false);
            }
        });
    }

    if (!isNull(this.resumeElement)) {
        this.resumeElement.bind("click.downloadview", null, function() {
            if (task.controller.getDownload().getState() === downloadState.PAUSE) {
                task.controller.getDownload().setActive(true);
            }
        });
    }

    if (!isNull(this.launchElement)) {
        this.launchElement.bind("click.downloadview", null, function() {
            task.controller.launch(task);
        });
    }

    this.onChangeClass("downloadStateInitializing");
    this.onUpdateStatus(host.getLanguageString("DownloadState_Initializing"));
    this.onUpdateProgressInternal(-1, downloadState.IDLE);
};

DownloadView.prototype.onWorkflowUnload = function(task, info) {
    this.release();
};

DownloadView.prototype.onDownloadStop = function(task, info) {
    this.onTimerStop();
};

DownloadView.prototype.onTimerDownload = function(state) {
    var download = this.controller.getDownload(), connectivityName, 
        sessionState = interop.parseJSON(download.getSessionState()),
        transferRates = interop.parseJSON(download.getTransferRates());

    if (state === downloadState.DOWNLOADSTALLED) {
        this.onUpdateStatus(host.getLanguageString("DownloadStalled_" + downloadStallReason.nameFromId(download.getStallReason())));
    }

    if (!isNull(sessionState)) {
        connectivityName = downloadSessionStateFlag.connectivityFromId(sessionState.flags);
        if (connectivityName.length > 0) {
            connectivityName = "DownloadConnectivity_" + connectivityName;
        }
    }

    this.onUpdateDeliveryMethod(host.getLanguageString(connectivityName));
    this.onUpdateTimeEst(messageFormat.getTimeEstimate(download.getRemainingTime()));
    this.onUpdateBytesLeft(messageFormat.getBytesLeft(download.getBytesLeft()));
    
    this.onUpdateTransferSpeed(messageFormat.getTransferSpeed(transferRates.incoming.average));
    this.onUpdateUploadSpeed(messageFormat.getTransferSpeed(transferRates.outgoing.average));
    this.onUpdateProgressInternal(download.getStateProgress(), download.getState());

    sessionState = null;
};

DownloadView.prototype.onTimerStart = function() {
    var self = this;

    if (isNull(this.timerId)) {
        this.timerId = setInterval(function() { self.onTimer(); }, 250);
    }
};

DownloadView.prototype.onTimerStop = function() {
    if (!isNull(this.timerId)) {
        clearInterval(this.timerId);
        this.timerId = null;
    }
};

DownloadView.prototype.onTimer = function() {
    var state = this.controller.getDownload().getState();

    switch (state) {
        case downloadState.CREATE:
        case downloadState.CHECK:
        case downloadState.DOWNLOADWITHCHECK:
        case downloadState.DOWNLOAD:
        case downloadState.DOWNLOADSTALLED:
        case downloadState.SEED:
            this.onTimerDownload(state);
            break;
    }
};

DownloadView.prototype.onUpdateElement = function(element, value) {
    if (!isNull(element)) {
        var oldValue = element.html();
        if (oldValue !== value) {
            element.html(value);
            element.trigger("changed", [oldValue, value]);
        }
    }
};

DownloadView.prototype.onUpdateTitle = function(value) {
    this.onUpdateElement(this.titleElement, value);
};

DownloadView.prototype.onUpdateStatus = function(value) {
    this.onUpdateElement(this.statusElement, value);
};

DownloadView.prototype.onUpdateTimeEst = function(value) {
    this.onUpdateElement(this.timeEstElement, value);
};

DownloadView.prototype.onUpdateBytesLeft = function(value) {
    this.onUpdateElement(this.bytesLeftElement, value);
};

DownloadView.prototype.onUpdateDeliveryMethod = function(value) {
    this.onUpdateElement(this.deliveryMethodElement, value);
};

DownloadView.prototype.onUpdateTransferSpeed = function(value) {
    this.onUpdateElement(this.transferSpeedElement, value);
};

DownloadView.prototype.onUpdateUploadSpeed = function(value) {
    this.onUpdateElement(this.uploadSpeedElement, value);
};

DownloadView.prototype.onUpdateProgress = function(value) {
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

DownloadView.prototype.onUpdateProgressInternal = function(value, currentState) {
    var progress = 0.0, i = 0, stateMultiplier = [
        0.0,  // downloadState.IDLE
        0.0,  // downloadState.FAILURE
        0.0,  // downloadState.PAUSE
        0.0,  // downloadState.STOP
        0.0,  // downloadState.RESUME
        0.0,  // downloadState.START
        0.0,  // downloadState.CREATE
        0.20, // downloadState.CHECK
        0.0,  // downloadState.DOWNLOADWITHCHECK
        0.80, // downloadState.DOWNLOAD
        0.0,  // downloadState.DOWNLOADSTALLED
        0.0,  // downloadState.COMPLETE
        0.0   // downloadState.SEED
    ];

    //app.debugPrint("downloadProgress value {0} currentState {1}\n".format(value.toFixed(2), currentState));

    if (!this.normalizeProgress) {
        this.onUpdateProgress(value);
        return;
    }
    if (value <= -1) {
        return;
    }
    if (currentState == downloadState.CHECK) {
        this.progressEnteredCheckState = true;
    } else if (currentState < downloadState.CHECK) {
        this.progressEnteredCheckState = false;
    }
    for (i = 0; i < stateMultiplier.length; i += 1) {
        if (i === currentState) {
            break;
        }
        // If there we don't enter a CHECK state with a progress between 0-100 then give DOWNLOAD state it's multiplier value
        if (i == downloadState.CHECK) {
            if (isNull(this.progressEnteredCheckState) || !this.progressEnteredCheckState) {
                stateMultiplier[downloadState.DOWNLOAD] += stateMultiplier[downloadState.CHECK];
                stateMultiplier[downloadState.CHECK] = 0.0;
            }
        }
        progress += stateMultiplier[i];
    }

    progress += (stateMultiplier[i] * parseFloat(value));

    //app.debugPrint("downloadProgress stateMultiplier {0}\n".format(stateMultiplier[currentState].toFixed(2)));
    //app.debugPrint("downloadProgress progress {0}\n".format(progress.toFixed(2)));

    this.onUpdateProgress(progress);
};

DownloadView.prototype.onDownloadConfigComplete = function(task, info) {
    var download = this.controller.getDownload();

    if (hasOwnProperty(task.args, "title")) {
        this.onUpdateTitle(download.expandString(task.args.title));
    }
};

DownloadView.prototype.onDownloadComplete = function(task, info) {
    var download = this.controller.getDownload();

    if (info.successful === false) {
        this.onUpdateStatus(host.getLanguageString("DownloadError_" + downloadError.nameFromId(download.getLastError())));
    }
};

DownloadView.prototype.onDownloadStateChange = function(task, info) {
    var download = this.controller.getDownload();

    this.onChangeClass("downloadState" + downloadState.nameFromId(info.state));

    if (info.state >= downloadState.CREATE && info.state !== downloadState.COMPLETE) {
        this.onTimerStart();
    } else {
        this.onTimerStop();
    }

    this.onUpdateStatus(host.getLanguageString("DownloadState_" + downloadState.nameFromId(info.state)));
    this.onUpdateProgressInternal(download.getStateProgress(), download.getState());
};

DownloadView.prototype.onDownloadTaskLaunch = function(task, info) {
    this.rootElementLaunchClass.apply("launchStateRunning");
};

DownloadView.prototype.onDownloadTaskLaunchComplete = function(task, info) {
    if (info.launchTask.hasError()) {
        this.rootElementLaunchClass.apply("launchStateError");
        this.onUpdateStatus(host.getLanguageString(info.launchTask.getFirstErrorMessage()));
    } else if (info.launchTask.hasWarning()) {
        this.rootElementLaunchClass.apply("launchStateWarning");
        this.onUpdateStatus(host.getLanguageString(info.launchTask.getFirstWarningMessage()));
    } else {
        this.rootElementLaunchClass.apply("launchStateComplete");
        if (hasOwnProperty(task.args, "launchCompleteMessage")) {
            this.onUpdateStatus(host.getLanguageString(task.args.launchCompleteMessage));
        }
    }
};

DownloadView.prototype.onChangeClass = function(newStateName) {
    this.rootElementClass.apply(newStateName);
};

registerTaskView("download", DownloadView);

/*!
* \file HttpRequest.js
* \brief File containing HttpRequest class and creation function
*/

/*!
* \class HttpRequest
* \brief HTTP request
*/




function HttpRequest(instanceId)
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
HttpRequest.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the caching use in the request
* \type bool
* \returns caching use in the request
*/
HttpRequest.prototype.getUseCache = function(){
   return interop.invoke(this.instanceId, {
      "method":"getUseCache"
   });
};

/*!
* sets the caching use in the request
* \tparam bool(in) value caching use in the request
*/
HttpRequest.prototype.setUseCache = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setUseCache", 
      "value":value
   });
};

/*!
* gets the call validation callback before completing
* \type bool
* \returns call validation callback before completing
*/
HttpRequest.prototype.getValidate = function(){
   return interop.invoke(this.instanceId, {
      "method":"getValidate"
   });
};

/*!
* sets the call validation callback before completing
* \tparam bool(in) value call validation callback before completing
*/
HttpRequest.prototype.setValidate = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setValidate", 
      "value":value
   });
};

/*!
* gets the type of request
* \type int
* \returns type of request
*/
HttpRequest.prototype.getType = function(){
   return interop.invoke(this.instanceId, {
      "method":"getType"
   });
};

/*!
* sets the type of request
* \tparam int(in) value type of request
*/
HttpRequest.prototype.setType = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setType", 
      "value":value
   });
};

/*!
* gets the maximum body size for request
* \type int
* \returns maximum body size for request
*/
HttpRequest.prototype.getLimitBodySize = function(){
   return interop.invoke(this.instanceId, {
      "method":"getLimitBodySize"
   });
};

/*!
* sets the maximum body size for request
* \tparam int(in) value maximum body size for request
*/
HttpRequest.prototype.setLimitBodySize = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setLimitBodySize", 
      "value":value
   });
};

/*!
* gets the url for request
* \type string
* \returns url for request
*/
HttpRequest.prototype.getUrl = function(){
   return interop.invoke(this.instanceId, {
      "method":"getUrl"
   });
};

/*!
* sets the url for request
* \tparam string(in) value url for request
*/
HttpRequest.prototype.setUrl = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setUrl", 
      "value":value
   });
};

/*!
* gets the file name where url is saved (empty to save to buffer)
* \type string
* \returns file name where url is saved (empty to save to buffer)
*/
HttpRequest.prototype.getFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileName"
   });
};

/*!
* sets the file name where url is saved (empty to save to buffer)
* \tparam string(in) value file name where url is saved (empty to save to buffer)
*/
HttpRequest.prototype.setFileName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFileName", 
      "value":value
   });
};

/*!
* gets the number of times to retry
* \type int
* \returns number of times to retry
*/
HttpRequest.prototype.getRetryCount = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRetryCount"
   });
};

/*!
* sets the number of times to retry
* \tparam int(in) value number of times to retry
*/
HttpRequest.prototype.setRetryCount = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setRetryCount", 
      "value":value
   });
};

/*!
* gets the request deletion when released
* \type bool
* \returns request deletion when released
*/
HttpRequest.prototype.getCleanup = function(){
   return interop.invoke(this.instanceId, {
      "method":"getCleanup"
   });
};

/*!
* sets the request deletion when released
* \tparam bool(in) value request deletion when released
*/
HttpRequest.prototype.setCleanup = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setCleanup", 
      "value":value
   });
};

/*!
* gets the seconds to wait for connection before timeout
* \type int
* \returns seconds to wait for connection before timeout
*/
HttpRequest.prototype.getConnectTimeout = function(){
   return interop.invoke(this.instanceId, {
      "method":"getConnectTimeout"
   });
};

/*!
* sets the seconds to wait for connection before timeout
* \tparam int(in) value seconds to wait for connection before timeout
*/
HttpRequest.prototype.setConnectTimeout = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setConnectTimeout", 
      "value":value
   });
};

/*!
* gets the http code for request
* \type int
* \returns http code for request
*/
HttpRequest.prototype.getHttpCode = function(){
   return interop.invoke(this.instanceId, {
      "method":"getHttpCode"
   });
};

/*!
* gets the raw http code for request
* \type int
* \returns raw http code for request
*/
HttpRequest.prototype.getRawHttpCode = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRawHttpCode"
   });
};

/*!
* gets the content length of the request
* \type int
* \returns content length of the request
*/
HttpRequest.prototype.getContentLength = function(){
   return interop.invoke(this.instanceId, {
      "method":"getContentLength"
   });
};

/*!
* gets the current position of the file in request
* \type int
* \returns current position of the file in request
*/
HttpRequest.prototype.getFilePosition = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFilePosition"
   });
};

/*!
* gets the header size of the request
* \type int
* \returns header size of the request
*/
HttpRequest.prototype.getHeaderSize = function(){
   return interop.invoke(this.instanceId, {
      "method":"getHeaderSize"
   });
};

/*!
* gets the current body size of the request
* \type int
* \returns current body size of the request
*/
HttpRequest.prototype.getBodySize = function(){
   return interop.invoke(this.instanceId, {
      "method":"getBodySize"
   });
};

/*!
* Start request
*/
HttpRequest.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};

/*!
* Reset request
*/
HttpRequest.prototype.reset = function(){
   return interop.invoke(this.instanceId, {
      "method":"reset"
   });
};

/*!
* Abort request
*/
HttpRequest.prototype.abort = function(){
   return interop.invoke(this.instanceId, {
      "method":"abort"
   });
};

/*!
* Complete the request validation
* \tparam bool(in) successful TRUE if the validation was successful, FALSE otherwise
*/
HttpRequest.prototype.validate = function(successful){
   return interop.invoke(this.instanceId, {
      "method":"validate", 
      "successful":successful
   });
};

/*!
* gets the body buffer
* \tparam int(in) offset offset to start at
* \tparam int(in) length number of bytes to return
* \type string
* \returns buffer of body starting at offset, hex encoded
*/
HttpRequest.prototype.getBody = function(offset,length){
   return interop.invoke(this.instanceId, {
      "method":"getBody", 
      "offset":offset, 
      "length":length
   });
};

/*!
* clears the post data buffer
*/
HttpRequest.prototype.clearPostData = function(){
   return interop.invoke(this.instanceId, {
      "method":"clearPostData"
   });
};

/*!
* appends post data to a buffer
* \tparam string(in) postData hex encoded data for buffer
*/
HttpRequest.prototype.appendPostData = function(postData){
   return interop.invoke(this.instanceId, {
      "method":"appendPostData", 
      "postData":postData
   });
};

/*!
* sets the byte range for a request
* \tparam int(in) start start of download
* \tparam int(in) end end of download
*/
HttpRequest.prototype.setByteRange = function(start,end){
   return interop.invoke(this.instanceId, {
      "method":"setByteRange", 
      "start":start, 
      "end":end
   });
};

/*!
* checks if a value exists in the header
* \tparam string(in) name name of header value
* \type bool
* \returns true if exists, false otherwise
*/
HttpRequest.prototype.headerExists = function(name){
   return interop.invoke(this.instanceId, {
      "method":"headerExists", 
      "name":name
   });
};

/*!
* gets the header buffer as a raw string
* \tparam int(in) offset offset to start at
* \tparam int(in) length number of bytes to return
* \type string
* \returns buffer of header starting at offset, hex encoded
*/
HttpRequest.prototype.getHeader = function(offset,length){
   return interop.invoke(this.instanceId, {
      "method":"getHeader", 
      "offset":offset, 
      "length":length
   });
};

/*!
* gets value for a key
* \tparam string(in) name name of header value
* \type string
* \returns header value
*/
HttpRequest.prototype.getHeaderValue = function(name){
   return interop.invoke(this.instanceId, {
      "method":"getHeaderValue", 
      "name":name
   });
};

/*!
* sets value for a key
* \tparam string(in) name name of header value
* \tparam string(in) value value store with name
*/
HttpRequest.prototype.setHeaderValue = function(name,value){
   return interop.invoke(this.instanceId, {
      "method":"setHeaderValue", 
      "name":name, 
      "value":value
   });
};


/*!
* Create instance of httpRequest
*/
function createHttpRequest()
{
   return interop.createInstance("SSN.HttpRequest", HttpRequest);
}


/*!
* \file httprequesttype.js
* \brief File containing http request type constants and helper functions
*/

/*!
* \class HttpRequestType
* \brief HttpRequestType state constants and helper functions
*/
function HttpRequestType() {
    /*!
    * Unknown
    * \type int
    */
    this.UNKNOWN = 0;
    /*!
    * Get
    * \type int
    */
    this.GET = 1;
    /*!
    * Post
    * \type int
    */
    this.POST = 2;
    /*!
    * Put
    * \type int
    */
    this.PUT = 3;
    /*!
    * Delete
    * \type int
    */
    this.DELETE = 4;
    /*!
    * HEAD
    * \type int
    */
    this.HEAD = 5;
}

/*!
* converts a http request type to a string
* \type string
* \tparam int id http request type
* \returns stringified name of request type
*/
HttpRequestType.prototype.nameFromId = function(id) {
    var nameMap = [
        "Unknown",
        "Get",
        "Post",
        "Put",
        "Delete",
        "Head"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of HttpRequestType
* \type HttpRequestType
*/
var httpRequestType = new HttpRequestType();
function HttpRequestXhr(originalXhr) {
    this.readyState = HttpRequestXhr.IDLE;
    this.responseText = "";
    this.responseXML = null;
    this.status = 0;
    this.statusText = "";
    this.onreadystatechange = function() { };
    this.httpRequest = null;
    this.observers = [];
    this.pendingFunctions = [];
    this.pendingIntervalId = null;
}

HttpRequestXhr.prototype.internalCreateConnection = function() {
    var self = this;

    if (!isNull(this.httpRequest)) {
        this.httpRequest.reset();
        return;
    }

    this.httpRequest = createHttpRequest();
    this.httpRequest.setUseCache(false);
    this.httpRequest.setRetryCount(1);

    this.observers.push(notificationCenter.addInstanceObserver("HttpRequest", "HeaderDone", this.httpRequest, function(sender, info) { self.onHeaderDone(sender, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("HttpRequest", "Complete", this.httpRequest, function(sender, info) { self.onRequestComplete(sender, info); }));
};

HttpRequestXhr.prototype.internalClose = function() {
    if (!isNull(this.pendingIntervalId)) {
        clearInterval(this.pendingIntervalId);
        this.pendingIntervalId = null;
    }

    this.pendingFunctions = [];

    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.httpRequest)) {
        this.httpRequest.release();
        this.httpRequest = null;
    }
};

HttpRequestXhr.prototype.pendFunction = function(func) {
    var self = this;

    function processPending() {
        if (interop.isInteropLoaded("downloader") === false) {
            return;
        }

        clearInterval(self.pendingIntervalId);
        self.pendingIntervalId = null;

        self.pendingFunctions.forEach(function(func) {
            func();
        });

        self.pendingFunctions = [];
    }

    this.pendingFunctions.push(func);

    if (isNull(this.pendingIntervalId)) {
        this.pendingIntervalId = setInterval(function() {
            processPending();
        }, 250);
    }
};

HttpRequestXhr.prototype.onHeaderDone = function(sender, info) {
    this.changeReadyState(HttpRequestXhr.HEADERDONE);
    this.changeReadyState(HttpRequestXhr.BODY);
};

HttpRequestXhr.prototype.onRequestComplete = function(sender, info) {
    var offset = 0, chunk, chunkLength = 4000, self = this;

    this.status = this.httpRequest.getHttpCode();

    do {
        chunk = app.base64Decode(this.httpRequest.getBody(offset, chunkLength));
        this.responseText = this.responseText.concat(chunk);
        offset += chunkLength;
    } while (chunk.length > 0);

    chunk = null;

    try {
        this.responseXML = $.parseXML(this.responseText);
    }
    catch (err) {
        this.responseXML = null;
    }

    this.changeReadyState(HttpRequestXhr.COMPLETE);

    if (!isNull(this.httpRequest)) {
        setTimeout(function() { self.internalClose(); }, 0);
    }
};

HttpRequestXhr.prototype.changeReadyState = function(state) {
    this.readyState = state;
    this.onreadystatechange();
};

HttpRequestXhr.prototype.open = function(method, url, async, user, password) {
    var self = this;

    if (interop.isInteropLoaded("downloader") === false) {
        this.pendFunction(function() { self.open(method, url, async, user, password); });
        return;
    }

    this.internalCreateConnection();

    host.assert(async === true, "Synchronous request not supported");

    method = method.toLowerCase();

    switch (method) {
        case "get":
            this.httpRequest.setType(httpRequestType.GET);
            break;
        case "post":
            this.httpRequest.setType(httpRequestType.POST);
            break;
        case "put":
            this.httpRequest.setType(httpRequestType.PUT);
            break;
        case "delete":
            this.httpRequest.setType(httpRequestType.DELETE);
            break;
        case "head":
            this.httpRequest.setType(httpRequestType.HEAD);
            break;
        default:
            host.assert(false, "Unsupported request type ({0})".format(method));
            return;
    }

    this.httpRequest.setUrl(url);
    this.changeReadyState(HttpRequestXhr.OPEN);
};

HttpRequestXhr.prototype.send = function(data) {
    var self = this, chunkStart = 0, chunkLength = 8000, stringData;

    if (interop.isInteropLoaded("downloader") === false) {
        this.pendFunction(function() { self.send(data); });
        return;
    }

    if (!isNull(data)) {
        stringData = data.toString();

        while (chunkStart < stringData.length) {
            this.httpRequest.appendPostData(app.base64Encode(stringData.substring(chunkStart, chunkStart + chunkLength)));
            chunkStart = chunkStart + chunkLength;
        }
    }

    this.httpRequest.start();
};

HttpRequestXhr.prototype.abort = function() {
    var self = this;

    if (!isNull(this.httpRequest)) {
        self.internalClose();
    }
};

HttpRequestXhr.prototype.overrideMimeType = function(mime) {
};

HttpRequestXhr.prototype.getAllResponseHeaders = function() {
    host.assert(!isNull(this.httpRequest), "HttpRequest object does not exist");
    
    var offset = 0, chunk, chunkLength = 4000, headerStr = "";

    do {
        chunk = app.base64Decode(this.httpRequest.getHeader(offset, chunkLength));
        headerStr += chunk;
        offset += chunkLength;
    } while (chunk.length > 0);
    
    return headerStr;
};

HttpRequestXhr.prototype.getResponseHeader = function(name) {
    host.assert(!isNull(this.httpRequest), "HttpRequest object does not exist");
    return this.httpRequest.getHeaderValue(name);
};

HttpRequestXhr.prototype.setRequestHeader = function(name, value) {
    var self = this;
    if (interop.isInteropLoaded("downloader") === false) {
        this.pendFunction(function() { self.setRequestHeader(name, value); });
        return;
    }

    this.httpRequest.setHeaderValue(name, value);
};

HttpRequestXhr.IDLE = 0;
HttpRequestXhr.OPEN = 1;
HttpRequestXhr.HEADERDONE= 2;
HttpRequestXhr.BODY = 3;
HttpRequestXhr.COMPLETE = 4;

(function() {
    jQuery.ajaxSetup({
        converters: {
            "text script": function(text) {
                return text;
            }
        },
        crossDomain: false,
        xhr: function() { return new HttpRequestXhr(); }
    });
} ());

