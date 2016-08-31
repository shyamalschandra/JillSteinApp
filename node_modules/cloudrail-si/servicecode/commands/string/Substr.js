"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var Substr = (function () {
    function Substr() {
    }
    Substr.prototype.getIdentifier = function () {
        return "string.substr";
    };
    Substr.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert((parameters.length === 3 || parameters.length === 4) && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var sourceString = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isString(sourceString));
        var startIdx = Helper_1.Helper.resolve(environment, parameters[2]);
        Helper_1.Helper.assert(Helper_1.Helper.isNumber(startIdx));
        var length = sourceString.length - startIdx;
        if (parameters.length === 4) {
            length = Helper_1.Helper.resolve(environment, parameters[3]);
            Helper_1.Helper.assert(Helper_1.Helper.isNumber(length));
            Helper_1.Helper.assert(length + startIdx <= sourceString.length);
        }
        var res = sourceString.substring(startIdx, startIdx + length);
        environment.setVariable(resultVar, res);
    };
    return Substr;
}());
exports.Substr = Substr;
