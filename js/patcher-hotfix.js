/* patcher-hotfix.js has been provided to over-ride the PatchController and PatchGroupController launch functions. This was done
for the purposes of making sure that Download Messages are available when an 'upcoming' patch is paused and then resumed. There is a 
bug in DIRECT 3.6.8.1 that makes a resumed upcoming download to go from the state DownloadUpcoming to Download 

for this to work it must be referenced in your html AFTER the patcher-3.6.8.1.min.js is referenced.
*/

PatchController.prototype.launch = function (task) {
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
        task.runSubAction("launch", null, function (launchTask, launchInfo) {
            launchInfo.launchTask = launchTask;
            self.changeState(patchControllerState.COMPLETE);
            self.isLaunching = false;

            if (self.isUpcoming === true) {
                // Restart upcoming releases
                self.download.start();
                self.changeState(patchControllerState.DOWNLOADUPCOMING);
            }
        });
    }
};

PatchGroupController.prototype.launch = function (task) {
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
        task.runSubAction("launch", null, function (launchTask, launchInfo) {
            launchInfo.launchTask = launchTask;
            self.changeState(patchControllerState.COMPLETE);
            self.isLaunching = false;
            if (self.isUpcoming === true) {
                // Restart upcoming releases
                self.download.start();
                self.changeState(patchControllerState.DOWNLOADUPCOMING);
            }
        });
    }
};