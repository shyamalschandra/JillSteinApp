"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var MathCombine = (function () {
    function MathCombine(identifier, combineFunction) {
        this.identifier = identifier;
        this.combineFunction = combineFunction;
    }
    MathCombine.prototype.getIdentifier = function () {
        return this.identifier;
    };
    MathCombine.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length >= 2 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var elements = [];
        for (var i = 1; i < parameters.length; i++) {
            var resolved = Helper_1.Helper.resolve(environment, parameters[i]);
            if (Helper_1.Helper.isString(resolved))
                resolved = parseFloat(resolved);
            Helper_1.Helper.assert(Helper_1.Helper.isNumber(resolved));
            elements.push(resolved);
        }
        var res = this.combineFunction(elements);
        environment.setVariable(resultVar, res);
    };
    return MathCombine;
}());
exports.MathCombine = MathCombine;
