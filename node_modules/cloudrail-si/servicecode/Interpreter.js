"use strict";
var Helper_1 = require("../helpers/Helper");
var InternalError_1 = require("../errors/InternalError");
var VarAddress_1 = require("./VarAddress");
var CallFunc_1 = require("./commands/CallFunc");
var Create_1 = require("./commands/Create");
var Clone_1 = require("./commands/Clone");
var Delete_1 = require("./commands/Delete");
var Get_1 = require("./commands/Get");
var Uint8ToBase64_1 = require("./commands/array/Uint8ToBase64");
var Md5_1 = require("./commands/hash/Md5");
var Sha1_1 = require("./commands/crypt/hmac/Sha1");
var Base64Encode_1 = require("./commands/string/Base64Encode");
var StreamToString_1 = require("./commands/stream/StreamToString");
var StringToStream_1 = require("./commands/stream/StringToStream");
var MakeJoinedStream_1 = require("./commands/stream/MakeJoinedStream");
var MakeLimitedStream_1 = require("./commands/stream/MakeLimitedStream");
var RequestCall_1 = require("./commands/http/RequestCall");
var Out_1 = require("./commands/debug/Out");
var UserError_1 = require("../errors/UserError");
var AwaitCodeRedirect_1 = require("./commands/AwaitCodeRedirect");
var GetMimeType_1 = require("./commands/GetMimeType");
var ThrowError_1 = require("./commands/ThrowError");
var Parse_1 = require("./commands/json/Parse");
var Stringify_1 = require("./commands/json/Stringify");
var Floor_1 = require("./commands/math/Floor");
var Conditional_1 = require("./commands/Conditional");
var MathCombine_1 = require("./commands/math/MathCombine");
var GetKeyArray_1 = require("./commands/object/GetKeyArray");
var GetKeyValueArrays_1 = require("./commands/object/GetKeyValueArrays");
var Concat_1 = require("./commands/string/Concat");
var IndexOf_1 = require("./commands/string/IndexOf");
var LastIndexOf_1 = require("./commands/string/LastIndexOf");
var Split_1 = require("./commands/string/Split");
var Substr_1 = require("./commands/string/Substr");
var Substring_1 = require("./commands/string/Substring");
var StringTransform_1 = require("./commands/string/StringTransform");
var JumpRel_1 = require("./commands/JumpRel");
var Pull_1 = require("./commands/Pull");
var Push_1 = require("./commands/Push");
var Return_1 = require("./commands/Return");
var Set_1 = require("./commands/Set");
var Size_1 = require("./commands/Size");
var Format_1 = require("./commands/string/Format");
var Promise = require("bluebird");
var Interpreter = (function () {
    function Interpreter(sandbox) {
        this.sandbox = sandbox;
    }
    Interpreter.prototype.callFunction = function (functionName) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        this.sandbox.createNewStackLevel(functionName, 0);
        Helper_1.Helper.addAll(this.sandbox.currentParameters(), parameters);
        if (this.sandbox.currentFunctionCode() == null) {
            var errorMessage = "Service code error: function '" + functionName + "' not found";
            throw new InternalError_1.InternalError(errorMessage);
        }
        return this.run();
    };
    Interpreter.prototype.callFunctionSync = function (functionName) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        this.sandbox.createNewStackLevel(functionName, 0);
        Helper_1.Helper.addAll(this.sandbox.currentParameters(), parameters);
        if (this.sandbox.currentFunctionCode() == null) {
            var errorMessage = "Service code error: function '" + functionName + "' not found";
            throw new InternalError_1.InternalError(errorMessage);
        }
        return this.runSync();
    };
    Interpreter.prototype.run = function () {
        var _this = this;
        var condition = function () { return (_this.sandbox.currentServiceCodeLine() < _this.sandbox.currentFunctionCode().length && _this.sandbox.currentServiceCodeLine() >= 0); };
        var body = function () {
            var command = _this.sandbox.currentFunctionCode()[_this.sandbox.currentServiceCodeLine()];
            if (COMMANDS[command[0]] == null) {
                throw new InternalError_1.InternalError("Unknown command: " + command[0]);
            }
            var commandParameters = Interpreter.decodeCommandParameters(command);
            return Promise.resolve().then(function () { return COMMANDS[command[0]].execute(_this.sandbox, commandParameters); }).then(function () {
                if (_this.sandbox.thrownError != null) {
                    return false;
                }
                _this.sandbox.incrementCurrentServiceCodeLine(1);
                while ((_this.sandbox.currentServiceCodeLine() >= _this.sandbox.currentFunctionCode().length ||
                    _this.sandbox.currentServiceCodeLine() < 0) && _this.sandbox.codeFunctionNameStack.length > 1) {
                    _this.sandbox.returnFromFunction();
                }
                return true;
            });
        };
        var loop = function (condition, body) {
            if (condition()) {
                return body().then(function (cont) { return cont ? loop(condition, body) : Promise.resolve(); });
            }
            else {
                return Promise.resolve();
            }
        };
        return Promise.resolve().then(function () { return loop(condition, body); }).catch(function (e) {
            if (!(e instanceof InternalError_1.InternalError))
                throw e;
            var errorMessage = "Service code error in function " + _this.sandbox.currentFunctionName() + " at line " + _this.sandbox.currentServiceCodeLine() + " with message: " + e.message;
            throw new InternalError_1.InternalError(errorMessage);
        });
    };
    Interpreter.prototype.runSync = function () {
        try {
            while (this.sandbox.currentServiceCodeLine() < this.sandbox.currentFunctionCode().length && this.sandbox.currentServiceCodeLine() >= 0) {
                var command = this.sandbox.currentFunctionCode()[this.sandbox.currentServiceCodeLine()];
                if (COMMANDS[command[0]] == null) {
                    throw new InternalError_1.InternalError("Unknown command: " + command[0]);
                }
                var commandParameters = Interpreter.decodeCommandParameters(command);
                var commandRet = COMMANDS[command[0]].execute(this.sandbox, commandParameters);
                if (commandRet != null && commandRet instanceof Promise)
                    throw new InternalError_1.InternalError("Attempt to synchronously execute an asynchronous command");
                if (this.sandbox.thrownError != null) {
                    return;
                }
                this.sandbox.incrementCurrentServiceCodeLine(1);
                while ((this.sandbox.currentServiceCodeLine() >= this.sandbox.currentFunctionCode().length ||
                    this.sandbox.currentServiceCodeLine() < 0) && this.sandbox.codeFunctionNameStack.length > 1) {
                    this.sandbox.returnFromFunction();
                }
            }
        }
        catch (e) {
            if (e instanceof UserError_1.UserError)
                throw e;
            var errorMessage = "Service code error in function " + this.sandbox.currentFunctionName() + " at line " + this.sandbox.currentServiceCodeLine() + " with message: " + e.message;
            throw new InternalError_1.InternalError(errorMessage);
        }
    };
    Interpreter.decodeCommandParameters = function (command) {
        var commandParameters = command.slice(1, command.length);
        for (var i = 0; i < commandParameters.length; i++) {
            if (Helper_1.Helper.isString(commandParameters[i])) {
                if (commandParameters[i].indexOf("$") === 0) {
                    commandParameters[i] = new VarAddress_1.VarAddress(commandParameters[i].substring(1));
                }
                else if (commandParameters[i].indexOf("\\$") === 0) {
                    commandParameters[i] = commandParameters[i].substring(1);
                }
            }
        }
        return commandParameters;
    };
    Interpreter.prototype.getParameter = function (idx) {
        return this.sandbox.getParameter(idx, 0);
    };
    Interpreter.prototype.saveAsString = function () {
        return JSON.stringify(this.sandbox.persistentStorage);
    };
    Interpreter.prototype.loadAsString = function (savedState) {
        this.sandbox.persistentStorage = JSON.parse(savedState);
    };
    Interpreter.prototype.resumeFunction = function (functionName) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        var firstParameters;
        if (this.sandbox.parametersStack.length === 0) {
            firstParameters = [];
            this.sandbox.parametersStack.push(firstParameters);
        }
        else {
            firstParameters = this.sandbox.parametersStack[0];
        }
        for (var i = 0; i < parameters.length; i++) {
            if (Helper_1.Helper.isObject(parameters[i])) {
                var m = parameters[i];
                Helper_1.Helper.clear(m);
                Helper_1.Helper.putAll(m, firstParameters[i]);
            }
            else {
                if (i >= firstParameters.length) {
                    firstParameters.push(parameters[i]);
                }
                else {
                    firstParameters[i] = parameters[i];
                }
            }
        }
        return this.run();
    };
    return Interpreter;
}());
exports.Interpreter = Interpreter;
var COMMAND_LIST = [
    new CallFunc_1.CallFunc(),
    new Clone_1.Clone(),
    new Create_1.Create(),
    new Delete_1.Delete(),
    new Get_1.Get(),
    new JumpRel_1.JumpRel(),
    new Pull_1.Pull(),
    new Push_1.Push(),
    new Return_1.Return(),
    new Set_1.Set(),
    new Size_1.Size(),
    new ThrowError_1.ThrowError(),
    new Uint8ToBase64_1.Uint8ToBase64(),
    new Sha1_1.Sha1(),
    new Md5_1.Md5(),
    new Base64Encode_1.Base64Encode(),
    new StreamToString_1.StreamToString(),
    new StringToStream_1.StringToStream(),
    new MakeJoinedStream_1.MakeJoinedStream(),
    new MakeLimitedStream_1.MakeLimitedStream(),
    new RequestCall_1.RequestCall(),
    new Out_1.Out(),
    new AwaitCodeRedirect_1.AwaitCodeRedirect(),
    new GetMimeType_1.GetMimeType(),
    new Conditional_1.Conditional("if==than", function (compare) { return compare == 0; }, false),
    new Conditional_1.Conditional("if>=than", function (compare) { return compare >= 0; }, true),
    new Conditional_1.Conditional("if>than", function (compare) { return compare > 0; }, true),
    new Conditional_1.Conditional("if<=than", function (compare) { return compare <= 0; }, true),
    new Conditional_1.Conditional("if<than", function (compare) { return compare < 0; }, true),
    new Conditional_1.Conditional("if!=than", function (compare) { return compare != 0; }, false),
    new ThrowError_1.ThrowError(),
    new Parse_1.Parse(),
    new Stringify_1.Stringify(),
    new MathCombine_1.MathCombine("math.add", function (elements) { return elements.reduce(function (prev, curr) { return prev + curr; }); }),
    new MathCombine_1.MathCombine("math.multiply", function (elements) { return elements.reduce(function (prev, curr) { return prev * curr; }); }),
    new MathCombine_1.MathCombine("math.max", function (elements) { return elements.reduce(function (prev, curr) { return Math.max(prev, curr); }); }),
    new MathCombine_1.MathCombine("math.min", function (elements) { return elements.reduce(function (prev, curr) { return Math.min(prev, curr); }); }),
    new Floor_1.Floor(),
    new GetKeyArray_1.GetKeyArray(),
    new GetKeyValueArrays_1.GetKeyValueArrays(),
    new Concat_1.Concat(),
    new Format_1.Format(),
    new IndexOf_1.IndexOf(),
    new LastIndexOf_1.LastIndexOf(),
    new Split_1.Split(),
    new Substr_1.Substr(),
    new Substring_1.Substring(),
    new StringTransform_1.StringTransform("string.lowerCase", function (str) { return str.toLowerCase(); }),
    new StringTransform_1.StringTransform("string.upperCase", function (str) { return str.toUpperCase(); }),
    new StringTransform_1.StringTransform("string.urlEncode", function (str) { return encodeURIComponent(str).split("%20").join("+"); }),
    new StringTransform_1.StringTransform("string.urlDecode", function (str) { return decodeURIComponent(str.split("+").join("%20")); })
];
var COMMANDS = {};
for (var _i = 0, COMMAND_LIST_1 = COMMAND_LIST; _i < COMMAND_LIST_1.length; _i++) {
    var command = COMMAND_LIST_1[_i];
    COMMANDS[command.getIdentifier()] = command;
}
