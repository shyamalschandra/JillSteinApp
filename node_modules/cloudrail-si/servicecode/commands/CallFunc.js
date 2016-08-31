"use strict";
var Helper_1 = require("../../helpers/Helper");
var VarAddress_1 = require("../VarAddress");
var CallFunc = (function () {
    function CallFunc() {
    }
    CallFunc.prototype.getIdentifier = function () {
        return "callFunc";
    };
    CallFunc.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length >= 1 && (Helper_1.Helper.isString(parameters[0]) || parameters[0] instanceof VarAddress_1.VarAddress));
        var functionName = Helper_1.Helper.resolve(environment, parameters[0]);
        if (!Helper_1.Helper.isString(functionName)) {
            functionName = functionName.toString();
        }
        var functionParameters = [];
        for (var i = 1; i < parameters.length; i++) {
            functionParameters.push(Helper_1.Helper.resolve(environment, parameters[i], false));
        }
        environment.callFunction(functionName, functionParameters);
    };
    return CallFunc;
}());
exports.CallFunc = CallFunc;
