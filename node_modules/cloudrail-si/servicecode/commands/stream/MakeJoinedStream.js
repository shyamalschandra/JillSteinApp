"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var SequenceReadableStream_1 = require("../../../helpers/SequenceReadableStream");
var MakeJoinedStream = (function () {
    function MakeJoinedStream() {
    }
    MakeJoinedStream.prototype.getIdentifier = function () {
        return "stream.makeJoinedStream";
    };
    MakeJoinedStream.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length >= 3 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var source = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isStream(source));
        var streamStack = [];
        for (var i = parameters.length - 1; i > 0; i--) {
            var stream_1 = Helper_1.Helper.resolve(environment, parameters[i]);
            Helper_1.Helper.assert(Helper_1.Helper.isStream(stream_1));
            streamStack.push(stream_1);
        }
        var result = joinStreams(streamStack);
        environment.setVariable(resultVar, result);
    };
    return MakeJoinedStream;
}());
exports.MakeJoinedStream = MakeJoinedStream;
function joinStreams(streams) {
    if (streams.length > 1) {
        return new SequenceReadableStream_1.SequenceReadableStream(streams.pop(), joinStreams(streams));
    }
    else {
        return streams.pop();
    }
}
