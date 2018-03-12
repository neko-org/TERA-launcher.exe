/**
 * @preserve Modifications performed to this file by anyone other than Solid State Networks
 * are unsupported and may void your software warranty.
 */
$(document).ready(function() {
    host.assert(app.expandString("{AppVersion}") === "3.6.8.1", "Invalid application version");
});


function AppInstallController(task, args) {
    var self = this;

    if (host.isWin) {
        this.installRoot = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\";
    } else {
        this.installRoot = "/Applications/";
    }

    this.observers = [];    
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

AppInstallController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

AppInstallController.prototype.onIsInstalled = function(task) {
    var self = this, isPreInstalled = false, productName;
    var comparisonOperator = ">", compareVersion = "0.0.0.0", installedVersion = "";
    var compareResult, higherCompareResult;
    
    productName = task.getStringArgument("productName");
    if (hasOwnProperty(task.args, "name")) {
        productName = task.getStringArgument("name");
    }
    if (hasOwnProperty(task.args, ["comparisonOperator", "version"])) {
        compareVersion = task.getStringArgument("version");
        comparisonOperator = task.getStringArgument("comparisonOperator");
    }
    
    if (host.isWin) {
        installedVersion = platform.getRegistryString("64", "machine", "{0}{1}".format(this.installRoot, productName), "DisplayVersion", "");
        if (installedVersion == "") {
            installedVersion = platform.getRegistryString("32", "machine", "{0}{1}".format(this.installRoot, productName), "DisplayVersion", "");
        }
    } else if (host.isMac) {
        installedVersion = app.expandString("{FileVersion:{0}{1}.app/Contents/Info.plist}".format(this.installRoot, productName));
    }

    compareResult = app.expandString("{VersionCompare:{0},{1},{2}}".format(installedVersion, comparisonOperator, compareVersion));
    task.debugPrint("installed {0} {1} {2} = {3}\n".format(installedVersion, comparisonOperator, compareVersion, compareResult));
    higherCompareResult = app.expandString("{VersionCompare:{0},>,{1}}".format(installedVersion, compareVersion));
    task.debugPrint("installed {0} > {1} = {2}\n".format(installedVersion, compareVersion, higherCompareResult));
    
    isPreInstalled = (compareResult == "0");
    
    function taskComplete() {
        task.complete({"isPreInstalled": isPreInstalled});
    };
    if (hasOwnProperty(task.args, "higherVersionInstalled") && (higherCompareResult == "1")) {
        task.runSubAction("higherVersionInstalled", null, taskComplete);
    } else if (hasOwnProperty(task.args, "notInstalled") || hasOwnProperty(task.args, "installed")) {
        if (compareResult == "0") {
            task.runSubAction("installed", null, taskComplete);
        } else {
            task.runSubAction("notInstalled", null, taskComplete);
        }
    } else {
        if (isPreInstalled) {
            task.error("UI_ApplicationIsInstalled");
        }
        taskComplete();
    }
};

AppInstallController.prototype.onInstallWin = function(task) {
    var self = this, productName, productIcon, productInfo;
    task.assertArgument("icon");
    task.assertArgument("version");
    task.assertArgument("uninstallApplication");
    task.assertArgument("publisher");

    productName = task.getStringArgument("productName");
    if (hasOwnProperty(task.args, "name")) {
        productName = task.getStringArgument("name");
    }
    productIcon = task.getStringArgument("productIcon");
    if (hasOwnProperty(task.args, "icon")) {
        productIcon = task.getStringArgument("icon");
    }
    productInfo = { 
        "DisplayName": productName,
        "DisplayIcon": productIcon,
        "DisplayVersion": task.getStringArgument("version"),
        "Publisher": task.getStringArgument("publisher"),
        "UninstallString": task.getStringArgument("uninstallApplication")
    };
    if (hasOwnProperty(task.args, "estimatedSize")) {
        productInfo["EstimatedSize"] = task.args.estimatedSize / 1024;
    }
    if (hasOwnProperty(task.args, "canRepair")) {
        productInfo["NoRepair"] = (task.args.canRepair) ? "0" : "1";
    }
    if (hasOwnProperty(task.args, "canModify")) {
        productInfo["NoModify"] = (task.args.canModify) ? "0" : "1";
    }
    $.each(productInfo, function(key, value) {
        if (typeof(value) === 'number') {
            platform.setRegistryInt32("default", "default", "machine", "{0}{1}".format(self.installRoot, productName), key, value);
        } else {
            platform.setRegistryString("default", "default", "machine", "{0}{1}".format(self.installRoot, productName), key, value);
        }
    });
    task.complete();
};

AppInstallController.prototype.onInstallMac = function(task) {
};

AppInstallController.prototype.onInstall = function(task, info) {
    if (host.isWin) {
        this.onInstallWin(task);
    } else if (host.isMac) {
        this.onInstallMac(task);
    }
};

AppInstallController.prototype.onUninstallWin = function(task) {
    var self = this, productName, runUninstall = false, uninstallRoot;
    productName = task.getStringArgument("productName");
    if (hasOwnProperty(task.args, "name")) {
        productName = task.getStringArgument("name");
    }
    uninstallRoot = "{0}{1}".format(this.installRoot, productName);
    if (hasOwnProperty(task.args, "runUninstall")) {
        runUninstall = task.args.runUninstall;
    }
    function removeRegistryEntries() {
        platform.registryDeleteKey("default", "machine", uninstallRoot);
    };
    if (runUninstall) {
        var uninstallString = platform.getRegistryString("default", "machine", uninstallRoot, "UninstallString", ""),
            launchCommand = "", launchArgs = "", launch, observer;
        if (uninstallString != "") {
            var endIndex = -1;
            if (uninstallString[0] == '\'' || uninstallString[0] == '\"') {
                endIndex = uninstallString.indexOf(uninstallString[0], 1);
            } else {
                endIndex = uninstallString.indexOf(" ");
            }
            if (endIndex == -1) {
                launchCommand = uninstallString;
            } else {
                launchCommand = uninstallString.substring(0, endIndex);
                launchArgs = uninstallString.substring(endIndex + 1);
            }
        }
        task.args.application = launchCommand;
        task.args.rawArguments = launchArgs;
        task.args.elevationRights = "elevated";
        task.args.waitForExit = true;
        launch = new LaunchController(task, task.args);
        launch.onCompleteOriginal = launch.onComplete;
        launch.onComplete = function(task, info) {
            if (info.successful) {
                removeRegistryEntries();
            }
            launch.onCompleteOriginal(task, info);
            launch.release();
        };
        launch.onStart(task);
    } else {
        removeRegistryEntries();
        task.complete();
    }
};

AppInstallController.prototype.onUninstallMac = function(task) {
    
};

AppInstallController.prototype.onUninstall = function(task, info) {
    if (host.isWin) {
        this.onUninstallWin(task);
    } else if (host.isMac) {
        this.onUninstallMac(task);
    }
};

AppInstallController.prototype.onStart = function(task, info) {
    switch (task.args.type) {
        case "appIsInstalled":
            this.onIsInstalled(task, info);
            break;
        case "appInstall":
            this.onInstall(task, info);
            break;
        case "appUninstall":
            this.onUninstall(task, info);
            break;
    }
};

registerTaskController("appIsInstalled", AppInstallController);
registerTaskController("appInstall", AppInstallController);
registerTaskController("appUninstall", AppInstallController);
registerTaskView("appIsInstalled", StatusView);


function DiskSpaceController(task, args) {
    var self = this;
     
    this.freeBytes = 0;
    
    this.observers = [];    
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

DiskSpaceController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

DiskSpaceController.prototype.onStart = function(task, info) {
    var args = "", path = "", successful = false;

    task.assertArgument("requiredBytes");
    
    path = task.getStringArgument("path");
    if (path == "") {
        path = app.expandString("{ModulePath}");
    }
    
    this.freeBytes = platform.getFreeDiskSpace(path);
    
    task.debugPrint("free bytes {0} required {1} path {2}\n".format(this.freeBytes, task.args.requiredBytes, path));
    
    if (task.args.requiredBytes > this.freeBytes) {
        task.error("OSError_NotEnoughSpace");
    }
    
    task.complete();
};

registerTaskController("diskspace", DiskSpaceController);
registerTaskView("diskspace", StatusView);

/*!
* \file FileCopy.js
* \brief File containing FileCopy class and creation function
*/

/*!
* \class FileCopy
* \brief Copies a file asynchronously
*/




function FileCopy(instanceId)
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
FileCopy.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the verbosity
* \type bool
* \returns Verbosity
*/
FileCopy.prototype.getVerbose = function(){
   return interop.invoke(this.instanceId, {
      "method":"getVerbose"
   });
};

/*!
* sets the verbosity
* \tparam bool(in) value Verbosity
*/
FileCopy.prototype.setVerbose = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setVerbose", 
      "value":value
   });
};

