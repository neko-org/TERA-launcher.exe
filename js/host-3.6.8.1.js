/**
 * @preserve Modifications performed to this file by anyone other than Solid State Networks
 * are unsupported and may void your software warranty.
 */
$(document).ready(function() {
    host.assert(app.expandString("{AppVersion}") === "3.6.8.1", "Invalid application version");
});

/*!
* \file jshelper.js
* \brief File containing general javascript extensions
*/

/*!
* \class Array
* \brief Array extension
* \docgen function Array() {}
*/
if (!Array.prototype.indexOf) {
    /*!
    * gets the index of an object
    * \tparam object elt object to get the array index of
    * \tparam object from optional starting point
    * @treturn int index of object in array
    */
    Array.prototype.indexOf = function(elt /*, from */) {
        var len, from;

        len = this.length;
        from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }

        while (from < len) {
            if (hasOwnProperty(this, from) && this[from] === elt) {
                return from;
            }
            
            from += 1;
        }
        return -1;
    };
}

if (!Array.prototype.removeIndex) {
    /*!
    * removes an object at the given index
    * \tparam int index index of object
    */
    Array.prototype.removeIndex = function(index) {
        this.splice(index, 1);
    };
}

if (!Array.prototype.removeElement) {
    /*!
    * removes an object
    * \tparam object element object to remove
    */
    Array.prototype.removeElement = function(element) {
        var idx;

        idx = this.indexOf(element);
        if (idx >= 0) {
            this.splice(idx, 1);
            return true;
        }

        return false;
    };
}

if (!Array.prototype.getUnique) {
    /*!
    * gets unique elements in array
    * @treturn array
    */
    Array.prototype.getUnique = function() {
        var used = {}, uniques = [], i = 0, l;

        for (l = this.length; i < l; i += 1) {
            if (hasOwnProperty(used, this[i])) {
                continue;
            }

            uniques.push(this[i]);
            used[this[i]] = 1;
        }
        return uniques;
    };
}

if (!Array.prototype.forEach) {
    /*!
    * array enumerator
    * \tparam function block function to call during each object
    * \tparam object context block context
    */
    Array.prototype.forEach = function(block, context) {
        var i, len;
        
        i = 0;
        len = this.length;

        while (i < len) {
            block.call(context, this[i], i, this);
            i += 1;
        }
    };
    // Backwards compatibility
    Array.forEach = function(o,b,c) { o.forEach(b, c); };
}

if (!Array.prototype.forEachReverse) {
    /*!
    * array enumerator
    * \tparam function block function to call during each object
    * \tparam object context block context
    */
    Array.prototype.forEachReverse = function(block, context) {
        var i;

        i = this.length - 1;

        while (i >= 0) {
            block.call(context, this[i], i, this);
            i -= 1;
        }
    };
    // Backwards compatibility
    Array.forEachReverse = function(o,b,c) { o.forEachReverse(b, c); };
}

/*!
* \class String
* \brief String extension
* \docgen function String() {}
*/
if (!String.prototype.replaceAll) {
    /*!
    * replaces all instances of one string with another
    * \tparam string oldString string to find
    * \tparam string newString string to replace
    */
    String.prototype.replaceAll = function(oldString, newString) {
        return this.split(oldString).join(newString);
    };
}

if (!String.prototype.toBoolean) {
    /*!
    * converts string to boolean
    */
    String.prototype.toBoolean = function() {
        return ((this.toLowerCase() === "true") || (this.toLowerCase() === "1"));
    };
}

if (!String.prototype.trimChars) {
    /*!
    * trims specified chars off the ends
    * \tparam string chars string of characters to trim
    */
    String.prototype.trimChars = function(chars) {
        var i = 0, j = 0;
        for (i = 0; i < this.length; i += 1) {
            if (chars.indexOf(this.charAt(i)) === -1) {
                break;
            }
        }
        for (j = this.length - 1; j >= i; j -= 1) {
            if (chars.indexOf(this.charAt(j)) === -1) {
                j += 1;
                break;
            }
        }
        return this.substring(i, j);
    };
}

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/\{(\d+)\}/g, function(match, number) {
            return hasOwnProperty(args, number) ? args[number] : match;
        });
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

if (!String.prototype.beginsWith) {
    String.prototype.beginsWith = function(prefix) {
        return this.indexOf(prefix) === 0;
    };
}

/* NOTE: We do not extend Object.prototype because it breaks the object-as-hashtables feature of Javascript */

/*!
* checks if the object is null or undefined
* \tparam object obj object to check
* \treturn bool true if null, undefined or blank jquery selector, false otherwise
*/
function isNull(obj) {
    if (obj instanceof jQuery && obj.length === 0) {
        return true;
    }
    return (typeof obj === "undefined") || obj === null;
}

/*!
* checks if a bit value is on
* \tparam int x object to check
* \tparam int y bit to check
* \treturn bool true if on, false otherwise
*/
function thisIs(x, y) {
    return (((x) & (y)) != 0);
}

/*!
* checks if a bit value is off
* \tparam int x object to check
* \tparam int y bit to check
* \treturn bool true if on, false otherwise
*/
function thisIsNot(x, y) {
    return (((x) & (y)) == 0);
}

/*!
* safe hasOwnProperty check
* \tparam object obj object to check
* \tparam string prop property name
* \treturn object property object
*/
function hasOwnProperty(obj, prop) {
    var i;

    if (getObjectType(prop) == "array") {
        for (i = 0; i < prop.length; i += 1) {
            if (!hasOwnProperty(obj, prop[i])) {
                return false;
            }
        }

        return true;
    }

    if (!isNull(obj.hasOwnProperty)) {
        return obj.hasOwnProperty(prop);
    }

    return Object.prototype.hasOwnProperty.call(obj, prop);
}

/*!
* prepare a deep copy of an object
* \tparam object obj object to copy
* \treturn object copied object
*/
function deepCopy(obj) {
    var out, i, len;
    
    switch (getObjectType(obj)) {
        case "object":
            out = {};

            for (i in obj) {
                if (hasOwnProperty(obj, i)) {
                    out[i] = deepCopy(obj[i]);
                }
            }
            return out;
            
        case "array":
            out = [];
            len = obj.length;
            
            for (i = 0; i < len; i += 1) {
                out[i] = deepCopy(obj[i]);
            }
            return out;
    }
    
    return obj;
}

/*!
* merges the properties of two javascript objects
* \tparam object target object to merge the properties to
* \tparam object src object to merge the properties from
* \tparam bool allowOverwrite overwrite existing items in list (false by default)
* \tparam bool allowAssert assert if overwrite detected when allowOverwrite is false
*/
function mergeObjectProperties(target, src, allowOverWrite, allowAssert) {
    var i, len, tmpObj;

    if (isNull(allowOverWrite)) {
        allowOverWrite = false;
    }

    if (isNull(allowAssert)) {
        allowAssert = true;
    }

    if (isNull(src)) {
        return target;
    }
    
    switch (getObjectType(src)) {
        case "object":
            for (i in src) {
                if (!hasOwnProperty(target, i)) {
                    target[i] = deepCopy(src[i]);
                } else {
                    target[i] = mergeObjectProperties(target[i], src[i], allowOverWrite, allowAssert);
                } 
            }
            break;

        case "array":
            len = src.length;

            for (i = 0; i < len; i += 1) {
                tmpObj = {};
                target.push(mergeObjectProperties(tmpObj, src[i], allowOverWrite, allowAssert));
            }
            break;

        default:
            if (allowAssert === true) {
                host.assert(allowOverWrite === true, "mergeObjectProperties failed to overwrite ({0}:{1})".format(target, src));
            }
            
            if (allowOverWrite === true) {
                target = src;
            }
            break;
    }
    
    return target;
}

/*!
* build an array of property keys from an object
* \tparam object obj object to get the properties from
* \treturn list array of property keys
*/
function getObjectProperties(obj) {
    var key, keys;

    keys = [];
    for (key in obj) {
        if (hasOwnProperty(obj, key)) {
            keys.push(key);
        }
    }
    return keys;
}

/*!
* save an object to a file
* \tparam object obj object to save
* \tparam string fileName location for save
* @treturn bool true if the object is saved or false otherwise
*/
function saveObjectToFile(obj, fileName) {
    var isOk, jsonString, textFileWriter, current, maxChunk, len, writeString, bytesWritten;

    jsonString = JSON.stringify(obj);

    maxChunk = 2048;
    len = jsonString.length;
    current = 0;

    textFileWriter = createTextFileWriter();

    isOk = false;

    if (textFileWriter.open(fileName) === true) {
        isOk = true;
        while (isOk === true && current < len) {
            writeString = jsonString.substr(current, maxChunk);
            bytesWritten = textFileWriter.write(writeString);
            if (bytesWritten <= 0) {
                isOk = false;
                break;
            }
            current += bytesWritten;
        }
        textFileWriter.close();
    }

    textFileWriter.release();
    return isOk;
}

/*!
* load object from a file
* \tparam string fileName location for load
* \tparam event onLoadComplete function called when load completed
*/
function loadObjectFromFile(fileName, onLoadComplete) {
    var jsonString, textFileReader, obj, observerRead, observerComplete;

    if (window.platform.fileExists(fileName) === false) {
        if (onLoadComplete !== null) {
            onLoadComplete({ "loadedObject": null });
        }
        return;
    }

    textFileReader = createTextFileReader();
    textFileReader.setFileName(fileName);
    
    jsonString = "";
    observerRead = notificationCenter.addInstanceObserver("TextFileReader", "Read", textFileReader, function(sender, info) {
        jsonString += info.text;
    });

    observerComplete = notificationCenter.addInstanceObserver("TextFileReader", "Complete", textFileReader, function(sender, info) {
        obj = null;

        observerRead.release();
        observerComplete.release();

        if (info.successful === true) {
            obj = interop.parseJSON(jsonString);
        }

        if (onLoadComplete !== null) {
            onLoadComplete({ "loadedObject": obj });
        }

        obj = null;
        sender.release();
    });

    textFileReader.start();
}

/*!
* gets the type from an object
* \treturn string type of object
*/
function getObjectType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

function whileInterval(proc, loopCount, delayBetween) {
    var timerID, i;
    timerID = setInterval(function() {
        i = 0;
        while (i < loopCount) {
            if (!proc()) {
                clearInterval(timerID);
                break;
            }
            i += 1;
        }
    }, delayBetween);

    return timerID;
}


var NativeInterop;
if (!NativeInterop) {
    NativeInterop = document.NativeInterop;
}

(function() {
    function Interop() {
        this.activeInteropLibs = [];
        this.instanceArray = [];
    }

    Interop.prototype =
    {
        parseJSON: function(content) {
            try {
                if (isNull(content) || content.length === 0) {
                    return null;
                }

                return JSON.parse(content);
            } catch (err) {
                if (!isNull(window.host)) {
                    host.assert(false, "Failed to parse json: {0}".format(err.message));
                }
                return null;
            }
        },

        isInteropLoaded: function(name) {
            return this.activeInteropLibs.indexOf(name) >= 0;
        },

        createInstance: function(typeName, TypeCreator) {
            try {
                var instance = null, instanceId = NativeInterop.createInstance(typeName);
                if (!isNull(instanceId)) {
                    instance = new TypeCreator(instanceId);
                    this.instanceArray[instanceId] = instance;
                } else {
                    host.assert(false, "Failed to create instance ({0})".format(typeName));
                }
                return instance;
            } catch (err) {
                if (!isNull(window.host)) {
                    host.assert(false, "Failed to create instance ({0})".format(typeName));
                }
                return null;
            }
        },

        hasInstance: function(instanceId) {
            return NativeInterop.hasInstance(instanceId);
        },

        releaseInstance: function(instanceId) {
            NativeInterop.releaseInstance(instanceId);
            delete this.instanceArray[instanceId];
        },

        instanceById: function(instanceId) {
            return this.instanceArray[instanceId];
        },

        invoke: function(instanceId, methodBinding) {
            try {
                var retVal = null, retObj = interop.parseJSON(NativeInterop.invoke(instanceId, JSON.stringify(methodBinding)));
                if (!isNull(retObj)) {
                    if (hasOwnProperty(methodBinding, "inOutParams") && hasOwnProperty(retObj, "inOutParams")) {
                        mergeObjectProperties(methodBinding.inOutParams, retObj.inOutParams, true);
                    }
                    if (hasOwnProperty(retObj, "returnValue")) {
                        retVal = retObj.returnValue;
                    }
                    retObj = null;
                } else {
                    host.assert(false, "Unable to invoke method ({0}) ({1})".format(instanceId, JSON.stringify(methodBinding)));
                }
                return retVal;
            } catch (err) {
                if (!isNull(window.host)) {
                    host.assert(false, "Unhandled exception attempting to invoke: {0}".format(err.message));
                }
                return null;
            }
        }
    };

    window.interop = new Interop();
} ());

function DispatchInteropCallback(instanceId, callbackInfo) {
    var callback = interop.parseJSON(callbackInfo), obj = interop.instanceById(instanceId);

    if (!isNull(obj)) {
        notificationCenter.fire(callback.typename, callback.method, obj, callback);
    }

    return JSON.stringify(callback);
}

(function() {
        function NotificationCenter() {
        this.notificationObservers = {};
        this.instanceId = "Global";
    }

    NotificationCenter.prototype.ensureCreated = function(typename, notification, instanceName) {
        var typenameNode, notificationNode, instanceNode;

        if (hasOwnProperty(this.notificationObservers, typename) === false) {
            typenameNode = {};
            this.notificationObservers[typename] = typenameNode;
        } else {
            typenameNode = this.notificationObservers[typename];
        }

        if (hasOwnProperty(typenameNode, notification) === false) {
            notificationNode = {};
            typenameNode[notification] = notificationNode;
        } else {
            notificationNode = typenameNode[notification];
        }

        if (hasOwnProperty(notificationNode, instanceName) === false) {
            instanceNode = [];
            notificationNode[instanceName] = instanceNode;
        } else {
            instanceNode = notificationNode[instanceName];
        }

        return instanceNode;
    };

    NotificationCenter.prototype.addObserver = function(typename, notification, func) {
        return this.addInstanceObserver(typename, notification, this, func);
    };

    NotificationCenter.prototype.addInstanceObserver = function(typename, notification, instance, func) {
        if (hasOwnProperty(instance, "instanceId") === false) {
            host.assert(false, "NotificationCenter requires instance to have unique instanceId");
            return { release: function() { return; } };
        }

        this.ensureCreated(typename, notification, instance.instanceId).push(func);

        return { release: function() { notificationCenter.removeInstanceObserver(typename, notification, instance, func); } };
    };

    NotificationCenter.prototype.removeInstanceObserver = function(typename, notification, instance, func) {
        if (this.ensureCreated(typename, notification, instance.instanceId).removeElement(func) === false) {
            if (instance === this) {
                host.assert(false, "NotificationCenter unable to remove global observer {0} {1}".format(typename, notification));
            } else {
                host.assert(false, "NotificationCenter unable to remove instance observer {0} {1} {2}".format(typename, notification, instance.instanceId));
            }
        }

        if (this.notificationObservers[typename][notification][instance.instanceId].length === 0) {
            delete this.notificationObservers[typename][notification][instance.instanceId];
        }
    };

    NotificationCenter.prototype.fireAfterDelay = function(typename, notification, delay, sender, info) {
        setTimeout(function() {
            notificationCenter.fire(typename, notification, sender, info);
        }, delay);
    };

    NotificationCenter.prototype.fire = function(typename, notification, sender, info) {
        //console.log(typename, notification);
        if (hasOwnProperty(this.notificationObservers, typename) === false) {
            return;
        }

        if (hasOwnProperty(this.notificationObservers[typename], notification) === false) {
            return;
        }

        if (hasOwnProperty(sender, "instanceId") === false) {
            host.assert(false, "NotificationCenter requires sender to have unique instanceId");
            return;
        }

        if (hasOwnProperty(this.notificationObservers[typename][notification], sender.instanceId) === true) {
            // Fire in reverse so I can remove elements in their own callbacks
            this.notificationObservers[typename][notification][sender.instanceId].forEachReverse(function(handler) {
                if (!isNull(handler)) {
                    try {
                        handler(sender, info);
                    } catch (err) {
                        host.assert(false, "Notification center caught unhandled exception: {0}".format(err.message));
                    }
                }
            });
        }

        if (hasOwnProperty(this.notificationObservers[typename][notification], this.instanceId) === true) {
            // Fire in reverse so I can remove elements in their own callbacks
            this.notificationObservers[typename][notification][this.instanceId].forEachReverse(function(handler) {
                if (!isNull(handler)) {
                    try {
                        handler(sender, info);
                    } catch (err) {
                        host.assert(false, "Notification center caught unhandled exception: {0}".format(err.message));
                    }
                }
            });
        }
    };

    window.notificationCenter = new NotificationCenter();
} ());

/*!
* \file App.js
* \brief File containing App class and creation function
*/

/*!
* \class App
* \brief Solid State's Application Interface
*/



(function() {
var unloadObs;


function App(instanceId)
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
App.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the current security status
* \type bool
* \returns current security status
*/
App.prototype.getSecurityEnabled = function(){
   return interop.invoke(this.instanceId, {
      "method":"getSecurityEnabled"
   });
};

/*!
* gets the filename for debug file
* \type string
* \returns filename for debug file
*/
App.prototype.getDebugFilename = function(){
   return interop.invoke(this.instanceId, {
      "method":"getDebugFilename"
   });
};

/*!
* gets the debug logging flags
* \type int
* \returns debug logging flags
*/
App.prototype.getDebugFlags = function(){
   return interop.invoke(this.instanceId, {
      "method":"getDebugFlags"
   });
};

/*!
* gets the number of days to keep logs (0 to disable)
* \type int
* \returns number of days to keep logs (0 to disable)
*/
App.prototype.getLogExpirationDays = function(){
   return interop.invoke(this.instanceId, {
      "method":"getLogExpirationDays"
   });
};

/*!
* sets the number of days to keep logs (0 to disable)
* \tparam int(in) value number of days to keep logs (0 to disable)
*/
App.prototype.setLogExpirationDays = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setLogExpirationDays", 
      "value":value
   });
};

/*!
* gets the exit code for the application
* \type int
* \returns exit code for the application
*/
App.prototype.getExitCode = function(){
   return interop.invoke(this.instanceId, {
      "method":"getExitCode"
   });
};

/*!
* sets the exit code for the application
* \tparam int(in) value exit code for the application
*/
App.prototype.setExitCode = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setExitCode", 
      "value":value
   });
};

/*!
* gets the time the application was started
* \type double
* \returns time the application was started
*/
App.prototype.getStartTime = function(){
   return interop.invoke(this.instanceId, {
      "method":"getStartTime"
   });
};

/*!
* gets the current time in seconds.milliseconds
* \type double
* \returns current time in seconds.milliseconds
*/
App.prototype.getCurrentTime = function(){
   return interop.invoke(this.instanceId, {
      "method":"getCurrentTime"
   });
};

/*!
* gets the running time in seconds.milliseconds
* \type double
* \returns running time in seconds.milliseconds
*/
App.prototype.getRunningTime = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRunningTime"
   });
};

/*!
* gets the current elevation status
* \type bool
* \returns current elevation status
*/
App.prototype.getElevated = function(){
   return interop.invoke(this.instanceId, {
      "method":"getElevated"
   });
};

/*!
* gets the flag value to remove the local storage directory on shutdown
* \type bool
* \returns flag value to remove the local storage directory on shutdown
*/
App.prototype.getRemoveLocalStorage = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRemoveLocalStorage"
   });
};

/*!
* sets the flag value to remove the local storage directory on shutdown
* \tparam bool(in) value flag value to remove the local storage directory on shutdown
*/
App.prototype.setRemoveLocalStorage = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setRemoveLocalStorage", 
      "value":value
   });
};

/*!
* gets the set the application language
* \type string
* \returns set the application language
*/
App.prototype.getLanguage = function(){
   return interop.invoke(this.instanceId, {
      "method":"getLanguage"
   });
};

/*!
* sets the set the application language
* \tparam string(in) value set the application language
*/
App.prototype.setLanguage = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setLanguage", 
      "value":value
   });
};

/*!
* gets the set the application country
* \type string
* \returns set the application country
*/
App.prototype.getCountry = function(){
   return interop.invoke(this.instanceId, {
      "method":"getCountry"
   });
};

/*!
* sets the set the application country
* \tparam string(in) value set the application country
*/
App.prototype.setCountry = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setCountry", 
      "value":value
   });
};

/*!
* gets the flag value to restart the host
* \type bool
* \returns flag value to restart the host
*/
App.prototype.getRestart = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRestart"
   });
};

/*!
* sets the flag value to restart the host
* \tparam bool(in) value flag value to restart the host
*/
App.prototype.setRestart = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setRestart", 
      "value":value
   });
};

/*!
* gets the flag value to elevate the restart
* \type bool
* \returns flag value to elevate the restart
*/
App.prototype.getRestartElevated = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRestartElevated"
   });
};

/*!
* sets the flag value to elevate the restart
* \tparam bool(in) value flag value to elevate the restart
*/
App.prototype.setRestartElevated = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setRestartElevated", 
      "value":value
   });
};

/*!
* gets the application command line
* \type string
* \returns application command line
*/
App.prototype.getCommandLine = function(){
   return interop.invoke(this.instanceId, {
      "method":"getCommandLine"
   });
};

/*!
* sets the application command line
* \tparam string(in) value application command line
*/
App.prototype.setCommandLine = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setCommandLine", 
      "value":value
   });
};

/*!
* This method expands implodes the executable
*/
App.prototype.implode = function(){
   return interop.invoke(this.instanceId, {
      "method":"implode"
   });
};

/*!
* Sets logging flag and command line
* \tparam string(in) filename filename for log file
* \tparam int(in) flags debug flags
*/
App.prototype.setDebugLogging = function(filename,flags){
   return interop.invoke(this.instanceId, {
      "method":"setDebugLogging", 
      "filename":filename, 
      "flags":flags
   });
};

/*!
* Checks is a command field is set on the command line
* \tparam string(in) commandField command field to check
* \type bool
* \returns true if the commandField is set, false otherwise
*/
App.prototype.isCommandFieldSet = function(commandField){
   return interop.invoke(this.instanceId, {
      "method":"isCommandFieldSet", 
      "commandField":commandField
   });
};

/*!
* Get value corresponding to command field on the command line
* \tparam string(in) commandField command field to check
* \type string
* \returns value for the command field in the command line
*/
App.prototype.getCommandFieldByName = function(commandField){
   return interop.invoke(this.instanceId, {
      "method":"getCommandFieldByName", 
      "commandField":commandField
   });
};

/*!
* Get value corresponding to command field on the command line
* \tparam string(in) commandField command field to check
* \type string
* \returns value for the command field in the command line
*/
App.prototype.getCommandFieldByName = function(commandField){
   return interop.invoke(this.instanceId, {
      "method":"getCommandFieldByName", 
      "commandField":commandField
   });
};

/*!
* Get modified timestamp of a string file
* \tparam string(in) filename filename contained in skin file
* \type double
* \returns Encoded timestamp
*/
App.prototype.getSkinFileModifiedEncoded = function(filename){
   return interop.invoke(this.instanceId, {
      "method":"getSkinFileModifiedEncoded", 
      "filename":filename
   });
};

/*!
* This method converts a utf8 string to base64
* \tparam string(in) utf8String String to be encoded
* \type string
* \returns encoded string
*/
App.prototype.base64Encode = function(utf8String){
   return interop.invoke(this.instanceId, {
      "method":"base64Encode", 
      "utf8String":utf8String
   });
};

/*!
* This method converts a base64 string to utf8
* \tparam string(in) encoded String to be decoded
* \type string
* \returns utf8 string
*/
App.prototype.base64Decode = function(encoded){
    return interop.invoke(this.instanceId, {
      "method":"base64Decode", 
      "encoded":encoded
   });
};

/*!
* This method expands the string with the current macros
* \tparam string(in) expand String to be expanded
* \type string
* \returns expanded string
*/
App.prototype.expandString = function(expand){
   return interop.invoke(this.instanceId, {
      "method":"expandString", 
      "expand":expand
   });
};

/*!
* This method converts a UTF-8 string into an HTML entitized string
* \tparam string(in) utf8string UTF-8 string to be entitized
* \type string
* \returns entitized string
*/
App.prototype.convertToEntitizedString = function(utf8string){
   return interop.invoke(this.instanceId, {
      "method":"convertToEntitizedString", 
      "utf8string":utf8string
   });
};

/*!
* This method converts an HTML entitized string into an UTF-8 string
* \tparam string(in) entitizedString Entitized string to be converted to UTF-8
* \type string
* \returns utf8 string
*/
App.prototype.convertFromEntitizedString = function(entitizedString){
   return interop.invoke(this.instanceId, {
      "method":"convertFromEntitizedString", 
      "entitizedString":entitizedString
   });
};

/*!
* This method retrieves a config setting
* \tparam string(in) key Name of config setting to be retrieved
* \tparam string(in) defaultValue Default value of key if nothing is found
* \type string
* \returns value of key's setting
*/
App.prototype.getConfig = function(key,defaultValue){
   return interop.invoke(this.instanceId, {
      "method":"getConfig", 
      "key":key, 
      "defaultValue":defaultValue
   });
};

/*!
* This method retrieves a credential
* \tparam string(in) target Target of credential
* \tparam string(inout) username Username for the credential
* \tparam string(inout) password Password for the credential
* \type bool
* \returns true if credential exists, false otherwise
*/
App.prototype.getCredential = function(target,inOutParams){
   return interop.invoke(this.instanceId, {
      "method":"getCredential", 
      "target":target, 
      "inOutParams":inOutParams
   });
};

/*!
* This method sets a credential
* \tparam string(in) target Target for the credential
* \tparam string(in) username Username for the credential
* \tparam string(in) password Password for the credential
*/
App.prototype.setCredential = function(target,username,password){
   return interop.invoke(this.instanceId, {
      "method":"setCredential", 
      "target":target, 
      "username":username, 
      "password":password
   });
};

/*!
* This method removes a credential
* \tparam string(in) target Target of credential
*/
App.prototype.removeCredential = function(target){
   return interop.invoke(this.instanceId, {
      "method":"removeCredential", 
      "target":target
   });
};

/*!
* This method retrieves a credential
* \tparam int(in) type Type of credential
* \tparam string(in) host Host for the credential
* \tparam string(in) realm Realm for the credential
* \tparam string(inout) username Username for the credential
* \tparam string(inout) password Password for the credential
* \type bool
* \returns true if credential exists, false otherwise
*/
App.prototype.getWebCredential = function(type,host,realm,inOutParams){
   return interop.invoke(this.instanceId, {
      "method":"getWebCredential", 
      "type":type, 
      "host":host, 
      "realm":realm, 
      "inOutParams":inOutParams
   });
};

/*!
* This method sets a credential
* \tparam int(in) type Type of credential
* \tparam string(in) host Host for the credential
* \tparam string(in) realm Realm for the credential
* \tparam string(in) username Username for the credential
* \tparam string(in) password Password for the credential
*/
App.prototype.setWebCredential = function(type,host,realm,username,password){
   return interop.invoke(this.instanceId, {
      "method":"setWebCredential", 
      "type":type, 
      "host":host, 
      "realm":realm, 
      "username":username, 
      "password":password
   });
};

/*!
* This method removes a credential
* \tparam int(in) type Type of credential
* \tparam string(in) host Host for the credential
* \tparam string(in) realm Realm for the credential
*/
App.prototype.removeWebCredential = function(type,host,realm){
   return interop.invoke(this.instanceId, {
      "method":"removeWebCredential", 
      "type":type, 
      "host":host, 
      "realm":realm
   });
};

/*!
* This method checks if a url is in the app config whitelist
* \tparam string(in) url Url to be checked
* \type bool
* \returns true if authorized, false otherwise
*/
App.prototype.authorizeUrl = function(url){
   return interop.invoke(this.instanceId, {
      "method":"authorizeUrl", 
      "url":url
   });
};

/*!
* This method loads an interop library
* \tparam string(in) fileName Name of interop library to be loaded
*/
App.prototype.loadInterop = function(fileName){
   return interop.invoke(this.instanceId, {
      "method":"loadInterop", 
      "fileName":fileName
   });
};

/*!
* This method unloads an interop library
* \tparam string(in) fileName Name of interop library to be unloaded
* \type bool
* \returns TRUE if the library was found, FALSE otherwise
*/
App.prototype.unloadInterop = function(fileName){
   return interop.invoke(this.instanceId, {
      "method":"unloadInterop", 
      "fileName":fileName
   });
};

/*!
* Adds a line to the host log file
* \tparam string(in) message string to add to the log file
*/
App.prototype.debugPrint = function(message){
   return interop.invoke(this.instanceId, {
      "method":"debugPrint", 
      "message":message
   });
};

/*!
* Send notification via special remoting interface
* \tparam string(in) notification String to pass to remoting interface
*/
App.prototype.remoteNotify = function(notification){
   return interop.invoke(this.instanceId, {
      "method":"remoteNotify", 
      "notification":notification
   });
};

/*!
* Checks to see if the process is hooked remotely
* \type bool
* \returns TRUE if the process is hooked, FALSE otherwise
*/
App.prototype.remoteIsAttached = function(){
   return interop.invoke(this.instanceId, {
      "method":"remoteIsAttached"
   });
};

/*!
* Unhooks a remote process
*/
App.prototype.remoteDetach = function(){
   return interop.invoke(this.instanceId, {
      "method":"remoteDetach"
   });
};

/*!
* API Message to pass to api message callback
* \tparam string(in) message string pass to api user
*/
App.prototype.apiMessage = function(message){
   return interop.invoke(this.instanceId, {
      "method":"apiMessage", 
      "message":message
   });
};

/*!
* This method opens a new top level window
* \tparam string(in) windowConfigUrl URL to the window configuration file
* \type string
* \returns instance id of the window
*/
App.prototype.openWindow = function(windowConfigUrl){
   return interop.invoke(this.instanceId, {
      "method":"openWindow", 
      "windowConfigUrl":windowConfigUrl
   });
};

/*!
* This method adds a macro to the app macro table
* \tparam string(in) key Key for the macro
* \tparam string(in) value Value used for the macro
*/
App.prototype.addMacro = function(key,value){
   return interop.invoke(this.instanceId, {
      "method":"addMacro", 
      "key":key, 
      "value":value
   });
};

/*!
* This method closes all the application windows
*/
App.prototype.closeAll = function(){
   return interop.invoke(this.instanceId, {
      "method":"closeAll"
   });
};

/*!
* This method crashes the application
*/
App.prototype.crash = function(){
   return interop.invoke(this.instanceId, {
      "method":"crash"
   });
};


window.app = interop.createInstance("SSN.App", App);
unloadObs = notificationCenter.addObserver("Host", "DidUnload", function(sender, info) {
   unloadObs.release();
   window.app.release();
   window.app = null;
});

}());


function Tasks() {
    this.instanceId = app.expandString("{Guid}");
    this.tasks = {};
    this.activeTasks = [];
}

Tasks.prototype.cancelAll = function() {
    this.activeTasks.forEachReverse(function(task) {
        task.debugPrint("Cancelling\n");
        task.error("UI_UserAbort");
        task.complete();
    });
};

Tasks.prototype.exists = function(name) {
    return hasOwnProperty(this.tasks, name);
};

Tasks.prototype.add = function(name, task) {
    if (!hasOwnProperty(this.tasks, name)) {
        this.tasks[name] = task;
    } else {
        host.assert(false, "Task ({0}) already exists".format(name));
    }
};

Tasks.prototype.remove = function(name) {
    if (hasOwnProperty(this.tasks, name)) {
        delete this.tasks[name];
    } else {
        host.assert(false, "Task ({0}) does not exist".format(name));
    }
};

Tasks.prototype.loadFromObject = function(obj) {
    mergeObjectProperties(this.tasks, obj);
};

Tasks.prototype.load = function(path, completeCallback) {
    var self = this, jsonLoaded = function(content) {
        var successful = false;

        if (!isNull(content)) {
            mergeObjectProperties(self.tasks, content);

            successful = true;
        }

        if (!isNull(completeCallback)) {
            completeCallback({ "successful": successful });
        }
    };
    host.extractJSON(app.expandString(path), jsonLoaded);
};

