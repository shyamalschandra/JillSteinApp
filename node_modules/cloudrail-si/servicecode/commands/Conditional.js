"use strict";
var Helper_1 = require("../../helpers/Helper");
var Conditional = (function () {
    function Conditional(identifier, compareFunction, typeCheck) {
        this.identifier = identifier;
        this.compareFunction = compareFunction;
        this.typeCheck = typeCheck;
    }
    Conditional.prototype.getIdentifier = function () {
        return this.identifier;
    };
    Conditional.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length == 3);
        var aObj = parameters[0];
        var bObj = parameters[1];
        var relativeEndPos = Helper_1.Helper.resolve(environment, parameters[2]);
        Helper_1.Helper.assert(Helper_1.Helper.isNumber(relativeEndPos));
        var compare = environment.compareVariables(aObj, bObj, this.identifier, this.typeCheck);
        if (!this.compareFunction(compare))
            environment.incrementCurrentServiceCodeLine(relativeEndPos);
    };
    return Conditional;
}());
exports.Conditional = Conditional;