/*!
* gets the deletes the file after copying
* \type bool
* \returns Deletes the file after copying
*/
FileCopy.prototype.getMove = function(){
   return interop.invoke(this.instanceId, {
      "method":"getMove"
   });
};

/*!
* sets the deletes the file after copying
* \tparam bool(in) value Deletes the file after copying
*/
FileCopy.prototype.setMove = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setMove", 
      "value":value
   });
};

/*!
* gets the source filename
* \type string
* \returns Source filename
*/
FileCopy.prototype.getSourceFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getSourceFileName"
   });
};

/*!
* sets the source filename
* \tparam string(in) value Source filename
*/
FileCopy.prototype.setSourceFileName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setSourceFileName", 
      "value":value
   });
};

/*!
* gets the target filename
* \type string
* \returns Target filename
*/
FileCopy.prototype.getTargetFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTargetFileName"
   });
};

/*!
* sets the target filename
* \tparam string(in) value Target filename
*/
FileCopy.prototype.setTargetFileName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setTargetFileName", 
      "value":value
   });
};

/*!
* gets the progress for current operation
* \type string
* \returns Progress for current operation
*/
FileCopy.prototype.getProgress = function(){
   return interop.invoke(this.instanceId, {
      "method":"getProgress"
   });
};

/*!
* Starts the copy
* \type bool
* \returns true if successful, false otherwise
*/
FileCopy.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};

/*!
* Stops the copy
* \type bool
* \returns true if successful, false otherwise
*/
FileCopy.prototype.stop = function(){
   return interop.invoke(this.instanceId, {
      "method":"stop"
   });
};


/*!
* Create instance of fileCopy
*/
function createFileCopy()
{
   return interop.createInstance("SSN.FileCopy", FileCopy);
}



function FileController(task, args) {
    var self = this;

    this.observers = [];

    this.filecopy = createFileCopy();
    this.progressTimer = null;
    
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("FileCopy", "Complete", this.filecopy, function(sender, info) { self.onComplete(task, info); }));
}

FileController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
    if (!isNull(this.progressTimer)) {
        clearInterval(this.progressTimer);
        this.progressTimer = null;
    }
    if (!isNull(this.filecopy)) {
        this.filecopy.release();
        this.filecopy = null;
    }
};

FileController.prototype.onStart = function(task, info) {
    var self = this, sourceFilename = "", targetFilename = "";
    var move = false, displayName = "", i = 0;


    task.assertArgument("sourceFilename");
    task.assertArgument("targetFilename");

    notificationCenter.fire("Task", "UpdateView", task, {
        "status": "FileCopy_Start",
        "progress": 0.0
    });

    sourceFilename = task.getStringArgument("sourceFilename");
    targetFilename = task.getStringArgument("targetFilename");
    
    if (hasOwnProperty(task.args, "move")) {
        move = task.args.move;
    }
    
    //this.filecopy.setVerbose(true);
    this.filecopy.setSourceFileName(sourceFilename);
    this.filecopy.setTargetFileName(targetFilename);
    this.filecopy.setMove(move);
    
    displayName = sourceFilename;
    if (displayName.length > 40) {
        displayName = "..." + displayName.substr(displayName.length - 40);
        i = displayName.indexOf(app.expandString("{PathSeparator}"));
        if (i != -1) {
            displayName = "..." + displayName.substr(i + 1);
        }
    }

    notificationCenter.fire("Task", "UpdateView", task, {
        "status": host.getLanguageString("FileCopy_Copying") + displayName
    });
    
    task.debugPrint("start {0}->{1}\n".format(sourceFilename, targetFilename));
    
    if (!this.filecopy.start()) {
        this.setError(task, info, -1, "FileCopy_Failure");
    }
    
    this.progressTimer = setInterval(function() { self.onUpdateProgress(task, info); }, 500);
};

FileController.prototype.onUpdateProgress = function(task, info) {
    var progress = JSON.parse(this.filecopy.getProgress());

    //task.debugPrint("progress {0}/{1} {2}%\n".format(progress.current, progress.total, (progress.current / progress.total)));
    notificationCenter.fire("Task", "UpdateView", task, {
        "progress": (Number(progress.current) / progress.total)
    });
};

FileController.prototype.onComplete = function(task, info) {
    task.debugPrint("complete {0} error {1} ({2})\n".format(info.successful, osError.nameFromId(info.error), info.error));

    if (info.successful === false) {
        this.setError(task, info, info.error, "FileCopy_Failure");
    } else {
        notificationCenter.fire("Task", "UpdateView", task, { "progress": 1.0 });
    }
    this.release();

    task.complete(info);
};