Tasks.prototype.create = function(name, autoRelease, controllerCreator, viewCreator, args) {
    var notificationArgs = {}, task = {}, handler, self = this;

    if (!hasOwnProperty(this.tasks, name)) {
        return null;
    }

    this.activeTasks.push(task);

    task.errors = [];
    task.warnings = [];

    task.instanceId = app.expandString("{Guid}");
    task.start = function() {
        task.startTime = new Date().getTime();
        task.completeTime = null;
        task.args = Tasks.expandValue(task, task.args, task.args);
        notificationCenter.fireAfterDelay("Task", "Start", 0, task, {});
    };

    task.getStringArgument = function(name) {
        if (hasOwnProperty(task.args, name) === true) {
            if (getObjectType(task.args[name]) === "array") {
                return app.expandString(task.args[name].join(""));
            } else {
                return app.expandString(task.args[name]);
            }
        }
        return "";
    };

    task.debugPrint = function(str) {
        app.debugPrint("{0} ({1}) ({2}): {3}".format(task.name, task.args.type, task.instanceId.substring(0, 4), str));
    };

    task.assertArgument = function(name) {
        host.assert(hasOwnProperty(task.args, name), "{0} not defined for ({1}) in ({2})".format(name, task.args.type, task.name));
    };

    task.isComplete = function() {
        return !isNull(task.completeTime);
    };

    task.getRunningTime = function() {
        if (isNull(task.startTime)) {
            return 0;
        } else if (isNull(task.completeTime)) {
            return new Date().getTime() - task.startTime();
        }

        return task.completeTime - task.startTime;
    };

    task.getFirstWarningMessage = function() {
        if (task.warnings.length > 0) {
            return host.getLanguageString(task.warnings[0].message);
        }
        return null;
    };

    task.getLastWarningMessage = function() {
        if (task.warnings.length > 0) {
            return host.getLanguageString(task.warnings[task.warnings.length - 1].message);
        }
        return null;
    };

    task.hasWarning = function(warning) {
        var i = 0;
        if (isNull(warning)) {
            return this.warnings.length > 0;
        }
        for (i in this.warnings) {
            if (this.warnings[i].message == warning) {
                return true;
            }
        }
        return false;
    };

    task.clearWarnings = function() {
        this.warnings = [];
    };

    task.warning = function(msg) {
        task.warnings.push({ "source": task.name, "message": msg });
        notificationCenter.fire("Task", "Warning", task, { "message": msg });
    };

    task.getFirstErrorMessage = function() {
        if (task.errors.length > 0) {
            return host.getLanguageString(task.errors[0].message);
        }
        return null;
    };

    task.getLastErrorMessage = function() {
        if (task.errors.length > 0) {
            return host.getLanguageString(task.errors[task.errors.length - 1].message);
        }
        return null;
    };

    task.hasError = function(error) {
        var i = 0;
        if (isNull(error)) {
            return this.errors.length > 0;
        }
        for (i in this.errors) {
            if (this.errors[i].message == error) {
                return true;
            }
        }
        return false;
    };

    task.clearErrors = function() {
        this.errors = [];
    };

    task.error = function(msg) {
        if (hasOwnProperty(task.args, "ignoreError") && task.args.ignoreError === true) {
            task.debugPrint("Ignoring task error ({0})\n".format(msg));
            return;
        }
        task.errors.push({ "source": task.name, "message": msg });
        notificationCenter.fire("Task", "Error", task, { "message": msg });
    };

    task.find = function(type, start) {
        var current = this;
        if (!isNull(start)) {
            current = start;
        }
        while (!isNull(current)) {
            if ((current.controller instanceof type) ||
                (current.view instanceof type)) {
                return current;
            }
            current = current.parent;
        }
        return null;
    };

    task.findAncestor = function(type) {
        this.find(type, this.parent);
    };

    task.runSubAction = function(actionName, args, completeCallback) {
        if (hasOwnProperty(task.args, actionName)) {
            task.runSubTask(task.args[actionName], args, completeCallback);
        } else {
            setTimeout(function() { completeCallback(null, {}); }, 0);
        }
    };

    task.runSubTask = function(taskName, args, completeCallback) {
        var observer, runTask = null, taskMetaInfo;

        runTask = self.create(app.expandString(taskName), autoRelease, this.controllerCreator, this.viewCreator, args);
        if (!isNull(runTask)) {
            runTask.parent = task;
            notificationCenter.fire("Task", "SubTaskCreate", task, { "subTask": runTask });

            observer = notificationCenter.addInstanceObserver("Task", "Complete", runTask, function(sender, info) {
                notificationCenter.fire("Task", "SubTaskComplete", task, { "subTask": runTask, "args": info });
                observer.release();

                mergeObjectProperties(task.errors, runTask.errors);
                mergeObjectProperties(task.warnings, runTask.warnings);

                completeCallback(runTask, info);
            });

            runTask.start();
        } else {
            setTimeout(function() { completeCallback(runTask, {}); }, 0);
        }
    };

    task.complete = function(args) {
        var completeArgs = {}, actionName = "failure";

        if (task.isComplete() || task.isCompleting) {
            return;
        }

        task.isCompleting = true;

        if (!isNull(args)) {
            mergeObjectProperties(completeArgs, args);
        }

        if (task.hasError() === false) {
            actionName = "success";
        }

        this.runSubAction(actionName, null, function(childTask, childInfo) {
            task.runSubAction("complete", null, function(childTask, childInfo) {
                task.isCompleting = false;
                task.completeTime = new Date().getTime();
                notificationCenter.fire("Task", "Complete", task, completeArgs);
                self.activeTasks.removeElement(task);

                if (isNull(task.view) && !isNull(task.controller)) {
                    task.controller.release();
                    task.controlller = null;
                }

                if (!isNull(task.view) && autoRelease === true) {
                    task.view.release();
                    task.view = null;
                }
            });
        });
    };

    task.name = name;
    task.args = {};
    task.controllerCreator = controllerCreator;
    task.viewCreator = viewCreator;
    mergeObjectProperties(task.args, this.tasks[name]);
    if (!isNull(args)) {
        mergeObjectProperties(task.args, args);
    }

    notificationArgs = task.args;

    controllerCreator(task, notificationArgs);
    host.assert(hasOwnProperty(task, "controller"), "Task controller not found for " + notificationArgs.type);

    viewCreator(task, notificationArgs);

    notificationCenter.fire("Task", "Create", task, {});
    return task;
};

Tasks.getValue = function(sender, args, dataPath) {
    var current = null, firstNode = true, propertyName = null;

    dataPath.forEach(function(path) {
        if (isNull(current)) {
            if (firstNode === true) {
                firstNode = false;
                if (path.charAt(0) === "@") {
                    propertyName = path.substring(1, path.length);
                    switch (propertyName) {
                        case "this":
                            current = sender;
                            break;

                        case "args":
                            current = args;
                            break;

                        default:
                            if (!isNull(window[propertyName])) {
                                current = window[propertyName];
                            }
                            break;
                    }
                }
            }
        } else if (hasOwnProperty(current, path)) {
            current = current[path];
        } else if (path.indexOf("{") > -1 && getObjectType(current.expandString) === "function") {
            current = current.expandString(path);
        } else if (path.indexOf("[") == 0 && path.indexOf("]") > 0 && ((getObjectType(current) === "array") || (getObjectType(current) === "object"))) {
            var propertyName = path.substring(path.indexOf("[") + 1, path.indexOf("]"));
            if (getObjectType(current) === "array") {
                current = current[parseInt(propertyName)];
            } else if (hasOwnProperty(current, propertyName)) {
                current = current[propertyName];
            }
        } else {
            propertyName = "get" + path.charAt(0).toUpperCase() + path.slice(1);
            if (getObjectType(current[propertyName]) === "function") {
                current = current[propertyName]();
                if (getObjectType(current) === "string") {
                    var storedCurrent = current;
                    // parse JSON just in case it returns a stringified json object
                    try {
                        current = JSON.parse(current);
                    } catch (err) {
                        current = storedCurrent;
                    }
                }
            } else {
                host.assert(false, "Path not found ({0}) in ({1})".format(path, dataPath.join(".")));
                current = null;
            }
        }
    });

    return current;
};

Tasks.replaceNestingBraces = function(str) {
    var nesting = 0, i, nestedStr = "", ch, retStr = "", retArgs = [];
    for (i = 0; i < str.length; i += 1) {
        ch = str.charAt(i);
        switch (ch) {
            case "{":
                nesting += 1;
                break;
            case "}":
                nesting -= 1;
                break;
        }

        if (nesting > 0) {
            nestedStr += ch;
        } else if (nestedStr.length > 0) {
            nestedStr += ch;
            retStr += "{" + retArgs.length + "}";
            retArgs.push(nestedStr);
            nestedStr = "";
        } else {
            retStr += ch;
        }
    }

    return { "str": retStr, "args": retArgs };
};

Tasks.splitIntoPath = function(str) {
    var nest, arr, retArr = [];

    nest = Tasks.replaceNestingBraces(str);
    arr = nest.str.match(/(\\.|[^\.])+/g);
    if (!isNull(arr)) {
        arr.forEach(function(path) {
            path = path.replaceAll("\\.", ".").replace(/\{(\d+)\}/g, function(match, number) {
                return hasOwnProperty(nest.args, number) ? nest.args[number] : match;
            });
            retArr.push(path);
        });
    }
    return retArr;
};

Tasks.expandValue = function(sender, args, value) {
    var newValue = null, i;

    if (isNull(value)) {
        return value;
    }

    if (getObjectType(value.forEach) === "function") {
        // Array
        newValue = [];
        value.forEach(function(subValue) {
            newValue.push(Tasks.expandValue(sender, args, subValue));
        });
        return newValue;
    }

    if (getObjectType(value.split) === "function") {
        // String
        newValue = Tasks.getValue(sender, args, Tasks.splitIntoPath(value));
    } else if (getObjectType(value) === "object") {
        // Object
        for (i in value) {
            if (hasOwnProperty(value, i)) {
                value[i] = Tasks.expandValue(sender, args, value[i]);
            }
        }

        return value;
    }

    if (isNull(newValue)) {
        return value;
    }

    return newValue;
};

window.taskControllers = {};
window.taskViews = {};

window.registerTaskController = function(name, controller) {
    window.taskControllers[name.toLowerCase()] = controller;
};

window.registerTaskView = function(name, view) {
    window.taskViews[name.toLowerCase()] = view;
};

window.taskControllerCreator = function(task, args) {
    host.assert(hasOwnProperty(args, "type"), "Task type not found for " + task.name);
    if (hasOwnProperty(window.taskControllers, args.type.toLowerCase())) {
        task.controller = new window.taskControllers[args.type.toLowerCase()](task, args);
    }
};

window.taskViewCreator = function(task, args) {
    host.assert(hasOwnProperty(args, "type"), "Task type not found for " + task.name);
    if (hasOwnProperty(window.taskViews, args.type.toLowerCase())) {
        task.view = new window.taskViews[args.type.toLowerCase()](task, args);
    }
};

/*!
* \file SkinWindow.js
* \brief File containing SkinWindow class and creation function
*/

/*!
* \class SkinWindow
* \brief Solid State's HTML Skinned Window
*/



(function() {
var unloadObs;


function SkinWindow(instanceId)
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
SkinWindow.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the x origin of the window
* \type int
* \returns x origin of the window
*/
SkinWindow.prototype.getX = function(){
   return interop.invoke(this.instanceId, {
      "method":"getX"
   });
};

/*!
* gets the y origin of the window
* \type int
* \returns y origin of the window
*/
SkinWindow.prototype.getY = function(){
   return interop.invoke(this.instanceId, {
      "method":"getY"
   });
};

/*!
* gets the width of the window (-2 if minimized, -1 if maximized)
* \type int
* \returns width of the window (-2 if minimized, -1 if maximized)
*/
SkinWindow.prototype.getWidth = function(){
   return interop.invoke(this.instanceId, {
      "method":"getWidth"
   });
};

/*!
* gets the height of the window (-2 if minimized, -1 if maximized)
* \type int
* \returns height of the window (-2 if minimized, -1 if maximized)
*/
SkinWindow.prototype.getHeight = function(){
   return interop.invoke(this.instanceId, {
      "method":"getHeight"
   });
};

/*!
* gets the minimum width of the window
* \type int
* \returns minimum width of the window
*/
SkinWindow.prototype.getMinWidth = function(){
   return interop.invoke(this.instanceId, {
      "method":"getMinWidth"
   });
};

/*!
* gets the minimum height of the window
* \type int
* \returns minimum height of the window
*/
SkinWindow.prototype.getMinHeight = function(){
   return interop.invoke(this.instanceId, {
      "method":"getMinHeight"
   });
};

/*!
* gets the add the window icon to the notification area (Windows only)
* \type bool
* \returns add the window icon to the notification area (Windows only)
*/
SkinWindow.prototype.getUseNotificationArea = function(){
   return interop.invoke(this.instanceId, {
      "method":"getUseNotificationArea"
   });
};

/*!
* sets the add the window icon to the notification area (Windows only)
* \tparam bool(in) value add the window icon to the notification area (Windows only)
*/
SkinWindow.prototype.setUseNotificationArea = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setUseNotificationArea", 
      "value":value
   });
};

/*!
* gets the mimimize the window to the notification area (Windows only)
* \type bool
* \returns mimimize the window to the notification area (Windows only)
*/
SkinWindow.prototype.getMinimizeToNotificationArea = function(){
   return interop.invoke(this.instanceId, {
      "method":"getMinimizeToNotificationArea"
   });
};

/*!
* sets the mimimize the window to the notification area (Windows only)
* \tparam bool(in) value mimimize the window to the notification area (Windows only)
*/
SkinWindow.prototype.setMinimizeToNotificationArea = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setMinimizeToNotificationArea", 
      "value":value
   });
};

/*!
* gets the can the window be activated
* \type bool
* \returns can the window be activated
*/
SkinWindow.prototype.getCanActivate = function(){
   return interop.invoke(this.instanceId, {
      "method":"getCanActivate"
   });
};

/*!
* sets the can the window be activated
* \tparam bool(in) value can the window be activated
*/
SkinWindow.prototype.setCanActivate = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setCanActivate", 
      "value":value
   });
};

/*!
* gets the valid values are Borderless, Popup, Resizable, Normal
* \type string
* \returns Valid values are Borderless, Popup, Resizable, Normal
*/
SkinWindow.prototype.getWindowFrame = function(){
   return interop.invoke(this.instanceId, {
      "method":"getWindowFrame"
   });
};

/*!
* sets the valid values are Borderless, Popup, Resizable, Normal
* \tparam string(in) value Valid values are Borderless, Popup, Resizable, Normal
*/
SkinWindow.prototype.setWindowFrame = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setWindowFrame", 
      "value":value
   });
};

/*!
* gets the title of the window
* \type string
* \returns title of the window
*/
SkinWindow.prototype.getTitle = function(){
   return interop.invoke(this.instanceId, {
      "method":"getTitle"
   });
};

/*!
* sets the title of the window
* \tparam string(in) value title of the window
*/
SkinWindow.prototype.setTitle = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setTitle", 
      "value":value
   });
};

/*!
* Checks if the window is currently visible
* \type bool
* \returns TRUE if the window is visible, FALSE otherwise
*/
SkinWindow.prototype.isVisible = function(){
   return interop.invoke(this.instanceId, {
      "method":"isVisible"
   });
};

/*!
* Set the origin of the host window
* \tparam int(in) x The desired x value of the host window
* \tparam int(in) y The desired y value of the host window
*/
SkinWindow.prototype.setOrigin = function(x,y){
   return interop.invoke(this.instanceId, {
      "method":"setOrigin", 
      "x":x, 
      "y":y
   });
};

/*!
* Set the size of the host window
* \tparam int(in) width The desired width of the host window
* \tparam int(in) height The desired height of the host window
*/
SkinWindow.prototype.setSize = function(width,height){
   return interop.invoke(this.instanceId, {
      "method":"setSize", 
      "width":width, 
      "height":height
   });
};

/*!
* Set the minimum size of the host window
* \tparam int(in) width The desired min width of the host window
* \tparam int(in) height The desired min height of the host window
*/
SkinWindow.prototype.setMinSize = function(width,height){
   return interop.invoke(this.instanceId, {
      "method":"setMinSize", 
      "width":width, 
      "height":height
   });
};

/*!
* Set the progress value on the taskbar
* \tparam int(in) value progress of the taskbar (0-100) (-1: Indeterminate) (-2: Hide progress)
*/
SkinWindow.prototype.setTaskbarProgress = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setTaskbarProgress", 
      "value":value
   });
};

/*!
* Set the taskbar overlay
* \tparam int(in) x x coordinate in sprite map
* \tparam int(in) y y coordinate in sprite map
* \tparam int(in) width width of icon (0 to disable)
* \tparam int(in) height height of icon (0 to disable)
*/
SkinWindow.prototype.setTaskbarOverlay = function(x,y,width,height){
   return interop.invoke(this.instanceId, {
      "method":"setTaskbarOverlay", 
      "x":x, 
      "y":y, 
      "width":width, 
      "height":height
   });
};

/*!
* Set the small icon for the window (Disable is the application icon) (Windows only)
* \tparam int(in) x x coordinate in sprite map
* \tparam int(in) y y coordinate in sprite map
* \tparam int(in) width width of icon (0 to disable)
* \tparam int(in) height height of icon (0 to disable)
*/
SkinWindow.prototype.setSmallIcon = function(x,y,width,height){
   return interop.invoke(this.instanceId, {
      "method":"setSmallIcon", 
      "x":x, 
      "y":y, 
      "width":width, 
      "height":height
   });
};

/*!
* Set the big icon for the window (Disable is the application icon)
* \tparam int(in) x x coordinate in sprite map
* \tparam int(in) y y coordinate in sprite map
* \tparam int(in) width width of icon (0 to disable)
* \tparam int(in) height height of icon (0 to disable)
*/
SkinWindow.prototype.setBigIcon = function(x,y,width,height){
   return interop.invoke(this.instanceId, {
      "method":"setBigIcon", 
      "x":x, 
      "y":y, 
      "width":width, 
      "height":height
   });
};

/*!
* Set the notification area icon (Windows only)
* \tparam int(in) x x coordinate in sprite map
* \tparam int(in) y y coordinate in sprite map
* \tparam int(in) width width of icon (0 to disable)
* \tparam int(in) height height of icon (0 to disable)
*/
SkinWindow.prototype.setNotificationAreaIcon = function(x,y,width,height){
   return interop.invoke(this.instanceId, {
      "method":"setNotificationAreaIcon", 
      "x":x, 
      "y":y, 
      "width":width, 
      "height":height
   });
};

/*!
* This method allows the user to select a folder
* \tparam string(in) text Message text to display
* \tparam string(in) startPath Folder to start in
* \type string
* \returns path selected string
*/
SkinWindow.prototype.browseForFolder = function(text,startPath){
   return interop.invoke(this.instanceId, {
      "method":"browseForFolder", 
      "text":text, 
      "startPath":startPath
   });
};

/*!
* This method allows the user to select a file
* \tparam string(in) text Message text to display
* \tparam string(in) startPath Folder to start in
* \tparam string(in) startFile File to start as
* \tparam string(in) fileTypeDesc Description of file type
* \tparam string(in) fileTypeExt Extension of the file type
* \type string
* \returns path selected string
*/
SkinWindow.prototype.browseForFile = function(text,startPath,startFile,fileTypeDesc,fileTypeExt){
   return interop.invoke(this.instanceId, {
      "method":"browseForFile", 
      "text":text, 
      "startPath":startPath, 
      "startFile":startFile, 
      "fileTypeDesc":fileTypeDesc, 
      "fileTypeExt":fileTypeExt
   });
};

/*!
* Set the mouse cursor
* \tparam string(in) cursor Type of cursor to display (auto, default, pointer, etc)
*/
SkinWindow.prototype.setCursor = function(cursor){
   return interop.invoke(this.instanceId, {
      "method":"setCursor", 
      "cursor":cursor
   });
};

/*!
* This method prompts the user for a response
* \tparam string(in) text Message text to display
* \tparam string(in) caption Caption for prompt
* \tparam int(in) type Prompt constant question type
* \type int
* \returns Prompt constant return value
*/
SkinWindow.prototype.prompt = function(text,caption,type){
   return interop.invoke(this.instanceId, {
      "method":"prompt", 
      "text":text, 
      "caption":caption, 
      "type":type
   });
};

/*!
* Send a message via the message callback
* \tparam string(in) message Message string (typically should be stringified json)
*/
SkinWindow.prototype.sendMessage = function(message){
   return interop.invoke(this.instanceId, {
      "method":"sendMessage", 
      "message":message
   });
};

/*!
* This method informs the native window of any movement so that the native/browser windows can be synchronized
*/
SkinWindow.prototype.beginMove = function(){
   return interop.invoke(this.instanceId, {
      "method":"beginMove"
   });
};

/*!
* This method informs the native window of any movement so that the native/browser windows can be synchronized
*/
SkinWindow.prototype.beginSize = function(){
   return interop.invoke(this.instanceId, {
      "method":"beginSize"
   });
};

/*!
* This method will center the window in the current view port
*/
SkinWindow.prototype.center = function(){
   return interop.invoke(this.instanceId, {
      "method":"center"
   });
};

/*!
* This method will show the window
*/
SkinWindow.prototype.show = function(){
   return interop.invoke(this.instanceId, {
      "method":"show"
   });
};

/*!
* This method will hide the window
*/
SkinWindow.prototype.hide = function(){
   return interop.invoke(this.instanceId, {
      "method":"hide"
   });
};

/*!
* This method will minimize the host application
*/
SkinWindow.prototype.minimize = function(){
   return interop.invoke(this.instanceId, {
      "method":"minimize"
   });
};

/*!
* This method will restore a minimized host application
*/
SkinWindow.prototype.restore = function(){
   return interop.invoke(this.instanceId, {
      "method":"restore"
   });
};

/*!
* This method will exit the host application
*/
SkinWindow.prototype.close = function(){
   return interop.invoke(this.instanceId, {
      "method":"close"
   });
};

/*!
* This method retrieves a config setting
* \tparam string(in) key Name of config setting to be retrieved
* \tparam string(in) defaultValue Default value of key if nothing is found
* \type string
* \returns value of key's setting
*/
SkinWindow.prototype.getConfig = function(key,defaultValue){
   return interop.invoke(this.instanceId, {
      "method":"getConfig", 
      "key":key, 
      "defaultValue":defaultValue
   });
};

/*!
* Set the windows context menu
* \tparam string(in) menu Menu string (typically should be stringified json)
*/
SkinWindow.prototype.setContextMenu = function(menu){
   return interop.invoke(this.instanceId, {
      "method":"setContextMenu", 
      "menu":menu
   });
};

/*!
* Set the windows context menu
* \tparam int(in) id id of item to change selection
* \tparam bool(in) select true if selected, false otherwise
*/
SkinWindow.prototype.setContextMenuSelect = function(id,select){
   return interop.invoke(this.instanceId, {
      "method":"setContextMenuSelect", 
      "id":id, 
      "select":select
   });
};

/*!
* Saves the current window image
* \tparam string(in) filename Path for the filename to save
* \type bool
* \returns true if successful, false otherwise
*/
SkinWindow.prototype.saveImage = function(filename){
   return interop.invoke(this.instanceId, {
      "method":"saveImage", 
      "filename":filename
   });
};

/*!
* Simulate key down event in window
* \tparam int(in) virtualKey Virtual key
* \tparam int(in) character raw character code pressed
* \tparam int(in) extended extended information for platform consumption
* \tparam int(in) modifier platform modifier flags
*/
SkinWindow.prototype.simulateKeyDown = function(virtualKey,character,extended,modifier){
   return interop.invoke(this.instanceId, {
      "method":"simulateKeyDown", 
      "virtualKey":virtualKey, 
      "character":character, 
      "extended":extended, 
      "modifier":modifier
   });
};

/*!
* Simulate key up event in window
* \tparam int(in) virtualKey Virtual key
* \tparam int(in) character raw character code pressed
* \tparam int(in) extended extended information for platform consumption
* \tparam int(in) modifier platform modifier flags
*/
SkinWindow.prototype.simulateKeyUp = function(virtualKey,character,extended,modifier){
   return interop.invoke(this.instanceId, {
      "method":"simulateKeyUp", 
      "virtualKey":virtualKey, 
      "character":character, 
      "extended":extended, 
      "modifier":modifier
   });
};

/*!
* Simulate character event in window
* \tparam int(in) virtualKey Virtual key
* \tparam int(in) character raw character code pressed
* \tparam int(in) extended extended information for platform consumption
* \tparam int(in) modifier platform modifier flags
*/
SkinWindow.prototype.simulateCharacter = function(virtualKey,character,extended,modifier){
   return interop.invoke(this.instanceId, {
      "method":"simulateCharacter", 
      "virtualKey":virtualKey, 
      "character":character, 
      "extended":extended, 
      "modifier":modifier
   });
};

/*!
* Simulate mouse movement in window
* \tparam int(in) x X coordinate
* \tparam int(in) y Y coordinate
* \tparam bool(in) leave Mouse left the window
*/
SkinWindow.prototype.simulateMouseMove = function(x,y,leave){
   return interop.invoke(this.instanceId, {
      "method":"simulateMouseMove", 
      "x":x, 
      "y":y, 
      "leave":leave
   });
};

/*!
* Simulate mouse down in window
* \tparam int(in) x X coordinate
* \tparam int(in) y Y coordinate
* \tparam int(in) button Button to simulate (0: left, 1: right, 2: middle)
*/
SkinWindow.prototype.simulateMouseDown = function(x,y,button){
   return interop.invoke(this.instanceId, {
      "method":"simulateMouseDown", 
      "x":x, 
      "y":y, 
      "button":button
   });
};

/*!
* Simulate mouse down in window
* \tparam int(in) x X coordinate
* \tparam int(in) y Y coordinate
* \tparam int(in) button Button to simulate (0: left, 1: right, 2: middle)
*/
SkinWindow.prototype.simulateMouseUp = function(x,y,button){
   return interop.invoke(this.instanceId, {
      "method":"simulateMouseUp", 
      "x":x, 
      "y":y, 
      "button":button
   });
};

/*!
* Simulate mouse wheel in window
* \tparam int(in) x X coordinate
* \tparam int(in) y Y coordinate
* \tparam int(in) delta Delta value for the mouse wheel
*/
SkinWindow.prototype.simulateMouseWheel = function(x,y,delta){
   return interop.invoke(this.instanceId, {
      "method":"simulateMouseWheel", 
      "x":x, 
      "y":y, 
      "delta":delta
   });
};

/*!
* Simulate undo in window
*/
SkinWindow.prototype.simulateUndo = function(){
   return interop.invoke(this.instanceId, {
      "method":"simulateUndo"
   });
};

/*!
* Simulate redo in window
*/
SkinWindow.prototype.simulateRedo = function(){
   return interop.invoke(this.instanceId, {
      "method":"simulateRedo"
   });
};

/*!
* Simulate cut in window
*/
SkinWindow.prototype.simulateCut = function(){
   return interop.invoke(this.instanceId, {
      "method":"simulateCut"
   });
};

/*!
* Simulate copy in window
*/
SkinWindow.prototype.simulateCopy = function(){
   return interop.invoke(this.instanceId, {
      "method":"simulateCopy"
   });
};

/*!
* Simulate paste in window
*/
SkinWindow.prototype.simulatePaste = function(){
   return interop.invoke(this.instanceId, {
      "method":"simulatePaste"
   });
};

/*!
* Simulate delete in window
*/
SkinWindow.prototype.simulateDelete = function(){
   return interop.invoke(this.instanceId, {
      "method":"simulateDelete"
   });
};

/*!
* Simulate select all in window
*/
SkinWindow.prototype.simulateSelectAll = function(){
   return interop.invoke(this.instanceId, {
      "method":"simulateSelectAll"
   });
};

/*!
* Send a notification message
* \tparam int(in) type type of message
* \tparam string(in) caption caption to display
* \tparam string(in) message message to display
*/
SkinWindow.prototype.notify = function(type,caption,message){
   return interop.invoke(this.instanceId, {
      "method":"notify", 
      "type":type, 
      "caption":caption, 
      "message":message
   });
};


window.attachSkinWindow = function(instanceId) { return new SkinWindow(instanceId); };
window.skinWindow = interop.createInstance("SSN.SkinWindow", SkinWindow);
unloadObs = notificationCenter.addObserver("Host", "DidUnload", function(sender, info) {
   unloadObs.release();
   window.skinWindow.release();
   window.skinWindow = null;
});

}());


/*!
* \file Platform.js
* \brief File containing Platform class and creation function
*/

/*!
* \class Platform
* \brief General platform functionality
*/



(function() {
var unloadObs;


function Platform(instanceId)
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
Platform.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the read limit for file access (0: unlimited)
* \type int
* \returns read limit for file access (0: unlimited)
*/
Platform.prototype.getFileReadLimit = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileReadLimit"
   });
};

/*!
* sets the read limit for file access (0: unlimited)
* \tparam int(in) value read limit for file access (0: unlimited)
*/
Platform.prototype.setFileReadLimit = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFileReadLimit", 
      "value":value
   });
};

/*!
* gets the write limit for file access (0: unlimited)
* \type int
* \returns write limit for file access (0: unlimited)
*/
Platform.prototype.getFileWriteLimit = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileWriteLimit"
   });
};

/*!
* sets the write limit for file access (0: unlimited)
* \tparam int(in) value write limit for file access (0: unlimited)
*/
Platform.prototype.setFileWriteLimit = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFileWriteLimit", 
      "value":value
   });
};

/*!
* Gets the file modified timestamp
* \tparam double(in) date date to convert to RFC1123
* \type string
* \returns RFC 1123 date if successful, empty string otherwise
*/
Platform.prototype.dateEncodedToRFC1123 = function(date){
   return interop.invoke(this.instanceId, {
      "method":"dateEncodedToRFC1123", 
      "date":date
   });
};

/*!
* Gets the file modified timestamp
* \tparam string(in) fileName filename to check
* \type double
* \returns Encoded date
*/
Platform.prototype.fileModifiedEncoded = function(fileName){
   return interop.invoke(this.instanceId, {
      "method":"fileModifiedEncoded", 
      "fileName":fileName
   });
};

/*!
* Gets the file created timestamp
* \tparam string(in) fileName filename to check
* \type double
* \returns Encoded date
*/
Platform.prototype.fileCreationEncoded = function(fileName){
   return interop.invoke(this.instanceId, {
      "method":"fileCreationEncoded", 
      "fileName":fileName
   });
};

/*!
* Check if a file exists
* \tparam string(in) fileName filename to check
* \type bool
* \returns true if successful, false otherwise
*/
Platform.prototype.fileExists = function(fileName){
   return interop.invoke(this.instanceId, {
      "method":"fileExists", 
      "fileName":fileName
   });
};

/*!
* Check if a directory exists
* \tparam string(in) directory directory to check
* \type bool
* \returns true if successful, false otherwise
*/
Platform.prototype.directoryExists = function(directory){
   return interop.invoke(this.instanceId, {
      "method":"directoryExists", 
      "directory":directory
   });
};

/*!
* Create a directory
* \tparam string(in) directory directory to check
* \type bool
* \returns true if successful, false otherwise
*/
Platform.prototype.directoryCreate = function(directory){
   return interop.invoke(this.instanceId, {
      "method":"directoryCreate", 
      "directory":directory
   });
};

/*!
* Removes all empty child directories
* \tparam string(in) sourceDirectory directory to start recursion
*/
Platform.prototype.collapseEmptyDirectories = function(sourceDirectory){
   return interop.invoke(this.instanceId, {
      "method":"collapseEmptyDirectories", 
      "sourceDirectory":sourceDirectory
   });
};

/*!
* Removes a file matching the filename by checking the source directory and its children
* \tparam string(in) sourceDirectory directory to start recursion
* \tparam string(in) fileName filename to erase
*/
Platform.prototype.fileEraseRecursive = function(sourceDirectory,fileName){
   return interop.invoke(this.instanceId, {
      "method":"fileEraseRecursive", 
      "sourceDirectory":sourceDirectory, 
      "fileName":fileName
   });
};

/*!
* Removes a directory
* \tparam string(in) fileName filename to erase
* \type int
* \returns 0 if successful, OS error code otherwise
*/
Platform.prototype.directoryErase = function(fileName){
   return interop.invoke(this.instanceId, {
      "method":"directoryErase", 
      "fileName":fileName
   });
};

/*!
* Removes a file
* \tparam string(in) fileName filename to erase
* \type int
* \returns 0 if successful, OS error code otherwise
*/
Platform.prototype.fileErase = function(fileName){
   return interop.invoke(this.instanceId, {
      "method":"fileErase", 
      "fileName":fileName
   });
};

