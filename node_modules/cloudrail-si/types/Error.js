"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SandboxObject_1 = require("./SandboxObject");
var ErrorType_1 = require("./ErrorType");
var Error = (function (_super) {
    __extends(Error, _super);
    function Error(message, type) {
        if (message === void 0) { message = ""; }
        _super.call(this);
        this.message = message;
        this.type = type;
    }
    Error.prototype.getMessage = function () {
        return this.message;
    };
    Error.prototype.setMessage = function (message) {
        this.message = message;
    };
    Error.prototype.getType = function () {
        return this.type;
    };
    Error.prototype.setType = function (type) {
        this.type = type;
    };
    Error.prototype.toString = function () {
        return this.message;
    };
    Error.prototype.getErrorType = function () {
        return ErrorType_1.ErrorType.getValueOf(this.type);
    };
    return Error;
}(SandboxObject_1.SandboxObject));
exports.Error = Error;
