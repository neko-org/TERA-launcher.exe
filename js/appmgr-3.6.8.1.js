/**
 * @preserve Modifications performed to this file by anyone other than Solid State Networks
 * are unsupported and may void your software warranty.
 */
$(document).ready(function() {
    host.assert(app.expandString("{AppVersion}") === "3.6.8.1", "Invalid application version");
});


function ApplicationsController(task, args) {
    var self = this;

    this.instanceId = app.expandString("{Guid}");
    this.observers = [];
    this.timers = [];
    this.busyApplications = [];
    this.xhr = null;
    this.runAfterPatching = false;

    this.workflowTemplates = {}; // actions templates, mapped by name, from workflow.json
    this.localTemplates = {}; // actions templates, mapped by name, from applications.json

    this.applications = []; // the model
    
    this.queueType = appQueueType.NONE;
    this.maxConcurrent = 0; // the number of things that can run before they get queues
    this.patchesRunning = 0; // the download + patch apply queue .. serves both functions.
    this.patchQueue = [];

    this.autoRepairOn = [];

    this.pathSeparator = app.expandString("{PathSeparator}");
    
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));

    this.donothing = function() {};

    this.observers.push(notificationCenter.addInstanceObserver("Applications", "AddCustom", this, function(sender, info) {
        self.addCustomItem(task, info);
    }));
    
    this.observers.push(notificationCenter.addObserver("PatchQueue", "DidProcessPatch", function(patchQueue, info) {
        if( patchQueue.patch && patchQueue.patch.getSelfUpdate() === true &&
        ( (!patchQueue.currentPatchInfo) || patchQueue.currentPatchInfo.isUpcoming === false )) {
              self.release();
        }
    }));
}

ApplicationsController.prototype.startTimer = function(func, delay) {
    var timerId = 0, self = this;
    timerId = setTimeout(function() {
        var index = self.timers.indexOf(timerId);
        if (index >= 0) {
            self.timers.splice(index, 1);
        }
        func();
    }, delay);
    self.timers.push(timerId);
};

ApplicationsController.prototype.runNextQueueTask = function(type) {
    if (( this.patchQueue.length > 0 ) && ( this.queueType === type ) && ( this.maxConcurrent > 0 )) {
        if( this.patchesRunning < this.maxConcurrent ) {
            this.patchesRunning = this.patchesRunning + 1;
            var func = this.patchQueue[0];
            this.patchQueue.splice(0, 1);
            func.apply(this);
        }
    }
};

ApplicationsController.prototype.finishQueueTask = function(type) {
    if (( this.queueType === type ) && ( this.maxConcurrent > 0 )) {
        this.patchesRunning = this.patchesRunning - 1;
        this.runNextQueueTask(type);
    }
};

ApplicationsController.prototype.startQueueTask = function(task, application, type, callBack) {
    if (( this.queueType !== type ) || ( this.maxConcurrent <= 0 )) {
        callBack();
    } else {
        this.patchQueue.push(callBack);
        if( this.patchesRunning >= this.maxConcurrent ) {
            this.changeState(task, application, applicationState.WAITING);
            notificationCenter.fire("Applications", "ChangeItem", this, application);
        }
        this.runNextQueueTask(type);
    }
};

ApplicationsController.prototype.replaceAllValues = function(obj, str, withStr) {
    var self = this;
    $.each(obj, function(key, val){
        if (obj.hasOwnProperty(key)) {
            var type = getObjectType(obj[key]);
            if (type === "object") {
                self.replaceAllValues(obj[key], str, withStr);
            } else if (type === "string") {
                obj[key] = obj[key].replace(str, withStr);
            }
        }
    });
};

ApplicationsController.prototype.isApplicationBusy = function(application) {
    return this.busyApplications.indexOf(application) >= 0;
};

ApplicationsController.prototype.setApplicationBusy = function(application, busy) {
    var index = this.busyApplications.indexOf(application);
    if (false === busy) {
        this.busyApplications.splice(index, 1);
    } else {
        this.busyApplications.push(application); // this can happen more than once
    }
};

ApplicationsController.prototype.deleteApplication = function(task, application) {
    if (!isNull(application.tasks)) {
        application.tasks.cancelAll();
    }
    var index;
    index = this.busyApplications.indexOf(application);
    while (index >= 0) {
        this.busyApplications.splice(index, 1);
        index = this.busyApplications.indexOf(application);
    }
    index = this.applications.indexOf(application);
    if (index >= 0) {
        this.applications.splice(index, 1);
    }
};

ApplicationsController.prototype.resetCallbacks = function(task, application) {
    delete application.downloadApp;
    delete application.launchApp;
    delete application.patchApp;
    delete application.repairApp;
    delete application.removeApp;
};

ApplicationsController.prototype.changeState = function(task, application, newState) {
    var self = this;
    if(application.state === newState) {
        return;
    }
    application.prevState=application.state;
    application.state=newState;
    notificationCenter.fire("Applications", "StateChange", self, application);
};

ApplicationsController.prototype.bindApplication = function(task, application) {
    var self = this;
    self.resetCallbacks(task, application);
    self.changeState(task, application, applicationState.REFRESHING);
    self.startTimer(function() { self.updateApplicationActionStatus(task, application, null); }, 1);
};

ApplicationsController.prototype.save = function(config) {
    if (!isNull(config) && !isNull(config.filename)) {
        var saveableObj = {};
        saveableObj.config = config;
        saveableObj.applications = [];
        if(this.localTemplates) {
            saveableObj.templates = this.localTemplates;
        }
        $.each(this.applications, function(index, app) {
            var cleanApp = {};
            cleanApp.properties = app.properties;
            if (isNull(app.properties.template)) {
                cleanApp.actions = app.actions;
            }
            saveableObj.applications.push(cleanApp);
        });
        saveObjectToFile(saveableObj, app.expandString("{LocalStorage}{0}".format(config.filename)));
    }
};

