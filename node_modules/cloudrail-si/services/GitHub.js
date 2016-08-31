"use strict";
var Interpreter_1 = require("../servicecode/Interpreter");
var Sandbox_1 = require("../servicecode/Sandbox");
var ErrorType_1 = require("../types/ErrorType");
var DetailErrors_1 = require("../errors/DetailErrors");
var InitSelfTest_1 = require("../servicecode/InitSelfTest");
var Statistics_1 = require("../statistics/Statistics");
var SERVICE_CODE = {
    "getGHIdentifier": [
        ["callFunc", "checkAuthentication", "$P0"],
        ["if==than", "$P0.cachedObject", null, 2],
        ["callFunc", "makeHTTPRequest", "$P0"],
        ["jumpRel", 1],
        ["callFunc", "checkExpirationTime", "$P0"],
        ["string.concat", "$L2", "$P0.cachedObject.id", ""],
        ["string.concat", "$P1", "github-", "$L2"]
    ],
    "getGHFullName": [
        ["callFunc", "checkAuthentication", "$P0"],
        ["if==than", "$P0.cachedObject", null, 2],
        ["callFunc", "makeHTTPRequest", "$P0"],
        ["jumpRel", 1],
        ["callFunc", "checkExpirationTime", "$P0"],
        ["set", "$P1", "$P0.cachedObject.name"]
    ],
    "getGHEmail": [
        ["callFunc", "checkAuthentication", "$P0"],
        ["if==than", "$P0.cachedObject", null, 2],
        ["callFunc", "makeHTTPRequest", "$P0"],
        ["jumpRel", 1],
        ["callFunc", "checkExpirationTime", "$P0"],
        ["set", "$P1", "$P0.cachedObject.email"]
    ],
    "getGHGender": [
        ["set", "$P1", null]
    ],
    "getGHDescription": [
        ["callFunc", "checkAuthentication", "$P0"],
        ["if==than", "$P0.cachedObject", null, 2],
        ["callFunc", "makeHTTPRequest", "$P0"],
        ["jumpRel", 1],
        ["callFunc", "checkExpirationTime", "$P0"],
        ["set", "$P1", "$P0.cachedObject.bio"]
    ],
    "getGHDateOfBirth": [
        ["create", "$P1", "DateOfBirth"]
    ],
    "getGHLocale": [
        ["set", "$P1", null]
    ],
    "getGHPictureURL": [
        ["callFunc", "checkAuthentication", "$P0"],
        ["if==than", "$P0.cachedObject", null, 2],
        ["callFunc", "makeHTTPRequest", "$P0"],
        ["jumpRel", 1],
        ["callFunc", "checkExpirationTime", "$P0"],
        ["set", "$P1", "$P0.cachedObject.avatar_url"]
    ],
    "loginGH": [
        ["callFunc", "checkAuthentication", "$P0"]
    ],
    "logoutGH": [
        ["set", "$S0.accessToken", null],
        ["set", "$P0.cachedObject", null]
    ],
    "makeHTTPRequest": [
        ["create", "$L0", "Object"],
        ["set", "$L0.method", "GET"],
        ["set", "$L0.url", "https://api.github.com/user"],
        ["create", "$L0.requestHeaders", "Object"],
        ["string.concat", "$L0.requestHeaders.Authorization", "token ", "$S0.accessToken"],
        ["create", "$L1", "Object"],
        ["http.requestCall", "$L1", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L1"],
        ["json.parse", "$P0.cachedObject", "$L1.responseBody"],
        ["create", "$L2", "Date"],
        ["set", "$P0.readTime", "$L2.time"]
    ],
    "checkExpirationTime": [
        ["create", "$L0", "Date"],
        ["math.multiply", "$L1", "$P0.readTime", -1],
        ["math.add", "$L2", "$L0.time", "$L1"],
        ["if>than", "$L2", 60000, 1],
        ["callFunc", "makeHTTPRequest", "$P0"]
    ],
    "checkAuthentication": [
        ["if==than", "$S0.accessToken", null, 2],
        ["callFunc", "authenticate", "$P0"],
        ["return"]
    ],
    "authenticate": [
        ["create", "$L0", "String"],
        ["string.concat", "$L0", "https://github.com/login/oauth/authorize?client_id=", "$P0.clientId", "&redirect_uri=", "$P0.redirectUri"],
        ["awaitCodeRedirect", "$L1", "$L0"],
        ["string.concat", "$L2", "client_id=", "$P0.clientId", "&client_secret=", "$P0.clientSecret", "&code=", "$L1"],
        ["stream.stringToStream", "$L3", "$L2"],
        ["create", "$L4", "Object"],
        ["set", "$L4.Accept", "application/json"],
        ["set", "$L4", "application/x-www-form-urlencoded", "Content-Type"],
        ["create", "$L5", "Object"],
        ["set", "$L5.url", "https://github.com/login/oauth/access_token"],
        ["set", "$L5.method", "POST"],
        ["set", "$L5.requestBody", "$L3"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "validateResponse", "$P0", "$L6"],
        ["create", "$L7", "String"],
        ["stream.streamToString", "$L7", "$L6.responseBody"],
        ["json.parse", "$L8", "$L7"],
        ["set", "$S0.accessToken", "$L8.access_token"]
    ],
    "validateResponse": [
        ["if>=than", "$P1.code", 400, 13],
        ["json.parse", "$L0", "$P1.responseBody"],
        ["set", "$L2", "$L0.message"],
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
var GitHub = (function () {
    function GitHub(redirectReceiver, clientId, clientSecret, redirectUri, state) {
        this.interpreterStorage = {};
        this.persistentStorage = [{}];
        this.instanceDependencyStorage = {
            redirectReceiver: redirectReceiver
        };
        InitSelfTest_1.InitSelfTest.initTest("GitHub");
        this.interpreterStorage["clientId"] = clientId;
        this.interpreterStorage["clientSecret"] = clientSecret;
        this.interpreterStorage["redirectUri"] = redirectUri;
        this.interpreterStorage["state"] = state;
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        if (SERVICE_CODE["init"]) {
            ip.callFunctionSync("init", this.interpreterStorage);
        }
    }
    GitHub.prototype.getIdentifier = function (callback) {
        Statistics_1.Statistics.addCall("GitHub", "getIdentifier");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getGHIdentifier", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("GitHub", "getIdentifier");
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
    GitHub.prototype.getFullName = function (callback) {
        Statistics_1.Statistics.addCall("GitHub", "getFullName");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getGHFullName", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("GitHub", "getFullName");
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
    GitHub.prototype.getEmail = function (callback) {
        Statistics_1.Statistics.addCall("GitHub", "getEmail");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getGHEmail", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("GitHub", "getEmail");
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
    GitHub.prototype.getGender = function (callback) {
        Statistics_1.Statistics.addCall("GitHub", "getGender");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getGHGender", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("GitHub", "getGender");
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
    GitHub.prototype.getDescription = function (callback) {
        Statistics_1.Statistics.addCall("GitHub", "getDescription");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getGHDescription", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("GitHub", "getDescription");
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
    GitHub.prototype.getDateOfBirth = function (callback) {
        Statistics_1.Statistics.addCall("GitHub", "getDateOfBirth");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getGHDateOfBirth", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("GitHub", "getDateOfBirth");
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
    GitHub.prototype.getLocale = function (callback) {
        Statistics_1.Statistics.addCall("GitHub", "getLocale");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getGHLocale", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("GitHub", "getLocale");
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
    GitHub.prototype.getPictureURL = function (callback) {
        Statistics_1.Statistics.addCall("GitHub", "getPictureURL");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getGHPictureURL", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("GitHub", "getPictureURL");
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
    GitHub.prototype.login = function (callback) {
        Statistics_1.Statistics.addCall("GitHub", "login");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("loginGH", this.interpreterStorage).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("GitHub", "login");
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
    GitHub.prototype.logout = function (callback) {
        Statistics_1.Statistics.addCall("GitHub", "logout");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("logoutGH", this.interpreterStorage).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("GitHub", "logout");
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
    GitHub.prototype.saveAsString = function () {
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        return ip.saveAsString();
    };
    GitHub.prototype.loadAsString = function (savedState) {
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.loadAsString(savedState);
        this.persistentStorage = sandbox.persistentStorage;
    };
    GitHub.prototype.resumeLogin = function (executionState, callback) {
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        sandbox.loadStateFromString(executionState);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.resumeFunction("Authenticating:login", this.interpreterStorage).then(function () { return callback(undefined); }, function (err) { return callback(err); });
    };
    return GitHub;
}());
exports.GitHub = GitHub;