FileController.prototype.setError = function(task, info, exitCodeStr, defaultExitCodeStr) {
    if (hasOwnProperty(task.args, "errorMap") && hasOwnProperty(task.args.errorMap, exitCodeStr)) {
        task.error(task.args.errorMap[exitCodeStr]);
    } else {
        task.error(defaultExitCodeStr);
    }
};

registerTaskController("filecopy", FileController);
registerTaskView("filecopy", StatusView);

/*!
* \file Ini.js
* \brief File containing Ini class and creation function
*/

/*!
* \class Ini
* \brief Modify .ini files
*/




function Ini(instanceId)
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
Ini.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the verbosity
* \type bool
* \returns Verbosity
*/
Ini.prototype.getVerbose = function(){
   return interop.invoke(this.instanceId, {
      "method":"getVerbose"
   });
};

/*!
* sets the verbosity
* \tparam bool(in) value Verbosity
*/
Ini.prototype.setVerbose = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setVerbose", 
      "value":value
   });
};

/*!
* gets the ini filename
* \type string
* \returns Ini filename
*/
Ini.prototype.getFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileName"
   });
};

/*!
* sets the ini filename
* \tparam string(in) value Ini filename
*/
Ini.prototype.setFileName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFileName", 
      "value":value
   });
};

/*!
* Opens an ini file
* \type bool
* \returns true if successful, false otherwise
*/
Ini.prototype.open = function(){
   return interop.invoke(this.instanceId, {
      "method":"open"
   });
};

/*!
* Saves an ini file
* \type bool
* \returns true if successful, false otherwise
*/
Ini.prototype.save = function(){
   return interop.invoke(this.instanceId, {
      "method":"save"
   });
};

/*!
* Gets a value in the ini file
* \tparam string(in) section Name of the section
* \tparam string(in) key Name of the key
* \tparam string(in) defaultValue Returned when value not found
* \type string
* \returns returns the value
*/
Ini.prototype.getValue = function(section,key,defaultValue){
   return interop.invoke(this.instanceId, {
      "method":"getValue", 
      "section":section, 
      "key":key, 
      "defaultValue":defaultValue
   });
};

/*!
* Sets a value in the ini file
* \tparam string(in) section Name of the section
* \tparam string(in) key Name of the key
* \tparam string(in) value Value to set
* \type bool
* \returns true if successful, false otherwise
*/
Ini.prototype.setValue = function(section,key,value){
   return interop.invoke(this.instanceId, {
      "method":"setValue", 
      "section":section, 
      "key":key, 
      "value":value
   });
};


/*!
* Create instance of ini
*/
function createIni()
{
   return interop.createInstance("SSN.Ini", Ini);
}



function IniController(task, args) {
    var self = this;

    this.observers = [];
    
    this.ini = createIni();
    this.value = "";
    
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

IniController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
    if (!isNull(this.ini)) {
        this.ini.release();
        this.ini = null;
    }
};

IniController.prototype.onStart = function(task, info) {
    var self = this, opened = false, filename = "", langId, i = 0;
    

    task.assertArgument("filename");
    task.assertArgument("section");

    notificationCenter.fire("Task", "UpdateView", task, { "progress": 0.0 });

    filename = task.getStringArgument("filename");
    
    this.ini.setFileName(filename);
    opened = this.ini.open(filename);
    
    switch (task.args.type.toLowerCase()) {
        case "writeini":
            langId = "Ini_Writing";
            create = true;
            break;
        case "readini":
            langId = "Ini_Reading";
            if (!opened) {
                task.error("Ini_LoadFail");
            }
            break;
    }

    if (!task.hasError()) {
        if (hasOwnProperty(task.args, "keyValuePairs")) {
            if (getObjectType(task.args.keyValuePairs) == "array") {
                var keyValuePairs = task.args.keyValuePairs;
                for (i = 0; i < keyValuePairs.length; i += 1) {
                    var key = keyValuePairs[i].substr(0, keyValuePairs[i].indexOf("="));
                    var value = keyValuePairs[i].substr(keyValuePairs[i].indexOf("=") + 1);

                    task.debugPrint("write {0}.{1} = {2}\n".format(task.args.section, key, value));

                    notificationCenter.fire("Task", "UpdateView", task, {
                        "status": host.getLanguageString(langId) + task.args.section + "." + key,
                        "progress": (i + 1) / keyValuePairs.length
                    });
                    
                    this.ini.setValue(task.args.section, key, value);
                }
                if (!this.ini.save()) {
                    task.error("Ini_SaveFail");
                }
            }
        } else {
            task.assertArgument("key");

            notificationCenter.fire("Task", "UpdateView", task, {
                "status": host.getLanguageString(langId) + task.args.section + "." + task.args.key
            });

            if (hasOwnProperty(task.args, "value")) { 
                task.debugPrint("write {0}.{1} = {2}\n".format(task.args.section, task.args.key, task.args.value));
                this.ini.setValue(task.args.section, task.args.key, task.args.value);
                if (!this.ini.save()) {
                    task.error("Ini_SaveFail");
                }
            } else {
                this.value = this.ini.getValue(task.args.section, task.args.key, task.getStringArgument("defaultValue"));
                task.debugPrint("read {0}.{1} = {2}\n".format(task.args.section, task.args.key, this.value));
            }
        }
    }

    if (!task.hasError()) {
        notificationCenter.fire("Task", "UpdateView", task, { "progress": 1.0 });
    }
    
    this.release();

    task.complete();
};

registerTaskController("writeIni", IniController);
registerTaskController("readIni", IniController);
registerTaskView("writeIni", StatusView);
registerTaskView("readIni", StatusView);

/*!
* \file Installer.js
* \brief File containing Installer class and creation function
*/

/*!
* \class Installer
* \brief Installer Interface
*/



(function() {
var loadObs, unloadObs;
loadObs = notificationCenter.addObserver("Interop", "DidLoad", function(sender, info) {
if (info.name !== "installer") { return; }
loadObs.release();



function Installer(instanceId)
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
Installer.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the path to the default browser
* \type string
* \returns Path to the default browser
*/
Installer.prototype.getDefaultBrowserPath = function(){
   return interop.invoke(this.instanceId, {
      "method":"getDefaultBrowserPath"
   });
};

/*!
* Sets a restore point
* \tparam string(in) applicationName Name of the application creating the restore point
* \type int
* \returns -1 if unsuccessful, otherwise the ID of the restore point
*/
Installer.prototype.setRestorePoint = function(applicationName){
   return interop.invoke(this.instanceId, {
      "method":"setRestorePoint", 
      "applicationName":applicationName
   });
};

/*!
* Removes a restore point
* \tparam int(in) restorePointID ID of the restore point to remove
* \type bool
* \returns true if successful, false otherwise
*/
Installer.prototype.removeRestorePoint = function(restorePointID){
   return interop.invoke(this.instanceId, {
      "method":"removeRestorePoint", 
      "restorePointID":restorePointID
   });
};

/*!
* Checks to see if an application is installed
* \tparam string(in) nameOrGuid Name or guid of the application
* \type bool
* \returns true if installed, false otherwise
*/
Installer.prototype.isApplicationInstalled = function(nameOrGuid){
   return interop.invoke(this.instanceId, {
      "method":"isApplicationInstalled", 
      "nameOrGuid":nameOrGuid
   });
};


window.installer = interop.createInstance("SSN.Installer", Installer);
unloadObs = notificationCenter.addObserver("Interop", "WillUnload", function(sender, info) {
   if (info.name !== "installer") { return; }
   unloadObs.release();
   window.installer.release();
   window.installer = null;
});

});
}());



