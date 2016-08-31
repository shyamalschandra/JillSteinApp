"use strict";
var Interpreter_1 = require("../servicecode/Interpreter");
var Sandbox_1 = require("../servicecode/Sandbox");
var ErrorType_1 = require("../types/ErrorType");
var DetailErrors_1 = require("../errors/DetailErrors");
var InitSelfTest_1 = require("../servicecode/InitSelfTest");
var Statistics_1 = require("../statistics/Statistics");
var SERVICE_CODE = {
    "Social:postUpdate": [
        ["if==than", "$P1", null, 2],
        ["create", "$L0", "Error", "The content is not allowed to be null.", "IllegalArgument"],
        ["throwError", "$L0"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L3", "String"],
        ["string.urlEncode", "$L3", "$P1"],
        ["create", "$L0", "Object"],
        ["set", "$L0.method", "POST"],
        ["create", "$L1", "String"],
        ["string.concat", "$L1", "https://graph.facebook.com/v2.6/me/feed?message=", "$L3"],
        ["set", "$L0.url", "$L1"],
        ["create", "$L0.requestHeaders", "Object"],
        ["string.concat", "$L0.requestHeaders.Authorization", "Bearer ", "$S0.accessToken"],
        ["create", "$L2", "Object"],
        ["http.requestCall", "$L2", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L2"]
    ],
    "Social:getConnections": [
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L0", "Object"],
        ["set", "$L0.method", "GET"],
        ["create", "$L1", "String"],
        ["string.concat", "$L1", "https://graph.facebook.com/v2.6/me/friends"],
        ["set", "$L0.url", "$L1"],
        ["create", "$L0.requestHeaders", "Object"],
        ["string.concat", "$L0.requestHeaders.Authorization", "Bearer ", "$S0.accessToken"],
        ["create", "$L2", "Object"],
        ["http.requestCall", "$L2", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L2"],
        ["create", "$L3", "String"],
        ["stream.streamToString", "$L3", "$L2.responseBody"],
        ["json.parse", "$L4", "$L3"],
        ["create", "$L9", "Number"],
        ["size", "$L9", "$L4.data"],
        ["create", "$P1", "Array"],
        ["if!=than", "$L9", 0, 11],
        ["set", "$L5", "$L4.data.items"],
        ["create", "$L6", "Number"],
        ["size", "$L6", "$L5"],
        ["create", "$L7", "Number", 0],
        ["if<than", "$L7", "$L6", 6],
        ["create", "$L8", "Object"],
        ["get", "$L8", "$L5", "$L7"],
        ["string.concat", "$L9", "facebook-", "$L8.id"],
        ["push", "$P1", "$L9"],
        ["math.add", "$L7", "$L7", 1],
        ["jumpRel", -7]
    ],
    "Authenticating:login": [
        ["callFunc", "checkAuthentication", "$P0"]
    ],
    "Authenticating:logout": [
        ["set", "$P0.userInfo", null],
        ["if!=than", "$S0.accessToken", null, 10],
        ["create", "$L0", "Object"],
        ["set", "$L0.method", "DELETE"],
        ["create", "$L1", "String"],
        ["string.concat", "$L1", "https://graph.facebook.com/v2.6/me/permissions"],
        ["set", "$L0.url", "$L1"],
        ["create", "$L0.requestHeaders", "Object"],
        ["string.concat", "$L0.requestHeaders.Authorization", "Bearer ", "$S0.accessToken"],
        ["create", "$L2", "Object"],
        ["http.requestCall", "$L2", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L2"]
    ],
    "Profile:getIdentifier": [
        ["callFunc", "checkUserInfo", "$P0"],
        ["string.concat", "$P1", "facebook-", "$P0.userInfo.id"]
    ],
    "Profile:getFullName": [
        ["callFunc", "checkUserInfo", "$P0"],
        ["if!=than", "$P0.userInfo.name", null, 1],
        ["set", "$P1", "$P0.userInfo.name"]
    ],
    "Profile:getEmail": [
        ["callFunc", "checkUserInfo", "$P0"],
        ["if!=than", "$P0.userInfo.email", null, 1],
        ["set", "$P1", "$P0.userInfo.email"]
    ],
    "Profile:getGender": [
        ["callFunc", "checkUserInfo", "$P0"],
        ["if!=than", "$P0.userInfo.gender", null, 7],
        ["if==than", "$P0.userInfo.gender", "male", 2],
        ["set", "$P1", "$P0.userInfo.gender"],
        ["return"],
        ["if==than", "$P0.userInfo.gender", "female", 2],
        ["set", "$P1", "$P0.userInfo.gender"],
        ["return"],
        ["set", "$P1", "other"]
    ],
    "Profile:getDescription": [
        ["callFunc", "checkUserInfo", "$P0"],
        ["if!=than", "$P0.userInfo.bio", null, 1],
        ["set", "$P1", "$P0.userInfo.bio"]
    ],
    "Profile:getDateOfBirth": [
        ["callFunc", "checkUserInfo", "$P0"],
        ["create", "$P1", "DateOfBirth"],
        ["if!=than", "$P0.userInfo.birthday", null, 10],
        ["string.split", "$L0", "$P0.userInfo.birthday", "/"],
        ["get", "$L1", "$L0", 0],
        ["if!=than", "$L1", "00", 1],
        ["math.add", "$P1.month", "$L1", 0],
        ["get", "$L1", "$L0", 1],
        ["if!=than", "$L1", "00", 1],
        ["math.add", "$P1.day", "$L1", 0],
        ["get", "$L1", "$L0", 2],
        ["if!=than", "$L1", "0000", 1],
        ["math.add", "$P1.year", "$L1", 0]
    ],
    "Profile:getLocale": [
        ["callFunc", "checkUserInfo", "$P0"],
        ["if!=than", "$P0.userInfo.locale", null, 3],
        ["create", "$L1", "String"],
        ["string.substring", "$L1", "$P0.userInfo.locale", 0, 2],
        ["set", "$P1", "$L1"]
    ],
    "Profile:getPictureURL": [
        ["callFunc", "checkUserInfo", "$P0"],
        ["if!=than", "$P0.userInfo.picture.data.url", null, 1],
        ["set", "$P1", "$P0.userInfo.picture.data.url"]
    ],
    "checkUserInfo": [
        ["create", "$L0", "Date"],
        ["if!=than", "$P0.userInfo", null, 2],
        ["if>than", "$P0.expirationTime", "$L0", 1],
        ["return"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L2", "Object"],
        ["set", "$L2.url", "https://graph.facebook.com/v2.5/me?fields=locale,gender,name,birthday,email,bio"],
        ["create", "$L2.requestHeaders", "Object"],
        ["string.concat", "$L2.requestHeaders.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L2.method", "GET"],
        ["http.requestCall", "$L3", "$L2"],
        ["callFunc", "validateResponse", "$P0", "$L3"],
        ["json.parse", "$P0.userInfo", "$L3.responseBody"],
        ["create", "$L2", "Object"],
        ["set", "$L2.url", "https://graph.facebook.com/v2.6/me/picture?fields=url&type=large&redirect=false"],
        ["create", "$L2.requestHeaders", "Object"],
        ["string.concat", "$L2.requestHeaders.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L2.method", "GET"],
        ["http.requestCall", "$L3", "$L2"],
        ["callFunc", "validateResponse", "$P0", "$L3"],
        ["json.parse", "$L4", "$L3.responseBody"],
        ["set", "$P0.userInfo.picture", "$L4"],
        ["create", "$P0.expirationTime", "Date"],
        ["math.add", "$P0.expirationTime.time", "$P0.expirationTime.time", 60000]
    ],
    "checkAuthentication": [
        ["create", "$L0", "Date"],
        ["if==than", "$S0.accessToken", null, 2],
        ["callFunc", "authenticate", "$P0"],
        ["return"],
        ["create", "$L1", "Date"],
        ["set", "$L1.time", "$S0.expireIn"],
        ["if<than", "$L1", "$L0", 1],
        ["callFunc", "authenticate", "$P0"]
    ],
    "authenticate": [
        ["create", "$L0", "String"],
        ["create", "$L1", "String"],
        ["string.urlEncode", "$L3", "$P0.redirectUri"],
        ["string.concat", "$L0", "https://www.facebook.com/dialog/oauth?response_type=code&client_id=", "$P0.clientID", "&redirect_uri=", "$L3", "&state=", "$P0.state", "&scope=public_profile%2Cemail%2Cuser_birthday%2Cuser_about_me%2Cpublish_actions%2Cuser_friends"],
        ["awaitCodeRedirect", "$L2", "$L0"],
        ["string.concat", "$L1", "https://graph.facebook.com/v2.3/oauth/access_token?client_id=", "$P0.clientID", "&redirect_uri=", "$L3", "&client_secret=", "$P0.clientSecret", "&code=", "$L2"],
        ["create", "$L5", "Object"],
        ["set", "$L5.url", "$L1"],
        ["set", "$L5.method", "GET"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "validateResponse", "$P0", "$L6"],
        ["stream.streamToString", "$L7", "$L6.responseBody"],
        ["json.parse", "$L8", "$L7"],
        ["set", "$S0.accessToken", "$L8.access_token"],
        ["create", "$L10", "Date"],
        ["math.multiply", "$L9", "$L8.expires_in", 1000],
        ["math.add", "$L9", "$L9", "$L10.time", -60000],
        ["set", "$S0.expireIn", "$L9"]
    ],
    "validateResponse": [
        ["if>=than", "$P1.code", 400, 13],
        ["json.parse", "$L0", "$P1.responseBody"],
        ["set", "$L2", "$L0.error_user_msg"],
        ["if==than", "$P1.code", 401, 2],
        ["create", "$L3", "Error", "$L2", "Authentication"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 404, 2],
        ["create", "$L3", "Error", "$L2", "NotFound"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 503, 2],
        ["create", "$L3", "Error", "$L2", "ServiceUnavailable"],
        ["throwError", "$L3"],
        ["create", "$L3", "Error", "$L2", "Http"],
        ["throwError", "$L3"]
    ]
};
var Facebook = (function () {
    function Facebook(redirectReceiver, clientID, clientSecret, redirectUri, state) {
        this.interpreterStorage = {};
        this.persistentStorage = [{}];
        this.instanceDependencyStorage = {
            redirectReceiver: redirectReceiver
        };
        InitSelfTest_1.InitSelfTest.initTest("Facebook");
        this.interpreterStorage["clientID"] = clientID;
        this.interpreterStorage["clientSecret"] = clientSecret;
        this.interpreterStorage["redirectUri"] = redirectUri;
        this.interpreterStorage["state"] = state;
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        if (SERVICE_CODE["init"]) {
            ip.callFunctionSync("init", this.interpreterStorage);
        }
    }
    Facebook.prototype.getIdentifier = function (callback) {
        Statistics_1.Statistics.addCall("Facebook", "getIdentifier");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getIdentifier", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Facebook", "getIdentifier");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Facebook.prototype.getFullName = function (callback) {
        Statistics_1.Statistics.addCall("Facebook", "getFullName");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getFullName", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Facebook", "getFullName");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Facebook.prototype.getEmail = function (callback) {
        Statistics_1.Statistics.addCall("Facebook", "getEmail");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getEmail", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Facebook", "getEmail");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Facebook.prototype.getGender = function (callback) {
        Statistics_1.Statistics.addCall("Facebook", "getGender");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getGender", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Facebook", "getGender");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Facebook.prototype.getDescription = function (callback) {
        Statistics_1.Statistics.addCall("Facebook", "getDescription");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getDescription", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Facebook", "getDescription");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Facebook.prototype.getDateOfBirth = function (callback) {
        Statistics_1.Statistics.addCall("Facebook", "getDateOfBirth");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getDateOfBirth", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Facebook", "getDateOfBirth");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Facebook.prototype.getLocale = function (callback) {
        Statistics_1.Statistics.addCall("Facebook", "getLocale");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getLocale", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Facebook", "getLocale");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Facebook.prototype.getPictureURL = function (callback) {
        Statistics_1.Statistics.addCall("Facebook", "getPictureURL");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getPictureURL", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Facebook", "getPictureURL");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Facebook.prototype.login = function (callback) {
        Statistics_1.Statistics.addCall("Facebook", "login");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Authenticating:login", this.interpreterStorage).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Facebook", "login");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Facebook.prototype.logout = function (callback) {
        Statistics_1.Statistics.addCall("Facebook", "logout");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Authenticating:logout", this.interpreterStorage).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Facebook", "logout");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Facebook.prototype.postUpdate = function (content, callback) {
        Statistics_1.Statistics.addCall("Facebook", "postUpdate");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Social:postUpdate", this.interpreterStorage, content).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Facebook", "postUpdate");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Facebook.prototype.getConnections = function (callback) {
        Statistics_1.Statistics.addCall("Facebook", "getConnections");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Social:getConnections", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Facebook", "getConnections");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Facebook.prototype.saveAsString = function () {
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        return ip.saveAsString();
    };
    Facebook.prototype.loadAsString = function (savedState) {
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.loadAsString(savedState);
        this.persistentStorage = sandbox.persistentStorage;
    };
    Facebook.prototype.resumeLogin = function (executionState, callback) {
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        sandbox.loadStateFromString(executionState);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.resumeFunction("Authenticating:login", this.interpreterStorage).then(function () { return callback(undefined); }, function (err) { return callback(err); });
    };
    return Facebook;
}());
exports.Facebook = Facebook;