/*!
* Check if a registry key path exists
* \tparam string(in) view view of hive
* \tparam string(in) type type of hive
* \tparam string(in) keyPath path of the key
* \type bool
* \returns true if exists, false otherwise
*/
Platform.prototype.registryKeyPathExists = function(view,type,keyPath){
   return interop.invoke(this.instanceId, {
      "method":"registryKeyPathExists", 
      "view":view, 
      "type":type, 
      "keyPath":keyPath
   });
};

/*!
* deletes a key in the registry
* \tparam string(in) view view of hive
* \tparam string(in) type type of hive
* \tparam string(in) keyPath path of the key
* \type bool
* \returns true if successful, false otherwise
*/
Platform.prototype.registryDeleteKey = function(view,type,keyPath){
   return interop.invoke(this.instanceId, {
      "method":"registryDeleteKey", 
      "view":view, 
      "type":type, 
      "keyPath":keyPath
   });
};

/*!
* deletes a value in the registry
* \tparam string(in) view view of hive
* \tparam string(in) type type of hive
* \tparam string(in) keyPath path of the key
* \tparam string(in) name name of value
* \type bool
* \returns true if successful, false otherwise
*/
Platform.prototype.registryDeleteValue = function(view,type,keyPath,name){
   return interop.invoke(this.instanceId, {
      "method":"registryDeleteValue", 
      "view":view, 
      "type":type, 
      "keyPath":keyPath, 
      "name":name
   });
};

/*!
* sets a string in the registry
* \tparam string(in) view view of hive
* \tparam string(in) security type of security on the hive
* \tparam string(in) type type of hive
* \tparam string(in) keyPath path of the key
* \tparam string(in) name name of value
* \tparam string(in) value value of key
* \type bool
* \returns true if successful, false otherwise
*/
Platform.prototype.setRegistryString = function(view,security,type,keyPath,name,value){
   return interop.invoke(this.instanceId, {
      "method":"setRegistryString", 
      "view":view, 
      "security":security, 
      "type":type, 
      "keyPath":keyPath, 
      "name":name, 
      "value":value
   });
};

/*!
* returns a registry value as a string
* \tparam string(in) view view of hive
* \tparam string(in) type type of hive
* \tparam string(in) keyPath path of the key
* \tparam string(in) name name of value
* \tparam string(in) defaultValue default value returned if unable to read key
* \type string
* \returns value of the key
*/
Platform.prototype.getRegistryString = function(view,type,keyPath,name,defaultValue){
   return interop.invoke(this.instanceId, {
      "method":"getRegistryString", 
      "view":view, 
      "type":type, 
      "keyPath":keyPath, 
      "name":name, 
      "defaultValue":defaultValue
   });
};

/*!
* sets an integer in the registry
* \tparam string(in) view view of hive
* \tparam string(in) security type of security on the hive
* \tparam string(in) type type of hive
* \tparam string(in) keyPath path of the key
* \tparam string(in) name name of value
* \tparam int(in) value value of key
* \type bool
* \returns true if successful, false otherwise
*/
Platform.prototype.setRegistryInt32 = function(view,security,type,keyPath,name,value){
   return interop.invoke(this.instanceId, {
      "method":"setRegistryInt32", 
      "view":view, 
      "security":security, 
      "type":type, 
      "keyPath":keyPath, 
      "name":name, 
      "value":value
   });
};

/*!
* returns a registry value as an integer
* \tparam string(in) view view of hive
* \tparam string(in) type type of hive
* \tparam string(in) keyPath path of the key
* \tparam string(in) name name of value
* \tparam int(in) defaultValue default value returned if unable to read key
* \type int
* \returns value of the key
*/
Platform.prototype.getRegistryInt32 = function(view,type,keyPath,name,defaultValue){
   return interop.invoke(this.instanceId, {
      "method":"getRegistryInt32", 
      "view":view, 
      "type":type, 
      "keyPath":keyPath, 
      "name":name, 
      "defaultValue":defaultValue
   });
};

/*!
* Launch the process with user privileges
* \tparam string(in) path string to url/filename to open
* \type bool
* \returns true if successful, false otherwise
*/
Platform.prototype.shellOpen = function(path){
   return interop.invoke(this.instanceId, {
      "method":"shellOpen", 
      "path":path
   });
};

/*!
* returns the version of the filename
* \tparam string(in) fileName name of the file to get the version of
* \tparam string(in) defaultValue default value returned if unable to read version
* \type string
* \returns value of the version
*/
Platform.prototype.getVersion = function(fileName,defaultValue){
   return interop.invoke(this.instanceId, {
      "method":"getVersion", 
      "fileName":fileName, 
      "defaultValue":defaultValue
   });
};

/*!
* Reboots the machine
*/
Platform.prototype.reboot = function(){
   return interop.invoke(this.instanceId, {
      "method":"reboot"
   });
};

/*!
* Searches for a window that is visible
* \tparam string(in) caption caption to match (supports wildcards)
* \tparam string(in) className name of class to match (supports wildcards)
* \tparam bool(in) searchOnlyVisible only search windows that are visible
* \type bool
* \returns true if window found, false otherwise
*/
Platform.prototype.findWindow = function(caption,className,searchOnlyVisible){
   return interop.invoke(this.instanceId, {
      "method":"findWindow", 
      "caption":caption, 
      "className":className, 
      "searchOnlyVisible":searchOnlyVisible
   });
};

/*!
* Gets the bytes free on disk
* \tparam string(in) path path for the disk to check
* \type int
* \returns number of bytes free
*/
Platform.prototype.getFreeDiskSpace = function(path){
   return interop.invoke(this.instanceId, {
      "method":"getFreeDiskSpace", 
      "path":path
   });
};

/*!
* Creates a virtual shortcut
* \tparam string(in) executable path to the application
* \tparam string(in) parameter parameter to run with the application
* \tparam int(in) iconId id of the icon for the shortcut
* \tparam string(in) location location of the shortcut
* \tparam string(in) description description of the shortcut
* \type bool
* \returns TRUE if successful, FALSE otherwise
*/
Platform.prototype.createShortcut = function(executable,parameter,iconId,location,description){
   return interop.invoke(this.instanceId, {
      "method":"createShortcut", 
      "executable":executable, 
      "parameter":parameter, 
      "iconId":iconId, 
      "location":location, 
      "description":description
   });
};

/*!
* Remove a virtual shortcut
* \tparam string(in) location location of the shortcut
* \tparam string(in) description description of the shortcut
* \type bool
* \returns TRUE if successful, FALSE otherwise
*/
Platform.prototype.removeShortcut = function(location,description){
   return interop.invoke(this.instanceId, {
      "method":"removeShortcut", 
      "location":location, 
      "description":description
   });
};

/*!
* returns a new restore point value as integer
* \tparam string(in) applicationName name of the restore point to create
* \tparam int(in) defaultValue default value returned if unable to set restore point
* \type int
* \returns value of the key
*/
Platform.prototype.setRestorePoint = function(applicationName,defaultValue){
   return interop.invoke(this.instanceId, {
      "method":"setRestorePoint", 
      "applicationName":applicationName, 
      "defaultValue":defaultValue
   });
};

/*!
* removes a restore point
* \tparam int(in) restorePointID ID value of the restore point to remove
*/
Platform.prototype.removeRestorePoint = function(restorePointID){
   return interop.invoke(this.instanceId, {
      "method":"removeRestorePoint", 
      "restorePointID":restorePointID
   });
};

/*!
* Copy a file, overwriting if necessary
* \tparam string(in) sourceFilename filename to copy
* \tparam string(in) targetFilename filename to write
* \type bool
* \returns true if successful, false otherwise
*/
Platform.prototype.fileCopy = function(sourceFilename,targetFilename){
   return interop.invoke(this.instanceId, {
      "method":"fileCopy", 
      "sourceFilename":sourceFilename, 
      "targetFilename":targetFilename
   });
};

/*!
* checks for a running process at given path
* \tparam string(in) filename path of process to look for
*/
Platform.prototype.isProcessRunning = function(filename){
   return interop.invoke(this.instanceId, {
      "method":"isProcessRunning", 
      "filename":filename
   });
};

/*!
* checks a certificate file on disk
* \tparam string(in) filename path of the certificate to look for
* \tparam string(in) commonName common name of the certificate
*/
Platform.prototype.authenticateCertificate = function(filename,commonName){
   return interop.invoke(this.instanceId, {
      "method":"authenticateCertificate", 
      "filename":filename, 
      "commonName":commonName
   });
};

/*!
* resets the system idle timer to prevent auto-sleep
*/
Platform.prototype.resetSystemIdleTimer = function(){
   return interop.invoke(this.instanceId, {
      "method":"resetSystemIdleTimer"
   });
};


window.platform = interop.createInstance("SSN.Platform", Platform);
unloadObs = notificationCenter.addObserver("Host", "DidUnload", function(sender, info) {
   unloadObs.release();
   window.platform.release();
   window.platform = null;
});

}());



function StatusView(task, args) {
    var self = this;

    this.instanceId = app.expandString("{Guid}");
    this.rootElement = null;
    this.iconElement = null;
    this.titleElement = null;
    this.statusElement = null;
    this.progressElement = null;
    this.progressBarElement = null;
    this.progressBarElementClass = null;
    this.silent = false;
    
    this.controller = task.controller;

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Complete", task, function(sender, info) { self.onComplete(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Task", "UpdateView", task, function(sender, info) { self.onUpdateView(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("Workflow", "WillUnload", workflow, function(sender, info) { self.onWorkflowUnload(task, info); }));
}

StatusView.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.progressBarElementClass)) {
        this.progressBarElementClass.release();
        this.progressBarElementClass = null;
    }
    if (!isNull(this.controller)) {
        this.controller.release();
        this.controller = null;
    }
};

StatusView.prototype.onWorkflowUnload = function(task, info) {
    this.release();
};

StatusView.prototype.onStart = function(task, info) {
    notificationCenter.fire("StatusView", "Bind", task, this);

    if (hasOwnProperty(task.args, "enableView")) {
        this.silent = (task.args.enableView === false);
    }
    if (hasOwnProperty(task.args, "icon")) {
        this.onUpdateImage(this.iconElement, task.getStringArgument("icon"));
    }
    if (hasOwnProperty(task.args, "title")) {
        this.onUpdateElement(this.titleElement, host.getLanguageString(task.getStringArgument("title")));
    }

    if (!isNull(this.progressBarElement)) {
        this.progressBarElementClass = new ChangeClass(this.progressBarElement);
    }
};

StatusView.prototype.onComplete = function(task, info) {
    if (task.hasError()) {
        this.onUpdateElement(this.statusElement, host.getLanguageString(task.getFirstErrorMessage()));
    } else if (task.hasWarning()) {
        this.onUpdateElement(this.statusElement, host.getLanguageString(task.getFirstWarningMessage()));
    }
};

StatusView.prototype.onUpdateVisibility = function(element, value) {
    if (!this.silent && !isNull(element)) {
        var oldValue = element.is(":visible");
        if (oldValue !== value) {
            element.toggle();
            element.trigger("changed", [oldValue, value]);
        }
    }
};

StatusView.prototype.onUpdateElement = function(element, value) {
    if (!this.silent && !isNull(element)) {
        var oldValue = element.html();
        if (oldValue !== value) {
            element.html(value);
            element.trigger("changed", [oldValue, value]);
        }
    }
};

StatusView.prototype.onUpdateImage = function(element, value) {
    if (!this.silent && !isNull(element)) {
        var oldValue = element.attr("src");
        if (oldValue !== value) {
            element.attr("src", value);
            element.trigger("changed", [oldValue, value]);
        }
    }
};

StatusView.prototype.onUpdateCheckbox = function(element, value) {
    if (!this.silent && !isNull(element)) {
        var oldValue = element.attr("checked");
        if (oldValue !== value) {
            element.attr("checked", value);
            element.trigger("changed", [oldValue, value]);
        }
    }
};

StatusView.prototype.onUpdateStatus = function(value) {
    this.onUpdateElement(this.statusElement, host.getLanguageString(value));
};

StatusView.prototype.onUpdateProgress = function(value) {
    var info, percent = parseInt(value * 100, 10);

    info = { "percent": percent };

    notificationCenter.fire("TaskView", "WillUpdateProgress", this, info);
    
    if (this.silent === true) {
        return;
    }
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

StatusView.prototype.onUpdateView = function(task, info) {
    var self = this;
    $.each(info, function(key, value) {
        switch (key) {
            case "status":
                self.onUpdateElement(self.statusElement, host.getLanguageString(value));
                break;
            case "progress":
                self.onUpdateProgress(value);
                break;
        }
    });
};


function AggregateController(task, args) {
    var self = this;

    this.observers = [];
    this.actions = null;

    this.xhr = null;
    
    this.queueController = new QueueController(task, args);
    this.queueController.onStart = function(queueTask, queueArgs) { };
    this.queueController.onRunSubTask = function(queueTask, queueArgs, completeCallback) {
        task.runSubTask(self.actions[self.queueController.currentActionIndex].name,
            self.actions[self.queueController.currentActionIndex].value,
            function(childTask, childInfo) {
                completeCallback();
            });
    };

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

AggregateController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.xhr)) {
        this.xhr.abort();
        this.xhr = null;
    }

    if (!isNull(this.queueController)) {
        this.queueController.release();
        this.queueController = null;
    }

    this.actions = null;
};

AggregateController.prototype.onStart = function(task, info) {
    var self = this;

    if (hasOwnProperty(task.args, "url")) {
        this.xhr = $.getJSON(app.expandString(task.args.url), function(data) {
            self.onAggregateContent(task, data);
        }).error(function() {
            task.error("Aggregate_RequestFail");
            task.complete();
        });
    } else if (hasOwnProperty(task.args, "content")) {
        if (getObjectType(task.args.content.format) === "function") {
            this.onAggregateContent(task, interop.parseJSON(app.expandString(task.args.content)));
        } else {
            this.onAggregateContent(task, task.args.content);
        }
    } else {
        host.assert(false, "{0} not defined for ({1}) in ({2})".format("url/content", task.type, task.name));
    }
};

AggregateController.prototype.onAggregateContent = function(task, contentJSON) {
    var self = this;

    self.actions = [];

    // Create list
    if (getObjectType(contentJSON.forEach) === "function") {
        contentJSON.forEach(function(obj) {
            self.addTasks(task, obj);
        });
    } else {
        self.addTasks(task, contentJSON);
    }

    this.queueController.totalActions = this.actions.length;
    this.queueController.onQueueStart(task, {});
};

AggregateController.prototype.addTasks = function(task, obj) {
    var keys = getObjectProperties(obj), self = this;

    keys.forEach(function(key) {
        var embedTask = obj[key];
        if (getObjectType(embedTask) === "array") {
            embedTask.forEach(function(taskObj) {
                self.actions.push({
                    "name": key,
                    "value": taskObj
                });
            });
        } else {
            self.actions.push({
                "name": key,
                "value": embedTask
            });
        }
    });
};

registerTaskController("aggregate", AggregateController);

/*!
* \file AppExt.js
* \brief File containing AppExt class and creation function
*/

/*!
* \class AppExt
* \brief Internal Solid State Networks Usage Only
*/




function AppExt(instanceId)
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
AppExt.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the internal Solid State Networks Usage Only
* \type string
* \returns Internal Solid State Networks Usage Only
*/
AppExt.prototype.getFilename = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFilename"
   });
};

/*!
* sets the internal Solid State Networks Usage Only
* \tparam string(in) value Internal Solid State Networks Usage Only
*/
AppExt.prototype.setFilename = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFilename", 
      "value":value
   });
};

/*!
* Internal Solid State Networks Usage Only
*/
AppExt.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};


/*!
* Create instance of appExt
*/
function createAppExt()
{
   return interop.createInstance("SSN.AppExt", AppExt);
}


/*!
* \file AppNotificationDock.js
* \brief File containing app notification area dock locations
*/

/*!
* \class AppNotificationDock
* \brief Notification area dock constants
*/

function AppNotificationDock() {
    /*!
    * Dock left
    * \type int
    */
    this.LEFT = 1;
    /*!
    * Dock right
    * \type int
    */
    this.RIGHT = 2;
    /*!
    * Dock top
    * \type int
    */
    this.TOP = 4;
    /*!
    * Dock bottom
    * \type int
    */
    this.BOTTOM = 8;
}

/*!
* converts an dock location value to a string
* \tparam int id dock location value
* \type string
* \returns stringified name of dock location
*/
AppNotificationDock.prototype.nameFromId = function(id) {
    var dockArray = [];
    if (id == this.LEFT) {
        dockArray.push("Left");
    }
    if ((id & this.RIGHT) == this.RIGHT) {
        dockArray.push("Right");
    }
    if ((id & this.TOP) == this.TOP) {
        dockArray.push("Middle");
    }
    if ((id & this.BOTTOM) == this.BOTTOM) {
        dockArray.push("Bottom");
    }
    return dockArray.join(", ");
};

/*!
* precreated global instance of AppNotificationDock
* \type AppNotificationDock
*/
var appNotificationDock = new AppNotificationDock();

function BrowserController(task, args) {
    var self = this;

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

BrowserController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

BrowserController.prototype.onHostIsBrowser = function(task) {
    if (app.expandString("{PluginVersion}") !== "{PluginVersion}") {
        task.runSubAction("browser", null, function(sender, info) {
            task.complete();
        });
    } else {
        task.runSubAction("local", null, function(sender, info) {
            task.complete();
        });
    }
};

BrowserController.prototype.onBrowserNotify = function(task) {
    task.assertArgument("content");
    app.remoteNotify(JSON.stringify(task.args.content));
    task.complete();
};

BrowserController.prototype.onBrowserCheckUrl = function(task) {
    var windowLocation = app.expandString("{WindowLocationUrl}"), url;

    task.debugPrint("Checking browser url {0}\n".format(windowLocation));
    if (hasOwnProperty(task.args, "url")) {
        url = task.getStringArgument("url");
        if (windowLocation.toLowerCase().beginsWith(url.toLowerCase()) === false) {
            task.debugPrint("Browser control does not match url ({0}) ({1})\n".format(windowLocation, url));
            task.error("Browser_UnauthorizedUrl");
        }
    } else if (app.authorizeUrl(windowLocation) === false) {
        task.debugPrint("Browser control not in hostname whitelist ({0}) ({1})\n".format(windowLocation));
        task.error("Browser_UnauthorizedUrl");
    }

    task.complete();
};

BrowserController.prototype.onBrowserCheckIFrame = function(task) {
    var topWindowLocation = app.expandString("{TopWindowLocationUrl}"),
        windowLocation = app.expandString("{WindowLocationUrl}");

    if (topWindowLocation !== windowLocation) {
        task.debugPrint("Unable to load browser control in iframe ({0}) ({1})\n".format(topWindowLocation, windowLocation));
        task.error("Browser_IFrameFound");
    }

    task.complete();
};

BrowserController.prototype.onStart = function(task, info) {
    switch (task.args.type) {
        case "hostIsBrowser":
            this.onHostIsBrowser(task);
            break;
        case "browserNotify":
            this.onBrowserNotify(task);
            break;
        case "browserCheckUrl":
            this.onBrowserCheckUrl(task);
            break;
        case "browserCheckIFrame":
            this.onBrowserCheckIFrame(task);
            break;
        default:
            host.assert(false, "Unknown type in BrowserController ({0})".format(task.args.type));
            break;
    }
};

registerTaskController("hostIsBrowser", BrowserController);
registerTaskController("browserNotify", BrowserController);
registerTaskController("browserCheckUrl", BrowserController);
registerTaskController("browserCheckIFrame", BrowserController);


var BrowserUninstallState = {
    Unregister: 1,
    Erase: 2,
    Finalize: 3,
    Shutdown: 4
};

function BrowserUninstallController(task, args) {
    var self = this;

    this.process = createProcess();
    this.nextTimer = null;

    this.state = 0;

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Process", "Complete", this.process, function(sender, info) { self.onFileUnregisterComplete(task, info); }));
}

BrowserUninstallController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.nextTimer)) {
        clearTimeout(this.nextTimer);
        this.nextTimer = null;
    }
    
    if (!isNull(this.process)) {
        this.process.release();
        this.process = null;
    }
};

BrowserUninstallController.prototype.setState = function(state) {
    this.state = state;
    this.currentIndex = 0;
};

BrowserUninstallController.prototype.next = function(task, increment) {
    if (increment === true) {
        this.currentIndex += 1;
    }

    switch (this.state) {
        case BrowserUninstallState.Unregister:
            if (this.currentIndex >= this.unregisterFiles.length) {
                this.setState(BrowserUninstallState.Erase);
                this.nextAfter(task, 0, false);
            } else {
                this.onFileUnregister(task, { "index": this.currentIndex });
            }
            break;

        case BrowserUninstallState.Erase:
            if (this.currentIndex >= this.eraseFiles.length) {
                this.setState(BrowserUninstallState.Finalize);
                this.nextAfter(task, 0, false);
            } else {
                this.onFileErase(task, { "index": this.currentIndex });
            }
            break;

        case BrowserUninstallState.Finalize:
            app.setRemoveLocalStorage(true);
            app.implode();
            platform.collapseEmptyDirectories(this.rootDirectory);
            task.complete();

            this.setState(BrowserUninstallState.Shutdown);
            this.nextAfter(task, 100, true);
            break;

        case BrowserUninstallState.Shutdown:
            app.closeAll();
            break;

        default:
            task.error("Uninstall_UnknownState");
            task.complete();
            break;
    }
};

BrowserUninstallController.prototype.nextAfter = function(task, time, increment) {
    var self = this;
    
    host.assert(isNull(this.nextTimer), "Already processing uinstall timer");
    
    this.nextTimer = setTimeout(function() {
        self.nextTimer = null;
        self.next(task, increment);
   }, time);
}

BrowserUninstallController.prototype.onFileError = function(task, info) {
    task.error("OSError_" + osError.nameFromId(this.versionUninstall.getLastFileError()));
    task.complete();
};

BrowserUninstallController.prototype.onFileLocked = function(task, info) {
    notificationCenter.fire("Task", "UpdateView", task, {
        "status": "Uninstall_Locked"
    });
    this.nextAfter(task, 1000, false);
};

BrowserUninstallController.prototype.onFileErase = function(task, info) {
   var lastError = 0, self = this;
   
   if (this.currentIndex >= this.eraseFiles.length) {
        this.currentIndex = 0;
        this.onDirectoryCollapse();
        return;
   }
   
   lastError = platform.fileErase(this.eraseFiles[this.currentIndex]);
   if (lastError != osError.ERROR_SUCCESS) {
        if (host.isWin === true) {
            switch (lastError)
            {
                case osError.ERROR_ACCESS_DENIED:
                case osError.ERROR_SHARING_VIOLATION:
                case osError.ERROR_LOCK_VIOLATION:
                    return this.onFileLocked(task, { "lastError": lastError });
            }
        }
        return this.onFileError(task, { "lastError": lastError });
    }

    notificationCenter.fire("Task", "UpdateView", task, {
        "status": "Uninstall_Running"
    });

   this.nextAfter(task, 0, true);
};

BrowserUninstallController.prototype.onFileUnregisterComplete = function(task, info) {
    if (info.exitCode !== 0) {
        task.error("Uninstall_UnregisterFail");
        task.complete();
    } else {
        this.nextAfter(task, 0, true);
    }
}

BrowserUninstallController.prototype.onFileUnregister = function(task, info) {
    if (platform.fileExists(this.unregisterFiles[info.index]) === false) {
        this.nextAfter(task, 0, true);
        return;
    }
    this.process.setApplicationName(app.expandString("{SystemPath}regsvr32.exe"));
    this.process.setElevationRights(processElevationRights.ELEVATED);
    this.process.setArguments(app.expandString("/s /u \"{0}\"".format(this.unregisterFiles[info.index])));

    task.debugPrint("command = {0}\n".format(this.process.getApplicationName()));
    task.debugPrint("args = {0}\n".format(this.process.getArguments()));

    this.process.launch();
};

BrowserUninstallController.prototype.onStart = function(task, info) {

    task.assertArgument("unregister");
    task.assertArgument("metafile");
    task.assertArgument("targetDirectory");

    this.eraseFiles = [
        app.expandString("{ModulePath}" + task.getStringArgument("unregister")),
        app.expandString("{ModulePath}..{PathSeparator}" + task.getStringArgument("metafile"))
    ];
    this.unregisterFiles = [
        app.expandString("{ModulePath}" + task.getStringArgument("unregister"))
    ];
    this.rootDirectory = task.getStringArgument("targetDirectory");

    if (host.isRemote === true) {
        app.remoteDetach();
        skinWindow.center();
        skinWindow.show();
    }

    if (!app.getElevated()) {
        app.setRestartElevated(true);
        app.setRestart(true);
        task.error("Uninstall_RequiresElevated");
        task.complete();
        return;
    }

    notificationCenter.fire("Task", "UpdateView", task, {
        "status": "Uninstall_Running"
    });

    this.setState(BrowserUninstallState.Unregister);
    this.next(task, false);
};

registerTaskController("browserUninstall", BrowserUninstallController);
registerTaskView("browserUninstall", StatusView);


function BrowserUpdateController(task, args) {
    var self = this;
    
    if (!hasOwnProperty(task.args, "config")) {
        task.args.config = {};
    }
    
    this.httpRequest = createHttpRequest();
    this.httpRequest.setCleanup(true);
    this.httpRequest.setUseCache(true);
    this.httpRequest.setType(httpRequestType.GET);

    this.process = createProcess();

    this.lockTimer = null;
    this.systemMutex = createSystemMutex();

    this.downloadController = new DownloadController(task, args);
    this.downloadController.onStartOriginal = this.downloadController.onStart;
    this.downloadController.onStart = function(task, info) { self.onStart(task, info); };
    this.downloadController.onDownloadCompleteOriginal = this.downloadController.onDownloadComplete;
    this.downloadController.onDownloadComplete = function(task, info) { self.onDownloadComplete(task, info); }

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("HttpRequest", "Complete", this.httpRequest, function(sender, info) { self.onMetafileDownloadComplete(task, info); }));
}

BrowserUpdateController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.lockTimer)) {
        clearInterval(self.lockTimer);
        this.lockTimer = null;
    }

    if (!isNull(this.systemMutex)) {
        this.systemMutex.unlock();
        this.systemMutex.release();
        this.systemMutex = null;
    }
    
    if (!isNull(this.httpRequest)) {
        this.httpRequest.release();
        this.httpRequest = null;
    }

    if (!isNull(this.process)) {
        this.process.release();
        this.process = null;
    }

    if (!isNull(this.downloadController)) {
        this.downloadController.release();
        this.downloadController = null;
    }
};

BrowserUpdateController.prototype.onStart = function(task, info) {
    var self = this, modifiedDate, intervalId, metafile, url;

    task.assertArgument("url");
    task.assertArgument("targetDirectory");

    if (hasOwnProperty(task.args, "requiresElevated") && task.args.requiresElevated && !app.getElevated()) {
        this.onRestart(task);
        return;
    }

    url = task.getStringArgument("url");
    metafile = url.substring(url.lastIndexOf("/") + 1).toLowerCase();

    task.args.config.outputPath = app.expandString("{0}{Guid}{PathSeparator}".format(task.getStringArgument("targetDirectory")));

    this.httpRequest.setCleanup(false);
    this.httpRequest.setFileName(app.expandString("{0}{1}".format(task.args.targetDirectory, metafile)));
    this.systemMutex.setName(app.expandString("{MD5:{0}}".format(url.toLowerCase())));

    notificationCenter.fire("Task", "UpdateView", task, {
        "state": browserUpdateState.METAFILE,
        "status": "Update_Checking"
    });

    self.lockTimer = setInterval(function() {
        if (self.systemMutex.lockWithTimeout(0)) {
            self.onStartLocked(task, info);
            clearInterval(self.lockTimer);
            self.lockTimer = null;
        }
    }, 250);
};

BrowserUpdateController.prototype.onStartLocked = function(task, info) {
    this.httpRequest.setUrl(task.getStringArgument("url"));
    this.httpRequest.start();
};

BrowserUpdateController.prototype.onMetafileDownloadComplete = function(task, info) {
    if (info.httpCode === 304) {
        this.onComplete(task, false);
        return;
    } else if (info.httpCode !== 200) {
        task.error("Update_MetafileNotFound");
        this.onComplete(task, false);
        return;
    }

    task.args.metafile = this.httpRequest.getFileName();

    notificationCenter.fire("Task", "UpdateView", task, {
        "state": browserUpdateState.DOWNLOAD,
        "progress": 0.0
    });

    this.downloadController.onStartOriginal(task, info);
};

BrowserUpdateController.prototype.onRegisterMac = function(task) {
    host.assert(false, "Not implemented");
};

BrowserUpdateController.prototype.onRegisterWin = function(task) {
    var self = this;

    this.process.setApplicationName(app.expandString("{SystemPath}regsvr32.exe"));
    this.process.setElevationRights(processElevationRights.ELEVATED);
    this.process.setArguments(app.expandString("/s \"{0}{1}\"".format(task.args.config.outputPath, task.args.register)));

    this.observers.push(notificationCenter.addInstanceObserver("Process", "Complete", this.process, function(sender, info) {
        task.debugPrint("exit code {0}\n".format(info.exitCode));
        if (info.exitCode !== 0) {
            task.error("Update_RegisterFail");
            self.onComplete(task, false);
        } else {
            self.onComplete(task, true);
        }
    }));

    task.debugPrint("command {0}\n".format(this.process.getApplicationName()));
    task.debugPrint("args {0}\n".format(this.process.getArguments()));

    this.process.launch();
};

BrowserUpdateController.prototype.onRegister = function(task) {
    if (hasOwnProperty(task.args, "register")) {
        if (host.isWin === true) {
            this.onRegisterWin(task);
        } else if (host.isMac === true) {
            this.onRegisterMac(task);
        }
    } else {
        this.onComplete(task, true);
    }
};

BrowserUpdateController.prototype.onDownloadComplete = function(task, info) {
    if (!info.successful) {
        task.error("DownloadError_" + downloadError.nameFromId(this.getDownload().getLastError()))
        this.onComplete(task, false);
    } else {
        this.onRegister(task);
    }
};

BrowserUpdateController.prototype.onUpdateComplete = function(task, info) {
    if (platform.directoryExists(this.getDownload().getOptionString("OutputPath"))) {
        platform.directoryErase(this.getDownload().getOptionString("OutputPath"));
    }
    if (hasOwnProperty(task.args, "restart") && task.args.restart === true) {
        this.onRestart(task);
        return;
    }
    this.onComplete(task, true);
};

BrowserUpdateController.prototype.onRestart = function(task) {
    this.systemMutex.unlock();
    if (task.args.requiresElevated === true)
        app.setRestartElevated(true);
    app.setRestart(true);
};

BrowserUpdateController.prototype.onComplete = function(task, wasUpdated) {
    function taskComplete() {
        task.complete();
    };
    this.systemMutex.unlock();

    notificationCenter.fire("Task", "UpdateView", task, {
        "state": browserUpdateState.COMPLETE
    });

    if (task.hasError()) {
        this.httpRequest.setCleanup(true);
    } else {
        notificationCenter.fire("Task", "UpdateView", task, {
            "progress": 1.0,
            "status": "Update_Complete"
        });
    }

    if (wasUpdated) {
        task.runSubAction("updated", null, taskComplete);
    } else {
        if (task.hasError()) {
            task.runSubAction("notUpdated", null, taskComplete);
        } else {
            task.runSubAction("updateFailed", null, taskComplete);
        }
    }
};

BrowserUpdateController.prototype.getDownload = function() {
    return this.downloadController.getDownload();
};

registerTaskController("browserUpdate", BrowserUpdateController);

/*!
* \file browserupdatestate.js
* \brief File containing browser update state constants and helper functions
*/

/*!
* \class BrowserUpdateState
* \brief Browser update state constants and helper functions
*/
function BrowserUpdateState() {
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
   * Metafile state
   * \type int
   */
    this.METAFILE = 1;
   /*!
   * Download state
   * \type int
   */
    this.DOWNLOAD = 2;
   /*!
   * Complete state
   * \type int
   */
    this.COMPLETE = 3;
}