function MSInstallerController(task, args) {
    var self = this;

    this.observers = [];
    
    this.msinstaller = createMSInstaller();
    
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("MSInstaller", "Event", this.msinstaller, function(sender, info) { self.onMSIEvent(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("MSInstaller", "Complete", this.msinstaller, function(sender, info) { self.onMSIComplete(task, info); }));
}

MSInstallerController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
    if(!isNull(this.msinstaller)) {
        this.msinstaller.release();
        this.msinstaller = null;
    }
};

MSInstallerController.prototype.onStart = function(task, info) {
    var packagePath = "", packageArguments = "", logFilename = "", silent = true;


    task.assertArgument("packagePath");

    notificationCenter.fire("Task", "UpdateView", task, {
        "status": "Installer_Start",
        "progress": 0.0
    });

    packagePath = task.getStringArgument("packagePath");
    packageArguments = task.getStringArgument("packageArguments");
    
    if (hasOwnProperty(task.args, "silent")) {
        silent = task.args.silent;
    }
    if (hasOwnProperty(task.args, "logFilename")) {
        this.msinstaller.setLog(true);
        this.msinstaller.setLogFilename(task.getStringArgument("logFilename"));
    }
    if (hasOwnProperty(task.args, "logOnlyErrors")) {
        this.msinstaller.setLogOnlyErrors(task.args.logOnlyErrors);
    }

    //this.msinstaller.setVerbose(true);
    this.msinstaller.setSilent(silent);
    this.msinstaller.setPackagePath(packagePath);
    this.msinstaller.setPackageArguments(packageArguments);
    
    task.debugPrint("start {0} {1}\n".format(packagePath, packageArguments));
    
    if (!this.msinstaller.start()) {
        this.setError(task, info, -1, "Installer_Failure");
    }
};

MSInstallerController.prototype.onMSIEvent = function(task, info) {
    //task.debugPrint("event {0} message {1} progress {2} total {3}\n".format(MSIEvent.nameFromId(info.type), info.message, info.progress, info.total));
    if (info.type == MSIEvent.PROGRESS) {
        //task.debugPrint("progress {0}%\n".format((info.progress / info.total)));
        notificationCenter.fire("Task", "UpdateView", task, {
            "progress": (info.progress / info.total)
        });
    } else if (info.type == MSIEvent.ACTIONSTART) {
        var period = info.message.indexOf(". ");
        if ((period !== -1) && (info.message.length > period + 2)) {
            notificationCenter.fire("Task", "UpdateView", task, {
                "status": info.message.substring(period + 2)
            });
        }
    }
};

MSInstallerController.prototype.onMSIComplete = function(task, info) {
    task.debugPrint("complete {0} exitcode {1}\n".format(info.successful, info.exitCode));
    
    if (info.successful === false) {
        this.setError(task, info, info.exitCode, "Installer_Failure");
    } else {
        notificationCenter.fire("Task", "UpdateView", task, {
            "status": "Installer_Complete",
            "progress": 1.0
        });
    }
    
    this.release();
    
    task.complete();
};

MSInstallerController.prototype.setError = function(task, info, exitCodeStr, defaultExitCodeStr) {
    if (hasOwnProperty(task.args, "errorMap") && hasOwnProperty(task.args.errorMap, exitCodeStr)) {
        task.error(task.args.errorMap[exitCodeStr]);
    } else {
        task.error(defaultExitCodeStr);
    }
};

registerTaskController("msinstaller", MSInstallerController);
registerTaskView("msinstaller", StatusView);

/*!
* \file MSIEvent.js
* \brief File containing app notification area dock locations
*/

/*!
* \class MSIEvent
* \brief Microsoft Installer event constants
*/

function MSIEvent() {
    /*!
    * Progress
    * \type int
    */
    this.PROGRESS = 1;
    /*!
    * Fatal exit
    * \type int
    */
    this.FATALEXIT = 2;
    /*!
    * Error
    * \type int
    */
    this.ERROR = 3;
    /*!
    * Warning
    * \type int
    */
    this.WARNING = 4;
    /*!
    * User
    * \type int
    */
    this.USER = 5;
    /*!
    * Info
    * \type int
    */
    this.INFO = 6;
    /*!
    * Files in Use
    * \type int
    */
    this.FILESINUSE = 7;
    /*!
    * Out of disk space
    * \type int
    */
    this.OUTOFDISKSPACE = 8;
    /*!
    * Action start
    * \type int
    */
    this.ACTIONSTART = 9;
    /*!
    * Action data
    * \type int
    */
    this.ACTIONDATA = 10;
    /*!
    * Initialize
    * \type int
    */
    this.INTIALIZE = 11;
    /*!
    * Terminate
    * \type int
    */
    this.TERMINATE = 12;
}

/*!
* converts an msi event type to a string
* \tparam int id ms event type
* \type string
* \returns stringified name of msi event type
*/

MSIEvent.prototype.nameFromId = function(id) {
    var nameMap = [
        "Unknown",
        "Progress", 
        "FatalExit",
        "Error",
        "Warning", 
        "User",
        "Info",
        "FilesInUse",
        "OutOfDiskSpace",
        "ActionStart",
        "ActionData",
        "Initialize",
        "Terminate"
    ];
    return nameMap[id];
};

/*!
* precreated global instance of MSIEvent
* \type MSIEvent
*/
var MSIEvent = new MSIEvent();

/*!
* \file MSInstaller.js
* \brief File containing MSInstaller class and creation function
*/

/*!
* \class MSInstaller
* \brief Microsoft Installer
*/




function MSInstaller(instanceId)
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
MSInstaller.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the print verbose debug info
* \type bool
* \returns Print verbose debug info
*/
MSInstaller.prototype.getVerbose = function(){
   return interop.invoke(this.instanceId, {
      "method":"getVerbose"
   });
};

/*!
* sets the print verbose debug info
* \tparam bool(in) value Print verbose debug info
*/
MSInstaller.prototype.setVerbose = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setVerbose", 
      "value":value
   });
};

