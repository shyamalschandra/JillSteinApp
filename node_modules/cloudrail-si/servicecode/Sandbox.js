"use strict";
var Interpreter_1 = require("./Interpreter");
var VarAddress_1 = require("./VarAddress");
var InternalError_1 = require("../errors/InternalError");
var Helper_1 = require("../helpers/Helper");
var SandboxObject_1 = require("../types/SandboxObject");
var Types_1 = require("../types/Types");
var stream = require("stream");
var LIST_MAX_ADD_JUMP_ALLOWED = 32;
var JSON_AWARE_MARKER = "@JSONAware/";
var Sandbox = (function () {
    function Sandbox(serviceCode, persistentStorage, instanceDependencyStorage) {
        this.localVariablesStack = [];
        this.parametersStack = [];
        this.codeFunctionNameStack = [];
        this.codeLineStack = [];
        this.persistentStorage = [];
        this.serviceCode = serviceCode;
        this.persistentStorage = persistentStorage;
        this.instanceDependencyStorage = instanceDependencyStorage;
    }
    Sandbox.prototype.createNewStackLevel = function (functionName, codeLine) {
        this.localVariablesStack.push([]);
        this.parametersStack.push([]);
        this.codeFunctionNameStack.push(functionName);
        this.codeLineStack.push(codeLine);
    };
    Sandbox.prototype.currentParameters = function () {
        if (this.parametersStack.length === 0)
            return null;
        else
            return this.parametersStack[this.parametersStack.length - 1];
    };
    Sandbox.prototype.currentFunctionName = function () {
        if (this.codeFunctionNameStack.length === 0)
            return null;
        else
            return this.codeFunctionNameStack[this.codeFunctionNameStack.length - 1];
    };
    Sandbox.prototype.currentFunctionCode = function () {
        return this.serviceCode[this.currentFunctionName()];
    };
    Sandbox.prototype.currentServiceCodeLine = function () {
        if (this.codeLineStack.length === 0)
            return -1;
        else
            return this.codeLineStack[this.codeLineStack.length - 1];
    };
    Sandbox.prototype.incrementCurrentServiceCodeLine = function (amount) {
        if (this.codeLineStack.length === 0)
            return;
        else
            this.codeLineStack[this.codeLineStack.length - 1] = this.codeLineStack[this.codeLineStack.length - 1] + amount;
    };
    Sandbox.prototype.returnFromFunction = function () {
        if (this.codeFunctionNameStack.length <= 1)
            return;
        var currentStackLevel = this.codeFunctionNameStack.length - 1;
        var callFunctionCommandParameters = Interpreter_1.Interpreter.decodeCommandParameters(this.serviceCode[this.codeFunctionNameStack[currentStackLevel - 1]][this.codeLineStack[currentStackLevel - 1]]);
        for (var i = 0; i < callFunctionCommandParameters.length; i++) {
            var paramterVar = callFunctionCommandParameters[i];
            if (paramterVar instanceof VarAddress_1.VarAddress) {
                var value = this.parametersStack[currentStackLevel][i - 1];
                this.setVariable(paramterVar, value, currentStackLevel - 1);
            }
        }
        this.codeFunctionNameStack.splice(currentStackLevel, 1);
        this.codeLineStack.splice(currentStackLevel, 1);
        this.localVariablesStack.splice(currentStackLevel, 1);
        this.parametersStack.splice(currentStackLevel, 1);
        this.incrementCurrentServiceCodeLine(1);
    };
    Sandbox.prototype.setVariable = function (varAddress, value, stacklevel) {
        if (stacklevel === void 0) { stacklevel = this.localVariablesStack.length - 1; }
        var varAddressParts;
        if (varAddress instanceof VarAddress_1.VarAddress)
            varAddressParts = Sandbox.decodeVariableAddress(varAddress);
        else
            varAddressParts = varAddress;
        var variables = this.getStackForAddressPart(varAddressParts[0], stacklevel);
        var varIdx = varAddressParts[1];
        if (varAddressParts.length <= 2) {
            if (variables.length === varIdx) {
                variables.push(value);
            }
            else if (variables.length > varIdx) {
                variables[varIdx] = value;
            }
            else if (variables.length + LIST_MAX_ADD_JUMP_ALLOWED > varIdx) {
                for (var i = 0; i < varIdx - variables.length + 1; i++)
                    variables.push(null);
                variables[varIdx] = value;
            }
            else {
                throw new InternalError_1.InternalError("Could not decode variable " + varAddressParts.join(":"));
            }
            return true;
        }
        return this.setEntry(variables[varIdx], varAddressParts.slice(2, varAddressParts.length), value);
    };
    Sandbox.prototype.getVariable = function (varAddress, stacklevel, emptyIsNull) {
        if (stacklevel === void 0) { stacklevel = this.localVariablesStack.length - 1; }
        if (emptyIsNull === void 0) { emptyIsNull = false; }
        var varAddressParts;
        if (varAddress instanceof VarAddress_1.VarAddress)
            varAddressParts = Sandbox.decodeVariableAddress(varAddress);
        else
            varAddressParts = varAddress;
        var variables = this.getStackForAddressPart(varAddressParts[0], stacklevel);
        if (emptyIsNull && varAddressParts[1] >= variables.length)
            return null;
        var localEntry = variables[varAddressParts[1]];
        if (varAddressParts.length <= 2)
            return localEntry;
        return this.getEntry(localEntry, varAddressParts.slice(2, varAddressParts.length), emptyIsNull);
    };
    Sandbox.prototype.deleteVariable = function (varAddressParts, stacklevel) {
        if (stacklevel === void 0) { stacklevel = this.localVariablesStack.length - 1; }
        var variables = this.getStackForAddressPart(varAddressParts[0], stacklevel);
        var varIdx = varAddressParts[1];
        if (varAddressParts.length <= 2) {
            if (varIdx < variables.length) {
                variables[varIdx] = null;
            }
            return true;
        }
        return this.deleteEntry(variables[varIdx], varAddressParts.slice(2, varAddressParts.length));
    };
    Sandbox.prototype.getStackForAddressPart = function (part, stacklevel) {
        var variables;
        if (part === "L") {
            variables = this.localVariablesStack[stacklevel];
        }
        else if (part === "P") {
            variables = this.parametersStack[stacklevel];
        }
        else if (part === "S") {
            variables = this.persistentStorage;
        }
        else {
            throw new InternalError_1.InternalError("Could not attribute variable part" + part);
        }
        return variables;
    };
    Sandbox.decodeVariableAddress = function (varAddress) {
        var decAdr = [];
        var adr = varAddress.addressString;
        Helper_1.Helper.assert(adr[0] !== "$");
        if (adr[0] < '0' || adr[0] > '9') {
            decAdr.push(adr[0]);
            adr = adr.substring(1);
        }
        var adrParts = adr.split(".");
        for (var i = 0; i < adrParts.length; i++) {
            var part = adrParts[i];
            if (Helper_1.Helper.isNumberString(part)) {
                decAdr.push(parseInt(part));
            }
            else {
                decAdr.push(part);
            }
        }
        return decAdr;
    };
    Sandbox.prototype.setEntry = function (container, varAddress, value) {
        if (varAddress.length > 1) {
            var nextContainer = this.getEntry(container, varAddress.slice(0, varAddress.length - 1), false);
            return this.setEntry(nextContainer, varAddress.slice(1, varAddress.length), value);
        }
        var varAddressPart = varAddress[0];
        if (Helper_1.Helper.isArray(container)) {
            if (Helper_1.Helper.isNumberString(varAddressPart)) {
                varAddressPart = parseInt(varAddressPart);
            }
            if (!Helper_1.Helper.isNumber(varAddressPart) || varAddressPart >= container.length) {
                throw new InternalError_1.InternalError("Invalid index while indexing into an array");
            }
            var idx = varAddressPart;
            var list = container;
            if (list.length + LIST_MAX_ADD_JUMP_ALLOWED <= idx) {
                for (var i = 0; i < idx - list.length + 1; i++)
                    list.push(null);
            }
            list[idx] = value;
        }
        else if (Helper_1.Helper.isObject(container)) {
            if (!Helper_1.Helper.isString(varAddressPart)) {
                varAddressPart = varAddressPart.toString();
            }
            container[varAddressPart] = value;
        }
        else if (container instanceof SandboxObject_1.SandboxObject) {
            if (!Helper_1.Helper.isString(varAddressPart)) {
                varAddressPart = varAddressPart.toString();
            }
            container.set(varAddressPart, value);
        }
        return false;
    };
    Sandbox.prototype.getEntry = function (container, varAddress, emptyIsNull) {
        var entry;
        var varAddressPart = varAddress[0];
        if (Helper_1.Helper.isArray(container) || Helper_1.Helper.isString(container)) {
            if (Helper_1.Helper.isNumberString(varAddressPart)) {
                varAddressPart = parseInt(varAddressPart);
            }
            if (!Helper_1.Helper.isNumber(varAddressPart)) {
                throw new InternalError_1.InternalError("Invalid index while indexing into an array or string");
            }
            if (!(emptyIsNull && varAddressPart >= container.length)) {
                entry = container[varAddressPart];
            }
        }
        else if (Helper_1.Helper.isObject(container)) {
            if (!Helper_1.Helper.isString(varAddressPart)) {
                varAddressPart = varAddressPart.toString();
            }
            entry = container[varAddressPart];
        }
        else if (container instanceof SandboxObject_1.SandboxObject) {
            if (!Helper_1.Helper.isString(varAddressPart)) {
                varAddressPart = varAddressPart.toString();
            }
            entry = container.get(varAddressPart);
        }
        if (varAddress.length > 1) {
            return this.getEntry(entry, varAddress.slice(1, varAddress.length), emptyIsNull);
        }
        return entry;
    };
    Sandbox.prototype.deleteEntry = function (container, varAddress) {
        if (varAddress.length > 1) {
            var nextContainer = this.getEntry(container, varAddress.slice(0, varAddress.length - 1), false);
            return this.deleteEntry(nextContainer, varAddress.slice(1, varAddress.length));
        }
        var varAddressPart = varAddress[0];
        if (Helper_1.Helper.isArray(container)) {
            if (Helper_1.Helper.isNumberString(varAddressPart)) {
                varAddressPart = parseInt(varAddressPart);
            }
            if (!Helper_1.Helper.isNumber(varAddressPart) || varAddressPart >= container.length) {
                throw new InternalError_1.InternalError("Invalid index while indexing into an array");
            }
            var idx = varAddressPart;
            var list = container;
            if (idx < list.length) {
                list.splice(idx, 1);
            }
            while (list.length > 0 && list[list.length - 1] == null) {
                list.pop();
            }
        }
        else if (Helper_1.Helper.isObject(container)) {
            varAddressPart = varAddressPart.toString();
            delete container[varAddressPart];
        }
        else if (container instanceof SandboxObject_1.SandboxObject) {
            varAddressPart = varAddressPart.toString();
            container.set(varAddressPart, null);
        }
        return false;
    };
    Sandbox.prototype.callFunction = function (functionName, parameters) {
        this.createNewStackLevel(functionName, -1);
        var parameterStack = this.currentParameters();
        Helper_1.Helper.addAll(parameterStack, parameters);
    };
    Sandbox.prototype.compareVariables = function (aObj, bObj, commandID, typeCheck) {
        aObj = Helper_1.Helper.resolve(this, aObj, false);
        bObj = Helper_1.Helper.resolve(this, bObj, false);
        if (!typeCheck && (aObj == null || bObj == null)) {
            if (aObj == null && bObj == null) {
                return 0;
            }
            return -1;
        }
        if (aObj.constructor !== bObj.constructor) {
            if (!typeCheck)
                return -1;
            throw new InternalError_1.InternalError("Command '" + commandID + "' compares arguments of different types");
        }
        if (typeof aObj["compareTo"] === "function") {
            return aObj.compareTo(bObj);
        }
        else {
            return Helper_1.Helper.compare(aObj, bObj);
        }
    };
    Sandbox.prototype.saveStateToString = function () {
        var savelist = [];
        savelist.push(this.codeFunctionNameStack);
        savelist.push(this.codeLineStack);
        savelist.push(this.localVariablesStack);
        savelist.push(this.parametersStack);
        savelist.push(this.persistentStorage);
        return JSON.stringify(savelist, function (key, value) {
            if (value instanceof stream.Readable) {
                return undefined;
            }
            else if (value != null && typeof value["toJSONString"] === "function" && typeof value["fromJSONString"] === "function") {
                return JSON_AWARE_MARKER + value.constructor.name + ":" + value.toJSONString();
            }
            else {
                return value;
            }
        });
    };
    Sandbox.prototype.loadStateFromString = function (savedState) {
        var savelist = JSON.parse(savedState, function (key, value) {
            if (Helper_1.Helper.isString(value) && value.startsWith(JSON_AWARE_MARKER)) {
                var start = JSON_AWARE_MARKER.length;
                var className = value.substring(start, value.indexOf(":"));
                var content = value.substring(value.indexOf(":") + 1);
                var cl = Types_1.Types.typeMap[className];
                var instance = new cl();
                return instance["fromJSONString"](content);
            }
            else {
                return value;
            }
        });
        this.codeFunctionNameStack = savelist[0];
        this.codeLineStack = savelist[1];
        this.localVariablesStack = savelist[2];
        var mergeStacks = function (jsonStack, stack) {
            for (var i = 0; i < jsonStack.length; i++) {
                if (i >= stack.length) {
                    stack.push(jsonStack[i]);
                }
                else {
                    stack[i] = jsonStack[i];
                }
            }
        };
        var jsonParametersStack = savelist[3];
        var jsonPersistentStorage = savelist[4];
        mergeStacks(jsonParametersStack, this.parametersStack);
        mergeStacks(jsonPersistentStorage, this.persistentStorage);
    };
    Sandbox.prototype.getParameter = function (idx, stacklevel) {
        if (this.parametersStack.length === 0 || stacklevel >= this.parametersStack.length || idx >= this.parametersStack[stacklevel].length)
            return null;
        return this.parametersStack[stacklevel][idx];
    };
    return Sandbox;
}());
exports.Sandbox = Sandbox;
