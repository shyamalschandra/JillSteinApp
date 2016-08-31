"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var StringToStream = (function () {
    function StringToStream() {
    }
    StringToStream.prototype.getIdentifier = function () {
        return "stream.stringToStream";
    };
    StringToStream.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length == 2 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var source = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isString(source));
        environment.setVariable(resultVar, Helper_1.Helper.streamifyString(source));
    };
    return StringToStream;
}());
exports.StringToStream = StringToStream;