/*!
* gets the logging
* \type bool
* \returns Logging
*/
MSInstaller.prototype.getLog = function(){
   return interop.invoke(this.instanceId, {
      "method":"getLog"
   });
};

/*!
* sets the logging
* \tparam bool(in) value Logging
*/
MSInstaller.prototype.setLog = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setLog", 
      "value":value
   });
};

/*!
* gets the logging only of errors
* \type bool
* \returns Logging only of errors
*/
MSInstaller.prototype.getLogOnlyErrors = function(){
   return interop.invoke(this.instanceId, {
      "method":"getLogOnlyErrors"
   });
};

/*!
* sets the logging only of errors
* \tparam bool(in) value Logging only of errors
*/
MSInstaller.prototype.setLogOnlyErrors = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setLogOnlyErrors", 
      "value":value
   });
};

/*!
* gets the filename of log
* \type string
* \returns Filename of log
*/
MSInstaller.prototype.getLogFilename = function(){
   return interop.invoke(this.instanceId, {
      "method":"getLogFilename"
   });
};

/*!
* sets the filename of log
* \tparam string(in) value Filename of log
*/
MSInstaller.prototype.setLogFilename = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setLogFilename", 
      "value":value
   });
};

/*!
* gets the should perform a silent install
* \type bool
* \returns Should perform a silent install
*/
MSInstaller.prototype.getSilent = function(){
   return interop.invoke(this.instanceId, {
      "method":"getSilent"
   });
};

/*!
* sets the should perform a silent install
* \tparam bool(in) value Should perform a silent install
*/
MSInstaller.prototype.setSilent = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setSilent", 
      "value":value
   });
};

/*!
* gets the name of the .msi file
* \type string
* \returns Name of the .msi file
*/
MSInstaller.prototype.getPackagePath = function(){
   return interop.invoke(this.instanceId, {
      "method":"getPackagePath"
   });
};

/*!
* sets the name of the .msi file
* \tparam string(in) value Name of the .msi file
*/
MSInstaller.prototype.setPackagePath = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setPackagePath", 
      "value":value
   });
};

/*!
* gets the command line arguments
* \type string
* \returns Command line arguments
*/
MSInstaller.prototype.getPackageArguments = function(){
   return interop.invoke(this.instanceId, {
      "method":"getPackageArguments"
   });
};

/*!
* sets the command line arguments
* \tparam string(in) value Command line arguments
*/
MSInstaller.prototype.setPackageArguments = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setPackageArguments", 
      "value":value
   });
};

/*!
* Gets related product info
* \tparam string(in) productCode GUID of product
* \tparam int(in) index Index of the related product
* \type string
* \returns JSON object for the related product
*/
MSInstaller.prototype.getRelatedProduct = function(productCode,index){
   return interop.invoke(this.instanceId, {
      "method":"getRelatedProduct", 
      "productCode":productCode, 
      "index":index
   });
};

/*!
* Gets related product count
* \tparam string(in) productCode GUID of product
* \type int
* \returns Number of related products
*/
MSInstaller.prototype.getRelatedProductCount = function(productCode){
   return interop.invoke(this.instanceId, {
      "method":"getRelatedProductCount", 
      "productCode":productCode
   });
};

/*!
* Gets installed products info
* \tparam string(in) productCode GUID of product
* \type string
* \returns JSON object containing product info
*/
MSInstaller.prototype.getProductInfo = function(productCode){
   return interop.invoke(this.instanceId, {
      "method":"getProductInfo", 
      "productCode":productCode
   });
};

/*!
* Starts the install
* \type bool
* \returns true if successful, false otherwise
*/
MSInstaller.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};

/*!
* Stops the current pipe instance
*/
MSInstaller.prototype.stop = function(){
   return interop.invoke(this.instanceId, {
      "method":"stop"
   });
};


/*!
* Create instance of mSInstaller
*/
function createMSInstaller()
{
   return interop.createInstance("SSN.MSInstaller", MSInstaller);
}


function PkgController(task, args) {
    var self = this;

    this.observers = [];
    this.output = "";
    
    this.parent = task.parent;
    
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

PkgController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.launchController)) {
        this.launchController.release();
        this.launchController = null;
    }
};

PkgController.prototype.onStart = function(task, info) {
    var self = this, filename = "", target = "", args = "", originalComplete;

    task.assertArgument("filename");

    notificationCenter.fire("Task", "UpdateView", task, {
        "status": "Installer_Start",
        "progress": 0.0
    });

    filename = task.getStringArgument("filename");
    target = task.getStringArgument("target");
    
    if (target == "") {
        target = "/";
    }
    
    if (hasOwnProperty(task.args, "arguments")) {
        if (getObjectType(task.args.arguments) == "array") {
            args = app.expandString("\"" + task.args.arguments.join("\" \"") + "\"");
        } else {
            args = app.expandString(task.args.arguments);
        }
    }

    if (hasOwnProperty(task.args, "rawArguments")) {
        args = task.getStringArgument("rawArguments");
    }

    task.args["arguments"] = "";
    task.args["rawArguments"] = [ "-pkg '", filename, "' -target ", target, " -verboseR ", args ];
    task.args["application"] = "/usr/sbin/installer";
    task.args["successOutput"] = [ "upgrade was successful", "install was successful" ];
    task.args["waitForExit"] = true;

    task.debugPrint("pkg installer {0} -> {1}\n".format(filename, target));

    this.launchController = new LaunchController(task, task.args);
    this.launchController.onViewStatus = function(task, status) { };
    this.launchController.onViewProgress = function(task, progress) { };
    this.launchController.onOutput = function(task, output) { 
        self.onOutput(task, output); 
    };
    this.launchController.onOutputComplete = function(task, output) { 
        self.onOutputComplete(task, output); 
    };
    originalComplete = this.launchController.onComplete;
    this.launchController.onComplete = function(task, successful) {
        if (!isNull(originalComplete)) {
            originalComplete(task, successful);
        }
        self.onComplete(task, successful);
    };
    this.launchController.onStart(task, info);
};

PkgController.prototype.onOutput = function(task, output) {
    var i, lines = output.split("\n"), hasPhase = false, hasProgress = false;
    //task.debugPrint("line count {0}\n".format(lines.length));
    for (i = lines.length - 1; i >= 0; i -= 1) {
        if (isNull(lines[i]) || (lines[i] == "")) {
            continue;
        }
        //task.debugPrint("line {0}  = {1}\n".format(i, lines[i]));
        if (!hasPhase && lines[i].indexOf("installer:PHASE:") !== -1) {
            notificationCenter.fire("Task", "UpdateView", task, {
                "status": lines[i].substr(16)
            });
            hasPhase = true;
        }
        if (!hasProgress && lines[i].indexOf("installer:%") !== -1) {
            //task.debugPrint("percent {0}\n".format(lines[i].substr(11)));
            notificationCenter.fire("Task", "UpdateView", task, {
                "progress": parseFloat(lines[i].substr(11)) / 100.0
            });
            hasProgress = true;
        }
        if (hasProgress && hasPhase) {
            break;
        }
    }
};