/*!
* converts a browser update state to a string
* \type string
* \tparam int id browser update state
*/
BrowserUpdateState.prototype.nameFromId = function(id) {
    if (id < 0) {
        return "Unknown";
    }

    var nameMap = [
        "Idle",
        "Metafile",
        "Download",
        "Complete"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of BrowserUpdateState
* \type BrowserUpdateState
*/
var browserUpdateState = new BrowserUpdateState();

function BrowserUpdateView(task, args) {
    var self = this;

    this.instanceId = app.expandString("{Guid}");

    this.rootElement = null;
    this.rootElementClass = null;
    this.statusElement = null;

    this.updateState = browserUpdateState.IDLE;

    this.downloadView = new DownloadView(task, args);
    this.downloadView.onUpdateProgressOriginal = this.downloadView.onUpdateProgress;
    this.downloadView.onUpdateProgress = function(value) { self.onUpdateProgressInternal(value); };

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Complete", task, function(sender, info) { self.onComplete(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Task", "UpdateView", task, function(sender, info) { self.onUpdateView(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("TaskView", "WillUpdateProgress", this.downloadView, function(sender, info) { self.onDownloadViewWillUpdateProgress(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("Workflow", "WillUnload", workflow, function(sender, info) { self.onWorkflowUnload(task, info); }));
}

BrowserUpdateView.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.rootElementClass)) {
        this.rootElementClass.release();
        this.rootElementClass = null;
    }

    if (!isNull(this.downloadView)) {
        this.downloadView.release();
        this.downloadView = null;
    }
};

BrowserUpdateView.prototype.onWorkflowUnload = function(task, info) {
    this.release();
};

BrowserUpdateView.prototype.onStart = function(task, info) {
    notificationCenter.fire("BrowserUpdateView", "Bind", task, this);
    if (!isNull(this.rootElement)) {
        this.rootElementClass = new ChangeClass(this.rootElement);
    }
};

BrowserUpdateView.prototype.onComplete = function(task, info) {
    if (!isNull(this.rootElement)) {
        if (!task.hasError()) {
            this.rootElementClass.apply("updateStateComplete");
        } else if (task.hasWarning()) {
            this.rootElementClass.apply("updateStateWarning");
        }
    }
};

BrowserUpdateView.prototype.onUpdateProgressInternal = function(value) {
    var progress = 0.0, i = 0, stateMultiplier = [
        0.0, // browserUpdateState.IDLE
        0.5, // browserUpdateState.METAFILE
        0.5  // browserUpdateState.DOWNLOAD
    ];
    if (value > -1) {
        for (i = 0; i < stateMultiplier.length; i += 1) {
            if (i === this.updateState) {
                break;
            }
            progress += stateMultiplier[i];
        }
        progress += (stateMultiplier[i] * parseFloat(value));
    }
    //app.debugPrint("browserProgress {0}\n".format(progress));
    // Send the progress back through to the DownloadView
    this.downloadView.onUpdateProgressOriginal(progress);
};

BrowserUpdateView.prototype.onUpdateView = function(task, info) {
    var self = this;
    $.each(info, function(key, value) {
        switch (key) {
            case "status":
                self.downloadView.onUpdateElement(self.statusElement, host.getLanguageString(value));
                break;
            case "state":
                self.updateState = value;
                break;
            case "progress":
                self.onUpdateProgressInternal(value);
                break;
        }
    });
};

BrowserUpdateView.prototype.onDownloadViewWillUpdateProgress = function(task, info) {
    //app.debugPrint("browserUpdate {0}\n".format(info.percent));
    notificationCenter.fire("TaskView", "WillUpdateProgress", this, info);
};

registerTaskView("browserupdate", BrowserUpdateView);


function ChangeClass(element) {
    this.element = element;
}

ChangeClass.prototype.release = function() {
    this.apply(null);
};

ChangeClass.prototype.apply = function(newStateName) {
    if (isNull(newStateName) && isNull(this.currentState)) {
        return;
    }

    if (newStateName === this.currentState) {
        return;
    }

    var oldState = null;
    if (!isNull(this.currentState)) {
        oldState = this.currentState;
    }

    if (host.isIE6 === true) {
        var classValue = this.element.attr("class");
        if (isNull(classValue)) {
            classValue = "";
        }
        if (isNull(newStateName)) {
            newStateName = "";
        }
        if (!isNull(this.currentState) && this.currentState.length > 0) {
            classValue = classValue.replace(this.currentState, newStateName);
        } else if (classValue.length === 0) {
            classValue += newStateName;
        } else {
            classValue += "-" + newStateName;
        }
        classValue = classValue.replace(/-{2,}/g, "-");
        classValue = classValue.replace(/-$/, "");
        classValue = classValue.replace(/^-+/g, "");
        this.element.attr("class", classValue);
        this.currentState = newStateName;

        // app.debugPrint("Changing element {0} state to {1}\n".format(this.element.attr("id"), classValue));
    } else {
        if (!isNull(this.currentState)) {
            this.element.removeClass(this.currentState);
        }
        this.currentState = newStateName;
        if (!isNull(newStateName)) {
            this.element.addClass(this.currentState);
        }

        // app.debugPrint("Changing element {0} state to {1}\n".format(this.element.attr("id"), newStateName));
    }
    this.element.trigger("cssClassChanged", [oldState, this.currentState]);
};

/*!
* \file debugflag.js
* \brief File containing debug flags
*/

/*!
* \class DebugFlag
* \brief Debug flag constants and helper functions
*/

function DebugFlag() {
    /*!
    * Disabled
    * \type int
    */
    this.DISABLED = 0x00000000;
    /*!
    * Window
    * \type int
    */
    this.WINDOW = 0x00000001;
    /*!
    * File
    * \type int
    */
    this.FILE = 0x00000002;
    /*!
    * Verbose
    * \type int
    */
    this.VERBOSE = 0x00000004;
    /*!
    * Append
    * \type int
    */
    this.APPEND = 0x00000008;
    /*!
    * Command Line
    * \type int
    */
    this.COMMANDLINE = 0x00000010;
    /*!
    * Timestamp
    * \type int
    */
    this.TIMESTAMP = 0x00000020;
    /*!
    * Unique
    * \type int
    */
    this.UNIQUE = 0x00000040;
    /*!
    * Log Errors
    * \type int
    */
    this.LOGERRORS = 0x00000080;
    /*!
    * Per thread
    * \type int
    */
    this.PERTHREAD = 0x00000100;
    /*!
    * Per process
    * \type int
    */
    this.PERPROCESS = 0x00000200;
    /*!
    * Memory reporting
    * \type int
    */
    this.MEMORYREPORTING = 0x00000400;
    /*!
    * External print
    * \type int
    */
    this.EXTERNALPRINT = 0x00000800;
    /*!
    * Silence bell
    * \type int
    */
    this.SILENCEBELL = 0x00001000;
    /*!
    * Abort debugger
    * \type int
    */
    this.ABORTDEBUGGER = 0x00002000;
    /*!
    * Memory testing
    * \type int
    */
    this.MEMORYTESTING = 0x00004000;
    /*!
    * Mutex reporting
    * \type int
    */
    this.MUTEXREPORTING = 0x00008000;
    /*!
    * Cache writes
    * \type int
    */
    this.COMMIT = 0x00010000;
    /*!
    * Memory tracking
    * \type int
    */
    this.MEMORYTRACKING = 0x00020000;
}

/*!
* precreated global instance of DebugFlag
* \type DebugFlag
*/
var debugFlag = new DebugFlag();

$(document).ready(function() {
    function DebugOptionsView() {
        this.instanceId = app.expandString("{Guid}");
        this.rootElement = null;
        this.consoleElement = null;
        this.fileElement = null;
    }

    var rootElementClass = null;

    window.debugOptionsView = new DebugOptionsView();
    notificationCenter.fire("DebugOptionsView", "Bind", window.debugOptionsView, window.debugOptionsView);

    if (isNull(window.debugOptionsView.rootElement) &&
        isNull(window.debugOptionsView.consoleElement) &&
        isNull(window.debugOptionsView.fileElement)) {
        window.debugOptionsView = null;
        return;
    }

    notificationCenter.addInstanceObserver("SkinWindow", "DidClose", skinWindow, function(sender, info) {
        if (!isNull(window.debugOptionsView.consoleElement)) {
            window.debugOptionsView.consoleElement.unbind();
        }

        if (!isNull(window.debugOptionsView.fileElement)) {
            window.debugOptionsView.fileElement.unbind();
        }

        window.debugOptionsView = null;
    });

    if (!isNull(window.debugOptionsView.rootElement)) {
        rootElementClass = new ChangeClass(window.debugOptionsView.rootElement);

        if (!isNull(window.debugOptionsView.consoleElement)) {
            window.debugOptionsView.consoleElement.change(function() {
                rootElementClass.apply("optionChanged");
            });
        }

        if (!isNull(window.debugOptionsView.fileElement)) {
            window.debugOptionsView.fileElement.change(function() {
                rootElementClass.apply("optionChanged");
            });
        }

        window.debugOptionsView.rootElement.find("form").submit(function() {
            var currentFlags = app.getDebugFlags() | debugFlag.VERBOSE | debugFlag.TIMESTAMP;
            var newFlags = currentFlags;
            var debugFilename = app.getDebugFilename();

            rootElementClass.apply(null);

            if (!isNull(window.debugOptionsView.fileElement)) {
                if (window.debugOptionsView.fileElement.prop("checked")) {
                    debugFilename = app.expandString("{LocalStorage}{ModuleFileTitle}.log");
                    newFlags |= debugFlag.FILE;
                } else {
                    newFlags &= (~debugFlag.FILE);
                }
            }

            if (!isNull(window.debugOptionsView.consoleElement)) {
                if (window.debugOptionsView.consoleElement.prop("checked")) {
                    newFlags |= debugFlag.WINDOW;
                } else {
                    newFlags &= (~debugFlag.WINDOW);
                }
            }

            if (currentFlags != newFlags) {
                app.setDebugLogging(debugFilename, newFlags);
            }

            return false;
        });
    }

    if (!isNull(window.debugOptionsView.fileElement)) {
        window.debugOptionsView.fileElement.prop("checked", (app.getDebugFlags() & debugFlag.FILE) == debugFlag.FILE);
    }

    if (!isNull(window.debugOptionsView.consoleElement)) {
        window.debugOptionsView.consoleElement.prop("checked", (app.getDebugFlags() & debugFlag.WINDOW) == debugFlag.WINDOW);
    }
});


function DmgController(task, args) {
    var self = this;

    this.observers = [];
    
    this.filename = "";
    this.mountPoint = "";
    this.mountExitCode = -1;
    this.output = "";
    this.action = "attach";
    
    this.process = null;
    this.pipe = null;
    this.elevationRights = processElevationRights.INVOKER;
    
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

DmgController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
    if(!isNull(this.process)) {
        this.process.release();
        this.process = null;
    }
    if (!isNull(this.pipe)) {
        this.pipe.release();
        this.pipe = null;
    }
};

DmgController.prototype.reset = function(task, info) {
    var self = this;
    if(!isNull(this.process)) {
        this.process.release();
        this.process = null;
    }
    if (!isNull(this.pipe)) {
        this.pipe.release();
        this.pipe = null;
    }
    
    this.process = createProcess();
    this.pipe = createPipe();
    this.output = "";
    this.mountExitCode = -1;
    
    this.observers.push(notificationCenter.addInstanceObserver("Process", "Complete", this.process, function(sender, info) { self.onProcessComplete(task, info); }));
    
    this.observers.push(notificationCenter.addInstanceObserver("Pipe", "Read", this.pipe, function(sender, info) { self.onPipeRead(task, info); }));
};

DmgController.prototype.onStart = function(task, info) {
    var args = "";

    task.assertArgument("filename");

    switch (task.args.type.toLowerCase()) {
        case "mountdmg":
            this.action = "attach";
            notificationCenter.fire("Task", "UpdateView", task, { "status": "DiskImage_Mounting" });
            break;
        case "unmountdmg":
            this.action = "eject";
            break;
    }
    
    this.filename = task.getStringArgument("filename");

    if (hasOwnProperty(task.args, "target")) {
        this.mountPoint = "/Volumes/{0}/".format(task.args.target);
    } else {
        this.mountPoint = "/Volumes/{0}/".format(app.expandString("{SHA1:" + this.filename.toLowerCase() + "}"))
    }
    
    if (hasOwnProperty(task.args, "elevationRights")) {
        switch (task.args.elevationRights.toLowerCase()) {
            case "user":
                this.elevationRights = processElevationRights.USER;
                break;
            case "elevated":
                this.elevationRights = processElevationRights.ELEVATED;
                break;
            case "asinvoker":
                this.elevationRights = processElevationRights.INVOKER;
                break;
        }
    }
    
    this.runMountUtil(task, info);
};

DmgController.prototype.setError = function(task, info, exitCodeStr, defaultExitCodeStr) {
    if (hasOwnProperty(task.args, "errorMap") && hasOwnProperty(task.args.errorMap, exitCodeStr)) {
        task.error(task.args.errorMap[exitCodeStr]);
    } else {
        task.error(defaultExitCodeStr);
    }
};

DmgController.prototype.runMountUtil = function(task, info, action) {
    var args;
    
    if (typeof(action) !== "undefined") {
        this.action = action;
    }
    if (this.action == "attach") {
        args = "{0} '{1}' -mountpoint '{2}' -nobrowse".format(this.action , this.filename, this.mountPoint);
    } else {
        args = "{0} '{1}' -force".format(this.action, this.mountPoint);
    }

    this.reset(task, info);

    this.pipe.setBufferSize(1024);
    this.pipe.setName(app.expandString("{GUID}"));
    this.pipe.setOpenExisting(false);
    this.pipe.start();

    task.debugPrint("hdiutil mounting {0}\n".format(this.mountPoint));
    task.debugPrint("hdiutil args {0}\n".format(args));

    this.process.setApplicationName("/bin/sh");
    this.process.setArguments(app.expandString("-c \"/usr/bin/hdiutil " + args + " &> {PipePath}" + this.pipe.getName() + ";echo **EOP**$? > {PipePath}" + this.pipe.getName() + "\""));
    this.process.setShowWindow(false);
    this.process.setElevationRights(this.elevationRights);
    
    this.process.launch();
};

DmgController.prototype.onPipeRead = function(task, info) {
    var self = this, eopIndex = -1;
    this.output += app.base64Decode(info.buffer);
    eopIndex = this.output.indexOf("**EOP**");
    if (eopIndex != -1) {
        this.mountExitCode = parseInt(this.output.substring(eopIndex + 7));
        this.output = this.output.substring(0, eopIndex);
        
        task.debugPrint("hdiutil mount exitcode {0}\n".format(this.mountExitCode));
        
        if (this.action == "attach") {
            if (this.mountExitCode != 0) {
                task.debugPrint("hdiutil output {0}\n".format(this.output));
                this.setError(task, info, this.mountExitCode, "DiskImage_MountFailure");
            }
            if (!isNull(task.args.mounted)) {
                task.runSubAction("mounted", null, function(t, i) {
                    self.runMountUtil(task, info, "eject");
                });
            } else {
                this.onComplete(task, info);
            }
        } else {
            this.onComplete(task, info);
        }
    }
};

DmgController.prototype.onProcessComplete = function(task, info) {
    task.debugPrint("hdiutil exitcode {0} complete {1}\n".format(info.exitCode, info.successful));
    
    if ((info.successful === false) || (info.exitCode != 0)) {
        this.setError(task, info, info.exitCode, "DiskImage_LaunchFailure");
    }
};

DmgController.prototype.onComplete = function(task, info) {
    task.complete(info);
};

registerTaskController("mountDmg", DmgController);
registerTaskController("unmountDmg", DmgController);
registerTaskView("mountDmg", StatusView);
registerTaskView("unmountDmg", StatusView);

function FileSystemController(task, args) {
    var self = this;

    this.observers = [];
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

FileSystemController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

FileSystemController.prototype.translateError = function(task, error) {
    if (error !== 0) {
        task.error("OSError_" + osError.nameFromId(error));
    }
};

FileSystemController.prototype.onFileErase = function(task, info) {
    var self = this;

    task.assertArgument("filename");

    if (getObjectType(task.args.filename.forEach) === "function") {
        task.args.filename.forEach(function(filename) {
            self.translateError(task, platform.fileErase(app.expandString(filename)));
        });
    } else {
        this.translateError(task, platform.fileErase(app.expandString(task.args.filename)));
    }
    task.complete();
};

FileSystemController.prototype.onFileCopy = function(task, info) {
    var self = this;

    task.assertArgument("filelist");

    var filelist=task.args.filelist;
    if (getObjectType(filelist.forEach) === "function") {
        filelist.forEach(function(filename) {
            var separator=filename.indexOf("->");
            if(separator > 0) {
                self.translateError(task, platform.fileCopy(app.expandString(filename.substr(0,separator)),app.expandString(filename.substr(separator+2))));
            } else {
                task.error("OSError_None");
            }
        });
    } else {
        var separator=filelist.indexOf("->");
        if(separator > 0) {
            self.translateError(task, platform.fileCopy(app.expandString(filelist.substr(0,separator)),app.expandString(filelist.substr(separator+2))));
        } else {
            task.error("OSError_None");
        }
    }
    task.complete();
};

FileSystemController.prototype.onDirectoryErase = function(task, info) {
    var self = this;

    task.assertArgument("directory");

    if (getObjectType(task.args.directory.forEach) === "function") {
        task.args.directory.forEach(function(directory) {
            directory=app.expandString(directory);
            if(directory) {
                self.translateError(task, platform.directoryErase(directory));
            } else {
                task.error("OSError_None");
            }
        });
    } else {
        var directory=app.expandString(task.args.directory);
        if(directory) {
            this.translateError(task, platform.directoryErase(directory));
        } else {
            task.error("OSError_None");
        }
    }
    task.complete();
};

FileSystemController.prototype.onDirectoryCreate = function(task, info) {
    var self = this;

    task.assertArgument("directory");

    if (getObjectType(task.args.directory.forEach) === "function") {
        task.args.directory.forEach(function(directory) {
            if(!window.platform.directoryExists(app.expandString(directory))) {
                 self.translateError(task, platform.directoryCreate(app.expandString(directory)));
            }
        });
    } else {
        if(!window.platform.directoryExists(app.expandString(task.args.directory))) {
            this.translateError(task, platform.directoryCreate(app.expandString(task.args.directory)));
        }
    }
    task.complete();
};

FileSystemController.prototype.onFileExists = function(task, info) {
    task.assertArgument("filename");

    var result = true;
    if (getObjectType(task.args.filename.forEach) === "function") {
        task.args.filename.forEach(function(filename) {
            result = result && window.platform.fileExists(app.expandString(filename));
        });
    } else {
        result = window.platform.fileExists(app.expandString(task.args.filename));
    }
    
    if (result) {
        task.runSubAction("exists", null, function(subTask, subTaskInfo) {
            task.complete();
        });
    } else {
        task.runSubAction("missing", null, function(subTask, subTaskInfo) {
            task.complete();
        });
    }
};

FileSystemController.prototype.onDirectoryExists = function(task, info) {
    task.assertArgument("directory");
    
    var result = window.platform.directoryExists(app.expandString(task.args.directory));

    if (result) {
        task.runSubAction("exists", null, function(subTask, subTaskInfo) {
            task.complete();
        });
    } else {
        task.runSubAction("missing", null, function(subTask, subTaskInfo) {
            task.complete();
        });
    }
};

FileSystemController.prototype.onStart = function(task, info) {
    switch (task.args.type) {
        case "deleteFile":
            this.onFileErase(task, info);
            break;
        case "copyFile":
            this.onFileCopy(task, info);
            break;
        case "deleteDirectory":
            this.onDirectoryErase(task, info);
            break;
        case "createDirectory":
            this.onDirectoryCreate(task, info);
            break;
        case "checkFileExists":
            this.onFileExists(task, info);
            break;
        case "checkDirectoryExists":
            this.onDirectoryExists(task, info);
            break;
        default:
            host.assert(false, "Unknown type in FileSystemController ({0})".format(task.args.type));
            break;
    }
};

registerTaskController("copyFile", FileSystemController);
registerTaskController("deleteFile", FileSystemController);
registerTaskController("deleteDirectory", FileSystemController);
registerTaskController("createDirectory", FileSystemController);
registerTaskController("checkFileExists", FileSystemController);
registerTaskController("checkDirectoryExists", FileSystemController);

/*jslint debug: true*/
(function() {
    var loadCallback;

    /*!
    * \file host.js
    * \brief File containing Host class
    */

    /*!
    * \class Host
    * \brief Host Top level container for the host
    */
    function Host() {
        this.enableDebugging = app.getSecurityEnabled() === false && app.isCommandFieldSet("debugscript");
        this.isWin = false;
        this.isMac = false;
        this.isCEF = app.expandString("{Host}").toLowerCase() === "cef";
        this.isIE6 = app.expandString("{Host}{HostMajorVersion}").toLowerCase() === "ie6";
        this.isRemote = app.isCommandFieldSet("remoteserver");
        this.instanceId = "Host";

        if (app.getSecurityEnabled() === false && app.isCommandFieldSet("ie6class")) {
            this.isIE6 = true;
        }

        switch (app.expandString("{SystemShortName}".toLowerCase())) {
            case "win": this.isWin = true; break;
            case "mac": this.isMac = true; break;
        }
    }

    /*!
    * elevates the host
    */
    Host.prototype.elevate = function() {
        if (app.getElevated() === false) {
            app.setRestartElevated(true);
            app.setRestart(true);
            return true;
        }

        return false;
    };

    /*!
    * creates an id from a string
    * \tparam string str string to create id from
    * \treturn string id created from string
    */
    Host.prototype.idFromString = function(str) {
        return app.expandString("{SHA1:{Lower:" + str + "}}");
    };

    /*!
    * converts a url to a filename in the specified directory
    * \tparam string url url to convert
    * \tparam string directory output directory
    * \tparam string extension extension of filename
    * \treturn string path to file
    */
    Host.prototype.urlToFileName = function(url, directory, extension) {
        var fileName;
        fileName = url.replace(app.expandString("{ContentUrl}"), app.expandString("{ModuleFileName}\\"));
        fileName = app.expandString(directory + "{SHA1:" + fileName.toLowerCase() + "}" + extension);
        return fileName;
    };

    /*!
    * gets a JSON object from the skin
    * \tparam string path path of json object
    * \tparam event completeCallback called when function is complete with json object as parameter
    */
    Host.prototype.extractJSON = function(path, completeCallback) {
        this.extractContent(path, function(info) {
            if (info.successful === false) {
                completeCallback(null);
                return;
            }

            var content = interop.parseJSON(info.content);
            completeCallback(content);
            content = null;
        });
    };

    /*!
    * dynamically extract content from skin
    * \tparam string path path of the content to retrieve
    * \tparam event completeCallback called when function is complete with successful parameter
    */
    Host.prototype.extractContent = function(path, completeCallback) {
        var skinExtract = createSkinFileExtract();
        var observers = [];

        skinExtract.setFilename(path);

        observers.push(notificationCenter.addInstanceObserver("SkinFileExtract", "Complete", skinExtract, function(sender, info) {
            var offset = 0, chunk, chunkLength = 4000, content = null;

            observers.forEach(function(observer) {
                observer.release();
            });
            observers = [];

            if (info.successful === true) {
                content = "";
                do {
                    chunk = app.base64Decode(skinExtract.getBuffer(offset, chunkLength));
                    content += chunk;
                    offset += chunkLength;
                } while (chunk.length > 0);

                chunk = null;
            }

            if (completeCallback !== null) {
                completeCallback({ "successful": info.successful, "content": content });
            }

            content = null;

            skinExtract.release();
        }));
        skinExtract.start();
    };

    /*!
    * get a language string
    * \tparam string str name of the string to get
    */
    Host.prototype.getLanguageString = function(str) {
        if (isNull(Language) || hasOwnProperty(Language, str) === false) {
            return str;
        }
        return app.expandString(Language[str]);
    };

    /*!
    * load a specific language JS
    * \tparam string langCode language code
    * \tparam string countryCode country code
    * \tparam event completeCallback called when function is complete with successful parameter
    */
    Host.prototype.loadLanguageByCode = function(langCode, countryCode, completeCallback) {
        var lowerLang = langCode.toLowerCase();
        var lowerCountry = countryCode.toLowerCase();

        window.Language = {};

        host.extractJSON("locale.json", function(LocalLanguage) {
            var locale = "{0}-{1}".format(lowerLang, lowerCountry),
                langCodes = ["us", "en", "en-us", lowerLang, lowerCountry, locale];
            if (isNull(LocalLanguage)) {
                if (!isNull(completeCallback)) {
                    completeCallback({ "successful": false });
                }
                return;
            }

            langCodes.forEach(function(langCode) {
                if (hasOwnProperty(LocalLanguage, langCode)) {
                    app.debugPrint("Loading localization ({0})\n".format(langCode));
                    mergeObjectProperties(window.Language, LocalLanguage[langCode], true);
                }
            });

            completeCallback({ "successful": true });
        });
    };

    /*!
    * open a skin window
    * \tparam string url url to the window configuration to open
    * \treturn SkinWindow handle to SkinWindow
    */
    Host.prototype.openWindow = function(url) {
        var instanceId = "", retVal = null;
        instanceId = app.openWindow(app.expandString(url));
        if (instanceId.length > 0) {
            retVal = window.attachSkinWindow(instanceId);
        }
        return retVal;
    };

    /*!
    * basic assertion function
    * \tparam bool cond condition to test
    * \tparam string str string to display if assertion fails
    */
    Host.prototype.assert = function(cond, str) {
        if (!cond) {
            app.debugPrint(str + "\n");
            if (!isNull(window.console) && !isNull(window.console.error)) {
                console.error(str);
            }
            this.debugBreak();
        }
    };

    /*!
    * basic debug break function (set host.enableDebugging to true to allow)
    */
    Host.prototype.debugBreak = function() {
        if (this.enableDebugging === true) {
            debugger;
        }
    };

    window.host = new Host();
} ());

(function() {
    var loaded, loadComplete, loadCheck, topLevel;

    window.Language = null;

    loaded = false;
    topLevel = false;

    $(document).ready(function() {
        var currentCursor = "";

        $(document).mousemove(function(e) {
            if (!isNull(window.skinWindow)) {
                var cursor = $(e.target).css("cursor")
                if (currentCursor !== cursor) {
                    window.skinWindow.setCursor(cursor);
                    currentCursor = cursor;
                }
            }
        });
    });

    loadComplete = function() {
        notificationCenter.addInstanceObserver("SkinWindow", "DidClose", window.skinWindow, function(sender, info) {
            notificationCenter.fire("Host", "DidUnload", host, {});
        });

        notificationCenter.fire("Host", "DidLoad", host, {});
        loaded = true;
    };

    loadCheck = function() {
        if (loaded === true) {
            return;
        }

        try {
            document.documentElement.doScroll("left");
        } catch (e) {
            setTimeout(loadCheck, 1);
            return;
        }
        // and execute any waiting functions
        loadComplete();
    };

    if (document.addEventListener) {
        window.addEventListener("load", loadComplete, false);
    } else if (document.attachEvent) {
        window.attachEvent("onload", loadComplete);

        // Continually check to see if the document is ready
        try {
            topLevel = window.frameElement === null;
        } catch (e) { }

        // If the window is scrollable it must be loaded
        if (document.documentElement.doScroll && topLevel) {
            loadCheck();
        }
    }
} ());

function HostController(task, args) {
    var self = this;

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

HostController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

HostController.prototype.onShutdown = function(task, info) {
    function shutdownCallback() {
        if (hasOwnProperty(task.args, "implode") && task.args.implode === true) {
            app.implode();
        }
        if (hasOwnProperty(task.args, "restartElevated") && task.args.restartElevated === true) {
            app.setRestartElevated(true);
            app.setRestart(true);
        } else if (hasOwnProperty(task.args, "restart") && task.args.restart === true) {
            app.setRestart(true);
        } else {
            app.closeAll();
        }
    }

    if (hasOwnProperty(task.args, "error")) {
        task.error(task.args.error);
    }

    task.complete(); // Call complete before shutdown so workflow doesn't cancel item

    if (hasOwnProperty(task.args, "delay")) {
        setTimeout(shutdownCallback, task.args.delay);
    } else {
        shutdownCallback();
    }
};

HostController.prototype.onMinimizeWindow = function(task, info) {
    skinWindow.minimize();
    task.complete();
};

HostController.prototype.onRestoreWindow = function(task, info) {
    skinWindow.restore();
    task.complete();
};

HostController.prototype.onIsCommandFieldSet = function(task, info) {
    task.assertArgument("name");

    function taskComplete(subTask, subTaskInfo) {
        task.complete();
    }
    if (app.isCommandFieldSet(task.getStringArgument("name"))) {
        task.runSubAction("yes", null, taskComplete);
    } else {
        task.runSubAction("no", null, taskComplete);
    }
};

HostController.prototype.onCommandLineCompare = function(task, info) {
    task.assertArgument("key");
    task.assertArgument("value");

    var key = task.args.key;
    var value = app.expandString(task.args.value);
    var clValue = app.getCommandFieldByName(key);

    function taskComplete(subTask, subTaskInfo) {
        task.complete();
    }
    if (clValue.length === 0) {
        task.runSubAction("notEqualTo", null, function(){
            task.runSubAction("missing", null, taskComplete);
        });
    } else if (clValue === value) {
        task.runSubAction("equalTo", null, taskComplete);
    } else if (clValue > value) {
        task.runSubAction("notEqualTo", null, function(){
            task.runSubAction("greaterThan", null, taskComplete);
        });
    } else {
        task.runSubAction("notEqualTo", null, function(){
            task.runSubAction("lessThan", null, taskComplete);
        });
    }
};

HostController.prototype.onStringCompare = function(task, info) {
    task.assertArgument("stringOne");
    task.assertArgument("stringTwo");

    var stringOne = task.getStringArgument("stringOne");
    var stringTwo = task.getStringArgument("stringTwo");

    function taskComplete(subTask, subTaskInfo) {
        task.complete();
    };

    if (stringOne === stringTwo) {
        task.runSubAction("equalTo", null, taskComplete);
    } else if (stringOne.toLowerCase() === stringTwo.toLowerCase()) {
        task.runSubAction("equalToIgnoreCase", null, taskComplete);
    } else if (stringOne > stringTwo) {
        task.runSubAction("notEqualTo", null, function() {
            task.runSubAction("greaterThan", null, taskComplete);
        });
    } else {
        task.runSubAction("notEqualTo", null, function() {
            task.runSubAction("lessThan", null, taskComplete);
        });
    }
};

HostController.prototype.onPrompt = function(task, info) {
    task.assertArgument("text");
    task.assertArgument("caption");
    task.assertArgument("buttons");

    var text = task.args.text;
    var caption = task.args.caption;
    var buttons = task.args.buttons;
    var type = 0;

    if (getObjectType(buttons) === "string") {
        var buttonParts = buttons.split("|");
        buttonParts.forEach(function(button) {
            switch (button.toLowerCase()) {
                case "ok": type += skinWindowPrompt.OK; break;
                case "cancel": type += skinWindowPrompt.CANCEL; break;
                case "yes": type += skinWindowPrompt.YES; break;
                case "no": type += skinWindowPrompt.NO; break;
            }
        });
    }
    else {
        type = Number(buttons);
    }

    var response = skinWindow.prompt(host.getLanguageString(text), host.getLanguageString(caption), type);
    var subTask = "";

    switch (response) {
        case skinWindowPrompt.OK: subTask = "ok"; break;
        case skinWindowPrompt.CANCEL: subTask = "cancel"; break;
        case skinWindowPrompt.YES: subTask = "yes"; break;
        case skinWindowPrompt.NO: subTask = "no"; break;
        default: task.error("HostError_Unknown"); break;
    }
    if (subTask) {
        task.runSubAction(subTask, null, function(subTask, subInfo) { });
    }
    task.complete();
};

HostController.prototype.onCheckProgramRunning = function(task, info) {
    task.assertArgument("filename");

    var result = window.platform.isProcessRunning(app.expandString(task.args.filename));

    if (result) {
        task.runSubAction("running", null, function(subTask, subTaskInfo) {
            task.complete();
        });
    } else {
        task.runSubAction("notrunning", null, function(subTask, subTaskInfo) {
            task.complete();
        });
    }
};

HostController.prototype.onCheckCertificate = function(task, info) {
    task.assertArgument("filename");
    task.assertArgument("commonName");

    var result = window.platform.authenticateCertificate(app.expandString(task.args.filename),app.expandString(task.args.commonName));
    if (result) {
        task.runSubAction("passed", null, function(subTask, subTaskInfo) {
            task.complete();
        });
    } else {
        task.runSubAction("failed", null, function(subTask, subTaskInfo) {
            task.complete();
        });
    }
};

HostController.prototype.onStart = function(task, info) {
    switch (task.args.type) {
        case "shutdown":
            this.onShutdown(task, info);
            break;
        case "minimizeWindow":
            this.onMinimizeWindow(task, info);
            break;
        case "restoreWindow":
            this.onRestoreWindow(task, info);
            break;
        case "isCommandFieldSet":
            this.onIsCommandFieldSet(task, info);
            break;
        case "checkCommandLine":
            this.onCommandLineCompare(task, info);
            break;
        case "prompt":
            this.onPrompt(task, info);
            break;
        case "stringCompare":
            this.onStringCompare(task, info);
            break;
        case "checkProgramRunning":
            this.onCheckProgramRunning(task, info);
            break;
        case "checkCertificate":
            this.onCheckCertificate(task, info);
            break;
        default:
            host.assert(false, "Unknown type in HostController ({0})".format(task.args.type));
            break;
    }
};

registerTaskController("shutdown", HostController);
registerTaskController("minimizeWindow", HostController);
registerTaskController("restoreWindow", HostController);
registerTaskController("isCommandFieldSet", HostController);
registerTaskController("checkCommandLine", HostController);
registerTaskController("prompt", HostController);
registerTaskController("stringCompare", HostController);
registerTaskController("checkProgramRunning", HostController);
registerTaskController("checkCertificate", HostController);

(function($){
    // Because of the way we use trident, mouse messages can be spammed into the queue, causing query
    // to not work correctly.  These special events override the default behaviors of the mouse events
    // and provide a more stable mouse experience.
    if (app.expandString("{Host}").toLowerCase() !== "ie")
        return;

    $.event.special.mousemove = { 
        add: function(handleObj) {
            var old_handler = handleObj.handler, mouseInfo = { lastX: 0, lastY: 0 }, elem = $(this);

            handleObj.handler = function(event) {
                if (event.pageX >= 0 && event.pageY >= 0) {
                    if (event.pageX !== mouseInfo.lastX  || event.pageY !== mouseInfo.lastY) {
                        mouseInfo.lastX = event.pageX;
                        mouseInfo.lastY = event.pageY;
                        return old_handler.apply(elem, [ event ]);
                    }
                }
                event.preventDefault();
            };
        }
    };

    $.event.special.mouseenter = {
        add: function(handleObj) {
            var old_handler = handleObj.handler, allow = true, elem = $(this);

            $(this).mousemove(function(event) {
                if (allow == true) {
                    allow = false;
                    return old_handler.apply(elem, [ event ]);
                }
            });
            
            $(this).mouseleave(function(event) {
                allow = true;
            });
            
            handleObj.handler = function(event) {
                event.preventDefault();
            };
        }
    };
    
    $.event.special.mouseleave = {
        add: function(handleObj) {
            var old_handler = handleObj.handler, mouseInfo = { lastX: -1, lastY: -1 }, elem = $(this), lastEvent = null;

            handleObj.leaveObs = notificationCenter.addInstanceObserver("SkinWindow", "DidMouseLeave", window.skinWindow, function() {
                if (mouseInfo.lastX >= 0 && mouseInfo.lastY >= 0) {
                    mouseInfo.lastX = -1;
                    mouseInfo.lastY = -1;

                    if (!isNull(lastEvent)) {
                        lastEvent.pageX = -1;
                        lastEvent.pageY = -1;
                        old_handler.apply(elem, [ lastEvent ]);
                        lastEvent = null;
                    }
                }
            });
            
            elem.mousemove(function(event) {
                mouseInfo.lastX = event.pageX;
                mouseInfo.lastY = event.pageY;
            });
            
            handleObj.handler = function(event) {
                lastEvent = event;
                
                if (event.pageX >= 0 && event.pageY >= 0) {
                    if (event.pageX !== mouseInfo.lastX  || event.pageY !== mouseInfo.lastY) {
                        lastEvent = null;
                        return old_handler.apply(elem, [ event ]);
                    }
                }
                event.preventDefault();
            };
        },
        
        remove: function(handleObj) {
            handleObj.leaveObs.release();
            handleObj.leaveObs = null;
        }
    };
    
    $.event.special.mouseover = {
        add: function(handleObj) {
            var old_handler = handleObj.handler, elem = $(this);

            elem.mouseenter(function(event) {
                return old_handler.apply(elem, [ event ]);
            });

            handleObj.handler = function(event) {
                event.preventDefault();
            };
        }
    };
    
    $.event.special.mouseout = {
        add: function(handleObj) {
            var old_handler = handleObj.handler, elem = $(this);

            elem.mouseleave(function(event) {
                return old_handler.apply(elem, [ event ]);
            });

            handleObj.handler = function(event) {
                event.preventDefault();
            };
        }
    };
})(jQuery);

function LaunchController(task, args) {
    var self = this;

    this.pipe = null;
    this.process = null;
    this.parent = task.parent;
    this.output = "";

    this.observers = [];
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));

    this.resetObservers = [];
}

LaunchController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
    this.reset();
};

LaunchController.prototype.reset = function(task) {
    if (!isNull(task)) {
        task.clearWarnings();
        task.clearErrors();
    }

    this.resetObservers.forEach(function(observer) {
        observer.release();
    });
    this.resetObservers = [];

    if (!isNull(this.process)) {
        this.process.release();
        this.process = null;
    }
    if (!isNull(this.pipe)) {
        this.pipe.release();
        this.pipe = null;
    }
};

LaunchController.prototype.onStart = function(task, info) {
    var self = this;

    task.assertArgument("application");

    this.reset(task);
    this.process = createProcess();
    this.resetObservers.push(notificationCenter.addInstanceObserver("Process", "Complete", this.process, function(sender, info) { self.onProcessComplete(task, info); }));
    this.resetObservers.push(notificationCenter.addInstanceObserver("Process", "Ready", this.process, function(sender, info) { self.onProcessReady(task, info); }));

    notificationCenter.fire("Task", "UpdateView", task, { "status": "Launch_Start" });

    if (hasOwnProperty(task.args, "application")) {
        this.process.setApplicationName(task.getStringArgument("application"));
    }

    if (hasOwnProperty(task.args, "workingDirectory")) {
        this.process.setWorkingDirectory(task.getStringArgument("workingDirectory"));
    }

    if (hasOwnProperty(task.args, "arguments")) {
        if (getObjectType(task.args.arguments) == "array") {
            this.process.setArguments(app.expandString("\"" + task.args.arguments.join("\" \"") + "\""));
        } else {
            this.process.setArguments(app.expandString(task.args.arguments));
        }
    }

    if (hasOwnProperty(task.args, "rawArguments")) {
        this.process.setArguments(task.getStringArgument("rawArguments"));
    }

    if (hasOwnProperty(task.args, "elevationRights")) {
        switch (task.args.elevationRights.toLowerCase()) {
            case "user":
                this.process.setElevationRights(processElevationRights.USER);
                break;

            case "elevated":
                this.process.setElevationRights(processElevationRights.ELEVATED);
                break;

            case "asinvoker":
                this.process.setElevationRights(processElevationRights.INVOKER);
                break;
        }
    }

    if (hasOwnProperty(task.args, "sha1")) {
        this.process.setSha1(app.expandString(task.args.sha1));
    }

    if (hasOwnProperty(task.args, "sha1Target")) {
        this.process.setSha1Target(task.getStringArgument("sha1Target"));
    }

    if (hasOwnProperty(task.args, "authenticateTarget")) {
        this.process.setAuthenticateTarget(app.expandString(task.args.authenticateTarget));
    }

    if (hasOwnProperty(task.args, "authenticateType")) {
        switch (task.args.authenticateType.toLowerCase()) {
            case "none":
                this.process.setAuthenticateType(processAuthenticateType.NONE);
                break;
                
            case "zip":
                this.process.setAuthenticateType(processAuthenticateType.ZIP);
                break;

            case "library":
                this.process.setAuthenticateType(processAuthenticateType.LIBRARY);
                break;
        }
    }

    if (hasOwnProperty(task.args, "showWindow")) {
        this.process.setShowWindow(task.args.showWindow);
    }

    if (hasOwnProperty(task.args, "successOutput") && host.isMac) {
        this.pipe = createPipe();
        this.resetObservers.push(notificationCenter.addInstanceObserver("Pipe", "Read", this.pipe, function(sender, info) { self.onPipeRead(task, info); }));
        this.pipe.setBufferSize(1024);
        this.pipe.setName(app.expandString("{GUID}"));
        this.pipe.setOpenExisting(false);
        this.pipe.start();

        this.process.setArguments(app.expandString("-c \"" + this.process.getApplicationName().split(" ").join("\\ ") + " " + this.process.getArguments() + " &> {PipePath}" + this.pipe.getName() + ";echo **EOP** > {PipePath}" + this.pipe.getName() + "\""));
        this.process.setApplicationName("/bin/sh");
    }

    task.debugPrint("command = {0}\n".format(this.process.getApplicationName()));
    task.debugPrint("working dir = {0}\n".format(this.process.getWorkingDirectory()));
    task.debugPrint("args = {0}\n".format(this.process.getArguments()));

    this.process.launch();
};

LaunchController.prototype.onPipeRead = function(task, info) {
    var self = this, successful = false, hasSpecificError = false;
    this.output += app.base64Decode(info.buffer);
    if (this.output.indexOf("**EOP**") != -1) {
        this.output = this.output.replaceAll("**EOP**", "");
        task.debugPrint("output = {0}\n".format(this.output));
        if (getObjectType(task.args.successOutput) == "array") {
            task.args.successOutput.forEach(function(successOutput) {
                if (self.output.toLowerCase().indexOf(successOutput.toLowerCase()) != -1) {
                    successful = true;
                }
            });
        } else if (this.output.indexOf(task.args.successOutput) != -1) {
            successful = true;
        }
        if (successful === false) {
            if (hasOwnProperty(task.args, "errorOutputMap") || !isNull(task.args.errorOutputMap)) {
                 $.each(task.args.errorOutputMap, function(key, value) {
                    if (self.output.toLowerCase().indexOf(key.toLowerCase()) != -1) {
                        task.error(value);
                        hasSpecificError = true;
                    }
                });
            }
            if (hasSpecificError === false) {
                task.error("Launch_Failure");
            }
        }
        this.onComplete(task, { "successful": successful });
    }
};

LaunchController.prototype.onProcessReady = function(task, info) {
    if (hasOwnProperty(task.args, "waitForExit") && task.args.waitForExit === false) {
        notificationCenter.fire("Task", "UpdateView", task, { "status": "Launch_Complete" });
        this.onComplete(task, info);
    }
};

LaunchController.prototype.onProcessComplete = function(task, info) {
    var complete = false, exitCodeStr = info.exitCode.toString();

    task.debugPrint("successful {0} exitCode {1}\n".format(info.successful, info.exitCode));

    if (info.successful === false) {
        task.error("Launch_Failure");
        this.onComplete(task, info);
        return;
    }

    // Ignore immediate exit code and wait for output from pipe
    if (hasOwnProperty(task.args, "successOutput") || !isNull(task.args.successOutput)) {
        return;
    }

    if (hasOwnProperty(task.args, "successCode")) {
        if (getObjectType(task.args.successCode.forEach) === "function") {
            task.args.successCode.forEach(function(successCode) {
                if (info.exitCode === successCode) {
                    complete = true;
                }
            });
        } else {
            if (info.exitCode === task.args.successCode) {
                complete = true;
            }
        }
    }

    if (complete === true) {
        this.onComplete(task, info);
        return;
    }

    // Need to do both of before returning to support multiple flags
    if (hasOwnProperty(task.args, "warningFlagsMap")) {
        $.each(task.args.warningFlagsMap, function(key, value) {
            if (thisIs(info.exitCode, Number(key))) {
                task.warning(value);
                complete = true;
            }
        });
    }

    if (hasOwnProperty(task.args, "errorFlagsMap")) {
        $.each(task.args.errorFlagsMap, function(key, value) {
            if (thisIs(info.exitCode, Number(key))) {
                task.error(value);
                complete = true;
            }
        });
    }

    if (complete === false) {
        if (hasOwnProperty(task.args, "warningMap") && hasOwnProperty(task.args.warningMap, exitCodeStr)) {
            task.warning(task.args.warningMap[exitCodeStr]);
        } else {
            if (hasOwnProperty(task.args, "errorMap") && hasOwnProperty(task.args.errorMap, exitCodeStr)) {
                task.error(task.args.errorMap[exitCodeStr]);
            } else {
                task.error("Launch_UnknownCode");
            }
        }
    }

    this.onComplete(task, info);
};

LaunchController.prototype.onComplete = function(task, info) {
    if (!task.hasError() && !task.hasWarning()) {
        notificationCenter.fire("Task", "UpdateView", task, { "status": "Launch_Complete" });
    }
    task.complete();
};

registerTaskController("launch", LaunchController);
registerTaskView("launch", StatusView);

function LoadInteropController(task, args) {
    var self = this;

    this.observers = [];

    this.skinExtract = createSkinFileExtract();

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("SkinFileExtract", "Complete", this.skinExtract, function(sender, info) { self.onLoad(task, info); }));
    
    this.observers.push(notificationCenter.addObserver("App", "InteropLoaded", function(sender, info) { self.onInteropLoaded(task, info); }));
}

LoadInteropController.prototype.release = function() {
    this.skinExtract.release();

    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

LoadInteropController.prototype.onStart = function(task, info) {
    var obsInteropLoaded, interopArgs = {}, filename;

    task.assertArgument("name");
    task.assertArgument("filename");

    if (hasOwnProperty(task.args, "skinfilename")) {
        this.skinExtract.setFilename(app.expandString(task.args.skinfilename));
        this.skinExtract.setOutputFilename(app.expandString(task.args.filename));
        this.skinExtract.start();
    } else {
        this.onLoad(task, info);
    }
};

LoadInteropController.prototype.onInteropLoaded = function(task, info) {
    var interopArgs = {}, filename;

    filename = app.expandString(task.args.filename);
    if (info.fileName.toLowerCase() === filename.toLowerCase()) {
        if (info.successful === true) {
            window.interop.activeInteropLibs.push(task.args.name);
            
            mergeObjectProperties(interopArgs, task.args);
            notificationCenter.fireAfterDelay("Interop", "DidLoad", 0, task, interopArgs);
        } else {
            task.error("Interop_LoadFailed");
        }
        task.complete(info);
    }
};

LoadInteropController.prototype.onLoad = function(task, info) {
    var interopArgs = {}, filename;

    filename = app.expandString(task.args.filename);

    mergeObjectProperties(interopArgs, task.args);
    interopArgs.cancel = false;

    notificationCenter.fire("Interop", "WillLoad", task, interopArgs);
    if (interopArgs.cancel === true) {
        app.debugPrint("Interop load cancelled ({0})".format(task.args.name));
        task.error("Interop_LoadCancel");
        task.complete();
        return;
    }

    app.loadInterop(filename);
};

registerTaskController("loadInterop", LoadInteropController);

function MacroController(task, args) {
    var self = this;

    this.observers = [];

    this.xhr = null;
    
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

MacroController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];

    if (!isNull(this.xhr)) {
        this.xhr.abort();
        this.xhr = null;
    }
};

MacroController.prototype.onStart = function(task, info) {
    var self = this;
    
    if (hasOwnProperty(task.args, "url")) {
        this.xhr = $.getJSON(app.expandString(task.args.url), function(data) {
            self.onContent(task, data);
        }).error(function() {
            task.error("Macro_RequestFail");
            task.complete();
        });
    } else if (hasOwnProperty(task.args, "content")) {
        if (getObjectType(task.args.content.format) === "function") {
            this.onContent(task, interop.parseJSON(app.expandString(task.args.content)));
        } else {
            this.onContent(task, task.args.content);
        }
    } else {
        task.complete();
    }
};

MacroController.prototype.onContent = function(task, contentJSON) {
    var self = this;

    if (getObjectType(contentJSON.forEach) === "function") {
        contentJSON.forEach(function(obj) {
            self.addTasks(task, obj);
        });
    } else {
        self.addTasks(task, contentJSON);
    }
};

MacroController.prototype.addTasks = function(task, obj) {
    var keys = getObjectProperties(obj), self = this;

    $.each(keys, function(idx, key) {
        task.debugPrint("adding macro {0}={1}\n".format(key, obj[key]));
        app.addMacro(key, obj[key]);
    });

    task.complete();
};

registerTaskController("macro", MacroController);


(function() {
    function MessageFormat() {
    }

    MessageFormat.prototype =
    {
        getTimeEstimate: function(estimatedSeconds) {
            var oneSecond = 1;
            var oneMinute = oneSecond * 60;
            var oneHour = oneMinute * 60;
            var oneDay = oneHour * 24;

            if (estimatedSeconds < 0) {
                return host.getLanguageString("UI_EstimatingTime");
            }

            if (estimatedSeconds < oneMinute) {
                return host.getLanguageString("UI_ShortTimeLeft");
            }

            if (estimatedSeconds > 7 * oneDay) {
                return host.getLanguageString("UI_LongTimeLeft");
            }

            var timeEstimateString = "";

            var days = (estimatedSeconds / oneDay).toString().split(".")[0];
            estimatedSeconds -= days * oneDay;
            if (days > 0) {
                timeEstimateString += " " + days + host.getLanguageString("UI_DayAbbreviation");
            }

            var hours = (estimatedSeconds / oneHour).toString().split(".")[0];
            estimatedSeconds -= hours * oneHour;
            if (hours > 0) {
                timeEstimateString += " " + hours + host.getLanguageString("UI_HourAbbreviation");
            }

            var minutes = (estimatedSeconds / oneMinute).toString().split(".")[0];
            estimatedSeconds -= minutes * oneMinute;
            if (minutes > 0) {
                timeEstimateString += " " + minutes + host.getLanguageString("UI_MinuteAbbreviation");
            }

            if (timeEstimateString.length > 0)
                return timeEstimateString + " " + host.getLanguageString("UI_Left");

            return host.getLanguageString("UI_EstimatingTime");
        },

        getTransferSpeed: function(speed) {
            var Ns = speed;
            if (Ns >= (1024 * 1024 * 1024)) {
                return (Ns / (1024 * 1024 * 1024)).toFixed(2) + " " + host.getLanguageString("UI_SpeedGB");
            }
            if (Ns >= (1024 * 1024)) {
                return (Ns / (1024 * 1024)).toFixed(2) + " " + host.getLanguageString("UI_SpeedMB");
            }
            if (Ns >= (1024)) {
                return (Ns / (1024)).toFixed(2) + " " + host.getLanguageString("UI_SpeedKB");
            }
            return "0.0 " + host.getLanguageString("UI_SpeedKB");
        },

        getBytesLeft: function(bytesLeft) {
            return this.getBytesStr(bytesLeft) + " " + host.getLanguageString("UI_BytesLeft");
        },

        getBytesRequired: function(bytesRequired) {
            return this.getBytesStr(bytesRequired) + " " + host.getLanguageString("UI_BytesRequired");
        },

        getBytesFree: function(bytesFree) {
            return this.getBytesStr(bytesFree) + " " + host.getLanguageString("UI_BytesFree");
        },

        getBytesStr: function(bytesLeft) {
            var downloadBytesLeft = bytesLeft, mbLeft = (downloadBytesLeft / (1024 * 1024));
            return mbLeft.toFixed(2);
        },

        getPatchesLeft: function(remainingCount) {
            return remainingCount + " " + host.getLanguageString("UI_PatchesLeft");
        },

        getPatchTitle: function(title, isRepair) {
            var titlePrefix = "";
            if (isRepair === true) {
                titlePrefix = host.getLanguageString("UI_Repairing");
            } else {
                titlePrefix = host.getLanguageString("UI_Updating");
            }
            if (titlePrefix.length > 0) {
                titlePrefix += " ";
            }
            return "{0}{1}".format(titlePrefix, host.getLanguageString(title));
        }
    };

    window.messageFormat = new MessageFormat();
} ());

function NotificationCheckpoint(type, notificationType, notification, filters, reports) {
    var self = this;
    
    host.assert(getObjectType(filters) === "array", "Invaild object type for filters");
    host.assert(getObjectType(reports) === "array", "Invaild object type for filters");

    this.observers = [];
    this.type = type;
    this.filters = filters;
    this.reports = reports;
    this.instanceId = app.expandString("{Guid}");

    this.observers.push(notificationCenter.addObserver(notificationType, notification, function(sender, info) { self.onTrigger(sender, info); }));
}

NotificationCheckpoint.prototype.checkFilter = function(sender, args, filter) {
    host.assert(hasOwnProperty(filter, "name"), "Filter does not contain name property");

    if (!hasOwnProperty(filter, "value")) {
        return true;
    }

    var value, filterValue;

    value = Tasks.expandValue(sender, args, filter.name);
    filterValue = Tasks.expandValue(sender, args, filter.value);

    host.assert(getObjectType(value) === getObjectType(filterValue), "Filter trying to compare different types ({0}: {1})".format(this.type, filter.name));

    if (!hasOwnProperty(filter, "operator")) {
        filter.operator = "=";
    }

    switch (filter.operator) {
        case "=": return value === filterValue;
        case "!=": return value !== filterValue;
        case ">": return value > filterValue;
        case "<": return value < filterValue;
        case ">=": return value >= filterValue;
        case "<=": return value <= filterValue;
        default: host.assert(false, "Unrecognized filter operator in {0}".format(this.type)); break;
    }

    return false;
};

NotificationCheckpoint.prototype.expandArguments = function(sender, args, value, valueArgs) {
    var returnValue = Tasks.expandValue(sender, args, value);
    if (!isNull(valueArgs)) {
        returnValue = returnValue.replace(/\{(\d+)\}/g, function(match, number) {
            return hasOwnProperty(valueArgs, number) ? host.getLanguageString(Tasks.expandValue(sender, args, valueArgs[number])) : host.getLanguageString(Tasks.expandValue(sender, args, match));
        });
    }

    return host.getLanguageString(returnValue);
};

NotificationCheckpoint.prototype.onTrigger = function(sender, args) {
    var self = this, filterPassed = true, checkpointArgs = {};

    this.filters.forEach(function(filter) {
        if (filterPassed === true && self.checkFilter(sender, args, filter) === false) {
            filterPassed = false;
        }
    });

    if (filterPassed === true) {
        this.reports.forEach(function(report) {
            var value = null;

            host.assert(hasOwnProperty(report, "name"), "Checkpoint report does not contain name property");
            host.assert(hasOwnProperty(report, "value"), "Checkpoint report {0} does not contain value property".format(report.name));

            checkpointArgs[report.name] = self.expandArguments(sender, args, report.value, report.args);
        });

        notificationCenter.fire("NotificationCheckpoint", self.type, sender, checkpointArgs);
    }
};

function createNotificationCheckpoint(type, notificationType, notification, filters, reports) {
    return new NotificationCheckpoint(type, notificationType, notification, filters, reports);
}

function loadNotificationCheckpoints(path, completeCallback) {
    path = app.expandString(path);

    if (isNull(window.notificationCheckpoints)) {
        window.notificationCheckpoints = [];
    }

    var checkpoints = {}, self = this, jsonLoaded = function(content) {
        var successful = false, i, value;

        if (!isNull(content)) {
            checkpoints = mergeObjectProperties(checkpoints, content);

            successful = true;
        } else {
            host.assert(false, "Failed to load checkpoint file {0}".format(path));
        }

        for (i in checkpoints) {
            if (hasOwnProperty(checkpoints, i)) {
                value = checkpoints[i];

                host.assert(hasOwnProperty(value, "type"), "Checkpoint file {0} item {1} missing type".format(path, i));
                host.assert(hasOwnProperty(value, "notificationType"), "Checkpoint file {0} item {1} missing notificationType".format(path, i));
                host.assert(hasOwnProperty(value, "notification"), "Checkpoint file {0} item {1} missing notification".format(path, i));
                host.assert(hasOwnProperty(value, "filters"), "Checkpoint file {0} item {1} missing filters".format(path, i));
                host.assert(hasOwnProperty(value, "reports"), "Checkpoint file {0} item {1} missing reports".format(path, i));

                window.notificationCheckpoints.push(createNotificationCheckpoint(value.type, value.notificationType, value.notification, value.filters, value.reports));
            }
        }

        if (!isNull(completeCallback)) {
            completeCallback({ "successful": successful });
        }
    };

    host.extractJSON(path, jsonLoaded);
}

function NotifyController(task, args) {
    var self = this;

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));

    // I don't add this to the observer list because I want it to remain resident after the load completes
    notificationCenter.addObserver("NotificationCheckpoint", "ShowNotify", function(sender, info) { self.onShowNotify(task, info); });
}

