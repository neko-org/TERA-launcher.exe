// Unified Progress Bar 
//
// Rev 8
//
// formerly: "64.128-20revP8"
$(function() {
    var basePatchProgressFunction = PatchView.prototype.onUpdateProgress;
    var baseDownloadProgressFunction = DownloadView.prototype.onUpdateProgress;
    
    notificationCenter.addObserver("Task","Start",function(task,info) {
        //app.debugPrint("------------------Task-Start-"+task.name+"\n");
        var isChildOfPatchGroup=(task.parent) && (task.parent.args) && (task.parent.args.type === 'patchgroup');
        if((task.args.type === 'patch') 
        &&((!isNull(task.args.singleProgressBar))
          ||(isNull(task.args.singleProgressBar) && isChildOfPatchGroup && (task.parent.args.singleProgressBar === true))))
        {
            var data = {};
            var manifest=task.controller.patchChannel.manifest;
            var observers=[];
            task.view.unifiedProgressData=data;
            task.view.singleProgressBar = null;
            if ((!isNull(task.args.singleProgressBar)) && (getObjectType(task.args.singleProgressBar.forEach) === "function")) {
                var min = task.args.singleProgressBar[0]/100.0;
                var max = (task.args.singleProgressBar[1]-task.args.singleProgressBar[0])/100.0;
                task.view.singleProgressBar = [min,max];
            } else if (isChildOfPatchGroup && (task.parent.args.singleProgressBar === true)){
                 task.view.singleProgressBar = [0,1];
            }
            task.view.downloadView.singleProgressBar=task.view.singleProgressBar;
            task.view.downloadView.unifiedProgressData=data;
            data.lastValue = 0;
            var completeController = task;
            var lastPatchView = task.view;
            var setProgressBars = function(amt)
            {
                //app.debugPrint("------------------setProgressBars-"+amt+"\n");
                if (lastPatchView && lastPatchView.singleProgressBar) {
                    if(baseDownloadProgressFunction && (getObjectType(baseDownloadProgressFunction) === "function") && (lastPatchView.downloadView)) {
                        baseDownloadProgressFunction.apply(lastPatchView.downloadView,[amt]);
                    }
                    if(basePatchProgressFunction && (getObjectType(basePatchProgressFunction) === "function")) {
                        basePatchProgressFunction.apply(lastPatchView,[amt]);
                    }
                }
            };
            if(isChildOfPatchGroup) {
                var queue = task.parent.controller.patchQueue;
                if(isNull(task.parent.progressBaseTotalNumberPatchesDone))
                    task.parent.progressBaseTotalNumberPatchesDone=0;
                completeController = task.parent;
                observers.push(notificationCenter.addInstanceObserver("PatchQueue", "Complete", queue, function(sender, info) 
                { 
                    //app.debugPrint("------------------PatchQueue-Complete-"+data.totalDownloads+"\n");
                    if(!isNull(data.totalDownloads))
                    {
                        task.parent.progressBaseTotalNumberPatchesDone += data.totalDownloads;
                        delete data.totalDownloads;
                        delete data.groupProgressDone;
                        delete task.parent.progressTotalPatches;
                    }
                }));
                observers.push(notificationCenter.addInstanceObserver("PatchQueue","StateChange",queue,function(sender,stateInfo) {
                    //app.debugPrint("------------------PatchQueue-StateChange-"+stateInfo.state+"\n");
                    var name = manifest.getName();
                    if((!queue.currentPatchInfo)||(queue.currentPatchInfo.versionName != (name+'.version')))
                        return;

                    if(stateInfo.state == patchQueueState.COMPLETE) {
                        //app.debugPrint("**************************************************************************PatchQueue-StateChange-"+stateInfo.state+"\n");
                        delete data.totalDownloads;
                        delete data.groupProgressDone;
                        delete sender.progressTotalPatches;
                        sender.progressBaseTotalNumberPatchesDone=0;
                        data.state=-1;
                        return;
                    }
                    
                    lastPatchView=task.parent.view;
                    lastPatchView.singleProgressBar=task.view.singleProgressBar;
                    lastPatchView.unifiedProgressData=data;
                    lastPatchView.downloadView.singleProgressBar=task.view.singleProgressBar;
                    lastPatchView.downloadView.unifiedProgressData=data;

                    data.originalReleaseId=manifest.getCurrentReleaseId();
                    data.targetReleaseId=manifest.getRequiredReleaseId();
                    data.currentPatch=manifest.getName();
                    var oldRemain=data.downloadsRemaining;
                    data.downloadsRemaining = 1;
                    for(var i=0;i<queue.patchesRequired.length;i++)
                        if(queue.patchesRequired[i].versionName == (name+'.version')) {
                            data.downloadsRemaining++;
                        }
                    if(isNull(data.totalDownloads)) {
                        data.totalDownloads = data.downloadsRemaining;
                    }
                    //app.debugPrint("------------------PatchQueue-DLRem="+data.downloadsRemaining+"/totdl="+data.totalDownloads+"/progtotpatch=*"+task.parent.progressTotalPatches+"/grpprogdone=*"+data.groupProgressDone+"/patchreq="+queue.patchesRequired.length+"\n");
                    if(task.parent.args.singleProgressBar === true) {
                        if(isNull(task.parent.progressTotalPatches)) {
                            task.parent.progressTotalPatches=queue.patchesRequired.length + 1 + task.parent.progressBaseTotalNumberPatchesDone;
                            task.parent.progressPatchSize = (1.0 / task.parent.progressTotalPatches );
                            task.parent.progressNextStart=task.parent.progressBaseTotalNumberPatchesDone * task.parent.progressPatchSize;
                        }
                        //app.debugPrint("------------------PatchQueue-Step2-progtotpatch="+task.parent.progressTotalPatches+"/prognextstart="+task.parent.progressNextStart+"/progpatchsize="+task.parent.progressPatchSize+"\n");
                        if(isNull(data.groupProgressDone)) {
                            task.view.singleProgressBar[0]=task.parent.progressNextStart;
                            task.view.singleProgressBar[1]=data.totalDownloads * task.parent.progressPatchSize;
                            task.parent.progressNextStart += task.view.singleProgressBar[1];
                            data.groupProgressDone = true;
                        }
                        //app.debugPrint("------------------PatchQueue-Step3-singprogbar="+task.view.singleProgressBar+"/prognextstart="+task.parent.progressNextStart+"/grpprogdone="+data.groupProgressDone+"\n");
                    }
                    data.currentReleaseId=queue.currentPatchInfo.fromId;
                    data.nextReleaseId=queue.currentPatchInfo.toId;
                    data.releasesRemaining=data.targetReleaseId-data.currentReleaseId;
                    data.totalReleases=data.targetReleaseId-data.originalReleaseId;
                    // downloading=0, applying=1
                    if(stateInfo.state == patchQueueState.PATCH) {
                        data.state=1;
                    } else {
                        data.state=-1;
                    }
                    if(oldRemain !== data.downloadsRemaining) {
                        data.dlCheck = false;
                        data.dlState = 0;
                    }
                }));
                observers.push(notificationCenter.addInstanceObserver("Download", "StateChange", task.parent.controller.download, function(sender, info) { 
                    //app.debugPrint("------------------Download-StateChange-"+info.state+"\n");
                    data.dlState=info.state;
                   if((info.state == downloadState.CHECK)||(info.state == downloadState.DOWNLOAD)||(info.state == downloadState.DOWNLOADWITHCHECK)) {
                        data.state=0;
                    } else {
                        data.state=-1;
                    }
                }));
            }
            else
            {
                var queue=task.controller.patchQueue;
                observers.push(notificationCenter.addInstanceObserver("PatchQueue", "WillProcessPatch", queue, function(sender, info) {
                    //app.debugPrint("------------------PatchQueue-WillProcessPatch-"+info.patchInfo+"\n");
                    data.originalReleaseId=manifest.getCurrentReleaseId();
                    data.targetReleaseId=manifest.getRequiredReleaseId();
                    data.currentPatch=manifest.getName();
                    if(isNull(data.totalDownloads))
                        data.totalDownloads=queue.patchesRequired.length;
                    if(!isNull(info.patchInfo))
                        info=info.patchInfo;
                    data.currentReleaseId=info.fromId;
                    data.nextReleaseId=info.toId;
                    data.releasesRemaining=data.targetReleaseId-data.currentReleaseId;
                    data.totalReleases=data.targetReleaseId-data.originalReleaseId;
                    if(data.downloadsRemaining !== queue.patchesRequired.length) {
                        data.dlCheck = false;
                        data.dlState = 0;
                    }
                    data.downloadsRemaining = queue.patchesRequired.length;
                }));
                observers.push(notificationCenter.addInstanceObserver("PatchController","StateChange",task.controller,function(sender,stateInfo) {
                    //app.debugPrint("------------------PatchController-StateChange-"+stateInfo.state+"\n");
                    // downloading=0, applying=1
                    if(stateInfo.state == patchControllerState.COMPLETE) {
                        //app.debugPrint("**************************************************************************PatchController-StateChange-"+stateInfo.state+"\n");
                        delete data.totalDownloads;
                        delete data.groupProgressDone;
                        delete sender.progressTotalPatches;
                        sender.progressBaseTotalNumberPatchesDone=0;
                        data.state=-1;
                    } else if(stateInfo.state == patchControllerState.PATCH) {
                        data.state=1;
                    } else {
                        data.state=-1;
                    }
                }));
                observers.push(notificationCenter.addInstanceObserver("Download", "StateChange", task.controller.download, function(sender, info) { 
                    //app.debugPrint("------------------Download-StateChange-"+info.state+"\n");
                   data.dlState=info.state;
                   if((info.state == downloadState.CHECK)||(info.state == downloadState.DOWNLOAD)||(info.state == downloadState.DOWNLOADWITHCHECK)) {
                       data.state=0;
                   } else {
                       data.state=-1;
                   }
               }));
            }
            observers.push(notificationCenter.addInstanceObserver("Task","Complete",completeController,function(sender,info) {
                //app.debugPrint("------------------Task-Complete-"+sender.name+"\n");
                if((sender.args)
                &&((sender.args.type === 'patchgroup')
                	||((sender.args.type === 'patch')&&(!isChildOfPatchGroup)))
                &&(sender.args.updateInterval))
                {
                    //app.debugPrint("**************************************************************************Task-Complete\n");
                    delete data.totalDownloads;
                    delete data.groupProgressDone;
                    delete sender.progressTotalPatches;
                    sender.progressBaseTotalNumberPatchesDone=0;
                }
                else
                {
                    for(var i=0;i<observers.length;i++)
                        observers[i].release();
                }
                setProgressBars(1.0);
                if (lastPatchView && lastPatchView.unifiedProgressData) {
                    lastPatchView.unifiedProgressData.state=-1;
                }
            }));
        }
    });

    function adjustUnifiedProgressWidth(data, progBoundaries, value) {
        if(isNull(data.totalDownloads) || isNull(data.downloadsRemaining)) {
            return value;
        } 
        var min = progBoundaries[0];
        var width = progBoundaries[1] / data.totalDownloads;
        min += (data.totalDownloads - data.downloadsRemaining) * width; // replace with size based widths
        if((data.dlCheck === true)||((data.dlState === downloadState.CHECK)&&(value>1.0))) {
            data.dlCheck = true;
            if (data.state === 1) {
                min += 3 * (width / 4.0);
                width = width / 4.0;
            } else if (data.dlState !== downloadState.CHECK) {
                min += (width / 4.0);
                width = width / 2.0;
            } else {
                width = width / 4.0;
            }
        }  else {
            if (data.state === 1) {
                min += 2 * (width / 3.0);
                width = width / 3.0;
            } else {
                width = 2 * (width / 3.0);
            }
        }
        //app.debugPrint((min+(value*width))+"/totdl="+data.totalDownloads+"/dlrem="+data.downloadsRemaining+"/min="+min+",wid="+width+"/startval="+value+"/dlstate="+data.dlState+"/state="+data.state+"/bounds="+progBoundaries+"\n");
        if((min == 0)&&(value == 0)&&(!isNaN(width)))
            value=0.0001;
        return  min+(value*width);
    }

    notificationCenter.addObserver("TaskView", "WillUpdateProgress", function(sender, info) {
        var value=info.percent / 100.0;
        var oldValue = value;
        var state=-99;
        if( sender.singleProgressBar && sender.unifiedProgressData) {
            var data = sender.unifiedProgressData;
            state=data.state;
            if(value >= 0.0) {
                if(isNull(data.totalDownloads) || isNull(data.downloadsRemaining)) {
                    info.percent = 100.0;
                    //app.debugPrint("**************TaskView-WillUpdateProgress-"+(sender.singleProgressBar[1])+"/"+info.percent+"\n");
                    return;
                }
                else
                    value = adjustUnifiedProgressWidth(data, sender.singleProgressBar, value);
            }
            if ((value > 0.0) && (value !== 1) && (data.state != -1)  && (oldValue !== 1)) {
                info.percent=Math.round(value * 100.0);
            } else {
                //should hold the line
                if(!isNull(sender.lastPercent)) {
                    info.percent = sender.lastPercent;
                }
            }
        }
        //app.debugPrint("------------------TaskView-WillUpdateProgress-"+state+"/"+oldValue+"/"+sender.lastPercent+"/"+info.percent+"\n");
    });
    
});