PkgController.prototype.onOutputComplete = function(task, output) {
    this.output = output;
};

PkgController.prototype.onComplete = function(task, successful) {
    var logOnlyErrors = false;
    task.debugPrint("pkg installed {0}\n".format(successful));
    if (hasOwnProperty(task.args, "logFilename")) {
        if (hasOwnProperty(task.args, "logOnlyErrors")) {
            logOnlyErrors = task.args.logOnlyErrors;
        }
        if (!logOnlyErrors || (logOnlyErrors && !successful)) {
            var textFileWriter = createTextFileWriter();
            if (textFileWriter.open(app.expandString(task.args.logFilename))) {
                textFileWriter.write(this.output);
                textFileWriter.close();
            }
            textFileWriter.release();
            textFileWriter = null;
        }
    }
    if (successful) {
        notificationCenter.fire("Task", "UpdateView", task, { "status": "Installer_Complete" });
    }
};

registerTaskController("pkg", PkgController);
registerTaskView("pkg", StatusView);
/*!
* \file ProcessExplorer.js
* \brief File containing ProcessExplorer class and creation function
*/

/*!
* \class ProcessExplorer
* \brief Get system process information
*/




function ProcessExplorer(instanceId)
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
ProcessExplorer.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the print verbose debug info
* \type bool
* \returns Print verbose debug info
*/
ProcessExplorer.prototype.getVerbose = function(){
   return interop.invoke(this.instanceId, {
      "method":"getVerbose"
   });
};

/*!
* sets the print verbose debug info
* \tparam bool(in) value Print verbose debug info
*/
ProcessExplorer.prototype.setVerbose = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setVerbose", 
      "value":value
   });
};

/*!
* gets the filter information types
* \type int
* \returns Filter information types
*/
ProcessExplorer.prototype.getFilter = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFilter"
   });
};

/*!
* sets the filter information types
* \tparam int(in) value Filter information types
*/
ProcessExplorer.prototype.setFilter = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFilter", 
      "value":value
   });
};

/*!
* gets the process id to filter by
* \type int
* \returns Process id to filter by
*/
ProcessExplorer.prototype.getProcessFilter = function(){
   return interop.invoke(this.instanceId, {
      "method":"getProcessFilter"
   });
};

/*!
* sets the process id to filter by
* \tparam int(in) value Process id to filter by
*/
ProcessExplorer.prototype.setProcessFilter = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setProcessFilter", 
      "value":value
   });
};

/*!
* gets the handle types to filter by
* \type int
* \returns Handle types to filter by
*/
ProcessExplorer.prototype.getHandleFilter = function(){
   return interop.invoke(this.instanceId, {
      "method":"getHandleFilter"
   });
};

/*!
* sets the handle types to filter by
* \tparam int(in) value Handle types to filter by
*/
ProcessExplorer.prototype.setHandleFilter = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setHandleFilter", 
      "value":value
   });
};

/*!
* gets the gets the current process id
* \type int
* \returns Gets the current process id
*/
ProcessExplorer.prototype.getCurrentProcessId = function(){
   return interop.invoke(this.instanceId, {
      "method":"getCurrentProcessId"
   });
};

/*!
* Starts the install
* \type bool
* \returns true if successful, false otherwise
*/
ProcessExplorer.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};

/*!
* Stops the current pipe instance
*/
ProcessExplorer.prototype.stop = function(){
   return interop.invoke(this.instanceId, {
      "method":"stop"
   });
};


/*!
* Create instance of processExplorer
*/
function createProcessExplorer()
{
   return interop.createInstance("SSN.ProcessExplorer", ProcessExplorer);
}


/*!
* \file ProcessExplorerFilter.js
* \brief File containing process explorer filter types
*/

/*!
* \class ProcessExplorerFilter
* \brief Process explorer filter constants
*/

function ProcessExplorerFilter() {
    /*!
    * All
    * \type int
    */
    this.ALL = 16;
    /*!
    * Process
    * \type int
    */
    this.PROCESS = 1;
    /*!
    * Module
    * \type int
    */
    this.MODULE = 2;
    /*!
    * Handle
    * \type int
    */
    this.HANDLE = 4;
    /*!
    * Window
    * \type int
    */
    this.WINDOW = 8;
}

/*!
* converts an process explorer filter type to a string
* \tparam int id filter type
* \type string
* \returns stringified name of filter type
*/

ProcessExplorerFilter.prototype.nameFromId = function(id) {
    var filterArray = [];
    if (id == this.ALL) {
        filterArray.push("All");
    }
    if ((id & this.PROCESS) == this.PROCESS) {
        filterArray.push("Process");
    }
    if ((id & this.MODULE) == this.MODULE) {
        filterArray.push("Module");
    }
    if ((id & this.HANDLE) == this.HANDLE) {
        filterArray.push("Handle");
    }
    if ((id & this.WINDOW) == this.WINDOW) {
        filterArray.push("Window");
    }
    return filterArray.join(", ");
};

/*!
* precreated global instance of ProcessExplorerFilter
* \type ProcessExplorerFilter
*/
var processExplorerFilter = new ProcessExplorerFilter();

/*!
* \file ProcessExplorerHandle.js
* \brief File containing process explorer handle types
*/

/*!
* \class ProcessExplorerHandle
* \brief Process explorer handle type constants
*/