NotifyController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

NotifyController.prototype.onStart = function(task, info) {
    var self = this, url;

    task.assertArgument("checkpointPath");

    loadNotificationCheckpoints(task.args.checkpointPath, function() {
        task.complete();
    });
};

NotifyController.prototype.onShowNotify = function(task, info) {
    host.assert(!isNull(info.type), "NotifyController missing type");
    host.assert(!isNull(info.caption), "NotifyController missing caption");
    host.assert(!isNull(info.message), "NotifyController missing message");

    skinWindow.notify(info.type, info.caption, info.message);
};

registerTaskController("loadNotify", NotifyController);

function OpenController(task, args) {
    var self = this;

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

OpenController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

OpenController.prototype.onStart = function(task, info) {
    task.assertArgument("path");

    if (platform.shellOpen(task.args.path) === false) {
        task.error("ShellOpen_Error");
    }

    task.complete();
};

registerTaskController("open", OpenController);

$(document).ready(function() {
    function OptionsView() {
        this.instanceId = app.expandString("{Guid}");
        this.rootElement = null;
        this.protocolsElement = null;
        this.maxUploadRateElement = null;
        this.maxDownloadRateElement = null;
        this.maxFileWriteRateElement = null;
        this.maxFileReadRateElement = null;
        this.logExpirationDaysElement = null;
        this.langElement = null;
        this.allowContextMenu = true;
        this.allowP2P = app.getConfig("AllowP2P", "true").toBoolean();
        this.allowWeb = app.getConfig("AllowWeb", "true").toBoolean();
    }

    var rootElementClass = null;
    var downloadTypeBase = 100;
    var downloadMaxBase = 200;
    var uploadMaxBase = 300;
    var fileWriteMaxBase = 400;
    var fileReadMaxBase = 500;
    var langBase = 600;
    var appBase = 700;
    var logExpirationDaysBase = 800;
    var contextMenuItems = [];

    window.optionsView = new OptionsView();
    notificationCenter.fire("OptionsView", "Bind", window.optionsView, window.optionsView);

    if (isNull(window.optionsView.rootElement) &&
        isNull(window.optionsView.protocolsElement) &&
        isNull(window.optionsView.maxUploadRateElement) &&
        isNull(window.optionsView.maxDownloadRateElement) &&
        isNull(window.optionsView.maxFileWriteRateElement) &&
        isNull(window.optionsView.maxFileReadRateElement) &&
        isNull(window.optionsView.logExpirationDaysElement) &&
        isNull(window.optionsView.langElement) &&
        isNull(window.optionsView.formElement)) {
        window.optionsView = null;
        return;
    }

    if (!isNull(window.optionsView.protocolsElement) && window.optionsView.allowWeb === false) {
        window.optionsView.protocolsElement.find("option[value=\"w\"]").remove();
        window.optionsView.protocolsElement.find("option[value=\"wp\"]").remove();
    }

    if (!isNull(window.optionsView.protocolsElement) && window.optionsView.allowP2P === false) {
        window.optionsView.protocolsElement.find("option[value=\"p\"]").remove();
        window.optionsView.protocolsElement.find("option[value=\"wp\"]").remove();
    }

    if (!isNull(window.optionsView.rootElement)) {
        rootElementClass = new ChangeClass(window.optionsView.rootElement);

        if (!isNull(window.optionsView.protocolsElement)) {
            window.optionsView.protocolsElement.change(function() {
                rootElementClass.apply("optionChanged");
            });
        }

        if (!isNull(window.optionsView.maxUploadRateElement)) {
            window.optionsView.maxUploadRateElement.change(function() {
                rootElementClass.apply("optionChanged");
            });
        }

        if (!isNull(window.optionsView.maxDownloadRateElement)) {
            window.optionsView.maxDownloadRateElement.change(function() {
                rootElementClass.apply("optionChanged");
            });
        }

        if (!isNull(window.optionsView.maxFileWriteRateElement)) {
            window.optionsView.maxFileWriteRateElement.change(function() {
                rootElementClass.apply("optionChanged");
            });
        }

        if (!isNull(window.optionsView.maxFileReadRateElement)) {
            window.optionsView.maxFileReadRateElement.change(function() {
                rootElementClass.apply("optionChanged");
            });
        }

        if (!isNull(window.optionsView.langElement)) {
            window.optionsView.langElement.change(function() {
                rootElementClass.apply("optionChanged");
            });
        }

        if (!isNull(window.optionsView.logExpirationDaysElement)) {
            window.optionsView.logExpirationDaysElement.change(function() {
                rootElementClass.apply("optionChanged");
            });
        }

        window.optionsView.rootElement.find("form").submit(function() {
            rootElementClass.apply(null);
            if (!isNull(window.optionsView.protocolsElement)) {
                var downloadProtocols = window.optionsView.protocolsElement.attr("value");
                settings.set("webEnabled", downloadProtocols.indexOf("w") !== -1 && window.optionsView.allowWeb === true);
                settings.set("p2pEnabled", downloadProtocols.indexOf("p") !== -1 && window.optionsView.allowP2P === true);
            }

            if (!isNull(window.optionsView.maxUploadRateElement)) {
                settings.set("maxUploadRate", parseInt(window.optionsView.maxUploadRateElement.attr("value"), 10));
            }

            if (!isNull(window.optionsView.maxDownloadRateElement)) {
                settings.set("maxDownloadRate", parseInt(window.optionsView.maxDownloadRateElement.attr("value"), 10));
            }

            if (!isNull(window.optionsView.maxFileWriteRateElement)) {
                settings.set("maxFileWriteRate", parseInt(window.optionsView.maxFileWriteRateElement.attr("value"), 10));
            }

            if (!isNull(window.optionsView.maxFileReadRateElement)) {
                settings.set("maxFileReadRate", parseInt(window.optionsView.maxFileReadRateElement.attr("value"), 10));
            }

            if (!isNull(window.optionsView.logExpirationDaysElement)) {
                settings.set("logExpirationDays", parseInt(window.optionsView.logExpirationDaysElement.attr("value"), 10));
            }

            if (!isNull(window.optionsView.langElement)) {
                settings.set("language", window.optionsView.langElement.attr("value"));
            }

            return false;
        });
    }

    if (!isNull(window.optionsView.langElement)) {
        window.optionsView.langElement.attr("value", app.expandString("{Language}-{Country}"));
        if (window.optionsView.langElement.prop("selectedIndex") < 0) {
            window.optionsView.langElement.prop("selectedIndex", 0);
        }
    }

    function optionsToMenu(parentId, obj) {
        var subItems = [];
        var id = 1;
        obj.find("option").each(function() {
            subItems.push({
                "id": parentId + id,
                "text": $(this).html()
            });
            id += 1;
        });

        return subItems;
    }

    function addMenuFromObject(parentMenu, id, text, obj) {
        var menu = {
            id: id,
            text: host.getLanguageString(text)
        };
        menu.subMenu = optionsToMenu(id, obj);
        if (menu.subMenu.length > 0) {
            parentMenu.push(menu);
        }
    }

    function clearContextMenuSelection(menu) {
        menu.forEach(function(menuItem) {
            if (hasOwnProperty(menuItem, "subMenu") === true)
                clearContextMenuSelection(menuItem.subMenu);

            skinWindow.setContextMenuSelect(menuItem.id, false);
        });
    }

    function updateContextMenuSelect() {
        if (window.optionsView.allowContextMenu === false) {
            return;
        }
        var selectedItems = [];

        if (!isNull(window.optionsView.protocolsElement)) {
            if (window.optionsView.allowWeb === true && window.optionsView.allowP2P === true) {
                selectedItems.push(downloadTypeBase + 1 + window.optionsView.protocolsElement.prop("selectedIndex"));
            }
        }

        if (!isNull(window.optionsView.maxUploadRateElement)) {
            selectedItems.push(uploadMaxBase + 1 + window.optionsView.maxUploadRateElement.prop("selectedIndex"));
        }

        if (!isNull(window.optionsView.maxDownloadRateElement)) {
            selectedItems.push(downloadMaxBase + 1 + window.optionsView.maxDownloadRateElement.prop("selectedIndex"));
        }

        if (!isNull(window.optionsView.maxFileWriteRateElement)) {
            selectedItems.push(fileWriteMaxBase + 1 + window.optionsView.maxFileWriteRateElement.prop("selectedIndex"));
        }

        if (!isNull(window.optionsView.maxFileReadRateElement)) {
            selectedItems.push(fileReadMaxBase + 1 + window.optionsView.maxFileReadRateElement.prop("selectedIndex"));
        }

        if (!isNull(window.optionsView.langElement)) {
            selectedItems.push(langBase + 1 + window.optionsView.langElement.prop("selectedIndex"));
        }

        if (!isNull(window.optionsView.logExpirationDaysElement)) {
            selectedItems.push(logExpirationDaysBase + 1 + window.optionsView.logExpirationDaysElement.prop("selectedIndex"));
        }

        clearContextMenuSelection(contextMenuItems);
        selectedItems.forEach(function(selectedItem) {
            skinWindow.setContextMenuSelect(selectedItem, true);
        });
    }

    if (window.optionsView.allowContextMenu === true) {
        notificationCenter.addInstanceObserver("SkinWindow", "ContextMenuSelect", skinWindow, function(sender, info) {
            var parentForm = null;
            if (info.id >= logExpirationDaysBase) {
                window.optionsView.logExpirationDaysElement.prop("selectedIndex", info.id - 1 - logExpirationDaysBase);
                parentForm = window.optionsView.logExpirationDaysElement.parents("form:first");
            } else if (info.id >= appBase) {
                app.closeAll();
            } else if (info.id >= langBase) {
                window.optionsView.langElement.prop("selectedIndex", info.id - 1 - langBase);
                parentForm = window.optionsView.langElement.parents("form:first");
            } else if (info.id >= fileReadMaxBase) {
                window.optionsView.maxFileReadRateElement.prop("selectedIndex", info.id - 1 - fileReadMaxBase);
                parentForm = window.optionsView.maxFileReadRateElement.parents("form:first");
            } else if (info.id >= fileWriteMaxBase) {
                window.optionsView.maxFileWriteRateElement.prop("selectedIndex", info.id - 1 - fileWriteMaxBase);
                parentForm = window.optionsView.maxFileWriteRateElement.parents("form:first");
            } else if (info.id >= uploadMaxBase) {
                window.optionsView.maxUploadRateElement.prop("selectedIndex", info.id - 1 - uploadMaxBase);
                parentForm = window.optionsView.maxUploadRateElement.parents("form:first");
            } else if (info.id >= downloadMaxBase) {
                window.optionsView.maxDownloadRateElement.prop("selectedIndex", info.id - 1 - downloadMaxBase);
                parentForm = window.optionsView.maxDownloadRateElement.parents("form:first");
            } else if (info.id >= downloadTypeBase) {
                window.optionsView.protocolsElement.prop("selectedIndex", info.id - 1 - downloadTypeBase);
                parentForm = window.optionsView.protocolsElement.parents("form:first");
            }

            if (!isNull(parentForm)) {
                parentForm.submit();
            }
        });

        notificationCenter.addInstanceObserver("SkinWindow", "L18NComplete", skinWindow, function(sender, info) {
            contextMenuItems = [];

            if (!isNull(window.optionsView.protocolsElement)) {
                if (window.optionsView.allowWeb === true && window.optionsView.allowP2P === true) {
                    addMenuFromObject(contextMenuItems, downloadTypeBase, "UI_DownloadType", window.optionsView.protocolsElement);
                }
            }

            if (!isNull(window.optionsView.maxUploadRateElement)) {
                addMenuFromObject(contextMenuItems, uploadMaxBase, "UI_MaxUpload", window.optionsView.maxUploadRateElement);
            }

            if (!isNull(window.optionsView.maxDownloadRateElement)) {
                addMenuFromObject(contextMenuItems, downloadMaxBase, "UI_MaxDownload", window.optionsView.maxDownloadRateElement);
            }

            if (!isNull(window.optionsView.maxFileWriteRateElement)) {
                addMenuFromObject(contextMenuItems, fileWriteMaxBase, "UI_MaxFileWrite", window.optionsView.maxFileWriteRateElement);
            }

            if (!isNull(window.optionsView.maxFileReadRateElement)) {
                addMenuFromObject(contextMenuItems, fileReadMaxBase, "UI_MaxFileRead", window.optionsView.maxFileReadRateElement);
            }

            if (!isNull(window.optionsView.logExpirationDaysElement)) {
                if (contextMenuItems.length > 0) {
                    contextMenuItems.push({
                        "id": langBase,
                        "text": "-"
                    });
                }
                
                addMenuFromObject(contextMenuItems, logExpirationDaysBase, "UI_LogExpirationDays", window.optionsView.logExpirationDaysElement);
            }
            
            if (!isNull(window.optionsView.langElement)) {
                if (contextMenuItems.length > 0) {
                    contextMenuItems.push({
                        "id": langBase,
                        "text": "-"
                    });
                }

                addMenuFromObject(contextMenuItems, langBase, "UI_Language", window.optionsView.langElement);
            }

            if (host.isWin === true) {
                if (contextMenuItems.length > 0) {
                    contextMenuItems.push({
                        "id": appBase,
                        "text": "-"
                    });
                }

                contextMenuItems.push({
                    "id": appBase + 1,
                    "text": host.getLanguageString("UI_Exit")
                });
            }

            skinWindow.setContextMenu(JSON.stringify(contextMenuItems));
            updateContextMenuSelect();
        });
    }

    notificationCenter.addInstanceObserver("Settings", "DidChange", settings, function(sender, info) {
        var downloadSettings = "";
        switch (info.key) {
            case "language":
                if (!isNull(window.optionsView.langElement)) {
                    window.optionsView.langElement.attr("value", info.newValue);
                    updateContextMenuSelect();
                }
                break;

            case "logExpirationDays":
                if (!isNull(window.optionsView.logExpirationDaysElement)) {
                    window.optionsView.logExpirationDaysElement.attr("value", info.newValue);
                    updateContextMenuSelect();
                }
                break;

            case "webEnabled":
            case "p2pEnabled":
                if (!isNull(window.optionsView.protocolsElement)) {
                    if (settings.get("webEnabled") === true && window.optionsView.allowWeb === true) {
                        downloadSettings += "w";
                    }
                    if (settings.get("p2pEnabled") === true && window.optionsView.allowP2P === true) {
                        downloadSettings += "p";
                    }

                    // If the length is zero then it's in a transition state, so don't set the value
                    if (downloadSettings.length > 0) {
                        window.optionsView.protocolsElement.attr("value", downloadSettings);
                        updateContextMenuSelect();
                    }
                }
                break;

            case "maxUploadRate":
                if (!isNull(window.optionsView.maxUploadRateElement)) {
                    window.optionsView.maxUploadRateElement.attr("value", info.newValue);
                    updateContextMenuSelect();
                }
                break;

            case "maxDownloadRate":
                if (!isNull(window.optionsView.maxDownloadRateElement)) {
                    window.optionsView.maxDownloadRateElement.attr("value", info.newValue);
                    updateContextMenuSelect();
                }
                break;

            case "maxFileWriteRate":
                if (!isNull(window.optionsView.maxFileWriteRateElement)) {
                    window.optionsView.maxFileWriteRateElement.attr("value", info.newValue);
                    updateContextMenuSelect();
                }
                break;

            case "maxFileReadRate":
                if (!isNull(window.optionsView.maxFileReadRateElement)) {
                    window.optionsView.maxFileReadRateElement.attr("value", info.newValue);
                    updateContextMenuSelect();
                }
                break;
        }

    });
});

/*!
* \file oserror.js
* \brief File containing operating system helper functions
*/

/*!
* \class OSError
* \brief Operating system helper functions
*/
function OSError() {
    // Windows errors
    this.ERROR_SUCCESS = 0;
    this.ERROR_FILE_NOT_FOUND = 2;
    this.ERROR_PATH_NOT_FOUND = 3;
    this.ERROR_TOO_MANY_OPEN_FILES = 4;
    this.ERROR_ACCESS_DENIED = 5;
    this.ERROR_INVALID_DRIVE = 15;
    this.ERROR_WRITE_PROTECT = 19;
    this.ERROR_SHARING_VIOLATION = 32;
    this.ERROR_LOCK_VIOLATION = 33;
    this.ERROR_HANDLE_DISK_FULL = 39;
    this.ERROR_BAD_NET_NAME = 67;
    this.ERROR_FILE_EXISTS = 80;
    this.ERROR_DRIVE_LOCKED = 108;
    this.ERROR_DISK_FULL = 112;
    this.ERROR_INVALID_NAME = 123;
    this.ERROR_BAD_PATHNAME = 161;

    // Mac errors
    this.ESUCCESS = 0;
    this.EPERM = 1;
    this.ENOENT = 2;
    this.EBADF = 9;
    this.EAGAIN = 11;
    this.EACCES = 13;
    this.EBUSY = 16;
    this.EEXIST = 17;
    this.ENODEV = 19;
    this.EISDIR = 21;
    this.ENOTDIR = 20;
    this.ENFILE = 22;
    this.EFBIG = 27;
    this.ENOSPC = 28;
    this.ESPIPE = 29;
    this.EROFS = 30;
    this.EMLINK = 31;
    this.EDEADLK = 35;
    this.ENAMETOOLONG = 36;
}

OSError.prototype.nameFromIdWin = function(id) {
    switch (id) {
        case this.ERROR_SUCCESS:
            return "None";

        case this.ERROR_FILE_NOT_FOUND:
        case this.ERROR_INVALID_DRIVE:
        case this.ERROR_INVALID_NAME:
        case this.ERROR_BAD_PATHNAME:
        case this.ERROR_PATH_NOT_FOUND:
        case this.ERROR_ALREADY_EXISTS:
        case this.ERROR_FILE_EXISTS:
        case this.ERROR_BAD_NET_NAME:
        case this.ERROR_TOO_MANY_OPEN_FILES:
            return "AccessInvalid";

        case this.ERROR_ACCESS_DENIED:
        case this.ERROR_WRITE_PROTECT:
            return "AccessDenied";

        case this.ERROR_DRIVE_LOCKED:
        case this.ERROR_LOCK_VIOLATION:
        case this.ERROR_SHARING_VIOLATION:
            return "Locked";

        case this.ERROR_DISK_FULL:
        case this.ERROR_HANDLE_DISK_FULL:
            return "NotEnoughSpace";
    }

    return "Unknown";
};

OSError.prototype.nameFromIdMac = function(id) {
    switch (id) {
        case this.ESUCCESS:
            return "None";

        case this.EPERM:
        case this.EAGAIN:
        case this.EACCES:
        case this.EBUSY:
        case this.EROFS:
            return "AccessDenied";

        case this.ENOENT:
        case this.EBADF:
        case this.EEXIST:
        case this.ENODEV:
        case this.EISDIR:
        case this.ENOTDIR:
        case this.ENFILE:
        case this.EFBIG:
        case this.ESPIPE:
        case this.EMLINK:
        case this.ENAMETOOLONG:
            return "AccessInvalid";

        case this.ENOSPC:
            return "NotEnoughSpace";

        case this.EDEADLK:
            return "Locked";
    }

    return "Unknown";
};

/*!
* converts an error code to a string
* \tparam int id error code
* \type string
* \returns stringified name of error code
*/
OSError.prototype.nameFromId = function(id) {
    if (host.isWin === true) {
        return this.nameFromIdWin(id);
    }
    if (host.isMac === true) {
        return this.nameFromIdMac(id);
    }
    return "Unknown";
};

/*!
* checks if the error code is handled
* \tparam int id error code
* \type bool
* \returns true if handled, false otherwise
*/
OSError.prototype.isUnknown = function(id) {
    if (this.nameFromId(id).toLowerCase() === "unknown") {
        return true;
    }

    return false;
};

/*!
* precreated global instance of OSError
* \type OSError
*/
var osError = new OSError();

$(document).ready(function() {
    function PerformanceView() {
        this.instanceId = app.expandString("{Guid}");
        this.numGraphPoints = 40;
        this.legendPosition = "nw";
        this.legendColumnCount = 1;
        this.colors = null;
        this.incomingAvgSpeedElement = null;
        this.outgoingAvgSpeedElement = null;
        this.incomingCurSpeedElement = null;
        this.outgoingCurSpeedElement = null;
        this.incomingMaxSpeedElement = null;
        this.outgoingMaxSpeedElement = null;
        this.graphElement = null;
    }

    PerformanceView.prototype.onUpdateElement = function(element, value) {
        if (!isNull(element)) {
            var oldValue = element.html();
            if (oldValue !== value) {
                element.html(value);
                element.trigger("changed", [oldValue, value]);
            }
        }
    };
    
    window.performanceView = new PerformanceView();

    notificationCenter.fire("PerformanceView", "Bind", window.performanceView, window.performanceView);
    if (isNull(window.performanceView.incomingAvgSpeedElement) &&
        isNull(window.performanceView.outgoingAvgSpeedElement) &&
        isNull(window.performanceView.incomingCurSpeedElement) &&
        isNull(window.performanceView.outgoingCurSpeedElement) &&
        isNull(window.performanceView.incomingMaxSpeedElement) &&
        isNull(window.performanceView.outgoingMaxSpeedElement) &&
        isNull(window.performanceView.graphElement)) {
        window.performanceView = null;
        return;
    }

    var graphOptions = null, graph = null, dataUpdate = null, incomingData = [], outgoingData = [],
        maxYAxis = 0, i = 0;

    notificationCenter.addInstanceObserver("SkinWindow", "DidClose", skinWindow, function(sender, info) {
        if (!isNull(dataUpdate)) {
            clearInterval(dataUpdate);
            dataUpdate = null;
        }
        
        window.performanceView = null;
    });

    function normalizeData(list, max) {
        var res = [], i = 0;

        max = Math.max(max, 1);

        for (i = 0; i < window.performanceView.numGraphPoints; i += 1) {
            res.push([i, list[i] / max]);
        }

        return res;
    }

    function wouldChangeGraph(list, value) {
        var i = 0;

        for (i = 0; i < window.performanceView.numGraphPoints; i += 1) {
            if (value !== list[i]) {
                return true;
            }
        }

        return false;
    }

    function calcMaxYAxis() {
        var retVal = 1;

        for (i = 0; i < window.performanceView.numGraphPoints; i += 1) {
            retVal = Math.max(retVal, incomingData[i]);
            retVal = Math.max(retVal, outgoingData[i]);
        }

        return retVal;
    }

    for (i = 0; i < window.performanceView.numGraphPoints; i += 1) {
        incomingData.push(0);
        outgoingData.push(0);
    }

    graphOptions = {
        legend: { show: true, backgroundColor: "transparent", position: window.performanceView.legendPosition, noColumns: window.performanceView.legendColumnCount },
        grid: { show: false, borderWidth: 0 },
        series: {
            shadowSize: 0,
            lines: { show: true, lineWidth: 1, fill: true }
        },
        xaxis: { show: false, min: 0, max: window.performanceView.numGraphPoints - 1, alignTicksWithAxis: 1 },
        yaxis: { show: false, min: 0, max: 1 }
    };

    if (!isNull(window.performanceView.colors)) {
        graphOptions.colors = window.performanceView.colors;
    }

    if (!isNull(window.performanceView.graphElement)) {
        graph = $.plot(window.performanceView.graphElement, [
                { label: host.getLanguageString("UI_Incoming"), data: normalizeData(incomingData, 0) },
                { label: host.getLanguageString("UI_Outgoing"), data: normalizeData(outgoingData, 0)}],
                graphOptions);
    }

    dataUpdate = setInterval(function() {
        var rates, graphDirty = false;

        if (!isNull(window.downloader)) {
            rates = interop.parseJSON(downloader.getTransferRates());
        } else {
            rates = {
                "incoming": { "current": 0, "average": 0, "max": 0 },
                "outgoing": { "current": 0, "average": 0, "max": 0 }
            };
        }

        if (wouldChangeGraph(incomingData, rates.incoming.current) === true ||
            wouldChangeGraph(outgoingData, rates.outgoing.current) === true) {
            incomingData.shift();
            outgoingData.shift();
            incomingData.push(rates.incoming.current);
            outgoingData.push(rates.outgoing.current);

            maxYAxis = calcMaxYAxis();

            graphDirty = true;

            host.assert(incomingData.length <= window.performanceView.numGraphPoints, "Performance view incoming data overflow ({0} > {1})".format(incomingData.length, window.performanceView.numGraphPoints));
            host.assert(outgoingData.length <= window.performanceView.numGraphPoints, "Performance view outgoingData data overflow ({0} > {1})".format(outgoingData.length, window.performanceView.numGraphPoints));
        }

        if (!isNull(graph) && graphDirty === true && window.performanceView.graphElement.is(":visible")) {
            graph.setData([
                { label: host.getLanguageString("UI_Incoming"), data: normalizeData(incomingData, maxYAxis) },
                { label: host.getLanguageString("UI_Outgoing"), data: normalizeData(outgoingData, maxYAxis)}]);
            graph.draw();
        }
        
        window.performanceView.onUpdateElement(window.performanceView.incomingCurSpeedElement, messageFormat.getTransferSpeed(rates.incoming.current));
        window.performanceView.onUpdateElement(window.performanceView.outgoingCurSpeedElement, messageFormat.getTransferSpeed(rates.outgoing.current));
        window.performanceView.onUpdateElement(window.performanceView.incomingAvgSpeedElement, messageFormat.getTransferSpeed(rates.incoming.average));
        window.performanceView.onUpdateElement(window.performanceView.outgoingAvgSpeedElement, messageFormat.getTransferSpeed(rates.outgoing.average));
        window.performanceView.onUpdateElement(window.performanceView.incomingMaxSpeedElement, messageFormat.getTransferSpeed(rates.incoming.max));
        window.performanceView.onUpdateElement(window.performanceView.outgoingMaxSpeedElement, messageFormat.getTransferSpeed(rates.outgoing.max));
    }, 1000);
});

/*!
* \file Pipe.js
* \brief File containing Pipe class and creation function
*/

/*!
* \class Pipe
* \brief Create a named pipe
*/




function Pipe(instanceId)
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
Pipe.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the name of the pipe
* \type string
* \returns name of the pipe
*/
Pipe.prototype.getName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getName"
   });
};

