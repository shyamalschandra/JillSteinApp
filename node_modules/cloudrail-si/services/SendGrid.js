"use strict";
var Interpreter_1 = require("../servicecode/Interpreter");
var Sandbox_1 = require("../servicecode/Sandbox");
var ErrorType_1 = require("../types/ErrorType");
var DetailErrors_1 = require("../errors/DetailErrors");
var InitSelfTest_1 = require("../servicecode/InitSelfTest");
var Statistics_1 = require("../statistics/Statistics");
var SERVICE_CODE = {
    "sendEmail": [
        ["callFunc", "checkMandatory", "$P0", "$P1", "fromAddress"],
        ["callFunc", "checkMandatory", "$P0", "$P2", "fromName"],
        ["callFunc", "checkMandatory", "$P0", "$P3", "toAddresses"],
        ["callFunc", "checkMandatory", "$P0", "$P4", "subject"],
        ["callFunc", "checkEmptyList", "$P0", "$P3", "toAddresses"],
        ["callFunc", "checkEmpty", "$P0", "$P1", "fromAddress"],
        ["callFunc", "checkEmpty", "$P0", "$P2", "fromName"],
        ["callFunc", "checkEmpty", "$P0", "$P4", "subject"],
        ["set", "$L2", 1],
        ["set", "$L3", 1],
        ["if==than", "$P5", null, 1],
        ["set", "$L2", 0],
        ["if==than", "$P5", "", 1],
        ["set", "$L2", 0],
        ["if==than", "$P6", null, 1],
        ["set", "$L3", 0],
        ["if==than", "$P6", "", 1],
        ["set", "$L3", 0],
        ["if==than", "$L2", 0, 3],
        ["if==than", "$L3", 0, 2],
        ["create", "$L4", "Error", "Either a textBody or a htmlBody must be provided!", "IllegalArgument"],
        ["throwError", "$L4"],
        ["create", "$L0", "Object"],
        ["set", "$L0.method", "POST"],
        ["set", "$L0.url", "https://api.sendgrid.com/v3/mail/send"],
        ["create", "$L0.requestHeaders", "Object"],
        ["set", "$L0.requestHeaders.Content-Type", "application/json"],
        ["string.concat", "$L0.requestHeaders.Authorization", "Bearer ", "$P0.apiKey"],
        ["create", "$L1", "Object"],
        ["create", "$L1.from", "Object"],
        ["set", "$L1.from.email", "$P1"],
        ["set", "$L1.from.name", "$P2"],
        ["set", "$L1.subject", "$P4"],
        ["create", "$L1.content", "Array"],
        ["if==than", "$L2", 1, 4],
        ["create", "$L5", "Object"],
        ["set", "$L5.type", "text/plain"],
        ["set", "$L5.value", "$P5"],
        ["push", "$L1.content", "$L5"],
        ["if==than", "$L3", 1, 4],
        ["create", "$L6", "Object"],
        ["set", "$L6.type", "text/html"],
        ["set", "$L6.value", "$P6"],
        ["push", "$L1.content", "$L6"],
        ["create", "$L1.personalizations", "Array"],
        ["create", "$L7", "Object"],
        ["callFunc", "pushAddresses", "$P0", "$L7.to", "$P3"],
        ["callFunc", "pushAddresses", "$P0", "$L7.cc", "$P7"],
        ["callFunc", "pushAddresses", "$P0", "$L7.bcc", "$P8"],
        ["push", "$L1.personalizations", "$L7"],
        ["json.stringify", "$L1", "$L1"],
        ["stream.stringToStream", "$L0.requestBody", "$L1"],
        ["http.requestCall", "$L0", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L0"]
    ],
    "pushAddresses": [
        ["if==than", "$P2", null, 1],
        ["return"],
        ["size", "$L0", "$P2"],
        ["if==than", "$L0", 0, 1],
        ["return"],
        ["create", "$P1", "Array"],
        ["set", "$L1", 0],
        ["get", "$L2", "$P2", "$L1"],
        ["create", "$L3", "Object"],
        ["set", "$L3.email", "$L2"],
        ["push", "$P1", "$L3"],
        ["math.add", "$L1", 1],
        ["if<than", "$L1", "$L0", 1],
        ["jumpRel", -7]
    ],
    "checkMandatory": [
        ["if==than", "$P1", null, 3],
        ["string.concat", "$L1", "Field ", "$P2", " is mandatory"],
        ["create", "$L0", "Error", "$L1", "IllegalArgument"],
        ["throwError", "$L0"]
    ],
    "checkEmptyList": [
        ["size", "$L0", "$P1"],
        ["if==than", "$L0", 0, 3],
        ["string.concat", "$L2", "The list ", "$P2", " cannot be empty"],
        ["create", "$L1", "Error", "$L2", "IllegalArgument"],
        ["throwError", "$L1"]
    ],
    "checkEmpty": [
        ["if==than", "$P1", "", 3],
        ["string.concat", "$L0", "Field ", "$P2", " is mandatory"],
        ["create", "$L1", "Error", "$L0", "IllegalArgument"],
        ["throwError", "$L1"]
    ],
    "validateResponse": [
        ["if>=than", "$P1.code", 400, 10],
        ["if==than", "$P1.code", 401, 2],
        ["create", "$L3", "Error", "Invalid credentials or access rights. Make sure that your application has read and write permission.", "Authentication"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 503, 2],
        ["create", "$L3", "Error", "Service unavailable. Try again later.", "ServiceUnavailable"],
        ["throwError", "$L3"],
        ["json.parse", "$L0", "$P1.responseBody"],
        ["json.stringify", "$L0", "$L0.errors"],
        ["create", "$L3", "Error", "$L0", "Http"],
        ["throwError", "$L3"]
    ]
};
var SendGrid = (function () {
    function SendGrid(redirectReceiver, apiKey) {
        this.interpreterStorage = {};
        this.persistentStorage = [{}];
        this.instanceDependencyStorage = {
            redirectReceiver: redirectReceiver
        };
        InitSelfTest_1.InitSelfTest.initTest("SendGrid");
        this.interpreterStorage["apiKey"] = apiKey;
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        if (SERVICE_CODE["init"]) {
            ip.callFunctionSync("init", this.interpreterStorage);
        }
    }
    SendGrid.prototype.sendEmail = function (fromAddress, fromName, toAddresses, subject, textBody, htmlBody, ccAddresses, bccAddresses, callback) {
        Statistics_1.Statistics.addCall("SendGrid", "sendEmail");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("sendEmail", this.interpreterStorage, fromAddress, fromName, toAddresses, subject, textBody, htmlBody, ccAddresses, bccAddresses).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("SendGrid", "sendEmail");
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
    SendGrid.prototype.saveAsString = function () {
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        return ip.saveAsString();
    };
    SendGrid.prototype.loadAsString = function (savedState) {
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.loadAsString(savedState);
        this.persistentStorage = sandbox.persistentStorage;
    };
    SendGrid.prototype.resumeLogin = function (executionState, callback) {
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        sandbox.loadStateFromString(executionState);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.resumeFunction("Authenticating:login", this.interpreterStorage).then(function () { return callback(undefined); }, function (err) { return callback(err); });
    };
    return SendGrid;
}());
exports.SendGrid = SendGrid;