function ProcessExplorerHandle() {
    /*!
    * Unknown0
    * \type int
    */
    this.UNKNOWN0 = 0;
    /*!
    * Unknown1
    * \type int
    */
    this.UNKNOWN1 = 1;
    /*!
    * Directory
    * \type int
    */
    this.DIRECTORY = 2;
    /*!
    * SymbolicLink
    * \type int
    */
    this.SYMBOLICLINK = 4;
    /*!
    * Token
    * \type int
    */
    this.TOKEN = 8;
    /*!
    * Process
    * \type int
    */
    this.PROCESS = 16;
    /*!
    * Thread
    * \type int
    */
    this.THREAD = 32;
    /*!
    * Unknown7
    * \type int
    */
    this.UNKNOWN7 = 64;
    /*!
    * Event
    * \type int
    */
    this.EVENT = 128;
    /*!
    * EventPair
    * \type int
    */
    this.EVENTPAIR = 256;
    /*!
    * Mutant
    * \type int
    */
    this.MUTANT = 512;
    /*!
    * Unknown11
    * \type int
    */
    this.UNKNOWN11 = 1024;
    /*!
    * Semaphore
    * \type int
    */
    this.SEMAPHORE = 2048;
    /*!
    * Timer
    * \type int
    */
    this.TIMER = 4096;
    /*!
    * Profile
    * \type int
    */
    this.PROFILE = 8192;
    /*!
    * WindowStation
    * \type int
    */
    this.WINDOWSTATION = 16384;
    /*!
    * Desktop
    * \type int
    */
    this.DESKTOP = 32768;
    /*!
    * Section
    * \type int
    */
    this.SECTION = 65536;
    /*!
    * Key
    * \type int
    */
    this.KEY = 131072;
    /*!
    * Port
    * \type int
    */
    this.PORT = 262144;
    /*!
    * WaitablePort
    * \type int
    */
    this.WAITABLEPORT = 524288;
    /*!
    * Unknown21
    * \type int
    */
    this.UNKNOWN21 = 1048576;
    /*!
    * Unknown22
    * \type int
    */
    this.UNKNOWN22 = 2097152;
    /*!
    * Unknown23
    * \type int
    */
    this.UNKNOWN23 = 4194304;
    /*!
    * Unknown24
    * \type int
    */
    this.UNKNOWN24 = 8388608;
    /*!
    * IOCompletion
    * \type int
    */
    this.IOCOMPLETION = 16777216;
    /*!
    * File
    * \type int
    */
    this.FILE = 33554432;
    /*!
    * All
    * \type int
    */
    this.ALL = -1;
}

/*!
* converts an process explorer handle type to a string
* \tparam int id handle type
* \type string
* \returns stringified name of handle type
*/

ProcessExplorerHandle.prototype.nameFromId = function(id) {
    var handleArray = [];
    if (id == this.UNKNOWN0) {
        handleArray.push("Unknown0");
    }
    if ((id & this.UNKNOWN1) == this.UNKNOWN1) {
        handleArray.push("Unknown1");
    }
    if ((id & this.DIRECTORY) == this.DIRECTORY) {
        handleArray.push("Directory");
    }
    if ((id & this.SYMBOLICLINK) == this.SYMBOLICLINK) {
        handleArray.push("SymbolicLink");
    }
    if ((id & this.TOKEN) == this.TOKEN) {
        handleArray.push("Token");
    }
    if ((id & this.PROCESS) == this.PROCESS) {
        handleArray.push("Process");
    }
    if ((id & this.THREAD) == this.THREAD) {
        handleArray.push("Thread");
    }
    if ((id & this.UNKNOWN7) == this.UNKNOWN7) {
        handleArray.push("Unknown7");
    }
    if ((id & this.EVENT) == this.EVENT) {
        handleArray.push("Event");
    }
    if ((id & this.EVENTPAIR) == this.EVENTPAIR) {
        handleArray.push("EventPair");
    }
    if ((id & this.MUTANT) == this.MUTANT) {
        handleArray.push("Mutant");
    }
    if ((id & this.UNKNOWN11) == this.UNKNOWN11) {
        handleArray.push("Unknown11");
    }
    if ((id & this.SEMAPHORE) == this.SEMAPHORE) {
        handleArray.push("Semaphore");
    }
    if ((id & this.TIMER) == this.TIMER) {
        handleArray.push("Timer");
    }
    if ((id & this.PROFILE) == this.PROFILE) {
        handleArray.push("Profile");
    }
    if ((id & this.WINDOWSTATION) == this.WINDOWSTATION) {
        handleArray.push("WindowStation");
    }
    if ((id & this.DESKTOP) == this.DESKTOP) {
        handleArray.push("Desktop");
    }
    if ((id & this.SECTION) == this.SECTION) {
        handleArray.push("Section");
    }
    if ((id & this.KEY) == this.KEY) {
        handleArray.push("Key");
    }
    if ((id & this.PORT) == this.PORT) {
        handleArray.push("Port");
    }
    if ((id & this.WAITABLEPORT) == this.WAITABLEPORT) {
        handleArray.push("WaitablePort");
    }
    if ((id & this.UNKNOWN21) == this.UNKNOWN21) {
        handleArray.push("Unknown21");
    }
    if ((id & this.UNKNOWN22) == this.UNKNOWN22) {
        handleArray.push("Unknown22");
    }
    if ((id & this.UNKNOWN23) == this.UNKNOWN23) {
        handleArray.push("Unknown23");
    }
    if ((id & this.UNKNOWN24) == this.UNKNOWN24) {
        handleArray.push("Unknown24");
    }
    if ((id & this.IOCOMPLETION) == this.IOCOMPLETION) {
        handleArray.push("IoCompletion");
    }
    if ((id & this.FILE) == this.FILE) {
        handleArray.push("File");
    }
    return handleArray.join(", ");
};

/*!
* precreated global instance of ProcessExplorerHandle
* \type ProcessExplorerHandle
*/
var processExplorerHandle = new ProcessExplorerHandle();

/*!
* \file Unzip.js
* \brief File containing Unzip class and creation function
*/

/*!
* \class Unzip
* \brief Extract zip files
*/




function Unzip(instanceId)
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
Unzip.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the list the contents only
* \type bool
* \returns List the contents only
*/
Unzip.prototype.getList = function(){
   return interop.invoke(this.instanceId, {
      "method":"getList"
   });
};

/*!
* sets the list the contents only
* \tparam bool(in) value List the contents only
*/
Unzip.prototype.setList = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setList", 
      "value":value
   });
};

/*!
* gets the filename of zip
* \type string
* \returns Filename of zip
*/
Unzip.prototype.getFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileName"
   });
};

/*!
* sets the filename of zip
* \tparam string(in) value Filename of zip
*/
Unzip.prototype.setFileName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFileName", 
      "value":value
   });
};

/*!
* gets the filename in zip to extract, supports wildcards
* \type string
* \returns Filename in zip to extract, supports wildcards
*/
Unzip.prototype.getFilenameInZip = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFilenameInZip"
   });
};

/*!
* sets the filename in zip to extract, supports wildcards
* \tparam string(in) value Filename in zip to extract, supports wildcards
*/
Unzip.prototype.setFilenameInZip = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFilenameInZip", 
      "value":value
   });
};

/*!
* gets the directory to extract to
* \type string
* \returns Directory to extract to
*/
Unzip.prototype.getOutputDirectory = function(){
   return interop.invoke(this.instanceId, {
      "method":"getOutputDirectory"
   });
};

/*!
* sets the directory to extract to
* \tparam string(in) value Directory to extract to
*/
Unzip.prototype.setOutputDirectory = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setOutputDirectory", 
      "value":value
   });
};

/*!
* gets the progress for the current file
* \type string
* \returns Progress for the current file
*/
Unzip.prototype.getCurrentProgress = function(){
   return interop.invoke(this.instanceId, {
      "method":"getCurrentProgress"
   });
};