/*!
* sets the name of the pipe
* \tparam string(in) value name of the pipe
*/
Pipe.prototype.setName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setName", 
      "value":value
   });
};

/*!
* gets the buffer size of the pipe
* \type int
* \returns buffer size of the pipe
*/
Pipe.prototype.getBufferSize = function(){
   return interop.invoke(this.instanceId, {
      "method":"getBufferSize"
   });
};

/*!
* sets the buffer size of the pipe
* \tparam int(in) value buffer size of the pipe
*/
Pipe.prototype.setBufferSize = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setBufferSize", 
      "value":value
   });
};

/*!
* gets the open an existing pipe
* \type bool
* \returns open an existing pipe
*/
Pipe.prototype.getOpenExisting = function(){
   return interop.invoke(this.instanceId, {
      "method":"getOpenExisting"
   });
};

/*!
* sets the open an existing pipe
* \tparam bool(in) value open an existing pipe
*/
Pipe.prototype.setOpenExisting = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setOpenExisting", 
      "value":value
   });
};

/*!
* Starts the current pipe instance
* \type bool
* \returns true if successful, false otherwise
*/
Pipe.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};

/*!
* Starts the current pipe instance
* \tparam string(in) buffer Base64 converted buffer for the write
* \type int
* \returns number of bytes written
*/
Pipe.prototype.write = function(buffer){
   return interop.invoke(this.instanceId, {
      "method":"write", 
      "buffer":buffer
   });
};


/*!
* Create instance of pipe
*/
function createPipe()
{
   return interop.createInstance("SSN.Pipe", Pipe);
}


/*!
* \file Process.js
* \brief File containing Process class and creation function
*/

/*!
* \class Process
* \brief Process launcher
*/




function Process(instanceId)
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
Process.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the application to launch
* \type string
* \returns application to launch
*/
Process.prototype.getApplicationName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getApplicationName"
   });
};

/*!
* sets the application to launch
* \tparam string(in) value application to launch
*/
Process.prototype.setApplicationName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setApplicationName", 
      "value":value
   });
};

/*!
* gets the filename to launch
* \type string
* \returns filename to launch
*/
Process.prototype.getShortApplicationName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getShortApplicationName"
   });
};

/*!
* gets the time elapsed in runnable state
* \type double
* \returns time elapsed in runnable state
*/
Process.prototype.getRunningTime = function(){
   return interop.invoke(this.instanceId, {
      "method":"getRunningTime"
   });
};

/*!
* gets the id of process
* \type int
* \returns id of process
*/
Process.prototype.getId = function(){
   return interop.invoke(this.instanceId, {
      "method":"getId"
   });
};

/*!
* gets the arguments for the process
* \type string
* \returns arguments for the process
*/
Process.prototype.getArguments = function(){
   return interop.invoke(this.instanceId, {
      "method":"getArguments"
   });
};

/*!
* sets the arguments for the process
* \tparam string(in) value arguments for the process
*/
Process.prototype.setArguments = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setArguments", 
      "value":value
   });
};

/*!
* gets the full path to the current directory for the process
* \type string
* \returns full path to the current directory for the process
*/
Process.prototype.getWorkingDirectory = function(){
   return interop.invoke(this.instanceId, {
      "method":"getWorkingDirectory"
   });
};

/*!
* sets the full path to the current directory for the process
* \tparam string(in) value full path to the current directory for the process
*/
Process.prototype.setWorkingDirectory = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setWorkingDirectory", 
      "value":value
   });
};

/*!
* gets the process window visibility
* \type bool
* \returns process window visibility
*/
Process.prototype.getShowWindow = function(){
   return interop.invoke(this.instanceId, {
      "method":"getShowWindow"
   });
};

/*!
* sets the process window visibility
* \tparam bool(in) value process window visibility
*/
Process.prototype.setShowWindow = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setShowWindow", 
      "value":value
   });
};

/*!
* gets the process elevation rights
* \type int
* \returns process elevation rights
*/
Process.prototype.getElevationRights = function(){
   return interop.invoke(this.instanceId, {
      "method":"getElevationRights"
   });
};

/*!
* sets the process elevation rights
* \tparam int(in) value process elevation rights
*/
Process.prototype.setElevationRights = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setElevationRights", 
      "value":value
   });
};

/*!
* gets the sha1 value of application, blank to skip check
* \type string
* \returns sha1 value of application, blank to skip check
*/
Process.prototype.getSha1 = function(){
   return interop.invoke(this.instanceId, {
      "method":"getSha1"
   });
};

/*!
* sets the sha1 value of application, blank to skip check
* \tparam string(in) value sha1 value of application, blank to skip check
*/
Process.prototype.setSha1 = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setSha1", 
      "value":value
   });
};

/*!
* gets the optional target for sha1 calculation (uses application if blank)
* \type string
* \returns optional target for sha1 calculation (uses application if blank)
*/
Process.prototype.getSha1Target = function(){
   return interop.invoke(this.instanceId, {
      "method":"getSha1Target"
   });
};

/*!
* sets the optional target for sha1 calculation (uses application if blank)
* \tparam string(in) value optional target for sha1 calculation (uses application if blank)
*/
Process.prototype.setSha1Target = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setSha1Target", 
      "value":value
   });
};

/*!
* gets the authentication type for file
* \type int
* \returns authentication type for file
*/
Process.prototype.getAuthenticateType = function(){
   return interop.invoke(this.instanceId, {
      "method":"getAuthenticateType"
   });
};

/*!
* sets the authentication type for file
* \tparam int(in) value authentication type for file
*/
Process.prototype.setAuthenticateType = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setAuthenticateType", 
      "value":value
   });
};

/*!
* gets the optional target for verification (uses application if blank)
* \type string
* \returns optional target for verification (uses application if blank)
*/
Process.prototype.getAuthenticateTarget = function(){
   return interop.invoke(this.instanceId, {
      "method":"getAuthenticateTarget"
   });
};

/*!
* sets the optional target for verification (uses application if blank)
* \tparam string(in) value optional target for verification (uses application if blank)
*/
Process.prototype.setAuthenticateTarget = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setAuthenticateTarget", 
      "value":value
   });
};

/*!
* Launch the process
* \type bool
* \returns true if successful, false otherwise
*/
Process.prototype.launch = function(){
   return interop.invoke(this.instanceId, {
      "method":"launch"
   });
};


/*!
* Create instance of process
*/
function createProcess()
{
   return interop.createInstance("SSN.Process", Process);
}


/*!
* \file ProcessAuthenticateType.js
* \brief File containing process authentication type
*/

/*!
* \class ProcessAuthenticateType
* \brief Process authentication type constants
*/

function ProcessAuthenticateType() {
    /*!
    * No authentication
    * \type int
    */
    this.NONE = 0;
    /*!
    * Library (OS) Authentication
    * \type int
    */
    this.LIBRARY = 1;
    /*!
    * Zip (PE) Authentication
    * \type int
    */
    this.ZIP = 2;
}

