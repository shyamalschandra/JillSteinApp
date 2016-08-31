"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var StreamToString = (function () {
    function StreamToString() {
    }
    StreamToString.prototype.getIdentifier = function () {
        return "stream.streamToString";
    };
    StreamToString.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length == 2 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var source = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isStream(source));
        return Helper_1.Helper.dumpStream(source).then(function (str) {
            environment.setVariable(resultVar, str);
        });
    };
    return StreamToString;
}());
exports.StreamToString = StreamToString;
