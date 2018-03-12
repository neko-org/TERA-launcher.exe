/**
 * @preserve Modifications performed to this file by anyone other than Solid State Networks
 * are unsupported and may void your software warranty.
 */
$(document).ready(function() {
    host.assert(app.expandString("{AppVersion}") === "3.6.8.1", "Invalid application version");
});

(function() {
    function Analytics() {
        this.machineId = app.expandString("{SHA1:{Lower:{PrimaryMAC}{DiskSerial:{SystemPath}}}}");
        this.sessionId = app.expandString("{Guid}");
        this.token = "";
        this.hostname = "";
        this.debug = false;
        this.nameTag = null;
        this.shutdown = false;
        this.dummyObj = null;
        this.xhr = null;
        this.queue = [];
    };

    Analytics.prototype.setToken = function(token) {
        this.token = token;
    };

    Analytics.prototype.setHostname = function(hostname) {
        this.hostname = hostname;
    };

    Analytics.prototype.setDebug = function(debug) {
        this.debug = debug;
    };

    Analytics.prototype.setNameTag = function(nameTag) {
        this.nameTag = nameTag;
    };

    Analytics.prototype.onStartup = function() {
        // Create this object so the download interop library can't unload
        // until I'm done with it
        if (interop.isInteropLoaded("downloader") === true) {
            this.dummyObj = createHttpRequest();
        } else {
            this.shutdown = true;
        }
    };

    Analytics.prototype.onCheckShutdown = function() {
        if (this.shutdown === false)
            return;

        if (this.queue.length === 0) {
            if (!isNull(this.dummyObj)) {
                this.dummyObj.release();
                this.dummyObj = null;
            }
        }
    };

    Analytics.prototype.onLoadGeoIP = function(token) {
        var self = this;
        this.xhr = $.getJSON("http://geoip.snxd.com/geoip/json/", function(data) {
            self.xhr = null;
            window.geoIP = {};
            mergeObjectProperties(window.geoIP, data, false);
            self.onSendRequest();
        }).error(function() {
            self.xhr = null;
            window.geoIP = {};
            app.debugPrint("Failed to return geo ip information\n");
            self.onSendRequest();
        });
    };

    Analytics.prototype.onSendRequest = function() {
        if (this.queue.length === 0 || this.xhr !== null) {
            this.onCheckShutdown();
            return;
        }

        if (isNull(window.geoIP)) {
            this.onLoadGeoIP();
            return;
        }

        var url = this.queue.shift(), self = this;

        this.xhr = $.get(url, function() {
            self.xhr = null;
            self.onSendRequest();
        }).error(function() {
            // Disable analytics due to error
            self.queue = [];
            self.shutdown = true;
            app.debugPrint("Unable to send mix panel analytics\n");
            self.xhr = null;
            self.onSendRequest();
        });
    };

    Analytics.prototype.trackUserInfo = function(args) {
        if (this.token.length <= 0) {
            return;
        }

        if (this.shutdown === true) {
            app.debugPrint("Skipping analytics event because of shutdown\n");
            return;
        }

        var user = {}, ip = "1", userArgs = {};

        mergeObjectProperties(userArgs, args, false);

        user.$distinct_id = this.machineId;
        user.$token = app.expandString(this.token);
        user.$set = {};

        if (hasOwnProperty(userArgs, "email")) {
            user.$set.$email = userArgs.email;
            delete userArgs["email"];
        }

        if (hasOwnProperty(userArgs, "firstName")) {
            user.$set.$first_name = userArgs.firstName;
            delete userArgs["firstName"];
        }

        if (hasOwnProperty(userArgs, "lastName")) {
            user.$set.$last_name = userArgs.lastName;
            delete userArgs["lastName"];
        }

        if (hasOwnProperty(userArgs, "created")) {
            user.$set.$created = userArgs.created;
            delete userArgs["created"];
        }

        if (hasOwnProperty(userArgs, "lastLogin")) {
            user.$set.$last_login = userArgs.lastLogin;
            delete userArgs["lastLogin"];
        }

        mergeObjectProperties(user.$set, userArgs);

        if (!isNull(window.geoIP)) {
            mergeObjectProperties(user.$set, window.geoIP, true);
        }

        this.queue.push("http://{0}/engage/?data={1}".format(window.analytics.hostname, app.base64Encode(JSON.stringify(user))));
        this.onSendRequest();
    };

    Analytics.prototype.trackEvent = function(args) {
        if (this.token.length <= 0) {
            return;
        }

        host.assert(!isNull(args.event), "Analytics ReportEvent missing event");

        if (this.shutdown === true) {
            app.debugPrint("Skipping analytics ({0}) event because of shutdown\n".format(args.event));
            return;
        }

        var event = {}, ip = "1";
        event.event = args.event;
        event.distinct_id = this.machineId;
        event.properties = {};
        event.properties.token = app.expandString(this.token);
        event.properties.time = new Date().getTime();

        if (!isNull(this.nameTag)) {
            event.properties.mp_name_tag = this.nameTag;
        }

        getObjectProperties(args).forEach(function(name) {
            if (name.toLowerCase() !== "event") {
                event.properties[name] = args[name];
            }
        });

        if (!isNull(window.geoIP)) {
            mergeObjectProperties(event.properties, window.geoIP, true);
        }

        if (hasOwnProperty(event.properties, "ip")) {
            ip = "0";
        }

        if (this.debug === true) {
            app.debugPrint("Sending analytics event ({0})\n".format(event.event));
        }

        this.queue.push("http://{0}/track/?data={1}&ip={2}".format(window.analytics.hostname, app.base64Encode(JSON.stringify(event)), ip));
        this.onSendRequest();
    };

    Analytics.prototype.onReportEvent = function(sender, info) {
        this.trackEvent(info);
    };

    window.analytics = new Analytics();

    notificationCenter.addObserver("Workflow", "DidLoad", function(sender, info) {
        window.analytics.onStartup();
    });

    notificationCenter.addObserver("Workflow", "WillUnload", function(sender, info) {
        // Do this on the next tick in case any analytics events hook WillUnload
        setTimeout(function() {
            window.analytics.shutdown = true;
            window.analytics.onCheckShutdown();
        }, 0);
    });

    notificationCenter.addObserver("NotificationCheckpoint", "ReportEvent", function(sender, info) {
        window.analytics.onReportEvent(sender, info);
    });
} ());


function AnalyticsController(task, args) {
    var self = this;

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

AnalyticsController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

AnalyticsController.prototype.onStart = function(task, info) {
    var self = this;

    task.assertArgument("hostname");
    task.assertArgument("token");
    task.assertArgument("checkpointPath");

    window.analytics.setToken(app.expandString(task.args.token));
    window.analytics.setHostname(app.expandString(task.args.hostname));
    if (hasOwnProperty(task.args, "debug") && task.args.debug === true) {
        window.analytics.setDebug(true);
    }

    loadNotificationCheckpoints(task.args.checkpointPath, function() {
        task.complete();
    });
};

registerTaskController("loadAnalytics", AnalyticsController);


