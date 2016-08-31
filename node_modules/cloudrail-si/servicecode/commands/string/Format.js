"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var InternalError_1 = require("../../../errors/InternalError");
var Format = (function () {
    function Format() {
    }
    Format.prototype.getIdentifier = function () {
        return "string.format";
    };
    Format.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length === 3 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var format = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isString(format));
        var element = Helper_1.Helper.resolve(environment, parameters[2]);
        var res;
        switch (format) {
            case "%d":
                res = "" + element;
                break;
            case "%02x":
            case "%02X":
                res = toTwoCharHex(element);
                break;
            default:
                throw new InternalError_1.InternalError("Format with unsupported parameters attempted");
        }
        environment.setVariable(resultVar, res);
    };
    return Format;
}());
exports.Format = Format;
function toTwoCharHex(element) {
    var hex = element.toString(16).toUpperCase();
    if (hex.length === 1)
        hex = "0" + hex;
    return hex;
}