ApplicationsController.prototype.updateApplicationActionStatus = function(task, application, completeCallback) {
    var self = this;
    if (isNull(application.actions)) {
        self.changeState(task, application, applicationState.IDLE);
        notificationCenter.fire("Applications", "ChangeItem", self, application);
        if (completeCallback) {
            completeCallback();
        }
        return;
    }

    self.resetCallbacks(task, application);

    var finishPatchableCheck = function(isPatchable) {
        var busy = self.isApplicationBusy(application);
        if (isPatchable) {
            if ( !application.lastPatchError && !busy) {
                application.patchApp = function(actionCompleteCallBack, obj) { self.patchApplication(task, application, actionCompleteCallBack, obj); };
            }
        }
        else {
            if (!isNull(application.actions.launch)) {
                application.launchApp = function(actionCompleteCallBack, obj) { self.launchApplication(task, application, actionCompleteCallBack, obj); };
            }
        }
        if (!isNull(application.actions.remove) && !busy) {
            application.removeApp = function(actionCompleteCallBack, obj) { self.removeApplication(task, application, actionCompleteCallBack, obj); };
        }
        if (!isNull(application.actions.repair) && !busy) {
            application.repairApp = function(actionCompleteCallBack, obj) { self.repairApplication(task, application, actionCompleteCallBack, obj); };
        }
        notificationCenter.fire("Applications", "ChangeItem", self, application);

        if (isPatchable && !isNull(application.properties) && !busy && application.properties.autoPatch 
        && !isNull(application.buttons.patchElement) && !application.lastPatchError) {
            if (completeCallback) {
                var oldCompleteCallBack=completeCallback;
                completeCallback=function() {
                    oldCompleteCallBack();
                    application.buttons.patchElement.click();
                };
            } else {
                setTimeout(function(){application.buttons.patchElement.click();}, 1);
            }
        }
    };

    var finishInstalledCheck = function(isInstalled) {
        if ((application.properties) && (false === (application.actions && (application.actions.patch || application.actions.download)))) {
            application.properties.isCustomApp = true;
        }

        if (!isNull(application.actions.isVisible)) {
            self.runActionList("isVisible", task, application, function(appl, appTask) {
                application.properties.visible = !appTask.hasError();
                notificationCenter.fire("Applications", "ChangeItem", self, application);
            });
        }

        if (!isInstalled) {
            self.changeState(task, application, applicationState.IDLE);
            application.downloadApp = function(actionCompleteCallBack, obj) { self.downloadApplication(task, application, actionCompleteCallBack, obj); };
            notificationCenter.fire("Applications", "ChangeItem", self, application);
            if (completeCallback) {
                completeCallback();
            }
        }
        else {
            if (!isNull(application.actions.patch) && !isNull(application.actions.isPatchable)) {
                self.runActionList("isPatchable", task, application, function(appl, appTask) {
                    self.changeState(task, application, applicationState.IDLE);
                    finishPatchableCheck(appTask.hasError());
                    if (completeCallback) {
                        completeCallback();
                    }
                });
            }
            else {
                if (!isNull(application.actions.launch)) {
                    application.launchApp = function(actionCompleteCallBack, obj) { self.launchApplication(task, application, actionCompleteCallBack, obj); };
                }
                if (!isNull(application.actions.repair)) {
                    application.repairApp = function(actionCompleteCallBack, obj) { self.repairApplication(task, application, actionCompleteCallBack, obj); };
                }
                if (!isNull(application.actions.remove)) {
                    application.removeApp = function(actionCompleteCallBack, obj) { self.removeApplication(task, application, actionCompleteCallBack, obj); };
                }
                self.changeState(task, application, applicationState.IDLE);
                notificationCenter.fire("Applications", "ChangeItem", self, application);
                if (completeCallback) {
                    completeCallback();
                }
            }
        }
    };
    if (!isNull(application.actions.isInstalled) && !isNull(application.actions.download)) {
        this.runActionList("isInstalled", task, application, function(appl, appTask) {
            finishInstalledCheck(!appTask.hasError());
        });
    }
    else {
        finishInstalledCheck(true);
    }
};

ApplicationsController.prototype.onStart = function(task, info) {
    var self = this;

    task.assertArgument("config");
    if(hasOwnProperty(task.args,"templates")) {
        this.workflowTemplates = task.args.templates;
    }
    loadObjectFromFile(app.expandString("{LocalStorage}{0}".format(task.args.config.filename)), function(obj) {
        var workflowArgs = deepCopy(task.args.config);
        if (obj && obj.loadedObject) {
            obj = obj.loadedObject;
            if (hasOwnProperty(obj, "config")) {
                mergeObjectProperties(task.args.config, obj.config, false, false);
            }
            if (hasOwnProperty(obj, "templates")) {
                self.localTemplates = obj.templates;
            }
            if (hasOwnProperty(obj, "applications")) {
                self.applications = obj.applications;
            }
        }
        self.loadRemoteApps(task, workflowArgs, function(result) {
            var updateInterval = 0;
            if (!isNull(task.args.config)) {
                if (task.args.config.checkForUpdateInterval) {
                    updateInterval = Number(task.args.config.checkForUpdateInterval);
                }
                if (task.args.config.runAfterPatch) {
                    self.runAfterPatching=true;
                }
                if (task.args.config.autoRepairOn) {
                    self.autoRepairOn=task.args.config.autoRepairOn;
                }
                if(!isNull(task.args.config.concurrentDownloads)) {
                    self.maxConcurrent = task.args.config.concurrentDownloads;
                    self.queueType = appQueueType.DOWNLOADS;
                } else if(!isNull(task.args.config.concurrentPatches)) {
                    self.maxConcurrent = task.args.config.concurrentPatches;
                    self.queueType = appQueueType.PATCHAPPLYS;
                }
            }
            $.each(self.applications, function(index, application) {
                self.applyApplicationTemplate(task.args.config, application);
                self.applyApplicationMacros(task.args.config, application);
                application.state=applicationState.IDLE;
                self.bindApplication(task, application);
                notificationCenter.fire("Applications", "AddItem", self, application);
                var updateFunction = function(app) {
                    if ((app.state === applicationState.IDLE) && (!self.isApplicationBusy(app)) && (app.properties.visible !== false)) {
                        self.changeState(task, app, applicationState.REFRESHING);
                        notificationCenter.fire("Applications", "ChangeItem", self, app);
                        self.updateApplicationActionStatus(task, app, function() {
                            self.startTimer(function() { updateFunction(app); }, updateInterval * 1000);
                        });
                    } else {
                        self.startTimer(function() { updateFunction(app); }, updateInterval * 1000);
                    }
                };
                if (updateInterval && updateInterval > 1) {
                    self.startTimer(function() { updateFunction(application); }, updateInterval * 1000);
                }
            });
            task.complete();
        });
    });
};

