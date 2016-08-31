"use strict";
var Helper_1 = require("../../helpers/Helper");
var Return = (function () {
    function Return() {
    }
    Return.prototype.getIdentifier = function () {
        return "return";
    };
    Return.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length == 0);
        environment.codeLineStack[environment.codeLineStack.length - 1] = 9007199254740991;
    };
    return Return;
}());
exports.Return = Return;
