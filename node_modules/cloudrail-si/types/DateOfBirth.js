"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SandboxObject_1 = require("./SandboxObject");
var DateOfBirth = (function (_super) {
    __extends(DateOfBirth, _super);
    function DateOfBirth(day, month, year) {
        _super.call(this);
        this.day = day;
        this.month = month;
        this.year = year;
    }
    return DateOfBirth;
}(SandboxObject_1.SandboxObject));
exports.DateOfBirth = DateOfBirth;
