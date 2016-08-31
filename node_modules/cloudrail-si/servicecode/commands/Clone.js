"use strict";
var VarAddress_1 = require("../VarAddress");
var Helper_1 = require("../../helpers/Helper");
var InternalError_1 = require("../../errors/InternalError");
var Clone = (function () {
    function Clone() {
    }
    Clone.prototype.getIdentifier = function () {
        return "clone";
    };
    Clone.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length == 2 && parameters[0] instanceof VarAddress_1.VarAddress);
        var targetId = parameters[0];
        var sourceObj = Helper_1.Helper.resolve(environment, parameters[1]);
        throw new InternalError_1.InternalError("Clone not implemented");
    };
    return Clone;
}());
exports.Clone = Clone;