ApplicationsController.prototype.applyApplicationTemplate = function(config, application) {
    var self = this;
    var findTemplate = function(named) {
        if(self.localTemplates[named]) {
            return self.localTemplates[named];
        }
        if(self.workflowTemplates[named]) {
            return self.workflowTemplates[named];
        }
        var task=window.workflow.tasks[named];
        if(task && (task.type === "template") && task.actions) {
            return task;
        }
        return null;
    };
    if (isNull(application.actions) && (!isNull(application.properties)) 
    && (!isNull(application.properties.template)) && (!isNull(application.properties.macros))) {
       var template = findTemplate(application.properties.template);
       if(isNull(template)) {
           application.properties.visible = false;
       } else {
           application.actions = deepCopy(template);
       }
    }
};

ApplicationsController.prototype.applyApplicationMacros = function(config, application) {
    var self=this;
    if (!isNull(application.actions) && (!isNull(application.properties)) && (!isNull(application.properties.macros))) {
       var variables = application.properties.macros;
       $.each(variables, function(key, val) {
           if (variables.hasOwnProperty(key)) {
               self.replaceAllValues(application.actions,"{"+key+"}",val);
           }
       });
    }
};

ApplicationsController.prototype.loadRemoteApps = function(task, oldConfig, completeCallBack) {
    var self = this;
    if (!isNull(task.args.config.updateUrl)) {
        var timeoutMillis=10000;
        if(!isNull(task.args.config.timeout)) {
            timeoutMillis=Number(task.args.config.timeout);
        }
        var settings={
            dataType: "json",
            url: app.expandString(task.args.config.updateUrl),
            timeout: timeoutMillis,
            error: function(){ completeCallBack({ "success": false }); },
            success: function(data) {
               if (hasOwnProperty(data, "config")) {
                   var newConfig=deepCopy(oldConfig);
                   mergeObjectProperties(newConfig, data.config, false, false);
                   task.args.config=newConfig;
               }
               if (hasOwnProperty(data, "templates")) {
                   self.localTemplates = data.templates;
               }
               if (hasOwnProperty(data, "applications")) {
                   var oldapps = self.applications;
                   self.applications = data.applications;
                   $.each(oldapps, function(i, app) {
                       if ((!isNull(app.actions)) && (isNull(app.actions.download) && isNull(app.actions.patch))) {
                           self.applications.push(app);
                       } else {
                           $.each(data.applications, function(idx, newapp) {
                               var newProps = newapp.properties;
                               var appProps = app.properties;
                               if (!isNull(newProps) && !isNull(appProps)
                               && newProps.title && (newProps.title === appProps.title )) {
                                   newProps.lastLaunch = appProps.lastLaunch;
                                   if ( (getObjectType(newProps.installPath)==="string") && (getObjectType(appProps.installPath)==="string") ) {
                                       newProps.installPath = appProps.installPath;
                                       var installPath=appProps.installPath;
                                       if(!installPath.endsWith(self.pathSeparator)) {
                                           installPath += self.pathSeparator;
                                       }
                                       self.replaceAllValues(newapp, "{BrowseForFolder}", installPath);
                                   }
                               }
                           });
                       }
                   });
               }
               self.save(task.args.config);
               completeCallBack({ "success": true });
            }
        };
        notificationCenter.fire("Applications", "RemoteLoad", this, settings);
        self.xhr = $.ajax(settings);
    } else {
        completeCallBack({ "success": true });
    }
};

ApplicationsController.prototype.addCustomItem = function(task, info) {
    host.assert(!isNull(info), "no arguments for for addCustomItem in ApplicationsController");
    host.assert(!isNull(info.filename), "filename not defined for addCustomItem in ApplicationsController");
    host.assert(!isNull(info.name), "name not defined for addCustomItem in ApplicationsController");
    var lastPathIndex = 0, args =  "";
    if (info.args) {
        args = info.args;
    }
    var workingDir = info.path, title = info.name;
    if (isNull(workingDir) || !workingDir) {
        workingDir = info.filename;
        lastPathIndex = workingDir.lastIndexOf(this.pathSeparator);
        if (lastPathIndex >= 0) {
            workingDir = workingDir.substr(0, lastPathIndex);
        }
    }
    if (isNull(title) || !title) {
        title = info.filename;
        lastPathIndex = title.lastIndexOf(this.pathSeparator);
        if (lastPathIndex >= 0) {
            title = title.substr(lastPathIndex + 1);
        }
    }

    var application = {
        "properties":
        {
            "title": title,
            "visible": true,
            "id": info.filename,
            "lastLaunch": "",
            "isCustomApp": true
        },
        "actions":
        {
            "isInstalled":
            {
                "type": "fileExists",
                "path": info.filename
            },
            "launch":
            {
                "type": "launch",
                "application": info.filename,
                "arguments": args,
                "workingDirectory": workingDir,
                "elevationRights": "asinvoker",
                "waitForExit": false
            },
            "remove":
            {
                "type": "unlistApplication"
            }
        }
    };

    var self = this;
    self.applications.push(application);
    application.launchApp = function(actionCompleteCallBack, obj) { self.launchApplication(task, application, actionCompleteCallBack, obj); };
    application.removeApp = function(actionCompleteCallBack, obj) { self.removeApplication(task, application, actionCompleteCallBack, obj); };
    notificationCenter.fire("Applications", "AddItem", this, application);
    this.save(task.args.config);
    notificationCenter.fire("Applications", "AddedCustomApp", this, application);
};

ApplicationsController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.xhr)) {
        this.xhr.abort();
        this.xhr = null;
    }
    
    $.each(this.timers, function(index, timerId) {
        clearTimeout(timerId);
    });
    this.timers = [];
    this.busyApplications = [];
    this.patchQueue = [];
    this.patchesRunning = 0;
    var oldApplications = this.applications;
    this.applications = [];
    var self=this;
    $.each(oldApplications, function(index, application) {
        self.deleteApplication(null, application);
    });
};

