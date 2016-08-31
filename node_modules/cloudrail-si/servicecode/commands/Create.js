"use strict";
var Sandbox_1 = require("../Sandbox");
var VarAddress_1 = require("../VarAddress");
var Helper_1 = require("../../helpers/Helper");
var InternalError_1 = require("../../errors/InternalError");
var Types_1 = require("../../types/Types");
var Create = (function () {
    function Create() {
    }
    Create.prototype.getIdentifier = function () {
        return "create";
    };
    Create.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length >= 2 && parameters[0] instanceof VarAddress_1.VarAddress &&
            (Helper_1.Helper.isString(parameters[1]) || parameters[1] instanceof VarAddress_1.VarAddress));
        var targetId = parameters[0];
        var type = Helper_1.Helper.resolve(environment, parameters[1]);
        Helper_1.Helper.assert(Helper_1.Helper.isString(type));
        var targetIdParts = Sandbox_1.Sandbox.decodeVariableAddress(targetId);
        var newObject;
        var constructorArgs = [];
        for (var i = 2; i < parameters.length; i++) {
            constructorArgs.push(Helper_1.Helper.resolve(environment, parameters[i]));
        }
        if (type === "String") {
            newObject = "";
            for (var _i = 0, constructorArgs_1 = constructorArgs; _i < constructorArgs_1.length; _i++) {
                var arg = constructorArgs_1[_i];
                newObject += arg.toString();
            }
        }
        else if (type === "Number") {
            if (constructorArgs.length > 1)
                throw new InternalError_1.InternalError("Create Number has too many arguments");
            if (constructorArgs.length === 1) {
                if (Helper_1.Helper.isNumber(constructorArgs[0])) {
                    newObject = constructorArgs[0];
                }
                else
                    throw new InternalError_1.InternalError("Create Number has an invalid argument type");
            }
            else {
                newObject = 0;
            }
        }
        else if (type === "Object") {
            if (constructorArgs.length !== 0)
                throw new InternalError_1.InternalError("Create Object does not take constructor arguments");
            newObject = {};
        }
        else if (type === "Array") {
            newObject = [];
            for (var _a = 0, constructorArgs_2 = constructorArgs; _a < constructorArgs_2.length; _a++) {
                var value = constructorArgs_2[_a];
                newObject.push(value);
            }
        }
        else {
            var constr = Types_1.Types.typeMap[type];
            Helper_1.Helper.assert(constr != null);
            newObject = new (constr.bind.apply(constr, [void 0].concat(constructorArgs)))();
        }
        environment.setVariable(targetIdParts, newObject);
    };
    return Create;
}());
exports.Create = Create;
