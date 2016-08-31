"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var RequestCall = (function () {
    function RequestCall() {
    }
    RequestCall.prototype.getIdentifier = function () {
        return "http.requestCall";
    };
    RequestCall.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length == 2 && parameters[0] instanceof VarAddress_1.VarAddress && parameters[1] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var options = Helper_1.Helper.resolve(environment, parameters[1]);
        var url = options["url"];
        var method = options["method"];
        var requestHeaders = options["requestHeaders"];
        var requestBody = options["requestBody"];
        Helper_1.Helper.assert(Helper_1.Helper.isString(url) && Helper_1.Helper.isString(method));
        Helper_1.Helper.assert(requestHeaders == null || Helper_1.Helper.isObject(requestHeaders));
        Helper_1.Helper.assert(requestBody == null || Helper_1.Helper.isStream(requestBody));
        return Helper_1.Helper.makeRequest(url, requestHeaders, requestBody, method).then(function (res) {
            var response = {
                code: res.statusCode,
                message: res.statusMessage,
                responseHeaders: capitalizeHeaders(res.headers),
                responseBody: res
            };
            environment.setVariable(resultVar, response);
        });
    };
    return RequestCall;
}());
exports.RequestCall = RequestCall;
function capitalizeHeaders(headers) {
    var ret = {};
    for (var key in headers) {
        if (headers.hasOwnProperty(key)) {
            ret[Helper_1.Helper.upperCaseFirstLetter(key)] = headers[key];
        }
    }
    return ret;
}