ApplicationsController.prototype.runActionList = function(taskName, task, application, completeCallback) {
    var self = this;
    if (!isNull(application.actions)) {
        if (isNull(application.tasks)) {
            application.tasks = new Tasks();
            application.tasks.loadFromObject(application.actions);
        }
        self.setApplicationBusy(application, true);
        var newInstallPath = null;
        if(application.tempInstallPath) {
            newInstallPath = application.tempInstallPath;
            application.tempInstallPath = null;
        }
        var observers = [];
        var runTask = null;
        var revertOptionalState = false;
        var observerRelease=function(obs) {
            var index=observers.indexOf(obs);
            if(index>=0) {
                observers.splice(index, 1);
            }
            obs.release();
        };
        var controllerCreator = function(newTask, args) {
            if (args.type === "unlistApplication") {// The Exception(TM)
                self.actionRemoveApplication(task, application, completeCallback);
                newTask.controller = null;
            }
            else {
                window.taskControllerCreator(newTask, args);
                newTask.application = application; // allows PatchView/DownloadView to know which app they create a progressbar for
                if ((args.type === "patch") || (args.type === "patchgroup") || (args.type === "checkPatchExists")) { // allows us to override targetdir/outputpath
                    var patchChannel = null;
                    var patchQueue = null;
                    if (!isNull(newTask.controller)) {
                        patchChannel=newTask.controller.patchChannel;
                        patchQueue=newTask.controller.patchQueue;
                    }
                    if (((args.type === "patch") || (args.type === "patchgroup")) && (!args.repair) && patchQueue) {
                        var requiredCompleteObserver = null;
                        requiredCompleteObserver = notificationCenter.addInstanceObserver("PatchQueue", "RequiredComplete", patchQueue, function(completeTask, info) {
                            observerRelease(requiredCompleteObserver);
                            if (!isNull(application.actions.launch) && patchQueue.patchesUpcoming.length) {
                                self.changeState(task, application, applicationState.OPTIONALS);
                                self.resetCallbacks(task, application);
                                application.launchApp = function(actionCompleteCallBack, obj) { self.launchApplication(task, application, actionCompleteCallBack, obj); };
                                notificationCenter.fire("Applications", "ChangeItem", self, application);
                                if ( application.properties.installPath && newInstallPath && (newInstallPath !== application.properties.installPath) ) {
                                    self.replaceAllValues(application, application.properties.installPath, newInstallPath);
                                    self.save(task.args.config);
                                }
                                revertOptionalState=true;
                            }
                        });
                        observers.push(requiredCompleteObserver);
                        if(self.queueType === appQueueType.PATCHAPPLYS) {
                            var patchApplyObserver = null;
                            var current={"patch": null, "start": null};
                            patchApplyObserver = notificationCenter.addInstanceObserver("PatchQueue", "StateChange", patchQueue, function(completeTask, info) {
                                if((info.state === patchQueueState.PATCH) && (!current.patch)) {
                                    current.patch=patchQueue.patch;
                                    current.start=patchQueue.patch.start;
                                    current.patch.start=self.donothing;
                                    setTimeout(function(){
                                        var oldState=application.state;
                                        self.startQueueTask(task, application, appQueueType.PATCHAPPLYS, function(){
                                            current.patch.start=current.start;
                                            if(application.state === applicationState.WAITING) {
                                                self.changeState(task, application, oldState);
                                                application.unWait();
                                            }
                                            current.start.apply(current.patch,[]);
                                        });
                                    },0);
                                }
                                else
                                if((info.state !== patchQueueState.PATCH) && (info.state !== patchQueueState.STALLED) && (current.patch)) {
                                    current.patch=null;
                                    current.start=null;
                                    self.finishQueueTask(appQueueType.PATCHAPPLYS);
                                }
                            });
                            observers.push(patchApplyObserver);
                        }
                    }
                    var taskCompleteObserver = null;
                    taskCompleteObserver = notificationCenter.addInstanceObserver("Task", "Complete", newTask, function(completeTask, info) {
                        observerRelease(taskCompleteObserver);
                        var lastError = null;
                        if ( patchChannel && (patchChannel.getState() === patchChannelState.FAIL)) {
                            lastError = patchChannel.getLastError();
                        }
                        if((args.type === "patchgroup") && !isNull(newTask.controller) && newTask.controller.failed) {
                            lastError = newTask.controller.lastError;
                        }
                        if (!isNull(lastError)) {
                            application.lastPatchError = lastError;
                            notificationCenter.fire("Applications", "ReportError", self, application);
                            newTask.error(patcherError.errorStringFromId(application.lastPatchError));
                        }
                    });
                    observers.push(taskCompleteObserver);
                    if ( patchChannel ) {
                        var processObserver=null;
                        processObserver = notificationCenter.addInstanceObserver("PatchManifest", "ConfigComplete", patchChannel.manifest, function(configTask, info) {
                            var installPath = application.properties.installPath;
                            if (!isNull(installPath) && installPath && patchChannel.manifest) {
                                if (installPath.replaceStr && installPath.replaceWith) {
                                    var replaceStr = app.expandString(installPath.replaceStr);
                                    var replaceWith = app.expandString(installPath.replaceWith);
                                    var tempInstallPath = patchChannel.manifest.getTargetDirectory().replace(replaceStr,replaceWith);
                                    patchChannel.manifest.setTargetDirectory(tempInstallPath);
                                }
                                else if (newInstallPath) {
                                    patchChannel.manifest.setTargetDirectory(newInstallPath);
                                } else {
                                    newInstallPath = app.expandString(installPath);
                                    patchChannel.manifest.setTargetDirectory(newInstallPath);
                                }
                            }
                        });
                        observers.push(processObserver);
                    }
                }
            }
        };
        var autoRelease = !(application.actions[taskName] && hasOwnProperty(application.actions[taskName],"type") && (application.actions[taskName].type === "patchgroup"));
        runTask = application.tasks.create(taskName, autoRelease, controllerCreator, window.taskViewCreator);
        var taskCompleteObserver = null;
        taskCompleteObserver = notificationCenter.addInstanceObserver("Task", "Complete", runTask, function(t, index) {
            taskCompleteObserver.release();
            self.setApplicationBusy(application, false);
            setTimeout(function(){
                observers.forEach(function(observer){
                    observer.release();
                });
            },0);
            if ( application.properties.installPath && newInstallPath && (newInstallPath !== application.properties.installPath) ) {
                self.replaceAllValues(application, application.properties.installPath, newInstallPath);
                self.save(task.args.config);
            }
            if( revertOptionalState && (application.state === applicationState.OPTIONALSRUNNING)) {
                self.changeState(task, application, applicationState.RUNNING);
            }
            if(!autoRelease) {
                if(!isNull(runTask.controller)) {
                    runTask.controller.release();
                }
            }
            if (completeCallback) {
                completeCallback(application, runTask);
            }
        });
        runTask.start();
    }
    else {
        if (completeCallback) {
            completeCallback(application, task, []);
        }
    }
};

