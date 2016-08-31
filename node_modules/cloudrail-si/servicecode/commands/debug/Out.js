"use strict";
var Helper_1 = require("../../../helpers/Helper");
var Out = (function () {
    function Out() {
    }
    Out.prototype.getIdentifier = function () {
        return "debug.out";
    };
    Out.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length >= 1);
        var str = "";
        for (var _i = 0, parameters_1 = parameters; _i < parameters_1.length; _i++) {
            var parameter = parameters_1[_i];
            var part = Helper_1.Helper.resolve(environment, parameter);
            if (Helper_1.Helper.isArray(part) || Helper_1.Helper.isObject(part))
                part = JSON.stringify(part);
            str += part.toString();
        }
        console.log(str);
    };
    return Out;
}());
exports.Out = Out;
