"use strict";
var Helper_1 = require("../../../helpers/Helper");
var VarAddress_1 = require("../../VarAddress");
var Parse = (function () {
    function Parse() {
    }
    Parse.prototype.getIdentifier = function () {
        return "json.parse";
    };
    Parse.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length == 2 && parameters[0] instanceof VarAddress_1.VarAddress);
        var resultVar = parameters[0];
        var input = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isStream(input) || Helper_1.Helper.isString(input));
        if (Helper_1.Helper.isStream(input)) {
            return Helper_1.Helper.dumpStream(input).then(function (stringInput) {
                Helper_1.Helper.assert(Helper_1.Helper.isString(stringInput));
                var obj = parse(stringInput);
                environment.setVariable(resultVar, obj);
            });
        }
        else {
            var obj = parse(input);
            environment.setVariable(resultVar, obj);
        }
    };
    return Parse;
}());
exports.Parse = Parse;
function parse(input) {
    return JSON.parse(input, function (key, value) {
        if (Helper_1.Helper.isBoolean(value))
            return value ? 1 : 0;
        else
            return value;
    });
}