ApplicationsController.prototype.refreshApplication = function(task, application, allowAutoLaunch, completeCallback) {
    var self = this;
    if (self.isApplicationBusy(application) || (application.state===applicationState.REFRESHING)) {
        if (completeCallback) {
            completeCallback(application, task);
        }
    } else {
        self.changeState(task, application, applicationState.REFRESHING);
        self.updateApplicationActionStatus(task, application, function() {
            notificationCenter.fire("Applications", "ChangeItem", self, application);
            if (completeCallback) {
                completeCallback(application, task);
            }
            if( allowAutoLaunch
            &&((self.runAfterPatching === true) || (application.properties.runAfterPatch === true))
            && (!isNull(application.properties))
            && (!isNull(application.buttons))
            && (!application.lastPatchError)
            && (application.properties.autoPatch !== true)
            && (!isNull(application.buttons.launchElement))
            && (application.state === applicationState.IDLE)) {
                setTimeout(function(){application.buttons.launchElement.click();}, 1);
            }
            else 
            if((application.lastPatchError) && (!isNull(application.buttons)) && (!isNull(application.buttons.repairElement)) && (!application.lastAutoRepair)) {
                var autoRepairOn = application.properties.autoRepairOn ? application.properties.autoRepairOn : self.autoRepairOn;
                var lastErrorStr = patcherError.errorStringFromId(application.lastPatchError);
                if((autoRepairOn === true)
                ||(autoRepairOn === application.lastPatchError)
                ||(autoRepairOn == lastErrorStr)
                ||(!isNull(autoRepairOn) 
                   && (getObjectType(autoRepairOn.indexOf) === "function") 
                   && ((autoRepairOn.indexOf(application.lastPatchError) >= 0) || autoRepairOn.indexOf(lastErrorStr) >= 0))) {
                      var startRepair = null;
                      startRepair = function() {
                        if (self.applications.length == 0) {
                            return;
                        } else if (self.isApplicationBusy(application) || (application.state===applicationState.REFRESHING)) {
                            setTimeout(function(){startRepair();}, 1000);
                        } else {
                            delete application.lastPatchError;
                            application.lastAutoRepair = true;
                            setTimeout(function(){application.buttons.repairElement.click();}, 1);
                        }
                      };
                      var info = { "application" : application, "cancel": false, "callback": startRepair};
                      notificationCenter.fire("Applications", "WillAutoRepair", self, info);
                      if(!info.cancel) {
                          startRepair();
                      }
                }
            }
            delete application.lastAutoRepair;
        });
    }
};

ApplicationsController.prototype.actionRemoveApplication = function(task, application, completeCallback) {
    var self = this;
    host.assert(!isNull(application), "application not sent to actionRemoveApplication in ApplicationsController");
    self.deleteApplication(task, application);
    notificationCenter.fire("Applications", "RemoveItem", this, application);
    self.save(task.args.config);
    self.startTimer(function() { completeCallback(application, task, []); }, 1);
};

ApplicationsController.prototype.downloadApplication = function(task, application, completeCallback, obj) {
    var self = this;
    var taskName = obj && $(obj).data("task") ? $(obj).data("task") : "download";
    self.changeState(task, application, applicationState.DOWNLOADING);
    var installPath = application.properties.installPath;
    if ((getObjectType(installPath)==="string") && (installPath.indexOf("{BrowseForFolder}") >=0)) {
        var newInstallPath = skinWindow.browseForFolder(host.getLanguageString("Download_BrowseForFolder"), app.expandString("{ModulePath}"));
        if (!newInstallPath) {
            self.refreshApplication(task,application,true,completeCallback);
            return;
        } else {
            if(!newInstallPath.endsWith(self.pathSeparator)) {
                newInstallPath += self.pathSeparator;
            }
            application.tempInstallPath = application.properties.installPath.replace("{BrowseForFolder}",newInstallPath);
        }
    }
    self.runActionList(taskName, task, application, function(appl, appTask) {
        self.finishQueueTask(appQueueType.DOWNLOADS);
        self.refreshApplication(task,application,true,completeCallback);
    });
};

ApplicationsController.prototype.patchApplication = function(task, application, completeCallback, obj) {
    var self = this;
    var taskName = obj && $(obj).data("task") ? $(obj).data("task") : "patch";
    self.changeState(task, application, applicationState.PATCHING);
    self.runActionList(taskName, task, application, function(appl, appTask) {
        self.finishQueueTask(appQueueType.DOWNLOADS);
        self.refreshApplication(task,application,true,completeCallback);
    });
};

ApplicationsController.prototype.repairApplication = function(task, application, completeCallback, obj) {
    var self = this;
    var taskName = obj && $(obj).data("task") ? $(obj).data("task") : "repair";
    self.changeState(task, application, applicationState.REPAIRING);
    self.runActionList(taskName, task, application, function(appl, appTask) {
        self.finishQueueTask(appQueueType.DOWNLOADS);
        self.refreshApplication(task,application,true,completeCallback);
    });
};

