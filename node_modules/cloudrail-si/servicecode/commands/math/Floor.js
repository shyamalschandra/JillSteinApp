"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var Floor = (function () {
    function Floor() {
    }
    Floor.prototype.getIdentifier = function () {
        return "math.floor";
    };
    Floor.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length == 2 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var input = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isNumber(input));
        var res = Math.floor(input);
        environment.setVariable(resultVar, res);
    };
    return Floor;
}());
exports.Floor = Floor;
