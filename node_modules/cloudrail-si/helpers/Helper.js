"use strict";
var VarAddress_1 = require("../servicecode/VarAddress");
var InternalError_1 = require("../errors/InternalError");
var Promise = require("bluebird");
var stream = require("stream");
var url = require("url");
var http = require("http");
var https = require("https");
var Helper = (function () {
    function Helper() {
    }
    Helper.addAll = function (target, source) {
        target.push.apply(target, source);
    };
    Helper.putAll = function (target, source) {
        for (var key in source) {
            target[key] = source[key];
        }
    };
    Helper.clear = function (target) {
        for (var key in target)
            delete target[key];
    };
    Helper.remove = function (target, element) {
        target.splice(target.indexOf(element), 1);
    };
    Helper.isString = function (object) {
        return (typeof object === "string" || object instanceof String);
    };
    Helper.isObject = function (object) {
        return (!!object && object.constructor === Object);
    };
    Helper.isNumber = function (object) {
        return typeof object === "number";
    };
    Helper.isBoolean = function (object) {
        return typeof object === "boolean";
    };
    Helper.isNumberString = function (obj) {
        return (Helper.isString(obj) && obj.search("^\\d+$") !== -1);
    };
    Helper.isStream = function (obj) {
        return obj instanceof stream.Readable;
    };
    Helper.assert = function (expression) {
        if (!expression)
            throw new InternalError_1.InternalError("Assertion failed");
    };
    Helper.resolve = function (environment, value, checkExistence) {
        if (checkExistence === void 0) { checkExistence = true; }
        if (value instanceof VarAddress_1.VarAddress)
            return environment.getVariable(value, undefined, !checkExistence);
        else
            return value;
    };
    Helper.compare = function (aObj, bObj) {
        if (aObj < bObj)
            return -1;
        else if (bObj < aObj)
            return 1;
        else if (aObj === bObj)
            return 0;
        else
            throw new InternalError_1.InternalError("Compare compares incomparable values");
    };
    Helper.dumpStream = function (stream, targetEncoding) {
        return new Promise(function (resolve, reject) {
            var buffers = [], length = 0;
            stream.on("data", function (chunk) {
                buffers.push(chunk);
                length += chunk.length;
            });
            stream.on("end", function () {
                var buf = Buffer.concat(buffers, length);
                var str = buf.toString(targetEncoding);
                resolve(str);
            });
            stream.on("error", function (err) { return reject(err); });
        });
    };
    Helper.streamifyString = function (string, sourceEncoding) {
        var resStream = new stream.Readable();
        resStream._read = function () {
        };
        resStream.push(string, sourceEncoding);
        resStream.push(null);
        return resStream;
    };
    Helper.makeRequest = function (urlString, headers, body, method) {
        var urlParsed = url.parse(urlString, true);
        var request = urlParsed.protocol === "http:" ? http : https;
        var options = {
            hostname: urlParsed.hostname,
            port: parseInt(urlParsed.port),
            path: urlParsed.path,
            method: method,
            headers: headers,
            auth: urlParsed.auth
        };
        return new Promise(function (resolve, reject) {
            var req = request.request(options, function (res) {
                if ([300, 301, 302, 307, 308].some(function (stat) { return res.statusCode === stat; })) {
                    var redUrl = res.headers["location"];
                    Helper.makeRequest(redUrl, headers, body, method).then(resolve, reject);
                }
                else
                    resolve(res);
            });
            req.on("error", reject);
            if (body) {
                body.pipe(req);
                body.on("end", function () { return req.end(); });
                body.on("error", reject);
            }
            else {
                req.end();
            }
        });
    };
    Helper.lowerCaseFirstLetter = function (str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    };
    Helper.upperCaseFirstLetter = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    Helper.isArray = Array.isArray;
    return Helper;
}());
exports.Helper = Helper;