ApplicationsController.prototype.launchApplication = function(task, application, completeCallback, obj) {
    var self = this, baseTask = task;
    var taskName = obj && $(obj).data("task") ? $(obj).data("task") : "launch";
    $(obj).addClass("Running");
    var launchApp = application.launchApp;
    if (launchApp) {
        self.resetCallbacks(task, application);
        application.launchApp = launchApp;
        notificationCenter.fire("Applications", "ChangeItem", self, application);
    }
    if(application.state === applicationState.OPTIONALS) {
        self.changeState(task, application, applicationState.OPTIONALSRUNNING);
    } else {
        self.changeState(task, application, applicationState.RUNNING);
    }
    this.runActionList(taskName, task, application, function(appl, appTask) {
        $(obj).removeClass("Running");
        var fmt = host.getLanguageString("MyLibrary_DateTimeFormat");
        if (fmt === "MyLibrary_DateTimeFormat") {
            fmt = "MM/dd/yyyy hh:mma";
        }
        if ($.format && $.format.date) {
            application.properties.lastLaunch = $.format.date(new Date(), fmt);
        }
        if(isNull(baseTask)) {
            baseTask = appTask;
        }
        if(isNull(baseTask)) {
            self.save(baseTask.args.config);
        }
        if(launchApp) {
            self.resetCallbacks(task, application);
            application.launchApp = launchApp;
            notificationCenter.fire("Applications", "ChangeItem", self, application);
        }
        self.refreshApplication(task,application,false,completeCallback);
    });
};

ApplicationsController.prototype.removeApplication = function(task, application, completeCallback, obj) {
    var self = this;
    var taskName = obj && $(obj).data("task") ? $(obj).data("task") : "remove";
    this.runActionList(taskName, task, application, function(appl, appTask) {
        self.refreshApplication(task,application,false,completeCallback);
    });
};

registerTaskController("applist", ApplicationsController);

/*!
* \file appstate.js
* \brief File containing application state constants and helper functions
*/

/*!
* \class ApplicationState
* \brief Application state constants and helper functions
*/

function ApplicationState() {
    /*!
    * Idle
    * \type int
    */
    this.IDLE = 0;
    /*!
    * Refreshing
    * \type int
    */
    this.REFRESHING = 1;
    /*!
    * Downloading
    * \type int
    */
    this.DOWNLOADING = 2;
    /*!
    * Patching
    * \type int
    */
    this.PATCHING = 3;
    /*!
    * Repairing
    * \type int
    */
    this.REPAIRING = 4;
    /*!
    * Running
    * \type int
    */
    this.RUNNING = 5;
    /*!
    * Uninstalling
    * \type int
    */
    this.UNINSTALLING = 6;
    /*!
    * Downloading Optional Content
    * \type int
    */
    this.OPTIONALS = 7;
    /*!
    * Running while downloading Optional Content
    * \type int
    */
    this.OPTIONALSRUNNING = 8;
    
    /*!
    * Queued and waiting for download/patch/repair
    * \type int
    */
    this.WAITING = 9;
}

