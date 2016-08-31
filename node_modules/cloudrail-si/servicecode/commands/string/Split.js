"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var Split = (function () {
    function Split() {
    }
    Split.prototype.getIdentifier = function () {
        return "string.split";
    };
    Split.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert((parameters.length === 3 || parameters.length === 4) && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var sourceString = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isString(sourceString));
        var separator = Helper_1.Helper.resolve(environment, parameters[2]);
        Helper_1.Helper.assert(Helper_1.Helper.isString(separator));
        var limit;
        if (parameters.length === 4) {
            limit = Helper_1.Helper.resolve(environment, parameters[3]);
            Helper_1.Helper.assert(Helper_1.Helper.isNumber(limit));
        }
        var res = sourceString.split(new RegExp(separator), limit);
        environment.setVariable(resultVar, res);
    };
    return Split;
}());
exports.Split = Split;
