"use strict";
var Sandbox_1 = require("../Sandbox");
var VarAddress_1 = require("../VarAddress");
var Helper_1 = require("../../helpers/Helper");
var InternalError_1 = require("../../errors/InternalError");
var Pull = (function () {
    function Pull() {
    }
    Pull.prototype.getIdentifier = function () {
        return "pull";
    };
    Pull.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length >= 2 && parameters[0] instanceof VarAddress_1.VarAddress && parameters[1] instanceof VarAddress_1.VarAddress);
        var targetVar = parameters[0];
        var containerVar = parameters[1];
        var containerVarParts = Sandbox_1.Sandbox.decodeVariableAddress(containerVar);
        for (var i = 2; i < parameters.length; i++) {
            containerVarParts.push(Helper_1.Helper.resolve(environment, parameters[i]));
        }
        var container = environment.getVariable(containerVarParts);
        var entry;
        if (Helper_1.Helper.isArray(container)) {
            entry = container.pop();
        }
        else if (Helper_1.Helper.isString(container)) {
            entry = container[container.length - 1];
            environment.setVariable(containerVarParts, container.slice(0, container.length - 1));
        }
        else
            throw new InternalError_1.InternalError("Pull only works for lists and strings");
        environment.setVariable(targetVar, entry);
    };
    return Pull;
}());
exports.Pull = Pull;