/*!
* converts an application state to a string
* \tparam int id application state
* \type string
* \returns stringified name of application state.
*/
ApplicationState.prototype.nameFromId = function(id) {
    var nameMap = [
        "Idle",
        "Refreshing",
        "Downloading",
        "Patching",
        "Repairing",
        "Running",
        "Uninstalling",
        "Optionals",
        "OptionalsRunning",
        "Waiting"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of ApplicationState
* \type ApplicationState
*/
var applicationState = new ApplicationState();

function AppQueueType() {
    /*!
    * No Concurrency Queue
    * \type int
    */
    this.NONE = 0;
    /*!
    * Downloads (and patches as one thing)
    * \type int
    */
    this.DOWNLOADS = 1;
    /*!
    * Patch Applys
    * \type int
    */
    this.PATCHAPPLYS = 2;
}

/*!
* precreated global instance of ApplicationConrrencyMode
* \type ApplicationConrrencyMode
*/
var appQueueType = new AppQueueType();

function ApplicationsView(task, args) {
    var self = this;

    this.observers = [];

    this.clear();

    this.controller=task.controller;
    
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("Applications", "ReportError", task.controller, function(sender, application) {
        if (!isNull(application.lastPatchError)) {
            if (!isNull(self.containerElement)) {
                self.containerElement.trigger("ReportError", [application]);
            }
            if (!isNull(application.progress) && !isNull(application.progress.errorElement)) {
                if(application.lastPatchError >= 0) {
                    var errorMessage=host.getLanguageString(patcherError.errorStringFromId(application.lastPatchError));
                    application.progress.errorElement.html(errorMessage);
                    application.progress.errorElement.show();
                }
            }
        }
    }));
    
    this.observers.push(notificationCenter.addInstanceObserver("Applications", "AddItem", task.controller, function(sender, application) {
        if (!isNull(self.containerElement)) {
            self.containerElement.trigger("AddItem", [application]);
        }
    }));

    this.observers.push(notificationCenter.addInstanceObserver("Applications", "ChangeItem", task.controller, function(sender, application) {
        if (!isNull(self.containerElement)) {
            self.containerElement.trigger("ChangeItem", [application]);
        }
    }));

    this.observers.push(notificationCenter.addInstanceObserver("Applications", "StateChange", task.controller, function(sender, application) {
        if (!isNull(application.progress) 
        && !isNull(application.progress.errorElement) 
        && (application.state !== applicationState.IDLE)
        && (application.state !== applicationState.REFRESHING)) {
            application.progress.errorElement.hide();
        }
        if (!isNull(self.containerElement)) {
            self.containerElement.trigger("StateChange", [application]);
        }
        if (!isNull(application.row)) {
            application.row.trigger("StateChange", [application]);
        }
        if (!isNull(application.rowClass)) {
            application.rowClass.apply("AppState" + applicationState.nameFromId(application.state));
        }
    }));

    this.observers.push(notificationCenter.addInstanceObserver("Applications", "RemoveItem", task.controller, function(sender, application) {
        if (!isNull(self.containerElement)) {
            self.containerElement.trigger("RemoveItem", [application]);
        }
    }));

    this.observers.push(notificationCenter.addInstanceObserver("Applications", "RemoteLoad", task.controller, function(sender, settings) {
        if (!isNull(self.containerElement)) {
            self.containerElement.trigger("RemoteLoad", [settings]);
        }
    }));

    this.observers.push(notificationCenter.addInstanceObserver("Applications", "AddCustomItem", task.controller, function(sender, application) {
        var filename = skinWindow.browseForFile(host.getLanguageString("MyLibrary_BrowseForFile"), "Executable file (*.exe)", "*.exe", app.expandString("{ModulePath}"), "");
        if ( filename && (window.platform.fileExists(filename) === true)) {
            task.controller.addCustomItem(task, { "filename": filename, "name": "", "args": "" });
        }
    }));

    this.observers.push(notificationCenter.addInstanceObserver("Applications", "AddedCustomApp", task.controller, function(sender, application) {
        if (application.row && !isNull(self.customAppOptionsView.rootName)) {
            self.showCustomAppOptions(task, application, function(subTask) {
                if (subTask.hasError()) {
                    if (application.removeApp) {
                        application.removeApp();
                    }
                }
            });
        }
    }));
    
    this.observers.push(notificationCenter.addInstanceObserver("Applications", "WillAutoRepair", workflow, function(sender, info) { 
        if (!isNull(self.containerElement)) {
            self.containerElement.trigger("WillAutoRepair", [info]);
        }
        if (!isNull(info.application) && !isNull(info.application.row)) {
            info.application.row.trigger("WillAutoRepair", [info]);
        }
    }));
    
    this.observers.push(notificationCenter.addInstanceObserver("Workflow", "WillUnload", workflow, function(sender, info) { self.release(); }));
}

ApplicationsView.prototype.clear = function() {
    this.observers = [];
    this.containerElement = null;
    this.applicationTemplateElement = null;
    this.customAppOptionsView = {};
    this.customAppOptionsView.rootName = null;
    this.customAppOptionsView.nameElement = null;
    this.customAppOptionsView.exeElement = null;
    this.customAppOptionsView.pathElement = null;
    this.customAppOptionsView.argsElement = null;
};

ApplicationsView.prototype.release = function() {
    if(!isNull(this.controller)) {
        this.controller.release();
        this.controller=null;
    }
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.clear();
};

ApplicationsView.prototype.showCustomAppOptions = function(task, application, completeCallback) {
    var taskRunner = new Tasks();

    var dialogTaskTemplate = {};
    dialogTaskTemplate.type = "uimodal";
    dialogTaskTemplate.element = this.customAppOptionsView.rootName;
    dialogTaskTemplate.title = application.properties.title;
    dialogTaskTemplate.application = !isNull(application.actions.launch.application) ? application.actions.launch.application : "";
    dialogTaskTemplate.workingDirectory = !isNull(application.actions.launch.workingDirectory) ? application.actions.launch.workingDirectory : "";
    dialogTaskTemplate.arguments = !isNull(application.actions.launch.arguments) ? application.actions.launch.arguments : "";
    taskRunner.loadFromObject({ "customAppOptions": dialogTaskTemplate });

    var runTask = taskRunner.create("customAppOptions", true, window.taskControllerCreator, window.taskViewCreator);
    
    var taskCompleteObserver = null;
    taskCompleteObserver = notificationCenter.addInstanceObserver("Task", "Complete", runTask, function(dialogTask, info) {
        taskCompleteObserver.release();

        if (!dialogTask.hasError() && hasOwnProperty(dialogTask, "result")) {
            var launchAction = application.actions.launch;
            host.assert(!isNull(launchAction), "custom app not custom launchable in ApplicationsView");

            if (!isNull(dialogTask.result.title)) {
                application.properties.title = dialogTask.result.title;
            }

            if (!isNull(dialogTask.result.application)) {
                launchAction.application = dialogTask.result.application;
            }

            if (!isNull(dialogTask.result.workingDirectory)) {
                launchAction.workingDirectory = dialogTask.result.workingDirectory;
            }

            if (!isNull(dialogTask.result.arguments)) {
                launchAction.arguments = dialogTask.result.arguments;
            }

            dialogTask.result = null;

            if (task.controller && task.args.config) {
                task.controller.save(task.args.config);
            }
            notificationCenter.fire("Applications", "ChangeItem", task.controller, application);
        }
        if (completeCallback) {
            completeCallback(dialogTask);
        }
    });
    runTask.start();
};

ApplicationsView.prototype.onStart = function(task, info) {
    var self = this;
    notificationCenter.fire("Applications", "Bind", task, self);

    if (!isNull(self.addElement)) {
        self.addElement.click(function() {
            notificationCenter.fire("Applications", "AddCustomItem", task.controller, {});
        });
    }

    // Don't bind against a rootElement because I need to pass it in as a task object
    // and merging a host object is a ton of work
    this.customAppOptionsView.rootName = null;
    this.customAppOptionsView.nameElement = null;
    this.customAppOptionsView.exeElement = null;
    this.customAppOptionsView.pathElement = null;
    this.customAppOptionsView.argsElement = null;

    notificationCenter.fire("Applications", "BindCustomAppOptionsView", task, this.customAppOptionsView);
    var customAppOptionViewRoot = null;
    if (!isNull(this.customAppOptionsView.rootName)) {
        customAppOptionViewRoot = $(this.customAppOptionsView.rootName);
    }
    if (!isNull(customAppOptionViewRoot)) {
        customAppOptionViewRoot.bind("modalValidate", null, function(event, task, view) {
            var newSelf=$(this);
            setTimeout(function(){
                task.result = {};
                if (!isNull(self.customAppOptionsView.nameElement)) {
                    task.result.title = self.customAppOptionsView.nameElement.val();
                }

                if (!isNull(self.customAppOptionsView.exeElement)) {
                    task.result.application = self.customAppOptionsView.exeElement.val();
                }

                if (!isNull(self.customAppOptionsView.pathElement)) {
                    task.result.workingDirectory = self.customAppOptionsView.pathElement.val();
                }

                if (!isNull(self.customAppOptionsView.argsElement)) {
                    task.result.arguments = self.customAppOptionsView.argsElement.val();
                }

                newSelf.trigger("modalSuccess");
            },0);
        });

        customAppOptionViewRoot.bind("bind", null, function(event, task, view) {
            view.requireValidation = true;
            view.cancelElement = $(this).find(".modalCancel");

            if (!isNull(self.customAppOptionsView.nameElement)) {
                self.customAppOptionsView.nameElement.val(task.args.title);
            }

            if (!isNull(self.customAppOptionsView.exeElement)) {
                self.customAppOptionsView.exeElement.val(task.args.application);
                self.customAppOptionsView.exeElement.unbind("focusin");
                self.customAppOptionsView.exeElement.focusin(function() {
                    var filename = skinWindow.browseForFile(host.getLanguageString("MyLibrary_BrowseForFile"), "Executable File (*.exe)", "*.exe", app.expandString("{ModulePath}"), "");
                    if ( filename && (window.platform.fileExists(filename) === true)) {
                        $(this).val(filename);
                    }
                    $(this).blur();
                });
            }

            if (!isNull(self.customAppOptionsView.pathElement)) {
                self.customAppOptionsView.pathElement.val(task.args.workingDirectory);
                self.customAppOptionsView.pathElement.unbind("focusin");
                self.customAppOptionsView.pathElement.focusin(function() {
                    var path = skinWindow.browseForFolder(host.getLanguageString("MyLibrary_BrowseForPath"), app.expandString("{ModulePath}"));
                    if ( path && (window.platform.directoryExists(path) === true)) {
                        $(this).val(path);
                    }
                    $(this).blur();
                });
            }

            if (!isNull(self.customAppOptionsView.argsElement)) {
                self.customAppOptionsView.argsElement.val(task.args.arguments);
            }
        });
    }

    var modifyLibraryRow = function(row, application) {
        if (!isNull(application.properties) && application.properties.title && !isNull(application.columns.nameElement)) {
            application.columns.nameElement.text(application.properties.title);
            application.columns.nameElement.unbind("click");
            if ((application.properties.isCustomApp === true) && !isNull(customAppOptionViewRoot)) {
                application.columns.nameElement.click(function() { self.showCustomAppOptions(task, application, null); });
            }
        }
        if (!isNull(application.columns.lastLaunchElement)) {
            if (!isNull(application.properties) && application.properties.lastLaunch) {
                application.columns.lastLaunchElement.text(application.properties.lastLaunch);
            }
            else {
                application.columns.lastLaunchElement.html("&nbsp;");
            }
        }
        $.each(application.progress, function(key, val) {
            if (val && (val !== application.progress.errorElement)) {
                val.hide();
            }
        });
        $.each(application.buttons, function(key, val) {
            if (val) {
                val.hide();
            }
        });

        var bindActionAnchor = function(actionButton, progressAction, clickFunction, completeFunction, queueableTask) {
            if (!isNull(actionButton)) {
                if (!isNull(clickFunction)) {
                    actionButton.show();
                    var subButton = null, i = 0;
                    for (i = 0; i < actionButton.length; i += 1) {
                        subButton = $(actionButton[i]);
                        if (subButton.hasClass("Running")) {
                            subButton.hide();
                        }
                    }
                    actionButton.unbind("click"); // since this can be called/changed many times
                    actionButton.click(function(obj) {
                        var startProcessFunc = function() {
                            application.unWait=function() {
                                if(!isNull(application.progress.waitElement)) {
                                    application.progress.waitElement.hide();
                                }
                                $.each(application.buttons, function(key, val) {
                                    if (val) {
                                        val.hide();
                                    }
                                });
                                if (!isNull(progressAction)) {
                                    progressAction.show();
                                }
                            };
                            application.unWait();
                            clickFunction(function(info) {
                                if (!isNull(progressAction)) {
                                    progressAction.hide();
                                }
                                if (!isNull(completeFunction)) {
                                    completeFunction(info);
                                }
                            }, obj.delegateTarget);
                        };
                        if (queueableTask === true) {
                            self.controller.startQueueTask(task, application, appQueueType.DOWNLOADS, startProcessFunc);
                        } else {
                            startProcessFunc();
                        }
                    });
                }
                else {
                    actionButton.hide();
                }
            }
        };

        if ((application.state === applicationState.REFRESHING) && (!isNull(application.progress.refreshElement))) {
            application.progress.refreshElement.show();
        }
        else if ((application.state === applicationState.WAITING) && (!isNull(application.progress.waitElement))) {
            application.progress.waitElement.show();
        }
        else {
            bindActionAnchor(application.buttons.downloadElement, application.progress.downloadElement, application.downloadApp, null, true);
            bindActionAnchor(application.buttons.patchElement, application.progress.patchElement, application.patchApp, null, true);
            bindActionAnchor(application.buttons.repairElement, application.progress.repairElement, application.repairApp, null, true);
            bindActionAnchor(application.buttons.launchElement, application.progress.launchElement, application.launchApp, null, false);
            bindActionAnchor(application.buttons.removeElement, application.progress.removeElement, application.removeApp, null, false);
        }
        if (application.properties && (false === application.properties.visible)) {
            row.hide();
        } else {
            row.show();
        }
    };

    self.containerElement.bind("AddItem", function(event, application) {
        var containerElement=self.containerElement;
        notificationCenter.fire("Applications", "AddRow", task, application);
        self.applicationTemplateElement.hide();
        var oldApplicationKeys=self.applicationTemplateElement.find("*");
        var newApplication = self.applicationTemplateElement.clone();
        newApplication.attr("id", app.expandString("{Guid}"));
        self.containerElement.append(newApplication);
        $.each(newApplication.find("*"),function(key,obj) {
            var newSelf=$(this);
            $.each(oldApplicationKeys,function(key2,obj2) {
                if((key===key2)&&($(this).data("l18n"))) {
                    newSelf.data("l18n",$(this).data("l18n"));
                }
            });
        });
        application.columns = {};
        application.progress = {};
        application.buttons = {};
        application.row = newApplication;
        application.rowClass = new ChangeClass(application.row);
        notificationCenter.fire("Applications", "BindRow", task, application);
        modifyLibraryRow(newApplication, application);
        self.containerElement.trigger("AddedItem", [application]);
        self.containerElement=containerElement;
    });

    self.containerElement.bind("ChangeItem", function(event, application) {
        if (application.row) {
            modifyLibraryRow(application.row, application);
        }
    });

    self.containerElement.bind("RemoveItem", function(event, application) { // called for local custom apps principally
        if (!isNull(application.row)) {
            application.row.remove();
            application.row = null;
            application.rowClass = null;
            self.containerElement.trigger("RemovedItem", [application]);
        }
    });

    task.complete();
};

registerTaskView("applist", ApplicationsView);


