"use strict";
var Interpreter_1 = require("../servicecode/Interpreter");
var Sandbox_1 = require("../servicecode/Sandbox");
var ErrorType_1 = require("../types/ErrorType");
var DetailErrors_1 = require("../errors/DetailErrors");
var InitSelfTest_1 = require("../servicecode/InitSelfTest");
var Statistics_1 = require("../statistics/Statistics");
var SERVICE_CODE = {
    "Authenticating:login": [
        ["callFunc", "checkAuthentication", "$P0"]
    ],
    "Authenticating:logout": [
        ["set", "$S0.accessToken", null],
        ["set", "$P0.userInfo", null]
    ],
    "Profile:getIdentifier": [
        ["callFunc", "checkUserInfo", "$P0"],
        ["string.concat", "$P1", "slack-", "$P0.userInfo.team.id", "-", "$P0.userInfo.user.id"]
    ],
    "Profile:getFullName": [
        ["callFunc", "checkUserInfo", "$P0"],
        ["if!=than", "$P0.userInfo.user.name", null, 1],
        ["set", "$P1", "$P0.userInfo.user.name"]
    ],
    "Profile:getEmail": [
        ["callFunc", "checkUserInfo", "$P0"],
        ["if!=than", "$P0.userInfo.user.email", null, 1],
        ["set", "$P1", "$P0.userInfo.user.email"]
    ],
    "Profile:getGender": [],
    "Profile:getDescription": [],
    "Profile:getDateOfBirth": [
        ["create", "$P1", "DateOfBirth"]
    ],
    "Profile:getLocale": [],
    "Profile:getPictureURL": [
        ["callFunc", "checkUserInfo", "$P0"],
        ["if!=than", "$P0.userInfo.user.image_192", null, 1],
        ["set", "$P1", "$P0.userInfo.user.image_192"]
    ],
    "checkUserInfo": [
        ["create", "$L0", "Date"],
        ["if!=than", "$P0.userInfo", null, 2],
        ["if>than", "$P0.expirationTime", "$L0", 1],
        ["return"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L2", "Object"],
        ["string.concat", "$L2.url", "https://slack.com/api/users.identity?token=", "$S0.accessToken"],
        ["set", "$L2.method", "GET"],
        ["http.requestCall", "$L3", "$L2"],
        ["callFunc", "validateResponse", "$P0", "$P0.userInfo", "$L3"],
        ["create", "$P0.expirationTime", "Date"],
        ["math.add", "$P0.expirationTime.time", "$P0.expirationTime.time", 60000]
    ],
    "checkAuthentication": [
        ["if!=than", null, "$S0.accessToken", 1],
        ["return"],
        ["string.concat", "$L0", "https://slack.com/oauth/authorize?redirect_uri=", "$P0.redirectUri", "&client_id=", "$P0.clientId", "&state=", "$P0.state", "&scope=", "identity.basic,identity.team,identity.avatar,identity.email"],
        ["awaitCodeRedirect", "$L1", "$L0"],
        ["create", "$L2", "Object"],
        ["set", "$L2.method", "GET"],
        ["string.concat", "$L3", "code=", "$L1", "&redirect_uri=", "$P0.redirectUri", "&client_id=", "$P0.clientId", "&client_secret=", "$P0.clientSecret"],
        ["string.concat", "$L2.url", "https://slack.com/api/oauth.access?", "$L3"],
        ["http.requestCall", "$L5", "$L2"],
        ["callFunc", "validateResponse", "$P0", "$L6", "$L5"],
        ["set", "$S0.accessToken", "$L6.access_token"]
    ],
    "validateResponse": [
        ["set", "$L1", "$P2"],
        ["if>=than", "$L1.code", 400, 10],
        ["if==than", "$L1.code", 401, 2],
        ["create", "$L3", "Error", "Invalid credentials or access rights. Make sure that your application has read and write permission.", "Authentication"],
        ["throwError", "$L3"],
        ["if==than", "$L1.code", 503, 2],
        ["create", "$L3", "Error", "Service unavailable. Try again later.", "ServiceUnavailable"],
        ["throwError", "$L3"],
        ["json.parse", "$L0", "$L1.responseBody"],
        ["string.concat", "$L2", "$P1.code", " - ", "$L0.error"],
        ["create", "$L3", "Error", "$L2", "Http"],
        ["throwError", "$L3"],
        ["json.parse", "$L0", "$L1.responseBody"],
        ["if==than", "$L0.ok", 0, 2],
        ["create", "$L3", "Error", "$L0.error", "Http"],
        ["throwError", "$L3"],
        ["set", "$P1", "$L0"]
    ]
};
var Slack = (function () {
    function Slack(redirectReceiver, clientId, clientSecret, redirectUri, state) {
        this.interpreterStorage = {};
        this.persistentStorage = [{}];
        this.instanceDependencyStorage = {
            redirectReceiver: redirectReceiver
        };
        InitSelfTest_1.InitSelfTest.initTest("Slack");
        this.interpreterStorage["clientId"] = clientId;
        this.interpreterStorage["clientSecret"] = clientSecret;
        this.interpreterStorage["redirectUri"] = redirectUri;
        this.interpreterStorage["state"] = state;
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        if (SERVICE_CODE["init"]) {
            ip.callFunctionSync("init", this.interpreterStorage);
        }
    }
    Slack.prototype.getIdentifier = function (callback) {
        Statistics_1.Statistics.addCall("Slack", "getIdentifier");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getIdentifier", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Slack", "getIdentifier");
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
    Slack.prototype.getFullName = function (callback) {
        Statistics_1.Statistics.addCall("Slack", "getFullName");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getFullName", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Slack", "getFullName");
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
    Slack.prototype.getEmail = function (callback) {
        Statistics_1.Statistics.addCall("Slack", "getEmail");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getEmail", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Slack", "getEmail");
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
    Slack.prototype.getGender = function (callback) {
        Statistics_1.Statistics.addCall("Slack", "getGender");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getGender", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Slack", "getGender");
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
    Slack.prototype.getDescription = function (callback) {
        Statistics_1.Statistics.addCall("Slack", "getDescription");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getDescription", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Slack", "getDescription");
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
    Slack.prototype.getDateOfBirth = function (callback) {
        Statistics_1.Statistics.addCall("Slack", "getDateOfBirth");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getDateOfBirth", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Slack", "getDateOfBirth");
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
    Slack.prototype.getLocale = function (callback) {
        Statistics_1.Statistics.addCall("Slack", "getLocale");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getLocale", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Slack", "getLocale");
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
    Slack.prototype.getPictureURL = function (callback) {
        Statistics_1.Statistics.addCall("Slack", "getPictureURL");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Profile:getPictureURL", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Slack", "getPictureURL");
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
    Slack.prototype.login = function (callback) {
        Statistics_1.Statistics.addCall("Slack", "login");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Authenticating:login", this.interpreterStorage).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Slack", "login");
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
    Slack.prototype.logout = function (callback) {
        Statistics_1.Statistics.addCall("Slack", "logout");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Authenticating:logout", this.interpreterStorage).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Slack", "logout");
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
    Slack.prototype.saveAsString = function () {
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        return ip.saveAsString();
    };
    Slack.prototype.loadAsString = function (savedState) {
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.loadAsString(savedState);
        this.persistentStorage = sandbox.persistentStorage;
    };
    Slack.prototype.resumeLogin = function (executionState, callback) {
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        sandbox.loadStateFromString(executionState);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.resumeFunction("Authenticating:login", this.interpreterStorage).then(function () { return callback(undefined); }, function (err) { return callback(err); });
    };
    return Slack;
}());
exports.Slack = Slack;
