"use strict";
var VarAddress_1 = require("../VarAddress");
var Helper_1 = require("../../helpers/Helper");
var Size = (function () {
    function Size() {
    }
    Size.prototype.getIdentifier = function () {
        return "size";
    };
    Size.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length === 2 && parameters[0] instanceof VarAddress_1.VarAddress && parameters[1] instanceof VarAddress_1.VarAddress);
        var targetVar = parameters[0];
        var container = environment.getVariable(parameters[1]);
        var size = -1;
        if (Helper_1.Helper.isArray(container) || Helper_1.Helper.isString(container))
            size = container.length;
        else if (Helper_1.Helper.isObject(container))
            size = Object.keys(container).length;
        environment.setVariable(targetVar, size);
    };
    return Size;
}());
exports.Size = Size;