/*!
* gets the progress for the entire operation
* \type string
* \returns Progress for the entire operation
*/
Unzip.prototype.getOverallProgress = function(){
   return interop.invoke(this.instanceId, {
      "method":"getOverallProgress"
   });
};

/*!
* Starts the unzip
* \type bool
* \returns true if successful, false otherwise
*/
Unzip.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};


/*!
* Create instance of unzip
*/
function createUnzip()
{
   return interop.createInstance("SSN.Unzip", Unzip);
}



function UnzipController(task, args) {
    var self = this;

    this.observers = [];

    this.unzip = createUnzip();
    this.progressTimer = null;
    this.progressSet = false;
    
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("Unzip", "FileStart", this.unzip, function(sender, info) { self.onFileStart(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Unzip", "FileComplete", this.unzip, function(sender, info) { self.onFileComplete(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Unzip", "Complete", this.unzip, function(sender, info) { self.onComplete(task, info); }));
}

UnzipController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
    if (!isNull(this.progressTimer)) {
        clearInterval(this.progressTimer);
        this.progressTimer = null;
    }
    if (!isNull(this.unzip)) {
        this.unzip.release();
        this.unzip = null;
    }
};

UnzipController.prototype.onStart = function(task, info) {
    var self = this, filename = "", outputDirectory = "", filenameInZip = "*";


    task.assertArgument("filename");
    task.assertArgument("outputDirectory");

    notificationCenter.fire("Task", "UpdateView", task, { "progress": 0.0 });
    notificationCenter.fire("Task", "UpdateView", task, { "progress": -1.0, "status": "Unzip_Start" });

    filename = task.getStringArgument("filename");
    outputDirectory = task.getStringArgument("outputDirectory");
    
    if (hasOwnProperty(task.args, "filenameInZip")) {
        filenameInZip = task.getStringArgument("filenameInZip");
    }
    
    this.unzip.setFileName(filename);
    this.unzip.setOutputDirectory(outputDirectory);
    this.unzip.setFilenameInZip(filenameInZip);
    //this.unzip.setList(true);
    this.progressSet = false;
    
    task.debugPrint("start {0} {1}\n".format(filename, outputDirectory));
    
    if (!this.unzip.start()) {
        this.setError(task, info, -1, "Unzip_Failure");
    }
    
    this.progressTimer = setInterval(function() { self.onUpdateProgress(task, info); }, 500);
};

UnzipController.prototype.onUpdateProgress = function(task, info) {
    var currentProgress = JSON.parse(this.unzip.getCurrentProgress());
    var overallProgress = JSON.parse(this.unzip.getOverallProgress());
    
    //task.debugPrint("current progress {0}/{1} {2}%\n".format(currentProgress.current, currentProgress.total, (currentProgress.current / currentProgress.total)));
    //task.debugPrint("overall progress {0}/{1} {2}%\n".format(overallProgress.current, overallProgress.total, (overallProgress.current / overallProgress.total)));

    this.progressSet = true;

    notificationCenter.fire("Task", "UpdateView", task, {
        "progress": (overallProgress.current / overallProgress.total)
    });
};

UnzipController.prototype.onFileStart = function(task, info) {
    task.debugPrint("extracting {0}->{1}\n".format(info.filenameInZip, info.outputFilename));
    notificationCenter.fire("Task", "UpdateView", task, { "status": host.getLanguageString("Unzip_Extracting") + info.filenameInZip });
    this.onUpdateProgress(task, info);
};

UnzipController.prototype.onFileComplete = function(task, info) {
    task.debugPrint("extracted {0} {1} ({2}) complete {3}\n".format(info.filenameInZip, UnzipError.nameFromId(info.error), info.error, info.successful));
    this.onUpdateProgress(task, info);
};

UnzipController.prototype.onComplete = function(task, info) {
    task.debugPrint("complete {0} Error {1} ({2})\n".format(info.successful, UnzipError.nameFromId(info.error), info.error));

    this.onUpdateProgress(task, info);
    
    if (info.successful === false) {
        if (this.progressSet === false) {
            notificationCenter.fire("Task", "UpdateView", task, { "progress": 0.0 });
        }
        this.setError(task, info, info.error, "Unzip_Failure");
    } else {
        notificationCenter.fire("Task", "UpdateView", task, { "progress": 1.0 });
    }
    
    this.release();
    
    task.complete();
};

UnzipController.prototype.setError = function(task, info, exitCodeStr, defaultExitCodeStr) {
    if (hasOwnProperty(task.args, "errorMap") && hasOwnProperty(task.args.errorMap, exitCodeStr)) {
        task.error(task.args.errorMap[exitCodeStr]);
    } else {
        task.error(defaultExitCodeStr);
    }
};

registerTaskController("unzip", UnzipController);
registerTaskView("unzip", StatusView);

/*!
* \file UnzipError.js
* \brief File containing unzip errors
*/

/*!
* \class UnzipError
* \brief Unzip error constants
*/

function UnzipError() {
    /*!
    * Ok
    * \type int
    */
    this.OK = 0;
    /*!
    * Open
    * \type int
    */
    this.OPEN = 16;
    /*!
    * Authenticate
    * \type int
    */
    this.AUTHENTICATE = 32;
    /*!
    * Not found in zip
    * \type int
    */
    this.NOTFOUNDINZIP = 64;
    /*!
    * Empty zip
    * \type int
    */
    this.EMPTYZIP = 128;
    /*!
    * Parameter error
    * \type int
    */
    this.PARAMERROR = -102;
    /*!
    * Bad zip file format
    * \type int
    */
    this.BADZIPFILE = -103;
    /*!
    * Internal error
    * \type int
    */
    this.INTERNALERROR = -104;
    /*!
    * CRC error
    * \type int
    */
    this.CRCERROR = -105;
}

/*!
* converts an unzip error type to a string
* \tparam int id unzip error
* \type string
* \returns stringified name of unzip error
*/

UnzipError.prototype.nameFromId = function(id) {
    switch (id) {
        case UnzipError.OK: return "Ok";
        case UnzipError.OPEN: return "CannotOpen";
        case UnzipError.AUTHENTICATE: return "FailedToAuthenticate";
        case UnzipError.NOTFOUNDINZIP: return "NotFoundInZip";
        case UnzipError.EMPTYZIP: return "EmptyZip";
        case UnzipError.PARAMERROR: return "ParameterError";
        case UnzipError.BADZIPFILE: return "BadZipFile";
        case UnzipError.INTERNALERROR: return "InternalError";
        case UnzipError.CRCERROR: return "CrcError";
    }
    return "Unknown";
};

/*!
* precreated global instance of UnzipError
* \type UnzipError
*/
var UnzipError = new UnzipError();


