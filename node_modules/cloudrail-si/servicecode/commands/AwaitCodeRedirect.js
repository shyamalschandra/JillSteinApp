"use strict";
var Helper_1 = require("../../helpers/Helper");
var VarAddress_1 = require("../VarAddress");
var UserError_1 = require("../../errors/UserError");
var url = require("url");
var Promise = require("bluebird");
var AwaitCodeRedirect = (function () {
    function AwaitCodeRedirect() {
    }
    AwaitCodeRedirect.prototype.getIdentifier = function () {
        return "awaitCodeRedirect";
    };
    AwaitCodeRedirect.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length >= 2 && parameters[0] instanceof VarAddress_1.VarAddress && (Helper_1.Helper.isString(parameters[1]) || parameters[1] instanceof VarAddress_1.VarAddress));
        var resVar = parameters[0];
        var urlStr = Helper_1.Helper.resolve(environment, parameters[1]);
        var legacy = parameters.length == 2;
        var keys = [];
        for (var i = 2; i < parameters.length; i++) {
            keys.push(Helper_1.Helper.resolve(environment, parameters[i]));
        }
        if (legacy)
            keys.push("code");
        var redirectReceiver = environment.instanceDependencyStorage["redirectReceiver"];
        if (!redirectReceiver || typeof redirectReceiver !== "function")
            throw new UserError_1.UserError("This service needs the RedirectReceiver to be implemented as a function. Have a look at our examples and documentation if you are unsure how to do that.");
        return new Promise(function (resolve, reject) {
            redirectReceiver(urlStr, environment.saveStateToString(), function (error, redirectedUrl) {
                if (error)
                    reject(error);
                else
                    resolve(redirectedUrl);
            });
        }).then(function (redirectUrl) {
            var queryMap = url.parse(redirectUrl, true).query;
            var resMap = {};
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (queryMap[key] != null)
                    resMap[key] = queryMap[key];
                else
                    throw new UserError_1.UserError("The URL the RedirectReceiver returns does not contain all necessary keys in the query, it's missing at least " + key);
            }
            environment.setVariable(resVar, legacy ? resMap["code"] : resMap);
        });
    };
    return AwaitCodeRedirect;
}());
exports.AwaitCodeRedirect = AwaitCodeRedirect;
