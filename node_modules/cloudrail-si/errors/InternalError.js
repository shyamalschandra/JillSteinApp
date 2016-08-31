"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var InternalError = (function (_super) {
    __extends(InternalError, _super);
    function InternalError(message) {
        _super.call(this, "An internal error has occured which you probably cannot fix. " + "We'd very much appreciate it if you would report it to the CloudRail team. The error message is:\n" + message);
        this.message = message;
    }
    return InternalError;
}(Error));
exports.InternalError = InternalError;
