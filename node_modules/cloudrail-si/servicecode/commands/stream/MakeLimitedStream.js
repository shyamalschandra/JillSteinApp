"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var LimitedReadableStream_1 = require("../../../helpers/LimitedReadableStream");
var MakeLimitedStream = (function () {
    function MakeLimitedStream() {
    }
    MakeLimitedStream.prototype.getIdentifier = function () {
        return "stream.makeLimitedStream";
    };
    MakeLimitedStream.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length == 3 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var source = Helper_1.Helper.resolve(environment, parameters[1]);
        var limit = Helper_1.Helper.resolve(environment, parameters[2]);
        Helper_1.Helper.assert(Helper_1.Helper.isStream(source) && Helper_1.Helper.isNumber(limit));
        var resStream = new LimitedReadableStream_1.LimitedReadableStream(source, limit);
        environment.setVariable(resultVar, resStream);
    };
    return MakeLimitedStream;
}());
exports.MakeLimitedStream = MakeLimitedStream;