/*!
* converts an authentication value to a string
* \tparam int id authentication value
* \type string
* \returns stringified name of elevation
*/
ProcessAuthenticateType.prototype.nameFromId = function(id) {
    var nameMap = [
        "None",
        "Library",
        "Zip"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of ProcessAuthenticateType
* \type ProcessAuthenticateType
*/
var processAuthenticateType = new ProcessAuthenticateType();

/*!
* \file ProcessElevationRights.js
* \brief File containing download error constants and helper functions
*/

/*!
* \class ProcessElevationRights
* \brief Process elevation right constants
*/

function ProcessElevationRights() {
    /*!
    * User rights
    * \type int
    */
    this.USER = 0;
    /*!
    * Elevated rights
    * \type int
    */
    this.ELEVATED = 1;
    /*!
    * Current rights
    * \type int
    */
    this.INVOKER = 2;
}

/*!
* converts an elevation value to a string
* \tparam int id elevation value
* \type string
* \returns stringified name of elevation
*/
ProcessElevationRights.prototype.nameFromId = function(id) {
    var nameMap = [
        "User",
        "Elevated",
        "Invoker"
    ];

    return nameMap[id];
};

/*!
* precreated global instance of ProcessElevationRights
* \type ProcessElevationRights
*/
var processElevationRights = new ProcessElevationRights();

/**
* Progress is a mechanism for attaching a progressbar to the a workflow branch.
* @param task
* @param args
* @returns
*/
function ProgressController(task, args) {
    var self = this;

    this.instanceId = app.expandString("{Guid}");
    this.bounds = {};
    this.intervalTimerId = null;
    this.intervalTaskArgs = { "progressWaitPaused": false };
    this.maxPercentage = 100.0;
    if (args.maxPercentage) {
        this.maxPercentage = Number(args.maxPercentage);
    }
    this.progressCompleteAllowed = false;
    if (args.type === "progress") {
        this.progressCompleteAllowed = true;
    }
    this.progressTask = task;
    this.incompletedTasks = [];

    this.observers = [];
    this.observers.push(notificationCenter.addObserver("Task", "Start", function(sender, info) { self.onTaskStart(sender, info); }));
    // Only when the last task completes will the ProgressView be released
    this.observers.push(notificationCenter.addObserver("Task", "Complete", function(sender, info) { self.onTaskComplete(sender, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Progress", "TogglePause", self, function(sender, info) {
        if ((self.intervalTimerId != null) && (self.intervalTaskArgs)) {
            self.intervalTaskArgs.progressWaitPaused = !self.intervalTaskArgs.progressWaitPaused;
        }
    }));
}

ProgressController.prototype.stopIntervalTimer = function() {
    if (!isNull(this.intervalTimerId)) {
        clearTimeout(this.intervalTimerId);
        this.intervalTimerId = null;
    }
};

ProgressController.prototype.release = function() {
    if (!isNull(this.view)) {
        this.view.release();
    }
    this.stopIntervalTimer();
    this.bounds = {};
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

ProgressController.prototype.onTaskStart = function(sender, info) {
    var self = this;
    if (sender === self.progressTask) {
        self.onStart(sender, info);
    }
    if (sender.name && self.bounds[sender.name] && (self.bounds[sender.name].progressWeight > 0.0)) {
        var progressArgs = self.bounds[sender.name];
        if (progressArgs.progressWaitTime > 0.0) {
            // Handle fake progressbar timer
            notificationCenter.fire("Progress", "Progress", self.progressTask, progressArgs.pctRange[0]);

            var timerIntervalSeconds = 1;
            if (Number(progressArgs.progressWaitInterval) > 0) {
                timerIntervalSeconds = Number(progressArgs.progressWaitInterval);
            }
            var numberOfIntervals = progressArgs.progressWaitTime / timerIntervalSeconds;
            var percentRange = (progressArgs.pctRange[1] - progressArgs.pctRange[0]) * progressArgs.progressWaitLimit;
            var percentageIncrement = percentRange / numberOfIntervals;
            self.stopIntervalTimer();
            var taskPctLimit = progressArgs.pctRange[0] + percentRange;
            var currentPercentage = progressArgs.pctRange[0];

            self.intervalTaskArgs = progressArgs;
            self.intervalTimerId = setInterval(function() {
                if (progressArgs.progressWaitPaused === true) {
                    return;
                }
                if (currentPercentage >= taskPctLimit) {
                    self.stopIntervalTimer();
                } else {
                    if (percentageIncrement > (taskPctLimit - currentPercentage)) {
                        percentageIncrement = (taskPctLimit - currentPercentage) / 2.0;
                    }
                    currentPercentage += percentageIncrement;
                    notificationCenter.fire("Progress", "Progress", self.progressTask, currentPercentage);
                }
            }, timerIntervalSeconds * 1000);
        } else {
            // If being controlled by a timer, do not allow the unified-bar to take over
            if (sender.view && sender.args) {
                var viewObserver = notificationCenter.addInstanceObserver("TaskView", "WillUpdateProgress", sender.view, function(sender, info) {
                    var min = progressArgs.pctRange[0];
                    var range = progressArgs.pctRange[1] - min;
                    //app.debugPrint("overallProgress status {0} name {1}\n".format(info.percent, task.name))
                    if (info.percent <= 100.0) {
                        notificationCenter.fire("Progress", "Progress", self.progressTask, min + ((info.percent / 100.0) * range));
                    }
                });
                var observer = notificationCenter.addInstanceObserver("Task", "Complete", sender, function(sender, info) {
                    viewObserver.release();
                    observer.release();
                });
            } else {
                notificationCenter.fire("Progress", "Progress", self.progressTask, progressArgs.pctRange[0]);
            }
        }
    }
};

ProgressController.prototype.onTaskComplete = function(sender, info) {
    var self = this;

    if ((sender !== self.progressTask) && sender.name) {
        if (this.bounds[sender.name] && (self.bounds[sender.name].progressWeight > 0.0)) {
            var progressArgs = self.bounds[sender.name];
            if (progressArgs.progressWaitTime > 0.0) {
                self.stopIntervalTimer();
            }
        }
        var i = this.incompletedTasks.indexOf(sender.name);
        if (i >= 0) {
            this.incompletedTasks.splice(i, 1);
            if (this.incompletedTasks.length === 0) {
                if (!sender.hasError()) {
                    notificationCenter.fire("Progress", "Progress", this.progressTask, this.maxPercentage / 100.0);
                }
                this.release();
            }
        }
    }
};

ProgressController.prototype.getNextTaskNames = function(args, argList, topLevelOnly) {
    var taskNameList = [], i, actionsList = args.actions;

    if (actionsList && !topLevelOnly) {
        if (getObjectType(actionsList.forEach) === "function") {
            for (i = 0; i < actionsList.length; i++) {
                if (actionsList[i]) {
                    taskNameList.push(app.expandString(actionsList[i]));
                }
            }
        }
    }
    if (getObjectType(argList.forEach) === "function") {
        for (i = 0; i < argList.length; i++) {
            if (args[argList[i]]) {
                taskNameList.push(app.expandString(args[argList[i]]));
                break;
            }
        }
    } else {
        if (args[argList]) {
            taskNameList.push(app.expandString(args[argList]));
        }
    }
    return taskNameList;
};


ProgressController.prototype.createProgressArguments = function(args) {
    var progressArgs = {
        "progressWeight": -1.0,
        "progressWaitTime": 0.0,
        "progressWaitLimit": 1.0,
        "progressWaitInterval": 0.0,
        "progressWaitPaused": false,
        "pctRange": [0, 0]
    };
    if (!isNull(args.progressWeight)) {
        progressArgs.progressWeight = args.progressWeight;
    }
    if (args.progressWaitTime) {
        progressArgs.progressWaitTime = args.progressWaitTime;
        if (args.progressWaitInterval) {
            progressArgs.progressWaitInterval = args.progressWaitInterval;
        }
        if (args.progressWaitLimit) {
            progressArgs.progressWaitLimit = args.progressWaitLimit;
        }
        if (args.progressWaitPaused) {
            progressArgs.progressWaitPaused = (args.progressWaitPaused == true);
        }
    }
    return progressArgs;
};

ProgressController.prototype.onStart = function(task, info) {
    var self = this, taskChainParameter = "complete";

    if (task.args.taskChainParameter) {
        taskChainParameter = task.args.taskChainParameter;
    }
    var taskNameChain = [], taskNameStack = [], i, currTaskName, currTaskArgs, nextTaskNames;
    nextTaskNames = self.getNextTaskNames(task.args, taskChainParameter, false);
    for (i = nextTaskNames.length - 1; i >= 0; i = i - 1) {
        taskNameStack.push(nextTaskNames[i]);
    }
    while (taskNameStack.length > 0) {
        currTaskName = taskNameStack.pop();
        currTaskArgs = window.workflow.tasks.tasks[currTaskName];
        window.workflow.tasks.tasks[currTaskName].normalizeProgress = true;
        if (currTaskArgs && (taskNameChain.indexOf(currTaskName) < 0)) {
            taskNameChain.push(currTaskName);
            if (!hasOwnProperty(currTaskArgs, "taskChainEnd") || !currTaskArgs.taskChainEnd) {
                nextTaskNames = self.getNextTaskNames(currTaskArgs, taskChainParameter, false);
                for (i = nextTaskNames.length - 1; i >= 0; i = i - 1) {
                    taskNameStack.push(nextTaskNames[i]);
                }
            }
        }
    }

    var percentageRemaining = 1.0, unweightedTasks = [], allTasks = [];
    var currTaskName, progressArgs;
    self.incompletedTasks = [];
    for (i = 0; i < taskNameChain.length; i = i + 1) {
        currTaskName = taskNameChain[i];
        currTaskArgs = window.workflow.tasks.tasks[currTaskName];
        progressArgs = self.createProgressArguments(currTaskArgs);
        if (progressArgs.progressWeight !== 0) {
            self.bounds[currTaskName] = progressArgs;
            if ((progressArgs.progressWeight > 0.0) && (progressArgs.progressWeight <= 1.0)) {
                percentageRemaining -= progressArgs.progressWeight;
            } else {
                unweightedTasks.push(currTaskName);
            }
            allTasks.push(currTaskName);
        }
        self.incompletedTasks.push(currTaskName);
    }

    if ((percentageRemaining > 0.0) && (unweightedTasks.length > 0)) {
        var evenPercentage = (percentageRemaining / unweightedTasks.length);
        for (i = 0; i < unweightedTasks.length; i = i + 1) {
            self.bounds[unweightedTasks[i]].progressWeight = evenPercentage;
        }
    }

    var pct = 0.1;
    var nextPct;
    for (i = 0; i < allTasks.length; i = i + 1) {
        nextPct = pct + (self.maxPercentage * self.bounds[allTasks[i]].progressWeight);
        if (nextPct > self.maxPercentage) {
            nextPct = self.maxPercentage;
        }
        self.bounds[allTasks[i]].pctRange = [pct / 100.0, nextPct / 100.0];
        pct = nextPct;
    }
    if (self.progressCompleteAllowed === true) {
        self.progressTask.complete();
    }
};

registerTaskController("progress", ProgressController);

/**
 * Progress is a mechanism for attaching a progressbar to the a workflow branch.
 * @param task
 * @param args
 * @returns
 */
function ProgressView(task, args) {
    var self = this;
    
    this.observers = [];
    this.controller=task.controller;
    this.progressElement = null;
    this.progressBarElement = null;
    this.showInTaskbar = true;

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
    // only when the last task completes will the progresscontroller be released
    //this.observers.push(notificationCenter.addInstanceObserver("Task", "Complete", task, function(sender, info) { self.release(); }));
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Complete", task, function(sender, info) { self.onTaskComplete(); }));
    this.observers.push(notificationCenter.addInstanceObserver("Progress", "Progress", task, function(sender, value) { self.onUpdateProgress(value); }));
    this.observers.push(notificationCenter.addInstanceObserver("Workflow", "WillUnload", workflow, function(sender, info) { self.release(); }));
}

ProgressView.prototype.release = function() {
    if (!isNull(this.progressBarElementClass)) {
        this.progressBarElementClass.release();
        this.progressBarElementClass = null;
    }
    if(!isNull(this.controller)) {
        this.controller.release();
        this.controller=null;
    }
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

ProgressView.prototype.onStart = function(task, info) {
    notificationCenter.fire("ProgressView", "Bind", task, this);

    host.assert(!isNull(this.progressBarElement), "ProgressView binding did not assign progressBarElement element");

    this.progressBarElementClass = new ChangeClass(this.progressBarElement);
};

ProgressView.prototype.onTaskComplete = function(value) {
    if (this.showInTaskbar === true) {
        skinWindow.setTaskbarProgress(-2);
    }
};

ProgressView.prototype.onUpdateProgress = function(value) { // cut-and-pasted from PatchView
    var percent = parseInt(value * 100, 10);
    if (percent !== this.lastPercent) {
        if (this.showInTaskbar === true) {
            skinWindow.setTaskbarProgress(percent);
        }

        this.lastPercent = percent;
        if (!isNull(this.progressElement)) {
            var newValue = Math.max(percent, 0) + "%";
            var oldValue = this.progressElement.html();
            if (oldValue !== newValue) {
                this.progressElement.html(newValue);
                this.progressElement.trigger("changed", [oldValue, newValue]);
            }
        }

        if (!isNull(this.progressBarElement)) {
            if (percent < 0) {
                this.progressBarElement.width("100%");
                this.progressBarElementClass.apply("indefinite");
            } else {
                this.progressBarElementClass.apply(null);
                if (host.isIE6 === true) {
                    // IE6 doesn't like 0% widths on transparent pngs
                    this.progressBarElement.width(Math.max(percent, 1) + "%");
                } else {
                    this.progressBarElement.width(percent + "%");
                }
            }

            this.progressBarElement.trigger("updateProgress", percent);
        }
    }
};

registerTaskView("progress", ProgressView);


function QueueController(task, args) {
    var observer = null, self = this;

    this.observers = [];
    this.totalActions = 0;
    this.currentActionIndex = 0;
    this.pendingTasks = 0;
    this.concurrentTasks = 1;

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Task", "NextTask", task, function(sender, info) { self.onNextTask(task, info); }));
}

QueueController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

QueueController.prototype.onStart = function(task, info) {
    task.assertArgument("actions");

    this.totalActions = task.args.actions.length;
    this.onQueueStart(task, info);
};

QueueController.prototype.onQueueStart = function(task, info) {
    var i;

    if (hasOwnProperty(task.args, "concurrentTasks")) {
        this.concurrentTasks = task.args.concurrentTasks;
        if (this.concurrentTasks == -1) {
            this.concurrentTasks = this.totalActions;
        }
        this.concurrentTasks = Math.min(this.concurrentTasks, this.totalActions);
    }

    for (i = 0; i < this.concurrentTasks; ++i) {
        notificationCenter.fire("Task", "NextTask", task, {});
    }

    if (this.concurrentTasks === 0) {
        this.onQueueComplete(task, info);
    }
};

QueueController.prototype.onRunSubTask = function(task, info, completeCallback) {
    task.runSubTask(task.args.actions[this.currentActionIndex], null, function(childTask, childInfo) {
        completeCallback(childInfo);
    });
};

QueueController.prototype.onNextTask = function(task, info) {
    var self = this, completeCallback = function(childInfo) {
        self.pendingTasks -= 1;
        if (!isNull(childInfo)) {
            mergeObjectProperties(info, childInfo, true);
        }
        if (task.hasError() === false) {
            notificationCenter.fire("Task", "NextTask", task, {});
        } else if (self.pendingTasks === 0) {
            self.onQueueComplete(task, info);
        }
    };

    if (this.currentActionIndex < this.totalActions) {
        this.pendingTasks += 1;
        this.onRunSubTask(task, info, completeCallback);
        this.currentActionIndex += 1;
    }

    if (this.pendingTasks === 0) {
        this.onQueueComplete(task, info);
    }
};

QueueController.prototype.onQueueComplete = function(task, info) {
    task.complete(info);
};

registerTaskController("queue", QueueController);

function RegistryKeyController(task, args) {
    var self = this;

    this.observers = [];
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

RegistryKeyController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

RegistryKeyController.prototype.RegistryKeyAdd = function(obj) {
    var result = false;
    
    switch (getObjectType(obj.value)) {
        case "string":
            result = platform.setRegistryString(obj.view, obj.security, obj.hive, app.expandString(obj.location), app.expandString(obj.key), app.expandString(obj.value));
            break;

        default:
            result = platform.setRegistryInt32(obj.view, obj.security, obj.hive, app.expandString(obj.location), app.expandString(obj.key), obj.value);
            break;
    }

    return result;
};

RegistryKeyController.prototype.onRegistryKeyAdd = function(task, info) {
    task.assertArgument("key");
    task.assertArgument("value");

    if (isNull(task.args.security)) {
        task.args.security = "default";
    }

    var result = this.RegistryKeyAdd(task.args);

    if (result === false) {
        task.error("RegistryKey_AddFail");
    }

    task.complete();
};

RegistryKeyController.prototype.onRegistryKeyAddBlock = function(task, info) {
    task.assertArgument("block");

    if (isNull(task.args.security)) {
        task.args.security = "default";
    }
    
    var self = this;
    var result = task.args.block.length > 0;
    $.each(task.args.block, function(key, value) {
        entry = {};
        entry.key = key;
        entry.value = value;
        entry.security = task.args.security;
        entry.hive = task.args.hive;
        entry.location = task.args.location;
        entry.view = task.args.view;
        result = self.RegistryKeyAdd(entry) && result;
    });

    if (result === false) {
        task.error("RegistryKey_AddFail");
    }

    task.complete();
};

RegistryKeyController.prototype.onRegistryKeyDelete = function(task, info) {
    platform.registryDeleteKey(task.args.view, task.args.hive, task.args.location);
    task.complete();
};

RegistryKeyController.prototype.onRegistryKeyExists = function(task, info) {
    var result = platform.registryKeyPathExists(task.args.view, task.args.hive, task.args.location);

    function taskComplete(subTask, subTaskInfo) {
        task.complete();
    }

    if (result) {
        task.runSubAction("exists", null, taskComplete);
    } else {
        task.runSubAction("missing", null, taskComplete);
    }
};

RegistryKeyController.prototype.onRegistryKeyCompare = function(task, info) {
    task.assertArgument("key");
    task.assertArgument("value");

    var value = null;

    if (platform.registryKeyPathExists(task.args.view, task.args.hive, task.args.location)) {
        switch (getObjectType(task.args.value)) {
            case "string":
                value = platform.getRegistryString(task.args.view, task.args.hive, task.args.location, task.args.key, "");
                break;

            default:
                value = platform.getRegistryInt32(task.args.view, task.args.hive, task.args.location, task.args.key, 0);
                break;
        }
    }


    function taskComplete(subTask, subTaskInfo) {
        task.complete();
    }

    if (isNull(value)) {
        task.runSubAction("missing", null, taskComplete);
    } else if (value === task.args.value) {
        task.runSubAction("equalTo", null, taskComplete);
    } else if (value > task.args.value) {
        task.runSubAction("greaterThan", null, taskComplete);
    } else {
        task.runSubAction("lessThan", null, taskComplete);
    }
};

RegistryKeyController.prototype.onRegistryKeyCompareVersion = function(task, info, string) {
    var x, valueOctet, taskValueOctet, value, valueArray, taskValueArray;

    task.assertArgument("key");
    task.assertArgument("value");

    if (isNull(task.args.delimiter)) {
        task.args.delimiter = ".";
    }

    if (platform.registryKeyPathExists(task.args.view, task.args.hive, task.args.location)) {
        value = platform.getRegistryString(task.args.view, task.args.hive, task.args.location, task.args.key, "");
    }

    if (isNull(value)) {
        task.runSubAction("missing", null, function(subTask, subTaskInfo) {
            task.complete();
        });

        return;
    }

    valueArray = value.split(task.args.delimiter);
    taskValueArray = task.args.value.split(task.args.delimiter);

    function taskComplete(subTask, subTaskInfo) {
        task.complete();
    }

    for (x = 0; x < Math.max(valueArray.length, taskValueArray.length); x += 1) {
        valueOctet = 0;
        if (x < valueArray.length) {
            valueOctet = parseInt(valueArray[x], 10);
        }

        taskValueOctet = 0;
        if (x < taskValueArray.length) {
            taskValueOctet = taskValueArray[x];
        }

        if (valueOctet > taskValueOctet) {
            task.runSubAction("greaterThan", null, taskComplete);
            return;
        } else if (valueOctet < taskValueOctet) {
            task.runSubAction("lessThan", null, taskComplete);
            return;
        }
    }

    task.runSubAction("equalTo", null, taskComplete);
};

RegistryKeyController.prototype.onStart = function(task, info) {
    task.assertArgument("hive");
    task.assertArgument("location");

    if (isNull(task.args.view)) {
        task.args.view = "default";
    }
    
    switch (task.args.type) {
        case "addRegistryKey":
            this.onRegistryKeyAdd(task, info);
            break;
        case "addRegistryKeyBlock":
            this.onRegistryKeyAddBlock(task, info);
            break;
        case "deleteRegistryKey":
            this.onRegistryKeyDelete(task, info);
            break;
        case "checkRegistryKeyExists":
            this.onRegistryKeyExists(task, info);
            break;
        case "compareRegistryKey":
            this.onRegistryKeyCompare(task, info);
            break;
        case "compareVersionRegistryKey":
            this.onRegistryKeyCompareVersion(task, info);
            break;
        default:
            host.assert(false, "Unknown type in RegistryKeyController ({0})".format(task.args.type));
            break;
    }
    task.complete();
};

registerTaskController("addRegistryKey", RegistryKeyController);
registerTaskController("addRegistryKeyBlock", RegistryKeyController);
registerTaskController("deleteRegistryKey", RegistryKeyController);
registerTaskController("checkRegistryKeyExists", RegistryKeyController);
registerTaskController("compareRegistryKey", RegistryKeyController);
registerTaskController("compareVersionRegistryKey", RegistryKeyController);

(function() {
    function RemoteNotificationCenter() {
        this.notificationObservers = {};
        this.instanceId = "Global";
        this.verbose = false;
    }

    RemoteNotificationCenter.prototype.ensureCreated = function(typename, notification, instanceName) {
        var typenameNode, notificationNode, instanceNode;

        if (hasOwnProperty(this.notificationObservers, typename) === false) {
            typenameNode = {};
            this.notificationObservers[typename] = typenameNode;
        } else {
            typenameNode = this.notificationObservers[typename];
        }

        if (hasOwnProperty(typenameNode, notification) === false) {
            notificationNode = {};
            typenameNode[notification] = notificationNode;
        } else {
            notificationNode = typenameNode[notification];
        }

        if (hasOwnProperty(notificationNode, instanceName) === false) {
            instanceNode = [];
            notificationNode[instanceName] = instanceNode;
        } else {
            instanceNode = notificationNode[instanceName];
        }

        return instanceNode;
    };

    RemoteNotificationCenter.prototype.addObserver = function(typename, notification, func) {
        return this.addInstanceObserver(typename, notification, this, func);
    };

    RemoteNotificationCenter.prototype.addInstanceObserver = function(typename, notification, instance, func) {
        var returnCreator;

        if (hasOwnProperty(instance, "instanceId") === false) {
            app.debugPrint("RemoteNotificationCenter requires instance to have unqiue instanceId\n");
            return;
        }
        if (this.verbose) {
            app.debugPrint("RemoteNotificationCenter addInstanceObs {0} {1} on {2}\n".format(typename, notification, instance.instanceId));
        }
        this.ensureCreated(typename, notification, instance.instanceId).push(func);

        return { release: function() { remoteNotificationCenter.removeInstanceObserver(typename, notification, instance, func); } };
    };

    RemoteNotificationCenter.prototype.removeInstanceObserver = function(typename, notification, instance, func) {
        if (this.ensureCreated(typename, notification, instance.instanceId).removeElement(func) === false) {
            if (instance === this) {
                app.debugPrint("RemoteNotificationCenter unable to remove global observer {0} {1}\n".format(typename, notification));
            } else {
                app.debugPrint("RemoteNotificationCenter unable to remove instance observer {0} {1} {2}\n".format(typename, notification, instance.instanceId));
            }
        }

        if (this.notificationObservers[typename][notification][instance.instanceId].length === 0) {
            delete this.notificationObservers[typename][notification][instance.instanceId];
        }
    };

    RemoteNotificationCenter.prototype.fireAfterDelay = function(typename, notification, delay, sender, sendto, info) {
        setTimeout(function() {
            notificationCenter.fire(typename, notification, sender, sendto, info);
        }, delay);
    };

    RemoteNotificationCenter.prototype.fire = function(typename, notification, sender, sendto, info) {
        if (hasOwnProperty(this.notificationObservers, typename) === false) {
            return;
        }

        if (hasOwnProperty(this.notificationObservers[typename], notification) === false) {
            return;
        }

        if (hasOwnProperty(sender, "instanceId") === false) {
            app.debugPrint("RemoteNotificationCenter requires sender to have unique instanceId\n");
            return;
        }

        if (hasOwnProperty(sendto, "instanceId") === false) {
            app.debugPrint("RemoteNotificationCenter requires sendto to have unique instanceId\n");
            return;
        }

        if (hasOwnProperty(this.notificationObservers[typename][notification], sendto.instanceId) === true) {
            // Fire in reverse so I can remove elements in their own callbacks
            this.notificationObservers[typename][notification][sendto.instanceId].forEachReverse(function(handler) {
                if (!isNull(handler)) {
                    handler(sender, sendto, info);
                }
            });
        }

        if (hasOwnProperty(this.notificationObservers[typename][notification], this.instanceId) === true) {
            // Fire in reverse so I can remove elements in their own callbacks
            this.notificationObservers[typename][notification][this.instanceId].forEachReverse(function(handler) {
                if (!isNull(handler)) {
                    handler(sender, sendto, info);
                }
            });
        }
    };

    RemoteNotificationCenter.prototype.messageDispatcher = function(sender, info) {
        var msg = interop.parseJSON(info.message);
        //app.debugPrint("RemoteNotificationCenter messageDispatcher {0}\n".format(JSON.stringify(info)));
        if (!hasOwnProperty(msg, "type")) {
            return;
        }
        if (!hasOwnProperty(msg, "typename") || !hasOwnProperty(msg, "notification") || !hasOwnProperty(msg, "sender")) {
            return;
        }
        switch (msg.type) {
            case "remoteNotification":
                if (this.verbose) {
                    app.debugPrint("RemoteNotificationCenter message {0} {1} from {2} to {3}\n".format(msg.typename, msg.notification, msg.sender, sender.instanceId));
                }
                remoteNotificationCenter.fire(msg.typename, msg.notification, { "instanceId": msg.sender }, sender, msg.params);
                break;
        }
    };

    RemoteNotificationCenter.prototype.addEndpoint = function(endpoint) {
        if (this.verbose) {
            app.debugPrint("RemoteNotificationCenter addEndpoint {0}\n".format(endpoint.instanceId));
        }
        notificationCenter.addInstanceObserver("SkinWindow", "Message", endpoint, this.messageDispatcher);
    };
    RemoteNotificationCenter.prototype.removeEndpoint = function(endpoint) {
        if (this.verbose) {
            app.debugPrint("RemoteNotificationCenter removeEndpoint {0}\n".format(endpoint.instanceId));
        }
        notificationCenter.removeInstanceObserver("SkinWindow", "Message", endpoint, this.messageDispatcher);
    };

    RemoteNotificationCenter.prototype.send = function(typename, notification, sender, sendto, info) {
        var msgInfo = {
            "type": "remoteNotification",
            "typename": typename,
            "notification": notification,
            "sender": sender.instanceId, "params": info
        };
        sendto.sendMessage(JSON.stringify(msgInfo));
    };

    RemoteNotificationCenter.prototype.sendWithWait = function(typename, notification, sender, sendto, info, shouldWait) {
        if (isNull(shouldWait) || (typeof (shouldWait) !== 'function')) {
            app.debugPrint("RemoteNotificationCenter sendWithWait requires a shouldWait function " + typeof (shouldWait) + "\n");
            return;
        }
        if (shouldWait(sender, info) === false) {
            var timeoutId = setTimeout(function() {
                timeoutId = null;
                remoteNotificationCenter.sendWithWait(typename, notification, sender, sendto, info, shouldWait);
            }, 500);
            return;
        }
        if (this.verbose) {
            app.debugPrint("RemoteNotificationCenter sendWithWait message sent {0} {1} to {2}\n".format(typename, notification, sendto.instanceId));
        }
        remoteNotificationCenter.send(typename, notification, sender, sendto, info);
    };

    window.remoteNotificationCenter = new RemoteNotificationCenter();

    remoteNotificationCenter.addEndpoint(skinWindow);
    var unloadObs = notificationCenter.addInstanceObserver("SkinWindow", "Closing", skinWindow, function(sender, info) {
        unloadObs.release();
        remoteNotificationCenter.removeEndpoint(skinWindow);
    });
} ());
(function() {
    function Settings() {
        this.instanceId = app.expandString("{Guid}");
        this.settingList = {};
        this.saveFilename = app.expandString("{LocalStorage}") + host.idFromString("{ModuleFilename}") + ".settings";
    }

    Settings.prototype = {
        get: function(key) {
            return this.settingList[key];
        },

        set: function(key, value, allowOverWrite) {
            if (isNull(allowOverWrite)) {
                allowOverWrite = true;
            }

            if (hasOwnProperty(this.settingList, key) && allowOverWrite === false) {
                return;
            }

            if (this.settingList[key] === value) {
                return;
            }

            var eventArgs = {};

            eventArgs.key = key;
            eventArgs.newValue = value;
            if (hasOwnProperty(this.settingList, key)) {
                eventArgs.oldValue = this.settingList[key];
            }

            this.settingList[key] = value;

            notificationCenter.fire("Settings", "DidChange", this, eventArgs);
        },

        loadFromObject: function(obj) {
            var self = this, key;

            notificationCenter.fire("Settings", "WillLoad", this, {});

            if (!isNull(obj)) {
                for (key in obj) {
                    if (hasOwnProperty(obj, key)) {
                        self.set(key, obj[key]);
                    }
                }
            }

            notificationCenter.fire("Settings", "DidLoad", this, {});
        },

        load: function() {
            var self = this;

            loadObjectFromFile(this.saveFilename, function(info) {
                self.loadFromObject(info.loadedObject);
            });
        },

        save: function() {
            saveObjectToFile(this.settingList, this.saveFilename);
        }
    };
    window.settings = new Settings();
} ());




/*!
* \file SkinFileExtract.js
* \brief File containing SkinFileExtract class and creation function
*/

/*!
* \class SkinFileExtract
* \brief Extract skin file
*/




function SkinFileExtract(instanceId)
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
SkinFileExtract.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the filename
* \type string
* \returns filename
*/
SkinFileExtract.prototype.getFilename = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFilename"
   });
};

/*!
* sets the filename
* \tparam string(in) value filename
*/
SkinFileExtract.prototype.setFilename = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFilename", 
      "value":value
   });
};

/*!
* gets the output filename
* \type string
* \returns output filename
*/
SkinFileExtract.prototype.getOutputFilename = function(){
   return interop.invoke(this.instanceId, {
      "method":"getOutputFilename"
   });
};

/*!
* sets the output filename
* \tparam string(in) value output filename
*/
SkinFileExtract.prototype.setOutputFilename = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setOutputFilename", 
      "value":value
   });
};

/*!
* gets the size of the request
* \type int
* \returns size of the request
*/
SkinFileExtract.prototype.getBufferSize = function(){
   return interop.invoke(this.instanceId, {
      "method":"getBufferSize"
   });
};

/*!
* gets the current position of the file in request
* \type int
* \returns current position of the file in request
*/
SkinFileExtract.prototype.getCurrentPosition = function(){
   return interop.invoke(this.instanceId, {
      "method":"getCurrentPosition"
   });
};

/*!
* Start extraction
*/
SkinFileExtract.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};

/*!
* gets the body buffer
* \tparam int(in) offset offset to start at
* \tparam int(in) length number of bytes to return
* \type string
* \returns buffer of body starting at offset, hex encoded
*/
SkinFileExtract.prototype.getBuffer = function(offset,length){
   return interop.invoke(this.instanceId, {
      "method":"getBuffer", 
      "offset":offset, 
      "length":length
   });
};


/*!
* Create instance of skinFileExtract
*/
function createSkinFileExtract()
{
   return interop.createInstance("SSN.SkinFileExtract", SkinFileExtract);
}


/*!
* \file skinwindownotify.js
* \brief File containing skin window notify flags
*/

/*!
* \class SkinWindowNotify
* \brief Skin window notify return type flags
*/

function SkinWindowNotify() {
    /*!
    * Info
    * \type int
    */
    this.INFO = 0;
    /*!
    * Warning
    * \type int
    */
    this.WARNING = 1;
    /*!
    * Error
    * \type int
    */
    this.ERROR = 2;
}

/*!
* precreated global instance of SkinWindowNotify
* \type SkinWindowNotify
*/
var skinWindowNotify = new SkinWindowNotify();

/*!
* \file skinwindowprompt.js
* \brief File containing skin window prompt flags
*/

/*!
* \class SkinWindowPrompt
* \brief Skin window prompt question and return type flags
*/

function SkinWindowPrompt() {
    /*!
    * Unknown
    * \type int
    */
    this.UNKNOWN = 0;
    /*!
    * Ok
    * \type int
    */
    this.OK = 1;
    /*!
    * Cancel
    * \type int
    */
    this.CANCEL = 2;
    /*!
    * Yes
    * \type int
    */
    this.YES = 4;
    /*!
    * No
    * \type int
    */
    this.NO = 8;
}

/*!
* precreated global instance of SkinWindowPrompt
* \type SkinWindowPrompt
*/
var skinWindowPrompt = new SkinWindowPrompt();

