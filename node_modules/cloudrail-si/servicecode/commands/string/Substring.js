"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var Substring = (function () {
    function Substring() {
    }
    Substring.prototype.getIdentifier = function () {
        return "string.substring";
    };
    Substring.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert((parameters.length === 3 || parameters.length === 4) && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var sourceString = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isString(sourceString));
        var startIdx = Helper_1.Helper.resolve(environment, parameters[2]);
        Helper_1.Helper.assert(Helper_1.Helper.isNumber(startIdx));
        var endIdx = sourceString.length;
        if (parameters.length === 4) {
            endIdx = Helper_1.Helper.resolve(environment, parameters[3]);
            Helper_1.Helper.assert(Helper_1.Helper.isNumber(endIdx));
            Helper_1.Helper.assert(endIdx <= sourceString.length);
        }
        var res = sourceString.substring(startIdx, endIdx);
        environment.setVariable(resultVar, res);
    };
    return Substring;
}());
exports.Substring = Substring;
