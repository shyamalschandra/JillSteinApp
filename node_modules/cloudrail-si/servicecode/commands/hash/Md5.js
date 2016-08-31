"use strict";
var crypto = require("crypto");
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var Md5 = (function () {
    function Md5() {
    }
    Md5.prototype.getIdentifier = function () {
        return "hash.md5";
    };
    Md5.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length == 2 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var message = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isString(message));
        var hash = crypto.createHash("md5");
        hash.update(message);
        var buf = hash.digest();
        var numberArray = [];
        for (var i = 0; i < buf.length; i++) {
            numberArray.push(buf.readUInt8(i));
        }
        environment.setVariable(resultVar, numberArray);
    };
    return Md5;
}());
exports.Md5 = Md5;
