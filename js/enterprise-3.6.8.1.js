/**
 * @preserve Modifications performed to this file by anyone other than Solid State Networks
 * are unsupported and may void your software warranty.
 */
$(document).ready(function() {
    host.assert(app.expandString("{AppVersion}") === "3.6.8.1", "Invalid application version");
});

function BrandingController(task, args) {
    var self = this;

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

BrandingController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

};

BrandingController.prototype.onStart = function(task, info) {
    var name, value, metafileData, chunkStart = 0, chunkSize = 8000, self = this;
};

registerTaskController("branding", BrandingController);

function BrandingView(task, args) {
    var self = this;

    this.controller = task.controller;
	this.logoElement = $(".logoElement");
    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

BrandingView.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.controller)) {
        this.controller.release();
        this.controller = null;
    }
};

BrandingView.prototype.onStart = function(task, info) {
    notificationCenter.fire("BrandingView", "Bind", task, this);

    if (hasOwnProperty(task.args, "logoUrl")) {
	this.logoElement.attr("src", task.args.logoUrl);
    }
    else {
        this.logoElement.attr("src", "/images/bgheader.png");
    }
};

registerTaskView("branding", BrandingView);

function ModsController(task, args) {
    var self = this;

    this.redirectTask = deepCopy(task);
    this.redirectTask.args.beginsWith = task.args.url;
    this.redirectTask.complete = function() {};

    this.observers = [];

    this.redirectController = new UrlRedirectController(this.redirectTask, args);
    this.aggregateController = new AggregateController(task, args);


    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

ModsController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.aggregateController)) {
        this.aggregateController.release();
        this.aggregateController = null;
    }

    if (!isNull(this.redirectController)) {
        this.redirectController.release();
        this.redirectController = null;
    }

    this.redirectTask = null;
};

ModsController.prototype.onStart = function(task, info) {
    var self = this;
    var modsUrl = "http://mods.snxd.com/GetMetafile.aspx?contenturl={0}&contentargs={1}&contentgroupid={2}&workflowresponse=true";

	//debugger;
    task.assertArgument("url");
    task.assertArgument("groupid");

    //beginsWith is added to support the urlredirectcontroller which is necessary for token auth
    task.args.beginsWith = task.args.url;
    
    if(typeof task.args.append == "undefined" || task.args.append == null) {
        taskargs.append = "";
    }
    task.args.url = modsUrl.format(task.args.url, task.args.append, task.args.groupid);

    if(!isNull(task.args.title)) {
        task.args.url = "{0}&contentname={1}".format(task.args.url, task.args.title);
    }
	

	//this.redirectController.onStart(task, info);
	//this.aggregateController.onStart(task, info);
};

registerTaskController("mods", ModsController);


