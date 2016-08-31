"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var IndexOf = (function () {
    function IndexOf() {
    }
    IndexOf.prototype.getIdentifier = function () {
        return "string.indexOf";
    };
    IndexOf.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert((parameters.length === 3 || parameters.length === 4) && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var sourceString = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isString(sourceString));
        var find = Helper_1.Helper.resolve(environment, parameters[2]);
        var fromIndex = 0;
        if (parameters.length === 4) {
            fromIndex = Helper_1.Helper.resolve(environment, parameters[3]);
            Helper_1.Helper.assert(Helper_1.Helper.isNumber(fromIndex));
            Helper_1.Helper.assert(fromIndex <= sourceString.length);
        }
        var res = sourceString.indexOf(find, fromIndex);
        environment.setVariable(resultVar, res);
    };
    return IndexOf;
}());
exports.IndexOf = IndexOf;
