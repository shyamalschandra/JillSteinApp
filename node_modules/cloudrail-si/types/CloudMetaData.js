"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SandboxObject_1 = require("./SandboxObject");
var CloudMetaData = (function (_super) {
    __extends(CloudMetaData, _super);
    function CloudMetaData() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(CloudMetaData.prototype, "folder", {
        get: function () {
            return this._folder;
        },
        set: function (value) {
            this._folder = !!value;
        },
        enumerable: true,
        configurable: true
    });
    CloudMetaData.prototype.toString = function () {
        var s = "";
        s += "name -> '" + this.name + "'\n";
        s += "path -> '" + this.path + "'\n";
        s += "size -> '" + this.size + "'\n";
        s += "folder -> '" + this.folder + "'\n";
        s += "modifiedAt -> '" + this.modifiedAt + "'";
        return s;
    };
    return CloudMetaData;
}(SandboxObject_1.SandboxObject));
exports.CloudMetaData = CloudMetaData;
