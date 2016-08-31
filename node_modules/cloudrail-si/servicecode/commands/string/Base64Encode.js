"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var base64charsDefault = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64charsWebSafe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
var Base64Encode = (function () {
    function Base64Encode() {
    }
    Base64Encode.prototype.getIdentifier = function () {
        return "string.base64encode";
    };
    Base64Encode.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length >= 2 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var sourceString = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isString(sourceString));
        var lineBreak = false;
        var webSafe = false;
        if (parameters.length >= 3)
            lineBreak = !!Helper_1.Helper.resolve(environment, parameters[2]);
        if (parameters.length >= 4)
            webSafe = !!Helper_1.Helper.resolve(environment, parameters[3]);
        var resultString = Base64Encode.encode(sourceString, lineBreak, webSafe);
        environment.setVariable(resultVar, resultString);
    };
    Base64Encode.encode = function (s, lineBreak, webSafe) {
        var base64chars = webSafe ? base64charsWebSafe : base64charsDefault;
        var r = "";
        var p = "";
        var c = s.length % 3;
        if (c > 0) {
            for (; c < 3; c++) {
                p += '=';
                s += "\0";
            }
        }
        for (c = 0; c < s.length; c += 3) {
            if (lineBreak) {
                if (c > 0 && (c / 3 * 4) % 76 == 0) {
                    r += "\r\n";
                }
            }
            var n = (s.charCodeAt(c) << 16) + (s.charCodeAt(c + 1) << 8) + s.charCodeAt(c + 2);
            n = [(n >>> 18) & 63, (n >>> 12) & 63, (n >>> 6) & 63, n & 63];
            r += base64chars[n[0]] + base64chars[n[1]] + base64chars[n[2]] + base64chars[n[3]];
        }
        return r.substring(0, r.length - p.length) + p;
    };
    return Base64Encode;
}());
exports.Base64Encode = Base64Encode;
