"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var Stringify = (function () {
    function Stringify() {
    }
    Stringify.prototype.getIdentifier = function () {
        return "json.stringify";
    };
    Stringify.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length == 2 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var input = Helper_1.Helper.resolve(environment, parameters[1]);
        var str = JSON.stringify(input);
        environment.setVariable(resultVar, str);
    };
    return Stringify;
}());
exports.Stringify = Stringify;
