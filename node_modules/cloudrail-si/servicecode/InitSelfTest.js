"use strict";
var Interpreter_1 = require("./Interpreter");
var Sandbox_1 = require("./Sandbox");
var Promise = require("bluebird");
var os = require("os");
var dns = require("dns");
var InitSelfTest = (function () {
    function InitSelfTest() {
    }
    InitSelfTest.initTest = function (servicename) {
        if (InitSelfTest.testedServices.indexOf(servicename) !== -1)
            return true;
        var testRes = InitSelfTest.execute(servicename);
        if (testRes && InitSelfTest.testedServices.indexOf(servicename) === -1)
            InitSelfTest.testedServices.push(servicename);
        return testRes;
    };
    InitSelfTest.execute = function (servicename) {
        var testState = true;
        var SERVICE_CODE = {
            "selfTest": [
                ["create", "$L0", "Object"],
                ["create", "$L1", "Object"],
                ["create", "$L1.client", "Object"],
                ["create", "$L1.app", "Object"],
                ["set", "$L1.client.mac", "$P1"],
                ["set", "$L1.client.platform", "$P0.platform"],
                ["set", "$L1.client.os", "$P0.os"],
                ["set", "$L1.app.name", "$P2"],
                ["set", "$L1.app.version", "$P3"],
                ["json.stringify", "$L3", "$L1.client"],
                ["callFunc", "hashString", "$L4", "$L3"],
                ["json.stringify", "$L5", "$L1.app"],
                ["callFunc", "hashString", "$L6", "$L5"],
                ["delete", "$L1.client.mac"],
                ["create", "$L8", "Object"],
                ["set", "$L8.method", "GET"],
                ["string.concat", "$L8.url", "https://stat-si.cloudrail.com/current_version?service=", "$P0.serviceName", "&client=", "$L4", "&app=", "$L6"],
                ["create", "$L8.requestHeaders", "Object"],
                ["json.stringify", "$L8.requestHeaders.clientdata", "$L1.client"],
                ["json.stringify", "$L8.requestHeaders.appdata", "$L1.app"],
                ["http.requestCall", "$L9", "$L8"]
            ],
            "hashString": [
                ["hash.md5", "$L0", "$P1"],
                ["size", "$L1", "$L0"],
                ["set", "$L2", 0],
                ["set", "$P0", ""],
                ["get", "$L3", "$L0", "$L2"],
                ["string.format", "$L4", "%02X", "$L3"],
                ["string.concat", "$P0", "$P0", "$L4"],
                ["math.add", "$L2", "$L2", 1],
                ["if>=than", "$L2", "$L1", -5]
            ]
        };
        var interpreterStorage = {
            "serviceName": servicename,
            "platform": "Node.js",
            "os": InitSelfTest.getOS()
        };
        InitSelfTest.getMac().then(function (mac) {
            var nv = InitSelfTest.getNameVersion();
            var interpreter = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, [], {}));
            interpreter.callFunction("selfTest", interpreterStorage, mac, nv.name, nv.version);
        });
        return testState;
    };
    InitSelfTest.getMac = function () {
        return new Promise(function (resolve, reject) {
            dns.lookup(os.hostname(), function (err, add, fam) {
                if (err)
                    reject(err);
                var mac;
                var interfaces = os.networkInterfaces();
                for (var key in interfaces) {
                    for (var _i = 0, _a = interfaces[key]; _i < _a.length; _i++) {
                        var entry = _a[_i];
                        if (entry.address === add) {
                            mac = entry.mac;
                            break;
                        }
                    }
                    if (mac)
                        break;
                }
                resolve(mac);
            });
        });
    };
    InitSelfTest.getNameVersion = function () {
        var pjson;
        var path = "./package.json";
        var limit = 50;
        while (!pjson && limit > 0) {
            try {
                var tmp = require(path);
                if (tmp.name === "cloudrail-si")
                    throw Error();
                else
                    pjson = tmp;
            }
            catch (err) {
                if (path.indexOf("./") === 0) {
                    path = "." + path;
                }
                else {
                    path = "../" + path;
                }
            }
            limit--;
        }
        var name;
        var version;
        if (!pjson) {
            name = "unknown";
            version = "unknown";
        }
        else {
            name = pjson.name ? pjson.name : "unknown";
            version = pjson.version ? pjson.version : "unknown";
        }
        return {
            name: name,
            version: version
        };
    };
    InitSelfTest.getOS = function () {
        return os.type() + " , " + os.arch() + " , " + os.release();
    };
    InitSelfTest.testedServices = [];
    return InitSelfTest;
}());
exports.InitSelfTest = InitSelfTest;
