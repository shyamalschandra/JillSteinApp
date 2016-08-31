"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var GetKeyArray = (function () {
    function GetKeyArray() {
    }
    GetKeyArray.prototype.getIdentifier = function () {
        return "object.getKeyArray";
    };
    GetKeyArray.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length === 2 && parameters[0] instanceof VarAddress_1.VarAddress && parameters[1] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var container = Helper_1.Helper.resolve(environment, parameters[1]);
        var keys = Object.keys(container);
        environment.setVariable(resultVar, keys);
    };
    return GetKeyArray;
}());
exports.GetKeyArray = GetKeyArray;
