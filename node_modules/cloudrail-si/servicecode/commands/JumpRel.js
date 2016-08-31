"use strict";
var Helper_1 = require("../../helpers/Helper");
var JumpRel = (function () {
    function JumpRel() {
    }
    JumpRel.prototype.getIdentifier = function () {
        return "jumpRel";
    };
    JumpRel.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length === 1);
        var relativeEndPos = Helper_1.Helper.resolve(environment, parameters[0]);
        Helper_1.Helper.assert(Helper_1.Helper.isNumber(relativeEndPos));
        environment.incrementCurrentServiceCodeLine(relativeEndPos);
    };
    return JumpRel;
}());
exports.JumpRel = JumpRel;