$(document).ready(function() {
    var rootElementClass = null, obsLoad = null, obsLocalize = null, modalStack = [], ShutdownState,
        pendingFunctions = [], pendingIntervalId = null;

    ShutdownState = {
        WaitForConfirm: 1,
        WaitForUser: 2,
        WaitForWorkflow: 3,
        Ready: 4
    };

    function SkinWindowView() {
        this.instanceId = app.expandString("{Guid}");
        this.rootElement = null;
        this.resizeElement = null;
        this.maximizeElement = null;
        this.minimizeElement = null;
        this.closeElement = null;
        this.moveElement = null;
        this.errorElement = null;
        this.localize = true;
        this.autoShow = true;
        this.allowSleep = false;
        this.allowConfirmClose = false;
        this.confirmCloseRootElement = null;
        this.confirmCloseCancelElement = null;
        this.loadTime = 0;
        this.shutdownState = ShutdownState.WaitForConfirm;
        this.workflowLoaded = false;
        this.workflowPath = skinWindow.getConfig("Skin.WorkflowPath", "");
    }

    SkinWindowView.prototype.onUpdateElement = function(element, value) {
        if (!isNull(element)) {
            var oldValue = element.html();
            if (oldValue !== value) {
                element.html(value);
                element.trigger("changed", [oldValue, value]);
            }
        }
    };

    SkinWindowView.prototype.onApplyState = function(stateName, isModal) {
        // Treat shutdown as a special case and allow it precendence over modal views
        if (stateName === "skinStateShutdown") {
            if (!isNull(window.skinWindowView.rootElement)) {
                rootElementClass.apply(stateName);
            }

            // No more proxy authentication after shutdown state reached
            if (!isNull(window.webGetAuthenticateView)) {
                window.webGetAuthenticateView.release();
                window.webGetAuthenticateView = null;
            }
        }

        if (isModal === false && modalStack.length > 0) {
            modalStack[0].previousState = stateName;
        } else if (!isNull(window.skinWindowView.rootElement)) {
            // Don't allow class to change after it's reached the shutdown state
            if (rootElementClass.currentState !== "skinStateShutdown") {
                rootElementClass.apply(stateName);
            }
        }
    };

    SkinWindowView.prototype.error = function(str) {
        this.onUpdateElement(this.errorElement, str);
        this.onApplyState("skinStateFailure", false);
    };

    SkinWindowView.prototype.moveModalToTop = function(name) {
        var idx = 0, self = this, currentState, retVal = false;
        modalStack.forEach(function(item) {
            if (retVal === false && item.name === name) {
                idx = modalStack.indexOf(item);
                if (idx >= 0) {
                    retVal = true;
                    if (idx + 1 < modalStack.length) {
                        // It's here and it's not already the top dialog
                        modalStack.splice(idx, 1);
                        currentState = modalStack[idx].previousState;
                        modalStack[idx].previousState = item.previousState;
                        item.previousState = rootElementClass.currentState;
                        self.onApplyState(currentState, true);
                        modalStack.push(item);
                    }
                }
            }
        });

        return retVal;
    };

    SkinWindowView.prototype.changeModalState = function(modalItem, state) {
        var stateName = "{0}-{1}".format(state, modalItem.name), idx = 0;

        idx = modalStack.indexOf(modalItem);
        if (idx + 1 >= modalStack.length) {
            this.onApplyState(stateName, true);
        } else {
            modalStack[idx + 1].previousState = stateName;
        }
    };

    SkinWindowView.prototype.showModal = function(element, requireLoad, name, modalArgs) {
        if (this.moveModalToTop(name) === true) {
            return;
        }

        var modalItem = {
            "name": name,
            "element": element,
            "previousState": rootElementClass.currentState
        };

        modalStack.push(modalItem);

        element.bind("modalMoveToTop.skinwindowview", null, function(event) {
            window.skinWindowView.moveModalToTop(name);
        });

        element.bind("modalLoaded.skinwindowview", null, function(event) {
            window.skinWindowView.changeModalState(modalItem, "skinStateModalRunning");
        });

        element.bind("modalHide.skinwindowview", null, function(event) {
            window.skinWindowView.hideModal(name);
        });

        if (requireLoad === true) {
            window.skinWindowView.changeModalState(modalItem, "skinStateModalLoading");
            element.trigger("modalLoad", modalArgs);
        } else {
            window.skinWindowView.changeModalState(modalItem, "skinStateModalRunning");
        }

        element.trigger("modalShow", modalArgs);
    };

    SkinWindowView.prototype.hideModal = function(name) {
        var idx = 0, self = this;
        modalStack.forEach(function(item) {
            if (item.name === name) {
                idx = modalStack.indexOf(item);
                if (idx >= 0) {
                    item.element.unbind(".skinwindowview");

                    if (idx + 1 >= modalStack.length) {
                        self.onApplyState(modalStack.pop().previousState, true);
                        return true;
                    }

                    modalStack.splice(idx, 1);
                    modalStack[idx].previousState = item.previousState;
                    item.previousState = rootElementClass.currentState;
                    return true;
                }
            }
        });

        return false;
    };

    SkinWindowView.prototype.localizeElement = function(element) {
        var oldDisplay, before, after, localeattrs = null;
        if (isNull(element)) {
            element = $("*");
        } else {
            element = element.find("*");
        }
        element.each(function(key, obj) {
            before = $(this).attr("value");
            localeattrs = $(this).data("l18n");

            if (!isNull(localeattrs)) {
                if (hasOwnProperty(localeattrs, "value")) {
                    $(this).attr("value", host.getLanguageString(localeattrs.value));
                }

                if (hasOwnProperty(localeattrs, "alt")) {
                    $(this).attr("alt", host.getLanguageString(localeattrs.alt));
                }

                if (hasOwnProperty(localeattrs, "title")) {
                    $(this).attr("title", host.getLanguageString(localeattrs.title));
                }

                if (hasOwnProperty(localeattrs, "html")) {
                    $(this).html(host.getLanguageString(localeattrs.html));
                }

                localeattrs = null;
                return;
            }

            if (!isNull(before) && before.length > 0) {
                after = host.getLanguageString(before);
                if (before !== after) {
                    $(this).attr("value", after);
                    if (isNull(localeattrs)) localeattrs = {};
                    localeattrs["value"] = before;
                }
            }

            before = $(this).attr("alt");
            if (!isNull(before) && before.length > 0) {
                after = host.getLanguageString(before);
                if (before !== after) {
                    $(this).attr("alt", after);
                    if (isNull(localeattrs)) localeattrs = {};
                    localeattrs["alt"] = before;
                }
            }

            before = $(this).attr("title");
            if (!isNull(before) && before.length > 0) {
                after = host.getLanguageString(before);
                if (before !== after) {
                    $(this).attr("title", after);
                    if (isNull(localeattrs)) localeattrs = {};
                    localeattrs["title"] = before;
                }
            }

            before = $.trim($(this).html());
            if (before.length > 0) {
                after = host.getLanguageString(before);
                if (before !== after) {
                    $(this).html(after);
                    if (isNull(localeattrs)) localeattrs = {};
                    localeattrs["html"] = before;
                }
            }

            if (!isNull(localeattrs)) {
                $(this).data("l18n", localeattrs);
                localeattrs = null;
            }
        });

        // Force a redraw to fix cef error when replacement string length is greater than the original string
        oldDisplay = document.body.style.display;
        document.body.style.display = 'none';
        document.body.offsetHeight; // no need to store this anywhere, the reference is enough
        document.body.style.display = oldDisplay;
    };

    SkinWindowView.prototype.relocalize = function() {
        var self = this;
        host.loadLanguageByCode(app.getLanguage(), app.getCountry(), function(info) {
            if (info.successful === false) {
                app.debugPrint("Unable to load language strings\n");
            }
            self.localizeElement();
            notificationCenter.fire("SkinWindow", "L18NComplete", window.skinWindow, {});
        });
    };

    SkinWindowView.prototype.onWorkflowUnloaded = function() {
        this.workflowLoaded = false;
        settings.save();

        host.assert(this.shutdownState === ShutdownState.WaitForWorkflow, "Invalid shutdown state before final shutdown");
        this.shutdownState = ShutdownState.Ready;

        app.closeAll();
    };

    SkinWindowView.prototype.unloadWorkflow = function() {
        var self = this;

        host.assert(this.shutdownState === ShutdownState.WaitForUser, "Invalid shutdown state before stopWorkflow");

        if (!isNull(pendingIntervalId)) {
            clearInterval(pendingIntervalId);
            pendingIntervalId = null;
        }

        pendingFunctions = [];

        this.shutdownState = ShutdownState.WaitForWorkflow;
        if (this.workflowLoaded === true) {
            workflow.unload();
        } else {
            setTimeout(function() { self.onWorkflowUnloaded(); }, 0);
        }
    };

    function pendFunction(waitFunction, func) {
        // Check to see if an interval has already started because I don't want to 
        // change the order the functions are loaded in
        if (isNull(pendingIntervalId) && waitFunction() === false) {
            func();
            return;
        }

        function processPending() {
            if (waitFunction() === true) {
                return;
            }

            clearInterval(pendingIntervalId);
            pendingIntervalId = null;

            pendingFunctions.forEach(function(func) {
                func();
            });

            pendingFunctions = [];
        }

        pendingFunctions.push(func);

        if (isNull(pendingIntervalId)) {
            pendingIntervalId = setInterval(function() {
                processPending();
            }, 250);
        }
    }

    window.skinWindowView = new SkinWindowView();

    notificationCenter.fire("SkinWindowView", "Bind", window.skinWindowView, window.skinWindowView);

    if (!isNull(window.skinWindowView.rootElement)) {
        rootElementClass = new ChangeClass(window.skinWindowView.rootElement);
        window.skinWindowView.onApplyState("skinStateInitializing", false);
        window.skinWindowView.rootElement.bind("changed", null, function() {
            if (window.skinWindowView.allowSleep !== true) {
                platform.resetSystemIdleTimer();
            }
        });
    }

    if (!isNull(window.skinWindowView.resizeElement)) {
        window.skinWindowView.resizeElement.mousedown(function(b) {
            if (b.which === 1) {
                skinWindow.beginSize();
            }
        });
    }

    if (!isNull(window.skinWindowView.moveElement)) {
        window.skinWindowView.moveElement.mousedown(function(b) {
            if (b.which === 1) {
                skinWindow.beginMove();
            }
        });
    }

    if (!isNull(window.skinWindowView.closeElement)) {
        window.skinWindowView.closeElement.click(function() {
            skinWindow.close();
        });
    }

    if (!isNull(window.skinWindowView.minimizeElement)) {
        window.skinWindowView.minimizeElement.click(function() {
            skinWindow.minimize();
        });
    }

    if (!isNull(window.skinWindowView.confirmCloseRootElement)) {
        var modalSuccessInfo = { "onComplete": function() {
            window.skinWindowView.shutdownState = ShutdownState.WaitForUser;
            window.skinWindow.close();
            }
        };
        window.skinWindowView.confirmCloseRootElement.find("form").submit(function() {
            window.skinWindowView.confirmCloseRootElement.trigger("modalSuccess", modalSuccessInfo);
            window.skinWindowView.hideModal("confirmClose");
            if (hasOwnProperty(modalSuccessInfo, "onComplete") && !isNull(modalSuccessInfo.onComplete)) {
                modalSuccessInfo.onComplete();
            }
            return false;
        });

        if (!isNull(window.skinWindowView.confirmCloseCancelElement)) {
            window.skinWindowView.confirmCloseCancelElement.click(function() {
                window.skinWindowView.confirmCloseRootElement.trigger("modalFailure");
                window.skinWindowView.hideModal("confirmClose");
            });
        }
    }

    notificationCenter.addInstanceObserver("Settings", "DidLoad", settings, function(sender, info) {
        settings.set("logExpirationDays", parseInt(app.getConfig("DefaultLogExpirationDays", "0"), 10), false);
        settings.set("maxFileWriteRate", parseInt(app.getConfig("DefaultFileWriteRate", "0"), 10), false);
        settings.set("maxFileReadRate", parseInt(app.getConfig("DefaultFileReadRate", "0"), 10), false);
        settings.set("maxUploadRate", parseInt(app.getConfig("DefaultUploadRate", "0"), 10), false);
        settings.set("maxDownloadRate", parseInt(app.getConfig("DefaultDownloadRate", "0"), 10), false);
        settings.set("webEnabled", app.getConfig("DefaultWeb", "true").toBoolean(), false);
        settings.set("p2pEnabled", app.getConfig("DefaultP2P", "true").toBoolean(), false);
    });

    notificationCenter.addInstanceObserver("Workflow", "DidLoad", workflow, function(sender, info) {
        window.skinWindowView.onApplyState("skinStateRunning", false);
    });

    notificationCenter.addInstanceObserver("Workflow", "WillUnload", workflow, function(sender, info) {
        window.skinWindowView.onApplyState("skinStateShutdown", false);
    });

    notificationCenter.addInstanceObserver("Workflow", "DidUnload", workflow, function(sender, info) {
        window.skinWindowView.onWorkflowUnloaded();
    });

    notificationCenter.addInstanceObserver("SkinWindow", "DidClose", skinWindow, function(sender, info) {
        if (!isNull(window.skinWindowView.rootElement)) {
            window.skinWindowView.rootElement.trigger("didClose");
        }

        if (!isNull(window.skinWindowView.resizeElement)) {
            window.skinWindowView.resizeElement.unbind();
        }

        if (!isNull(window.skinWindowView.moveElement)) {
            window.skinWindowView.moveElement.unbind();
        }

        if (!isNull(window.skinWindowView.closeElement)) {
            window.skinWindowView.closeElement.unbind();
        }

        if (!isNull(window.skinWindowView.minimizeElement)) {
            window.skinWindowView.minimizeElement.unbind();
        }

        window.skinWindowView = null;
    });

    notificationCenter.addInstanceObserver("SkinWindow", "WillClose", skinWindow, function(sender, info) {
        if (info.canClose === false) {
            return;
        }

        if (window.skinWindowView.shutdownState === ShutdownState.WaitForConfirm) {
            // Don't show the are you sure modal if the application is the one requesting a restart
            if (app.getRestart() === false && window.skinWindowView.allowConfirmClose === true && !isNull(window.skinWindowView.confirmCloseRootElement)) {
                window.skinWindowView.showModal(window.skinWindowView.confirmCloseRootElement, false, "confirmClose", {});
            } else {
                window.skinWindowView.shutdownState = ShutdownState.WaitForUser;
            }
        }

        if (window.skinWindowView.shutdownState === ShutdownState.WaitForUser) {
            if (!isNull(window.skinWindowView.rootElement)) {
                window.skinWindowView.rootElement.trigger("willClose", [info]);
            }

            if (info.canClose === true) {
                window.skinWindowView.unloadWorkflow();
            }
        }

        if (window.skinWindowView.shutdownState !== ShutdownState.Ready) {
            info.canClose = false;
        }
    });

    notificationCenter.addInstanceObserver("SkinWindow", "L18NComplete", skinWindow, function(sender, info) {
        if (!isNull(window.skinWindowView.rootElement)) {
            window.skinWindowView.rootElement.trigger("localize", [app.getLanguage(), app.getCountry()]);
        }
    });

    obsLocalize = notificationCenter.addInstanceObserver("SkinWindow", "L18NComplete", skinWindow, function(sender, info) {
        obsLocalize.release();
        skinWindow.setTitle(host.getLanguageString(skinWindow.getTitle()));
        window.skinWindowView.loadTime = app.getCurrentTime() - app.getStartTime();
        if (window.skinWindowView.autoShow === true) {
            skinWindow.show();
        }
    });

    remoteNotificationCenter.addInstanceObserver("SkinWindow", "SettingChange", skinWindow, function(sender, sendto, info) {
        settings.set(info.key, info.value);
    });

    notificationCenter.addInstanceObserver("Settings", "DidChange", settings, function(sender, info) {
        function downloaderNotLoaded() {
            return isNull(window.downloader);
        }

        switch (info.key) {
            case "language":
                var languageArr = info.newValue.split("-");
                if (languageArr.length > 1) {
                    app.setLanguage(languageArr[0]);
                    app.setCountry(languageArr[1]);
                    window.skinWindowView.relocalize();
                }
                break;

            case "webEnabled":
                pendFunction(downloaderNotLoaded, function() {
                    window.downloader.setWebBaseActive(info.newValue);
                });
                break;

            case "p2pEnabled":
                pendFunction(downloaderNotLoaded, function() {
                    window.downloader.setBitBaseActive(info.newValue);
                });
                break;

            case "maxUploadRate":
                pendFunction(downloaderNotLoaded, function() {
                    window.downloader.setUploadLimit(info.newValue);
                });
                break;

            case "maxDownloadRate":
                pendFunction(downloaderNotLoaded, function() {
                    window.downloader.setDownloadLimit(info.newValue);
                });
                break;

            case "maxFileReadRate":
                window.platform.setFileReadLimit(info.newValue);
                break;

            case "maxFileWriteRate":
                window.platform.setFileWriteLimit(info.newValue);
                break;

            case "logExpirationDays":
                app.setLogExpirationDays(info.newValue);
                break;
        }
    });

    if (window.skinWindowView.localize === true) {
        window.skinWindowView.relocalize();
    } else {
        notificationCenter.fire("SkinWindow", "L18NComplete", window.skinWindow, {});
    }

    if (!isNull(window.skinWindowView.workflowPath)) {
        window.skinWindowView.workflowLoaded = true;
        window.workflow.load(window.skinWindowView.workflowPath);
    }

    settings.load();
});

/*!
* \file SystemMutex.js
* \brief File containing SystemMutex class and creation function
*/

/*!
* \class SystemMutex
* \brief Multi-process singleton lock
*/




function SystemMutex(instanceId)
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
SystemMutex.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the unique name of the lock
* \type string
* \returns unique name of the lock
*/
SystemMutex.prototype.getName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getName"
   });
};

/*!
* sets the unique name of the lock
* \tparam string(in) value unique name of the lock
*/
SystemMutex.prototype.setName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setName", 
      "value":value
   });
};

/*!
* Locks the mutex
*/
SystemMutex.prototype.lock = function(){
   return interop.invoke(this.instanceId, {
      "method":"lock"
   });
};

/*!
* Locks the mutex
* \tparam int(in) waitMS time in milliseconds to wait to obtain the lock
*/
SystemMutex.prototype.lockWithTimeout = function(waitMS){
   return interop.invoke(this.instanceId, {
      "method":"lockWithTimeout", 
      "waitMS":waitMS
   });
};

/*!
* Unlocks the mutex
*/
SystemMutex.prototype.unlock = function(){
   return interop.invoke(this.instanceId, {
      "method":"unlock"
   });
};


/*!
* Create instance of systemMutex
*/
function createSystemMutex()
{
   return interop.createInstance("SSN.SystemMutex", SystemMutex);
}


function TaskController(task, args) {
    var self = this;

    this.observers = [];
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

TaskController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

TaskController.prototype.onStart = function(task, info) {
    task.assertArgument("message");

    switch (task.args.type) {
        case "taskWarning":
            task.warning(task.args.message);
            break;
        case "taskError":
            task.error(task.args.message);
            break;
        default:
            host.assert(false, "Unknown type in TaskController ({0})".format(task.args.type));
            break;
    }

    task.complete();
};

registerTaskController("taskWarning", TaskController);
registerTaskController("taskError", TaskController);

/*!
* \file TextFileReader.js
* \brief File containing TextFileReader class and creation function
*/

/*!
* \class TextFileReader
* \brief Text file reader
*/




function TextFileReader(instanceId)
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
TextFileReader.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* gets the max size of the buffer being read into
* \type int
* \returns max size of the buffer being read into
*/
TextFileReader.prototype.getBufferSize = function(){
   return interop.invoke(this.instanceId, {
      "method":"getBufferSize"
   });
};

/*!
* sets the max size of the buffer being read into
* \tparam int(in) value max size of the buffer being read into
*/
TextFileReader.prototype.setBufferSize = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setBufferSize", 
      "value":value
   });
};

/*!
* gets the file name where url is saved
* \type string
* \returns file name where url is saved
*/
TextFileReader.prototype.getFileName = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileName"
   });
};

/*!
* sets the file name where url is saved
* \tparam string(in) value file name where url is saved
*/
TextFileReader.prototype.setFileName = function(value){
   return interop.invoke(this.instanceId, {
      "method":"setFileName", 
      "value":value
   });
};

/*!
* gets the size of the file
* \type int
* \returns size of the file
*/
TextFileReader.prototype.getFileSize = function(){
   return interop.invoke(this.instanceId, {
      "method":"getFileSize"
   });
};

/*!
* gets the number of bytes left
* \type int
* \returns number of bytes left
*/
TextFileReader.prototype.getBytesLeft = function(){
   return interop.invoke(this.instanceId, {
      "method":"getBytesLeft"
   });
};

/*!
* Start file reading
*/
TextFileReader.prototype.start = function(){
   return interop.invoke(this.instanceId, {
      "method":"start"
   });
};


/*!
* Create instance of textFileReader
*/
function createTextFileReader()
{
   return interop.createInstance("SSN.TextFileReader", TextFileReader);
}


/*!
* \file TextFileWriter.js
* \brief File containing TextFileWriter class and creation function
*/

/*!
* \class TextFileWriter
* \brief Text file writer
*/




function TextFileWriter(instanceId)
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
TextFileWriter.prototype.release = function()
{
   interop.releaseInstance(this.instanceId);
};

/*!
* Open file for writing
* \tparam string(in) fileName name of the file to close
* \type bool
* \returns true if successful, false otherwise
*/
TextFileWriter.prototype.open = function(fileName){
   return interop.invoke(this.instanceId, {
      "method":"open", 
      "fileName":fileName
   });
};

/*!
* Write string to file
* \tparam string(in) value string to write to file
* \type int
* \returns number of bytes written to file
*/
TextFileWriter.prototype.write = function(value){
   return interop.invoke(this.instanceId, {
      "method":"write", 
      "value":value
   });
};

/*!
* Close file
* \type bool
* \returns true if successful, false otherwise
*/
TextFileWriter.prototype.close = function(){
   return interop.invoke(this.instanceId, {
      "method":"close"
   });
};


/*!
* Create instance of textFileWriter
*/
function createTextFileWriter()
{
   return interop.createInstance("SSN.TextFileWriter", TextFileWriter);
}



function UIModalController(task, args) {
    var self = this;
    
    this.observers = [];
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
    
    this.cancelBehavior = "error";
}

UIModalController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

UIModalController.prototype.onStart = function(task, info) {
    if (hasOwnProperty(task.args, "cancelBehavior")) {
        this.cancelBehavior = task.args.cancelBehavior;
    }
};

UIModalController.prototype.ok = function(task) {
    notificationCenter.fire("Task", "HideModal", task, { "result": "ok" });

    task.runSubAction("ok", null, function(subTask, subTaskInfo) {
        task.complete();
    });
};

UIModalController.prototype.cancel = function(task) {
    var self = this;

    notificationCenter.fire("Task", "HideModal", task, { "result": "cancel" });
    switch (self.cancelBehavior.toLowerCase()) {
        case "none":
            // do nothing
            break;
        case "warning":
            task.warning("UI_UserAbort");
            break;
        default:
            task.error("UI_UserAbort");
            break;
    }

    task.runSubAction("cancel", null, function(subTask, subTaskInfo) {
        task.complete();
    });
};

registerTaskController("uimodal", UIModalController);

function UIModalView(task, args) {
    var self = this;

    this.element = null;
    this.requireLoad = false;
    this.requireValidation = false;
    this.isVisible = false;
    this.cancelElement = null;
    this.controller = task.controller;

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Task", "Complete", task, function(sender, info) { self.onComplete(task, info); }));
    this.observers.push(notificationCenter.addInstanceObserver("Task", "HideModal", task, function(sender, info) { self.onWindowHideModal(task, info); }));

    this.observers.push(notificationCenter.addInstanceObserver("Workflow", "WillUnload", workflow, function(sender, info) { self.onWorkflowUnload(task, info); }));
}

UIModalView.prototype.release = function() {
    if (!isNull(this.controller)) {
        this.controller.release();
        this.controller = null;
    }

    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

UIModalView.prototype.onShow = function(task) {
    var self = this;

    host.assert(this.isVisible === false, "Trying to show an already visible view");

    window.skinWindowView.showModal(this.element, this.requireLoad, task.name, task);
    this.isVisible = true;
};

UIModalView.prototype.onHide = function(task) {
    if (this.isVisible === false) {
        return;
    }
    
    this.isVisible = false;
    window.skinWindowView.hideModal(task.name);
};

UIModalView.prototype.onStart = function(task, info) {
    var self = this;

    this.element = $(task.args.element);

    host.assert(!isNull(this.element), "Element not found for {0}".format(task.name));

    this.cancelElement = this.element.find(task.args.cancelElement);

    this.element.trigger("bind", [task, this]);

    this.element.unbind(".uimodalview");
    this.element.find("form").unbind(".uimodalview");

    if (!isNull(this.cancelElement)) {
        this.cancelElement.unbind(".uimodalview");
    }

    this.element.find("form").bind("submit.uimodalview", null, function() {
        if (self.requireValidation === true) {
            self.element.trigger("modalValidate", task);
        } else {
            self.element.trigger("modalSuccess");
        }
        return false;
    });

    this.element.bind("modalSuccess.uimodalview", null, function(event) {
        task.controller.ok(task);
    });

    this.element.bind("modalFailure.uimodalview", null, function(event) {
        task.controller.cancel(task);
    });

    if (!isNull(this.cancelElement)) {
        this.cancelElement.bind("click.uimodalview", null, function() {
            self.element.trigger("modalFailure");
        });
    }

    this.onShow(task);
};

UIModalView.prototype.onComplete = function(task, info) {
    this.release();
};

UIModalView.prototype.onWindowHideModal = function(task, info) {
    this.onHide(task);
};

UIModalView.prototype.onWorkflowUnload = function(task, info) {
    this.release();
};

registerTaskView("uimodal", UIModalView);

function UnloadInteropController(task, args) {
    var self = this;

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));

    this.observers.push(notificationCenter.addObserver("App", "InteropUnloaded", function(sender, info) { self.onInteropUnloaded(task, info); }));
}

UnloadInteropController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

UnloadInteropController.prototype.onInteropUnloaded = function(task, info) {
    var interopArgs = {}, filename;

    filename = app.expandString(task.args.filename);
    if (info.fileName.toLowerCase() === filename.toLowerCase()) {
        if (info.successful === true) {
            window.interop.activeInteropLibs.removeElement(task.args.name);
            
            mergeObjectProperties(interopArgs, task.args);
            notificationCenter.fire("Interop", "DidUnload", task, interopArgs);
        } else {
            task.error("Interop_UnloadFailed");
        }

        task.complete();
    }
};

UnloadInteropController.prototype.onStart = function(task, info) {
    var interopArgs = {}, filename;

    task.assertArgument("name");
    task.assertArgument("filename");

    filename = app.expandString(task.args.filename);

    mergeObjectProperties(interopArgs, task.args);
    interopArgs.cancel = false;

    notificationCenter.fire("Interop", "WillUnload", task, interopArgs);
    if (interopArgs.cancel === true) {
        app.debugPrint("Interop unload cancelled ({0})".format(task.args.name));
        task.error("Interop_UnloadCancel");
        task.complete();
        return;
    }

    if (app.unloadInterop(filename) === false) {
        // Fire the unload anyway, so the skin can shutdown
        interopArgs = {};
        mergeObjectProperties(interopArgs, task.args);
        notificationCenter.fire("Interop", "DidUnload", task, interopArgs);

        task.complete();
    }
};

registerTaskController("unloadInterop", UnloadInteropController);

function UrlRedirectController(task, args) {
    var self = this;

    this.observers = [];

    this.observers.push(notificationCenter.addInstanceObserver("Task", "Start", task, function(sender, info) { self.onStart(task, info); }));
}

UrlRedirectController.prototype.release = function() {
    this.observers.forEach(function(observer) {
        observer.release();
    });
    this.observers = [];
};

UrlRedirectController.prototype.checkMatch = function(task, url) {
    var retVal = false;

    switch (getObjectType(task.args.beginsWith)) {
        case "array":
            task.args.beginsWith.forEach(function(compareUrl) {
                if (url.beginsWith(app.expandString(compareUrl))) {
                    retVal = true;
                }
            });
            break;

        default:
            if (url.beginsWith(app.expandString(task.args.beginsWith))) {
                retVal = true;
            }
            break;
    }

    return retVal;
};

UrlRedirectController.prototype.onStart = function(task, info) {
    var self = this;

    task.assertArgument("beginsWith");

    host.assert(hasOwnProperty(task.args, "append") || hasOwnProperty(task.args, "replace"), "{0} not defined for ({1}) in ({2})".format("append/replace", task.type, task.name));

    notificationCenter.addObserver("App", "WillConstructWebGetTarget", function(sender, info) {
        if (self.checkMatch(task, info.url)) {
            if (!isNull(task.args.append)) {
                info.url = app.expandString(info.url + task.args.append);
            } else if (!isNull(task.args.replace)) {
                info.url = app.expandString(task.args.replace);
            }
        }
    });

    task.complete();
};

registerTaskController("urlRedirect", UrlRedirectController);

$(document).ready(function() {
    function WebGetAuthenticateView() {
        this.instanceId = app.expandString("{Guid}");
        this.rootElement = null;
        this.errorElement = null;
        this.serverElement = null;
        this.portElement = null;
        this.realmElement = null;
        this.usernameElement = null;
        this.passwordElement = null;
        this.cancelElement = null;
        this.observers = [];
    }

    var activeAuth = {};

    WebGetAuthenticateView.prototype.cancelAll = function() {
        $.each(activeAuth, function(key, value) {
            $.each(value, function(key2, value2) {
                window.downloader.webGetRetryAuth(value2.webGetContextId, true);
            });
        });

        if (!isNull(window.webGetAuthenticateView.rootElement)) {
            window.webGetAuthenticateView.rootElement.removeData("webAuthInfo");
        }

        activeAuth = {};
    };

    WebGetAuthenticateView.prototype.release = function() {
        this.observers.forEach(function(observer) {
            observer.release();
        });
        this.observers = [];

        this.cancelAll();

        window.webGetAuthenticateView = null;

        // Auto-cancel
        notificationCenter.addObserver("App", "WillAuthenticateWebGet", function(sender, info) {
            window.downloader.webGetRetryAuth(info.webGetContextId, true);
        });
    };

    window.webGetAuthenticateView = new WebGetAuthenticateView();

    notificationCenter.fire("WebGetAuthenticateView", "Bind", window.webGetAuthenticateView, window.webGetAuthenticateView);

    if (isNull(window.webGetAuthenticateView.rootElement) &&
        isNull(window.webGetAuthenticateView.serverElement) &&
        isNull(window.webGetAuthenticateView.portElement) &&
        isNull(window.webGetAuthenticateView.realmElement) &&
        isNull(window.webGetAuthenticateView.usernameElement) &&
        isNull(window.webGetAuthenticateView.passwordElement)) {
        // Release the object to set the auto-cancel
        window.webGetAuthenticateView.release();
        return;
    }

    window.webGetAuthenticateView.observers.push(notificationCenter.addObserver("App", "WillAuthenticateWebGet", function(sender, info) {
        var identifier = "{0}#{1}".format(info.host, info.realm);
        if (hasOwnProperty(activeAuth, identifier)) {
            if (!isNull(window.webGetAuthenticateView.rootElement)) {
                window.skinWindowView.moveModalToTop("webAuthenticate");
            }
            activeAuth[identifier].push(info);
            return;
        }

        if (!isNull(window.webGetAuthenticateView.rootElement)) {
            activeAuth[identifier] = [info];
            window.skinWindowView.showModal(window.webGetAuthenticateView.rootElement, false, "webAuthenticate", info);
        }
    }));

    if (!isNull(window.webGetAuthenticateView.rootElement)) {
        window.webGetAuthenticateView.rootElement.bind("modalShow", function(e, info) {
            var port, hostname, userCredentials, oldValue, newValue = "";

            window.webGetAuthenticateView.rootElement.data("webAuthInfo", info);

            if (info.host.indexOf(":") !== -1) {
                port = info.host.substr(info.host.indexOf(":") + 1);
                hostname = info.host.substr(0, info.host.indexOf(":"));
            } else {
                port = "80";
                hostname = info.host;
            }

            userCredentials = {
                "username": "",
                "password": ""
            };

            if (!isNull(window.webGetAuthenticateView.serverElement)) {
                window.webGetAuthenticateView.serverElement.html(hostname);
            }

            if (!isNull(window.webGetAuthenticateView.portElement)) {
                window.webGetAuthenticateView.portElement.html(port);
            }

            if (!isNull(window.webGetAuthenticateView.realmElement)) {
                window.webGetAuthenticateView.realmElement.html(info.realm);
            }

            if (app.getWebCredential(info.type, info.host, info.realm, userCredentials) === true) {
                if (!isNull(window.webGetAuthenticateView.errorElement)) {
                    oldValue = window.webGetAuthenticateView.errorElement.html();
                    newValue = host.getLanguageString("WebAuthenticate_InvalidLogin");
                    window.webGetAuthenticateView.errorElement.html(newValue);
                    window.webGetAuthenticateView.errorElement.trigger("changed", [oldValue, newValue]);
                }
                if (!isNull(window.webGetAuthenticateView.usernameElement)) {
                    window.webGetAuthenticateView.usernameElement.val(userCredentials.username);
                }
                if (!isNull(window.webGetAuthenticateView.passwordElement)) {
                    window.webGetAuthenticateView.passwordElement.val(userCredentials.password);
                }
            } else {
                if (!isNull(window.webGetAuthenticateView.errorElement)) {
                    oldValue = window.webGetAuthenticateView.errorElement.html();
                    window.webGetAuthenticateView.errorElement.html(newValue);
                    window.webGetAuthenticateView.errorElement.trigger("changed", [oldValue, newValue]);
                }
                if (!isNull(window.webGetAuthenticateView.usernameElement)) {
                    window.webGetAuthenticateView.usernameElement.val("");
                }
                if (!isNull(window.webGetAuthenticateView.passwordElement)) {
                    window.webGetAuthenticateView.passwordElement.val("");
                }
            }

            userCredentials = null;
        });

        window.webGetAuthenticateView.rootElement.find("form").submit(function() {
            var info = window.webGetAuthenticateView.rootElement.data("webAuthInfo"), identifier;
            if (!isNull(info)) {
                if (!isNull(window.webGetAuthenticateView.usernameElement) &&
                !isNull(window.webGetAuthenticateView.passwordElement)) {
                    app.setWebCredential(info.type, info.host, info.realm, window.webGetAuthenticateView.usernameElement.val(), window.webGetAuthenticateView.passwordElement.val());
                }

                identifier = "{0}#{1}".format(info.host, info.realm)
                $.each(activeAuth[identifier], function(key, value) {
                    window.downloader.webGetRetryAuth(value.webGetContextId, false);
                });
                delete activeAuth[identifier];
            }
            window.webGetAuthenticateView.rootElement.removeData("webAuthInfo");
            window.skinWindowView.hideModal("webAuthenticate");

            return false;
        });
    }

    if (!isNull(window.webGetAuthenticateView.cancelElement)) {
        window.webGetAuthenticateView.cancelElement.click(function() {
            if (!isNull(window.webGetAuthenticateView.rootElement)) {
                var info = window.webGetAuthenticateView.rootElement.data("webAuthInfo"), identifier;
                identifier = "{0}#{1}".format(info.host, info.realm)
                if (!isNull(info)) {
                    $.each(activeAuth[identifier], function(key, value) {
                        window.downloader.webGetRetryAuth(value.webGetContextId, true);
                    });
                    delete activeAuth[identifier];
                }
                window.webGetAuthenticateView.rootElement.removeData("webAuthInfo");
                window.skinWindowView.hideModal("webAuthenticate");
            }
        });
    }
});

(function() {
    function Workflow() {
        this.instanceId = app.expandString("{Guid}");
        this.tasks = new Tasks();
        this.isLoading = false;
        this.isComplete = true;
    }

    Workflow.prototype.runTask = function(taskName, completeCallback) {
        var task, observer;
        task = this.tasks.create(taskName, false, window.taskControllerCreator, window.taskViewCreator);
        if (!isNull(task)) {
            observer = notificationCenter.addInstanceObserver("Task", "Complete", task, function(sender, info) {
                observer.release();
                completeCallback(task, info);
            });
            task.start();
        } else {
            setTimeout(function() { completeCallback(task, {}); }, 0);
        }
    };

    Workflow.prototype.onLoaded = function(info) {
        var self = this, entryPoint = "start";

        if (info.successful === false) {
            self.isLoading = false;

            skinWindowView.error("Workflow_LoadFail");
            return;
        }

        this.runTask("load", function(task, info) {
            self.isLoading = false;

            notificationCenter.fire("Workflow", "DidLoad", self, {});

            if (!isNull(task) && task.hasError()) {
                window.skinWindowView.error(task.getFirstErrorMessage());
                return;
            }

            self.isComplete = false;
            if (app.isCommandFieldSet("uninstall") === true && self.tasks.exists("uninstall") === true) {
                entryPoint = "uninstall";
            }

            app.debugPrint("Worflow starting from {0}\n".format(entryPoint));
            self.runTask(entryPoint, function(task, info) {
                if (!isNull(task) && task.hasError()) {
                    window.skinWindowView.error(task.getFirstErrorMessage());
                }
                self.isComplete = true;
            });
        });
    };

    Workflow.prototype.load = function(path) {
        var self = this;

        this.isLoading = true;

        notificationCenter.fire("Workflow", "WillLoad", this, {});

        this.tasks.load(path, function(info) {
            self.onLoaded(info);
        });
    };

    Workflow.prototype.unload = function() {
        var self = this;

        if (this.isLoading === true) {
            // Wait for load to complete
            setTimeout(function() { self.unload(); }, 100);
            return;
        }

        // Do this before the unload so I can release all the task objects
        this.tasks.cancelAll();
        
        if (this.isComplete === false) {
            // Wait for load to complete
            setTimeout(function() { self.unload(); }, 100);
            return;
        }

        notificationCenter.fire("Workflow", "WillUnload", self, {});

        this.runTask("unload", function(task, info) {
            notificationCenter.fire("Workflow", "DidUnload", self, {});
        });
    };

    window.workflow = new Workflow();
} ());


