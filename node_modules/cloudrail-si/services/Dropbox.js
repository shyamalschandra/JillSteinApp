"use strict";
var Interpreter_1 = require("../servicecode/Interpreter");
var Sandbox_1 = require("../servicecode/Sandbox");
var ErrorType_1 = require("../types/ErrorType");
var DetailErrors_1 = require("../errors/DetailErrors");
var InitSelfTest_1 = require("../servicecode/InitSelfTest");
var Statistics_1 = require("../statistics/Statistics");
var SERVICE_CODE = {
    "CloudStorage:getUserLogin": [
        ["callFunc", "User:about", "$P0"],
        ["set", "$P1", "$P0.userInfo.emailAddress"]
    ],
    "CloudStorage:getUserName": [
        ["callFunc", "User:about", "$P0"],
        ["set", "$P1", "$P0.userInfo.displayName"]
    ],
    "User:about": [
        ["if!=than", "$P0.userInfo", null, 4],
        ["create", "$L0", "Date"],
        ["math.add", "$L0", "$L0.Time", -1000],
        ["if>than", "$P0.userInfo.lastUpdate", "$L0", 1],
        ["return"],
        ["callFunc", "User:aboutRequest", "$P0"]
    ],
    "User:aboutRequest": [
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L0", "Object"],
        ["string.concat", "$L0.url", "https://api.dropboxapi.com/2/users/get_current_account"],
        ["create", "$L0.requestHeaders", "Object"],
        ["string.concat", "$L0.requestHeaders.Authorization", "Bearer ", "$S0.access_token"],
        ["set", "$L0.method", "POST"],
        ["http.requestCall", "$L2", "$L0"],
        ["json.parse", "$L3", "$L2.responseBody"],
        ["callFunc", "validateResponse", "$P0", "$L2"],
        ["create", "$P0.userInfo", "Object"],
        ["create", "$L4", "Date"],
        ["set", "$P0.userInfo.lastUpdate", "$L4.Time"],
        ["set", "$P0.userInfo.emailAddress", "$L3.email"],
        ["set", "$P0.userInfo.displayName", "$L3.name.display_name"]
    ],
    "CloudStorage:download": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "https://content.dropboxapi.com/2/files/download"],
        ["set", "$L0.method", "POST"],
        ["create", "$L1", "Object"],
        ["string.concat", "$L2", "Bearer ", "$S0.access_token"],
        ["set", "$L1.Authorization", "$L2"],
        ["create", "$L3", "Object"],
        ["set", "$L3.path", "$P2"],
        ["json.stringify", "$L4", "$L3"],
        ["set", "$L1.Dropbox-API-Arg", "$L4"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["http.requestCall", "$L5", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L5"],
        ["set", "$P1", "$L5.responseBody"]
    ],
    "CloudStorage:upload": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "checkNull", "$P0", "$P2"],
        ["callFunc", "checkPositive", "$P0", "$P3"],
        ["if==than", "$P4", 0, 1],
        ["callFunc", "checkFileExists", "$P0", "$P1"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["callFunc", "checkParentPathExists", "$P0", "$P1"],
        ["if<=than", "$P3", 10000000, 2],
        ["callFunc", "simpleUpload", "$P0", "$P2", "$P1", "$P4"],
        ["jumpRel", 1],
        ["callFunc", "chunkedUpload", "$P0", "$P2", "$P1", "$P3", "$P4"]
    ],
    "CloudStorage:move": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["callFunc", "checkParentPathExists", "$P0", "$P2"],
        ["create", "$L0", "Object"],
        ["set", "$L0.from_path", "$P1"],
        ["set", "$L0.to_path", "$P2"],
        ["callFunc", "standardJSONRequest", "$P0", "$L1", "$L0", "https://api.dropboxapi.com/2/files/move"]
    ],
    "CloudStorage:delete": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L0", "Object"],
        ["set", "$L0.path", "$P1"],
        ["callFunc", "standardJSONRequest", "$P0", "$L1", "$L0", "https://api.dropboxapi.com/2/files/delete"]
    ],
    "CloudStorage:copy": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["callFunc", "checkParentPathExists", "$P0", "$P2"],
        ["create", "$L0", "Object"],
        ["set", "$L0.from_path", "$P1"],
        ["set", "$L0.to_path", "$P2"],
        ["callFunc", "standardJSONRequest", "$P0", "$L1", "$L0", "https://api.dropboxapi.com/2/files/copy"]
    ],
    "CloudStorage:createFolder": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["callFunc", "checkParentPathExists", "$P0", "$P1"],
        ["create", "$L0", "Object"],
        ["set", "$L0.path", "$P1"],
        ["callFunc", "standardJSONRequest", "$P0", "$L1", "$L0", "https://api.dropboxapi.com/2/files/create_folder"]
    ],
    "CloudStorage:getMetadata": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["if==than", "$P2", "/", 2],
        ["create", "$L2", "Error", "Root does not have MetaData", "IllegalArgument"],
        ["throwError", "$L2"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L0", "Object"],
        ["set", "$L0.path", "$P2"],
        ["callFunc", "standardJSONRequest", "$P0", "$L1", "$L0", "https://api.dropboxapi.com/2/files/get_metadata"],
        ["callFunc", "makeMeta", "$P0", "$P1", "$L1"]
    ],
    "CloudStorage:getChildren": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["if==than", "$P2", "/", 1],
        ["set", "$P2", ""],
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$P1", "Array"],
        ["create", "$L0", "Object"],
        ["set", "$L0.path", "$P2"],
        ["callFunc", "standardJSONRequest", "$P0", "$L1", "$L0", "https://api.dropboxapi.com/2/files/list_folder"],
        ["callFunc", "processRawMeta", "$P0", "$P1", "$L1"],
        ["if==than", "$L1.has_more", 1, 5],
        ["create", "$L2", "Object"],
        ["set", "$L2.cursor", "$L1.cursor"],
        ["callFunc", "standardJSONRequest", "$P0", "$L1", "$L2", "https://api.dropboxapi.com/2/files/list_folder/continue"],
        ["callFunc", "processRawMeta", "$P0", "$P1", "$L1"],
        ["jumpRel", -6]
    ],
    "CloudStorage:exists": [
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L2", "Object"],
        ["set", "$L2.url", "https://api.dropboxapi.com/2/files/get_metadata"],
        ["set", "$L2.method", "POST"],
        ["create", "$L2.requestHeaders", "Object"],
        ["string.concat", "$L2.requestHeaders.Authorization", "Bearer ", "$S0.access_token"],
        ["set", "$L2.requestHeaders.Content-Type", "application/json"],
        ["create", "$L3", "Object"],
        ["set", "$L3.path", "$P2"],
        ["json.stringify", "$L3", "$L3"],
        ["stream.stringToStream", "$L2.requestBody", "$L3"],
        ["http.requestCall", "$L4", "$L2"],
        ["if==than", "$L4.code", 200, 2],
        ["set", "$P1", 1],
        ["return"],
        ["if<than", "$L4.code", 429, 5],
        ["json.parse", "$L0", "$L4.responseBody"],
        ["string.indexOf", "$L1", "$L0.error_summary", "not_found"],
        ["if!=than", "$L4", -1, 2],
        ["set", "$P1", 0],
        ["return"],
        ["callFunc", "validateResponse", "$P0", "$L4"]
    ],
    "Authenticating:login": [
        ["callFunc", "checkAuthentication", "$P0"]
    ],
    "Authenticating:logout": [
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "https://api.dropboxapi.com/2/auth/token/revoke"],
        ["set", "$L0.method", "POST"],
        ["create", "$L0.requestHeaders", "Object"],
        ["string.concat", "$L0.requestHeaders.Authorization", "Bearer ", "$S0.access_token"],
        ["http.requestCall", "$L1", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L1"],
        ["set", "$S0.access_token", null]
    ],
    "getAllocation": [
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["set", "$L1", "https://api.dropboxapi.com/2/users/get_space_usage"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "POST"],
        ["create", "$L0.requestHeaders", "Object"],
        ["string.concat", "$L0.requestHeaders.Authorization", "Bearer ", "$S0.access_token"],
        ["create", "$L4", "Object"],
        ["http.requestCall", "$L4", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L4"],
        ["create", "$L5", "Object"],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["create", "$L6", "SpaceAllocation"],
        ["set", "$L6.total", "$L5.allocation.allocated"],
        ["set", "$L6.used", "$L5.used"],
        ["set", "$P1", "$L6"]
    ],
    "createShareLink": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["if==than", "$P2", "/", 2],
        ["create", "$L2", "Error", "Cannot share root", "IllegalArgument"],
        ["throwError", "$L2"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["callFunc", "checkParentPathExists", "$P0", "$P2"],
        ["create", "$L0", "Object"],
        ["set", "$L0.path", "$P2"],
        ["callFunc", "standardJSONRequest", "$P0", "$L1", "$L0", "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings"],
        ["set", "$P1", "$L1.url"]
    ],
    "checkAuthentication": [
        ["if!=than", null, "$S0.access_token", 1],
        ["return"],
        ["string.concat", "$L0", "https://www.dropbox.com/oauth2/authorize?response_type=code&redirect_uri=", "$P0.redirectUri", "&client_id=", "$P0.clientId", "&state=", "$P0.state"],
        ["awaitCodeRedirect", "$L1", "$L0"],
        ["create", "$L2", "Object"],
        ["set", "$L2.url", "https://api.dropboxapi.com/oauth2/token"],
        ["set", "$L2.method", "POST"],
        ["create", "$L7", "Object"],
        ["set", "$L7.Content-Type", "application/x-www-form-urlencoded"],
        ["set", "$L2.requestHeaders", "$L7"],
        ["string.concat", "$L3", "code=", "$L1", "&grant_type=authorization_code", "&redirect_uri=", "$P0.redirectUri", "&client_id=", "$P0.clientId", "&client_secret=", "$P0.clientSecret"],
        ["stream.stringToStream", "$L4", "$L3"],
        ["set", "$L2.requestBody", "$L4"],
        ["http.requestCall", "$L5", "$L2"],
        ["callFunc", "validateResponse", "$P0", "$L5"],
        ["json.parse", "$L6", "$L5.responseBody"],
        ["set", "$S0.access_token", "$L6.access_token"]
    ],
    "standardJSONRequest": [
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "$P3"],
        ["set", "$L0.method", "POST"],
        ["create", "$L1", "Object"],
        ["string.concat", "$L2", "Bearer ", "$S0.access_token"],
        ["set", "$L1.Authorization", "$L2"],
        ["set", "$L1.Content-Type", "application/json"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["json.stringify", "$L3", "$P2"],
        ["stream.stringToStream", "$L4", "$L3"],
        ["set", "$L0.requestBody", "$L4"],
        ["http.requestCall", "$L5", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L5"],
        ["json.parse", "$L6", "$L5.responseBody"],
        ["set", "$P1", "$L6"]
    ],
    "makeMeta": [
        ["create", "$P1", "CloudMetaData"],
        ["set", "$P1.name", "$P2.name"],
        ["if!=than", "$P2.server_modified", null, 2],
        ["create", "$L1", "Date", "$P2.server_modified"],
        ["set", "$P1.modifiedAt", "$L1.time"],
        ["get", "$L0", "$P2", ".tag"],
        ["if==than", "$L0", "folder", 2],
        ["set", "$P1.folder", 1],
        ["jumpRel", 2],
        ["set", "$P1.folder", 0],
        ["set", "$P1.size", "$P2.size"],
        ["set", "$P1.path", "$P2.path_display"]
    ],
    "processRawMeta": [
        ["set", "$L0", "$P2.entries"],
        ["size", "$L1", "$L0"],
        ["math.add", "$L2", "$L1", -1],
        ["if>=than", "$L2", 0, 5],
        ["get", "$L3", "$L0", "$L2"],
        ["callFunc", "makeMeta", "$P0", "$L4", "$L3"],
        ["push", "$P1", "$L4"],
        ["math.add", "$L2", "$L2", -1],
        ["jumpRel", -6]
    ],
    "simpleUpload": [
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "https://content.dropboxapi.com/2/files/upload"],
        ["set", "$L0.method", "POST"],
        ["create", "$L1", "Object"],
        ["string.concat", "$L2", "Bearer ", "$S0.access_token"],
        ["set", "$L1.Authorization", "$L2"],
        ["set", "$L1.Content-Type", "application/octet-stream"],
        ["create", "$L3", "Object"],
        ["set", "$L3.path", "$P2"],
        ["if!=than", "$P3", 0, 1],
        ["set", "$L3.mode", "overwrite"],
        ["json.stringify", "$L4", "$L3"],
        ["set", "$L1.Dropbox-API-Arg", "$L4"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["set", "$L0.requestBody", "$P1"],
        ["http.requestCall", "$L5", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L5"]
    ],
    "chunkedUpload": [
        ["stream.makeLimitedStream", "$L0", "$P1", 10000000],
        ["callFunc", "chunkedStart", "$P0", "$L1", "$L0"],
        ["math.add", "$L2", "$P3", -10000000],
        ["set", "$L5", 10000000],
        ["if>than", "$L2", 10000000, 7],
        ["stream.makeLimitedStream", "$L3", "$P1", 10000000],
        ["callFunc", "chunkedAppend", "$P0", "$L3", "$L1", "$L5"],
        ["math.add", "$L4", "$L2", -10000000],
        ["set", "$L2", "$L4"],
        ["math.add", "$L6", "$L5", 10000000],
        ["set", "$L5", "$L6"],
        ["jumpRel", -8],
        ["callFunc", "chunkedFinish", "$P0", "$P1", "$P2", "$L1", "$L5", "$P4"]
    ],
    "chunkedStart": [
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "https://content.dropboxapi.com/2/files/upload_session/start"],
        ["set", "$L0.method", "POST"],
        ["create", "$L1", "Object"],
        ["string.concat", "$L2", "Bearer ", "$S0.access_token"],
        ["set", "$L1.Authorization", "$L2"],
        ["set", "$L1.Content-Type", "application/octet-stream"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["set", "$L0.requestBody", "$P2"],
        ["http.requestCall", "$L3", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L3"],
        ["json.parse", "$L4", "$L3.responseBody"],
        ["set", "$P1", "$L4.session_id"]
    ],
    "chunkedAppend": [
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "https://content.dropboxapi.com/2/files/upload_session/append_v2"],
        ["set", "$L0.method", "POST"],
        ["create", "$L1", "Object"],
        ["string.concat", "$L2", "Bearer ", "$S0.access_token"],
        ["set", "$L1.Authorization", "$L2"],
        ["set", "$L1.Content-Type", "application/octet-stream"],
        ["create", "$L3", "Object"],
        ["set", "$L3.session_id", "$P2"],
        ["set", "$L3.offset", "$P3"],
        ["create", "$L7", "Object"],
        ["set", "$L7.cursor", "$L3"],
        ["json.stringify", "$L4", "$L7"],
        ["set", "$L1.Dropbox-API-Arg", "$L4"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["set", "$L0.requestBody", "$P1"],
        ["http.requestCall", "$L5", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L5"]
    ],
    "chunkedFinish": [
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "https://content.dropboxapi.com/2/files/upload_session/finish"],
        ["set", "$L0.method", "POST"],
        ["create", "$L1", "Object"],
        ["string.concat", "$L2", "Bearer ", "$S0.access_token"],
        ["set", "$L1.Authorization", "$L2"],
        ["set", "$L1.Content-Type", "application/octet-stream"],
        ["create", "$L3", "Object"],
        ["set", "$L3.session_id", "$P3"],
        ["set", "$L3.offset", "$P4"],
        ["create", "$L8", "Object"],
        ["if!=than", "$P5", 0, 1],
        ["set", "$L8.mode", "overwrite"],
        ["set", "$L8.path", "$P2"],
        ["create", "$L7", "Object"],
        ["set", "$L7.cursor", "$L3"],
        ["set", "$L7.commit", "$L8"],
        ["json.stringify", "$L4", "$L7"],
        ["set", "$L1.Dropbox-API-Arg", "$L4"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["set", "$L0.requestBody", "$P1"],
        ["http.requestCall", "$L5", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L5"]
    ],
    "validatePath": [
        ["if==than", "$P1", null, 2],
        ["create", "$L0", "Error", "Path shouldn't be null", "IllegalArgument"],
        ["throwError", "$L0"],
        ["if==than", "$P1", "", 2],
        ["create", "$L0", "Error", "Path should start with '/'.", "IllegalArgument"],
        ["throwError", "$L0"],
        ["create", "$L0", "String"],
        ["string.substr", "$L0", "$P1", 0, 1],
        ["if!=than", "$L0", "/", 2],
        ["create", "$L0", "Error", "Path should start with '/'.", "IllegalArgument"],
        ["throwError", "$L0"],
        ["create", "$L1", "Number"],
        ["size", "$L1", "$P1"],
        ["math.add", "$L1", "$L1", -1],
        ["if!=than", "$L1", 0, 5],
        ["create", "$L2", "String"],
        ["string.substr", "$L2", "$P1", "$L1", 1],
        ["if==than", "$L2", "/", 2],
        ["create", "$L3", "Error", "Path should not end with '/'.", "IllegalArgument"],
        ["throwError", "$L3"]
    ],
    "checkNull": [
        ["if==than", "$P1", null, 2],
        ["create", "$L0", "Error", "Passed argument is null.", "IllegalArgument"],
        ["throwError", "$L0"]
    ],
    "checkPositive": [
        ["if<than", "$P1", 0, 2],
        ["create", "$L0", "Error", "Passed argument should be bigger than 0.", "IllegalArgument"],
        ["throwError", "$L0"]
    ],
    "validateResponse": [
        ["if>=than", "$P1.code", 400, 27],
        ["if==than", "$P1.code", 400, 3],
        ["stream.streamToString", "$L2", "$P1.responseBody"],
        ["create", "$L3", "Error", "$L2", "Http"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 401, 3],
        ["stream.streamToString", "$L2", "$P1.responseBody"],
        ["create", "$L3", "Error", "$L2", "Authentication"],
        ["throwError", "$L3"],
        ["if>=than", "$P1.code", 500, 6],
        ["stream.streamToString", "$L2", "$P1.responseBody"],
        ["if==than", "$P1.code", 503, 2],
        ["create", "$L3", "Error", "$L2", "ServiceUnavailable"],
        ["throwError", "$L3"],
        ["create", "$L3", "Error", "$L2", "Authentication"],
        ["throwError", "$L3"],
        ["json.parse", "$L0", "$P1.responseBody"],
        ["set", "$L2", "$L0.error_summary"],
        ["string.indexOf", "$L4", "$L0.error_summary", "not_found"],
        ["if>=than", "$P1.code", 402, 5],
        ["if<=than", "$P1.code", 509, 4],
        ["if!=than", "$P1.code", 503, 3],
        ["if==than", "$L4", -1, 2],
        ["create", "$L3", "Error", "$L2", "Http"],
        ["throwError", "$L3"],
        ["if!=than", "$L4", -1, 2],
        ["create", "$L3", "Error", "$L2", "NotFound"],
        ["throwError", "$L3"]
    ],
    "checkParentPathExists": [
        ["string.lastIndexOf", "$L0", "$P1", "/"],
        ["string.substring", "$L1", "$P1", 0, "$L0"],
        ["if==than", "$L1", "", 1],
        ["return"],
        ["create", "$L2", "Object"],
        ["set", "$L2.url", "https://api.dropboxapi.com/2/files/get_metadata"],
        ["set", "$L2.method", "POST"],
        ["create", "$L2.requestHeaders", "Object"],
        ["string.concat", "$L2.requestHeaders.Authorization", "Bearer ", "$S0.access_token"],
        ["set", "$L2.requestHeaders.Content-Type", "application/json"],
        ["create", "$L3", "Object"],
        ["set", "$L3.path", "$L1"],
        ["json.stringify", "$L3", "$L3"],
        ["stream.stringToStream", "$L2.requestBody", "$L3"],
        ["http.requestCall", "$L4", "$L2"],
        ["if!=than", "$L4.code", 200, 2],
        ["create", "$L5", "Error", "Target folder not found.", "NotFound"],
        ["throwError", "$L5"]
    ],
    "checkFileExists": [
        ["create", "$L2", "Object"],
        ["set", "$L2.url", "https://api.dropboxapi.com/2/files/get_metadata"],
        ["set", "$L2.method", "POST"],
        ["create", "$L2.requestHeaders", "Object"],
        ["string.concat", "$L2.requestHeaders.Authorization", "Bearer ", "$S0.access_token"],
        ["set", "$L2.requestHeaders.Content-Type", "application/json"],
        ["create", "$L3", "Object"],
        ["set", "$L3.path", "$P1"],
        ["json.stringify", "$L3", "$L3"],
        ["stream.stringToStream", "$L2.requestBody", "$L3"],
        ["http.requestCall", "$L4", "$L2"],
        ["if==than", "$L4.code", 200, 2],
        ["create", "$L5", "Error", "File already exists.", "Http"],
        ["throwError", "$L5"]
    ]
};
var Dropbox = (function () {
    function Dropbox(redirectReceiver, clientId, clientSecret, redirectUri, state) {
        this.interpreterStorage = {};
        this.persistentStorage = [{}];
        this.instanceDependencyStorage = {
            redirectReceiver: redirectReceiver
        };
        InitSelfTest_1.InitSelfTest.initTest("Dropbox");
        this.interpreterStorage["clientId"] = clientId;
        this.interpreterStorage["clientSecret"] = clientSecret;
        this.interpreterStorage["redirectUri"] = redirectUri;
        this.interpreterStorage["state"] = state;
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        if (SERVICE_CODE["init"]) {
            ip.callFunctionSync("init", this.interpreterStorage);
        }
    }
    Dropbox.prototype.download = function (filePath, callback) {
        Statistics_1.Statistics.addCall("Dropbox", "download");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:download", this.interpreterStorage, null, filePath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "download");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.upload = function (filePath, stream, size, overwrite, callback) {
        Statistics_1.Statistics.addCall("Dropbox", "upload");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:upload", this.interpreterStorage, filePath, stream, size, overwrite ? 1 : 0).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "upload");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.move = function (sourcePath, destinationPath, callback) {
        Statistics_1.Statistics.addCall("Dropbox", "move");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:move", this.interpreterStorage, sourcePath, destinationPath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "move");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.delete = function (filePath, callback) {
        Statistics_1.Statistics.addCall("Dropbox", "delete");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:delete", this.interpreterStorage, filePath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "delete");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.copy = function (sourcePath, destinationPath, callback) {
        Statistics_1.Statistics.addCall("Dropbox", "copy");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:copy", this.interpreterStorage, sourcePath, destinationPath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "copy");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.createFolder = function (folderPath, callback) {
        Statistics_1.Statistics.addCall("Dropbox", "createFolder");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:createFolder", this.interpreterStorage, folderPath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "createFolder");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.getMetadata = function (filePath, callback) {
        Statistics_1.Statistics.addCall("Dropbox", "getMetadata");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:getMetadata", this.interpreterStorage, null, filePath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "getMetadata");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.getChildren = function (folderPath, callback) {
        Statistics_1.Statistics.addCall("Dropbox", "getChildren");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:getChildren", this.interpreterStorage, null, folderPath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "getChildren");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.getUserLogin = function (callback) {
        Statistics_1.Statistics.addCall("Dropbox", "getUserLogin");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:getUserLogin", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "getUserLogin");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.getUserName = function (callback) {
        Statistics_1.Statistics.addCall("Dropbox", "getUserName");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:getUserName", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "getUserName");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.createShareLink = function (path, callback) {
        Statistics_1.Statistics.addCall("Dropbox", "createShareLink");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("createShareLink", this.interpreterStorage, null, path).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "createShareLink");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.getAllocation = function (callback) {
        Statistics_1.Statistics.addCall("Dropbox", "getAllocation");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getAllocation", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "getAllocation");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.exists = function (path, callback) {
        Statistics_1.Statistics.addCall("Dropbox", "exists");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:exists", this.interpreterStorage, null, path).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "exists");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            res = !!ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.login = function (callback) {
        Statistics_1.Statistics.addCall("Dropbox", "login");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Authenticating:login", this.interpreterStorage).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "login");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.logout = function (callback) {
        Statistics_1.Statistics.addCall("Dropbox", "logout");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Authenticating:logout", this.interpreterStorage).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("Dropbox", "logout");
                switch (error.getErrorType()) {
                    case ErrorType_1.ErrorType.ILLEGAL_ARGUMENT:
                        throw new DetailErrors_1.IllegalArgumentError(error.toString());
                    case ErrorType_1.ErrorType.AUTHENTICATION:
                        throw new DetailErrors_1.AuthenticationError(error.toString());
                    case ErrorType_1.ErrorType.NOT_FOUND:
                        throw new DetailErrors_1.NotFoundError(error.toString());
                    case ErrorType_1.ErrorType.HTTP:
                        throw new DetailErrors_1.HttpError(error.toString());
                    case ErrorType_1.ErrorType.SERVICE_UNAVAILABLE:
                        throw new DetailErrors_1.ServiceUnavailableError(error.toString());
                    default:
                        throw new Error(error.toString());
                }
            }
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Dropbox.prototype.saveAsString = function () {
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        return ip.saveAsString();
    };
    Dropbox.prototype.loadAsString = function (savedState) {
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.loadAsString(savedState);
        this.persistentStorage = sandbox.persistentStorage;
    };
    Dropbox.prototype.resumeLogin = function (executionState, callback) {
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        sandbox.loadStateFromString(executionState);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.resumeFunction("Authenticating:login", this.interpreterStorage).then(function () { return callback(undefined); }, function (err) { return callback(err); });
    };
    return Dropbox;
}());
exports.Dropbox = Dropbox;
