"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UserError = (function (_super) {
    __extends(UserError, _super);
    function UserError(message) {
        _super.call(this, "An error occured that you should be able to fix. The error message is:\n" + message);
        this.message = message;
    }
    return UserError;
}(Error));
exports.UserError = UserError;
