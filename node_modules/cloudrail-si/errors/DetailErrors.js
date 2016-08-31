"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AuthenticationError = (function (_super) {
    __extends(AuthenticationError, _super);
    function AuthenticationError(message) {
        _super.call(this, message);
        this.message = message;
    }
    return AuthenticationError;
}(Error));
exports.AuthenticationError = AuthenticationError;
var HttpError = (function (_super) {
    __extends(HttpError, _super);
    function HttpError(message) {
        _super.call(this, message);
        this.message = message;
    }
    return HttpError;
}(Error));
exports.HttpError = HttpError;
var NotFoundError = (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        _super.call(this, message);
        this.message = message;
    }
    return NotFoundError;
}(Error));
exports.NotFoundError = NotFoundError;
var ServiceUnavailableError = (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError(message) {
        _super.call(this, message);
        this.message = message;
    }
    return ServiceUnavailableError;
}(Error));
exports.ServiceUnavailableError = ServiceUnavailableError;
var IllegalArgumentError = (function (_super) {
    __extends(IllegalArgumentError, _super);
    function IllegalArgumentError(message) {
        _super.call(this, message);
        this.message = message;
    }
    return IllegalArgumentError;
}(Error));
exports.IllegalArgumentError = IllegalArgumentError;
