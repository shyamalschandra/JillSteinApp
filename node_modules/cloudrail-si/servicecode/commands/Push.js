"use strict";
var Sandbox_1 = require("../Sandbox");
var VarAddress_1 = require("../VarAddress");
var Helper_1 = require("../../helpers/Helper");
var InternalError_1 = require("../../errors/InternalError");
var Push = (function () {
    function Push() {
    }
    Push.prototype.getIdentifier = function () {
        return "push";
    };
    Push.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length >= 2 && parameters[0] instanceof VarAddress_1.VarAddress);
        var targetVar = parameters[0];
        var value = Helper_1.Helper.resolve(environment, parameters[1]);
        var targetVarParts = Sandbox_1.Sandbox.decodeVariableAddress(targetVar);
        for (var i = 2; i < parameters.length; i++) {
            targetVarParts.push(Helper_1.Helper.resolve(environment, parameters[i]));
        }
        var container = environment.getVariable(targetVarParts);
        if (Helper_1.Helper.isArray(container)) {
            container.push(value);
        }
        else if (Helper_1.Helper.isObject(container)) {
            container[container.length] = value;
        }
        else if (Helper_1.Helper.isString(container)) {
            environment.setVariable(targetVarParts, container.concat(value.toString()));
        }
        else
            throw new InternalError_1.InternalError("Push only works for lists, objects and strings");
    };
    return Push;
}());
exports.Push = Push;
