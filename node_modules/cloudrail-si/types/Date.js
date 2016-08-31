"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SandboxObject_1 = require("./SandboxObject");
var InternalError_1 = require("../errors/InternalError");
var CustomDate = (function (_super) {
    __extends(CustomDate, _super);
    function CustomDate(date) {
        _super.call(this);
        if (date != null)
            this.date = new Date(Date.parse(date));
        else
            this.date = new Date();
    }
    CustomDate.prototype.getDate = function () {
        return this.date;
    };
    Object.defineProperty(CustomDate.prototype, "time", {
        get: function () {
            return this.date.getTime();
        },
        set: function (value) {
            this.date.setTime(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomDate.prototype, "rfcTime", {
        get: function () {
            return this.date.toISOString().slice(0, 19) + "Z";
        },
        enumerable: true,
        configurable: true
    });
    CustomDate.prototype.toJSONString = function () {
        return "" + this.date.getTime();
    };
    CustomDate.prototype.fromJSONString = function (jsonString) {
        var cd = new CustomDate();
        cd.time = parseInt(jsonString);
        return cd;
    };
    CustomDate.prototype.compareTo = function (obj) {
        if (!(obj instanceof CustomDate)) {
            throw new InternalError_1.InternalError("Comparing a Date with a non-Date");
        }
        if (this.getDate() < obj.getDate())
            return -1;
        else if (obj.getDate() < this.getDate())
            return 1;
        else if (this.getDate() === obj.getDate())
            return 0;
        else
            throw new InternalError_1.InternalError("Comparing a Date with a non-Date");
    };
    return CustomDate;
}(SandboxObject_1.SandboxObject));
exports.CustomDate = CustomDate;
