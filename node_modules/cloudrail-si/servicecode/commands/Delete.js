"use strict";
var Sandbox_1 = require("../Sandbox");
var VarAddress_1 = require("../VarAddress");
var Helper_1 = require("../../helpers/Helper");
var Delete = (function () {
    function Delete() {
    }
    Delete.prototype.getIdentifier = function () {
        return "delete";
    };
    Delete.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length >= 1 && parameters[0] instanceof VarAddress_1.VarAddress);
        var targetId = parameters[0];
        var targetIdParts = Sandbox_1.Sandbox.decodeVariableAddress(targetId);
        for (var i = 1; i < parameters.length; i++) {
            targetIdParts.push(Helper_1.Helper.resolve(environment, parameters[i]));
        }
        environment.deleteVariable(targetIdParts);
    };
    return Delete;
}());
exports.Delete = Delete;
