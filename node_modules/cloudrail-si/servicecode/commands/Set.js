"use strict";
var Sandbox_1 = require("../Sandbox");
var VarAddress_1 = require("../VarAddress");
var Helper_1 = require("../../helpers/Helper");
var Set = (function () {
    function Set() {
    }
    Set.prototype.getIdentifier = function () {
        return "set";
    };
    Set.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length >= 2 && parameters[0] instanceof VarAddress_1.VarAddress);
        var targetVar = parameters[0];
        var value = Helper_1.Helper.resolve(environment, parameters[1]);
        var targetVarParts = Sandbox_1.Sandbox.decodeVariableAddress(targetVar);
        for (var i = 2; i < parameters.length; i++) {
            targetVarParts.push(Helper_1.Helper.resolve(environment, parameters[i]));
        }
        environment.setVariable(targetVarParts, value);
    };
    return Set;
}());
exports.Set = Set;
