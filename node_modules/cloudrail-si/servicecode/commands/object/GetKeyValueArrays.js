"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var GetKeyValueArrays = (function () {
    function GetKeyValueArrays() {
    }
    GetKeyValueArrays.prototype.getIdentifier = function () {
        return "object.getKeyValueArrays";
    };
    GetKeyValueArrays.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length === 3 && parameters[0] instanceof VarAddress_1.VarAddress && parameters[1] instanceof VarAddress_1.VarAddress && parameters[2] instanceof VarAddress_1.VarAddress);
        var resultKeysVar = parameters[0];
        var resultValuesVar = parameters[1];
        var container = Helper_1.Helper.resolve(environment, parameters[2]);
        var keys = Object.keys(container);
        var values = [];
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            values.push(container[key]);
        }
        environment.setVariable(resultKeysVar, keys);
        environment.setVariable(resultValuesVar, values);
    };
    return GetKeyValueArrays;
}());
exports.GetKeyValueArrays = GetKeyValueArrays;
