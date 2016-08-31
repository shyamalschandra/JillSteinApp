"use strict";
var Sandbox_1 = require("../Sandbox");
var VarAddress_1 = require("../VarAddress");
var Helper_1 = require("../../helpers/Helper");
var Get = (function () {
    function Get() {
    }
    Get.prototype.getIdentifier = function () {
        return "get";
    };
    Get.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length >= 2 && parameters[0] instanceof VarAddress_1.VarAddress && parameters[1] instanceof VarAddress_1.VarAddress);
        var targetId = parameters[0];
        var containerIdParts = Sandbox_1.Sandbox.decodeVariableAddress(parameters[1]);
        for (var i = 2; i < parameters.length; i++) {
            containerIdParts.push(Helper_1.Helper.resolve(environment, parameters[i]));
        }
        environment.setVariable(targetId, environment.getVariable(containerIdParts));
    };
    return Get;
}());
exports.Get = Get;
