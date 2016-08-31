"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var StringTransform = (function () {
    function StringTransform(identifier, transform) {
        this.identifier = identifier;
        this.transform = transform;
    }
    StringTransform.prototype.getIdentifier = function () {
        return this.identifier;
    };
    StringTransform.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length === 2 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var sourceString = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isString(sourceString));
        var res = this.transform(sourceString);
        environment.setVariable(resultVar, res);
    };
    return StringTransform;
}());
exports.StringTransform = StringTransform;
