"use strict";
var Helper_1 = require("../../../../helpers/Helper");
var VarAddress_1 = require("../../../VarAddress");
var crypto = require("crypto");
var Sha1 = (function () {
    function Sha1() {
    }
    Sha1.prototype.getIdentifier = function () {
        return "crypt.hmac.sha1";
    };
    Sha1.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length == 3 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var key = Helper_1.Helper.resolve(environment, parameters[1]);
        var message = Helper_1.Helper.resolve(environment, parameters[2]);
        Helper_1.Helper.assert(Helper_1.Helper.isString(key) && Helper_1.Helper.isString(message));
        var hmac = crypto.createHmac("sha1", key);
        hmac.update(message);
        var buf = hmac.digest();
        var numberArray = [];
        for (var i = 0; i < buf.length; i++) {
            numberArray.push(buf.readUInt8(i));
        }
        environment.setVariable(resultVar, numberArray);
    };
    return Sha1;
}());
exports.Sha1 = Sha1;
