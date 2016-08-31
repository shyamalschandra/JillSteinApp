"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var Concat = (function () {
    function Concat() {
    }
    Concat.prototype.getIdentifier = function () {
        return "string.concat";
    };
    Concat.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length >= 2 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var str = "";
        for (var i = 1; i < parameters.length; i++) {
            var strPart = Helper_1.Helper.resolve(environment, parameters[i]);
            str += strPart.toString();
        }
        environment.setVariable(resultVar, str);
    };
    return Concat;
}());
exports.Concat = Concat;
