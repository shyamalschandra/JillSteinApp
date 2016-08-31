"use strict";
var Helper_1 = require("../helpers/Helper");
var SandboxObject = (function () {
    function SandboxObject() {
    }
    SandboxObject.prototype.get = function (key) {
        var entry = this[Helper_1.Helper.lowerCaseFirstLetter(key)];
        if (Helper_1.Helper.isBoolean(entry)) {
            entry = entry ? 1 : 0;
        }
        return entry;
    };
    SandboxObject.prototype.set = function (key, value) {
        this[Helper_1.Helper.lowerCaseFirstLetter(key)] = value;
    };
    return SandboxObject;
}());
exports.SandboxObject = SandboxObject;
