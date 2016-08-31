"use strict";
var Helper_1 = require("../../helpers/Helper");
var Error_1 = require("../../types/Error");
var ThrowError = (function () {
    function ThrowError() {
    }
    ThrowError.prototype.getIdentifier = function () {
        return "throwError";
    };
    ThrowError.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length < 2);
        var errorObj = new Error_1.Error();
        if (parameters.length > 0) {
            errorObj = Helper_1.Helper.resolve(environment, parameters[0]);
        }
        environment.thrownError = errorObj;
    };
    return ThrowError;
}());
exports.ThrowError = ThrowError;
