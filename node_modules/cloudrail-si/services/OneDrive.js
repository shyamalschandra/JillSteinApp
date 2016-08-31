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
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["create", "$L0", "Object"],
        ["string.concat", "$L0.url", "https://apis.live.net/v5.0/me?access_token=", "$L30"],
        ["set", "$L0.method", "GET"],
        ["http.requestCall", "$L2", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L2"],
        ["json.parse", "$L3", "$L2.responseBody"],
        ["create", "$P0.userInfo", "Object"],
        ["create", "$L4", "Date"],
        ["set", "$P0.userInfo.lastUpdate", "$L4.Time"],
        ["set", "$P0.userInfo.emailAddress", "$L3.emails.account"],
        ["set", "$P0.userInfo.displayName", "$L3.name"]
    ],
    "init": [
        ["string.urlEncode", "$P0.redirectUri", "$P0.redirectUri"]
    ],
    "uploadSC": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "checkNull", "$P0", "$P2"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["if<=than", "$P3", 10000000, 2],
        ["callFunc", "simpleUpload", "$P0", "$P1", "$P2", "$P3", "$P4"],
        ["jumpRel", 1],
        ["callFunc", "chunkedUpload", "$P0", "$P2", "$P1", "$P3", "$P4"]
    ],
    "downloadSC": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["string.urlEncode", "$P2", "$P2"],
        ["string.concat", "$L1", "https://api.onedrive.com/v1.0/drive/root:", "$P2", ":/content?access_token=", "$L30"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["http.requestCall", "$L3", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L3"],
        ["set", "$P1", "$L3.responseBody"]
    ],
    "moveSC": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["create", "$L2", "Object"],
        ["create", "$L3", "Object"],
        ["create", "$L4", "String"],
        ["create", "$L5", "String"],
        ["create", "$L7", "Object"],
        ["set", "$L7.Content-Type", "application/json"],
        ["set", "$L7.X-HTTP-METHOD-OVERRIDE", "PATCH"],
        ["string.urlEncode", "$L20", "$P1"],
        ["string.concat", "$L1", "https://api.onedrive.com/v1.0/drive/root:", "$L20", "?access_token=", "$L30"],
        ["set", "$L22", "$P2"],
        ["set", "$L39", "$P2"],
        ["callFunc", "checkIfPathExists", "$P0", "$L24", "$L22", "$L30"],
        ["if==than", "$L24", "true", 2],
        ["create", "$L25", "Error", "Destination path already exists.", "Http"],
        ["throwError", "$L25"],
        ["callFunc", "getParentPath", "$P0", "$L21", "$L39"],
        ["set", "$L27", "$L21"],
        ["callFunc", "checkIfPathExists", "$P0", "$L28", "$L27", "$L30"],
        ["if==than", "$L28", "false", 2],
        ["create", "$L31", "Error", "The parent path of the destination folder doesn't exist.", "NotFound"],
        ["throwError", "$L31"],
        ["callFunc", "getItemNameFromPath", "$P0", "$L23", "$P2"],
        ["if==than", "$L21", "/", 2],
        ["set", "$L4", "/drive/root"],
        ["jumpRel", 1],
        ["string.concat", "$L4", "/drive/root:", "$L21"],
        ["set", "$L3.path", "$L4"],
        ["set", "$L2.parentReference", "$L3"],
        ["set", "$L2.name", "$L23"],
        ["json.stringify", "$L5", "$L2"],
        ["size", "$L19", "$L5"],
        ["string.concat", "$L7.Content-Length", "$L19"],
        ["stream.stringToStream", "$L6", "$L5"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "POST"],
        ["set", "$L0.requestHeaders", "$L7"],
        ["set", "$L0.requestBody", "$L6"],
        ["http.requestCall", "$L8", "$L0"],
        ["if==than", "$L8.code", 400, 2],
        ["create", "$L20", "Error", "Item does not exist", "NotFound"],
        ["throwError", "$L20"],
        ["callFunc", "validateResponse", "$P0", "$L8"]
    ],
    "deleteSC": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["string.urlEncode", "$P1", "$P1"],
        ["string.concat", "$L1", "https://api.onedrive.com/v1.0/drive/root:", "$P1", "?access_token=", "$L30"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "DELETE"],
        ["http.requestCall", "$L2", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L2"]
    ],
    "copySC": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["create", "$L2", "Object"],
        ["create", "$L3", "Object"],
        ["create", "$L4", "String"],
        ["create", "$L5", "String"],
        ["create", "$L7", "Object"],
        ["set", "$L7.Content-Type", "application/json"],
        ["set", "$L7.Prefer", "respond-async"],
        ["string.urlEncode", "$L20", "$P1"],
        ["string.concat", "$L1", "https://api.onedrive.com/v1.0/drive/root:", "$L20", ":/action.copy", "?access_token=", "$L30"],
        ["set", "$L22", "$P2"],
        ["set", "$L39", "$P2"],
        ["callFunc", "checkIfPathExists", "$P0", "$L24", "$L22", "$L30"],
        ["if==than", "$L24", "true", 2],
        ["create", "$L25", "Error", "Destination path already exists.", "Http"],
        ["throwError", "$L25"],
        ["callFunc", "getParentPath", "$P0", "$L21", "$L39"],
        ["set", "$L27", "$L21"],
        ["callFunc", "checkIfPathExists", "$P0", "$L28", "$L27", "$L30"],
        ["if==than", "$L28", "false", 2],
        ["create", "$L31", "Error", "The parent path of the destination folder doesn't exist.", "NotFound"],
        ["throwError", "$L31"],
        ["callFunc", "getItemNameFromPath", "$P0", "$L23", "$P2"],
        ["if==than", "$L21", "/", 1],
        ["set", "$L21", ""],
        ["string.concat", "$L4", "/drive/root:", "$L21"],
        ["set", "$L3.path", "$L4"],
        ["set", "$L2.parentReference", "$L3"],
        ["callFunc", "getItemNameFromPath", "$P0", "$L9", "$P1"],
        ["set", "$L2.name", "$L23"],
        ["json.stringify", "$L5", "$L2"],
        ["size", "$L19", "$L5"],
        ["string.concat", "$L7.Content-Length", "$L19"],
        ["stream.stringToStream", "$L6", "$L5"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "POST"],
        ["set", "$L0.requestHeaders", "$L7"],
        ["set", "$L0.requestBody", "$L6"],
        ["http.requestCall", "$L8", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L8"]
    ],
    "createFolderSC": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["set", "$L9", "$P1"],
        ["callFunc", "getParentPath", "$P0", "$L27", "$P1"],
        ["callFunc", "checkIfPathExists", "$P0", "$L10", "$L27"],
        ["if==than", "$L10", "false", 2],
        ["create", "$L31", "Error", "Parent path does not exist.", "NotFound"],
        ["throwError", "$L31"],
        ["callFunc", "checkIfPathExists", "$P0", "$L10", "$L9", "$L30"],
        ["if==than", "$L10", "true", 2],
        ["create", "$L31", "Error", "Folder already exists.", "Http"],
        ["throwError", "$L31"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["create", "$L2", "String"],
        ["create", "$L3", "String"],
        ["set", "$L15", "$P1"],
        ["set", "$L16", "$P1"],
        ["callFunc", "getParentPath", "$P0", "$L2", "$L15"],
        ["string.urlEncode", "$L2", "$L2"],
        ["callFunc", "getItemNameFromPath", "$P0", "$L3", "$L16"],
        ["string.concat", "$L1", "https://api.onedrive.com/v1.0/drive/root:", "$L2", ":/children?access_token=", "$L30"],
        ["create", "$L4", "Object"],
        ["set", "$L4.Content-Type", "application/json"],
        ["create", "$L5", "Object"],
        ["set", "$L5.name", "$L3"],
        ["create", "$L20", "Object"],
        ["set", "$L5.folder", "$L20"],
        ["json.stringify", "$L6", "$L5"],
        ["size", "$L19", "$L6"],
        ["string.concat", "$L4.Content-Length", "$L19"],
        ["stream.stringToStream", "$L7", "$L6"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "POST"],
        ["set", "$L0.requestHeaders", "$L4"],
        ["set", "$L0.requestBody", "$L7"],
        ["http.requestCall", "$L8", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L8"]
    ],
    "getMetadataSC": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["if==than", "$P2", "/", 2],
        ["create", "$L31", "Error", "You cannot take metadata from the root folder", "IllegalArgument"],
        ["throwError", "$L31"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["callFunc", "getMetadataFromPath", "$P0", "$P1", "$P2", "$L30"]
    ],
    "getChildrenSC": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["string.urlEncode", "$L28", "$P2"],
        ["string.concat", "$L1", "https://api.onedrive.com/v1.0/drive/root:", "$L28"],
        ["string.concat", "$L1", "$L1", ":/children?access_token=", "$L30"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["create", "$L4", "Object"],
        ["http.requestCall", "$L4", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L4"],
        ["create", "$L5", "Object"],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["create", "$L6", "Array"],
        ["create", "$L7", "Number", 0],
        ["create", "$L8", "Number", 0],
        ["size", "$L8", "$L5.value"],
        ["if<than", "$L7", "$L8", 18],
        ["create", "$L9", "CloudMetaData"],
        ["get", "$L10", "$L5.value", "$L7"],
        ["set", "$L9.Name", "$L10.name"],
        ["set", "$L9.Size", "$L10.size"],
        ["if!=than", "$L10.lastModifiedDateTime", null, 2],
        ["create", "$L20", "Date", "$L10.lastModifiedDateTime"],
        ["set", "$L9.modifiedAt", "$L20.time"],
        ["if==than", "$L10.folder", null, 2],
        ["set", "$L9.Folder", 0],
        ["jumpRel", 1],
        ["set", "$L9.Folder", 1],
        ["if==than", "$P2", "/", 2],
        ["string.concat", "$L9.Path", "$P2", "$L9.Name"],
        ["jumpRel", 1],
        ["string.concat", "$L9.Path", "$P2", "/", "$L9.Name"],
        ["push", "$L6", "$L9"],
        ["math.add", "$L7", "$L7", 1],
        ["jumpRel", -19],
        ["set", "$P1", "$L6"]
    ],
    "getAllocation": [
        ["callFunc", "checkAuth", "$P0", "$L10"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["string.concat", "$L1", "https://api.onedrive.com/v1.0/drive", "?access_token=", "$L10"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["create", "$L4", "Object"],
        ["http.requestCall", "$L4", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L4"],
        ["create", "$L5", "Object"],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["create", "$L6", "SpaceAllocation"],
        ["set", "$L6.total", "$L5.quota.total"],
        ["set", "$L6.used", "$L5.quota.used"],
        ["set", "$P1", "$L6"]
    ],
    "createShareLink": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["if==than", "$P2", "/", 2],
        ["create", "$L2", "Error", "Cannot share root", "IllegalArgument"],
        ["throwError", "$L2"],
        ["callFunc", "checkAuth", "$P0", "$L12"],
        ["set", "$L9", "$P2"],
        ["callFunc", "getParentPath", "$P0", "$L27", "$L9"],
        ["callFunc", "checkIfPathExists", "$P0", "$L10", "$L27"],
        ["if==than", "$L10", "false", 2],
        ["create", "$L31", "Error", "Parent path does not exist.", "NotFound"],
        ["throwError", "$L31"],
        ["set", "$L0", "$P2"],
        ["string.urlEncode", "$L0", "$L0"],
        ["string.concat", "$L1", "https://api.onedrive.com/v1.0/drive/root:", "$L0", ":/action.createLink", "?access_token=", "$L12"],
        ["create", "$L3", "Object"],
        ["set", "$L3.type", "view"],
        ["json.stringify", "$L3", "$L3"],
        ["stream.stringToStream", "$L3", "$L3"],
        ["create", "$L7", "Object"],
        ["set", "$L7.Content-Type", "application/json"],
        ["create", "$L2", "Object"],
        ["set", "$L2.url", "$L1"],
        ["set", "$L2.method", "POST"],
        ["set", "$L2.requestHeaders", "$L7"],
        ["set", "$L2.requestBody", "$L3"],
        ["http.requestCall", "$L4", "$L2"],
        ["callFunc", "validateResponse", "$P0", "$L4"],
        ["create", "$L5", "Object"],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["set", "$P1", "$L5.link.webUrl"]
    ],
    "exists": [
        ["callFunc", "checkAuth", "$P0", "$L12"],
        ["callFunc", "checkIfPathExists", "$P0", "$L0", "$P2"],
        ["if==than", "$L0", "true", 2],
        ["set", "$P1", 1],
        ["return"],
        ["set", "$P1", 0]
    ],
    "Authenticating:login": [
        ["callFunc", "checkAuth", "$P0", "$L0"]
    ],
    "Authenticating:logout": [
        ["set", "$S0.accessToken", null]
    ],
    "getParentPath": [
        ["create", "$L0", "Number"],
        ["string.lastIndexOf", "$L0", "$P2", "/"],
        ["if==than", "$L0", 0, 2],
        ["set", "$P1", "/"],
        ["return"],
        ["string.substring", "$P1", "$P2", 0, "$L0"]
    ],
    "checkNull": [
        ["if==than", "$P1", null, 2],
        ["create", "$L0", "Error", "Passed argument is null.", "IllegalArgument"],
        ["throwError", "$L0"]
    ],
    "getItemNameFromPath": [
        ["create", "$L0", "Array"],
        ["create", "$L1", "String"],
        ["string.split", "$L0", "$P2", "/"],
        ["size", "$L2", "$L0"],
        ["math.add", "$L3", "$L2", -1],
        ["get", "$L1", "$L0", "$L3"],
        ["set", "$P1", "$L1"]
    ],
    "getMetadataFromPath": [
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["string.urlEncode", "$L10", "$P2"],
        ["string.concat", "$L1", "https://api.onedrive.com/v1.0/drive/root:", "$L10", "?access_token=", "$P3"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["create", "$L4", "Object"],
        ["http.requestCall", "$L4", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L4"],
        ["create", "$L5", "Object"],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["set", "$P1", "$L5"],
        ["create", "$P1", "CloudMetaData"],
        ["set", "$P1.Name", "$L5.name"],
        ["set", "$P1.Size", "$L5.size"],
        ["if!=than", "$L5.lastModifiedDateTime", null, 2],
        ["create", "$L10", "Date", "$L5.lastModifiedDateTime"],
        ["set", "$P1.modifiedAt", "$L10.time"],
        ["if==than", "$L5.folder", null, 2],
        ["set", "$P1.Folder", 0],
        ["jumpRel", 1],
        ["set", "$P1.Folder", 1],
        ["set", "$P1.Path", "$P2"]
    ],
    "checkIfPathExists": [
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["string.urlEncode", "$L22", "$P2"],
        ["string.concat", "$L1", "https://api.onedrive.com/v1.0/drive/root:", "$L22", "?access_token=", "$S0.accessToken"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["create", "$L4", "Object"],
        ["http.requestCall", "$L4", "$L0"],
        ["if==than", "$L4.code", 200, 2],
        ["set", "$P1", "true"],
        ["jumpRel", 1],
        ["set", "$P1", "false"]
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
    "validateResponse": [
        ["if>=than", "$P1.code", 400, 21],
        ["json.parse", "$L0", "$P1.responseBody"],
        ["set", "$L1", "$L0.error"],
        ["set", "$L2", "$L1.message"],
        ["if==than", "$P1.code", 401, 2],
        ["create", "$L3", "Error", "$L2", "Authentication"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 400, 2],
        ["create", "$L3", "Error", "$L2", "Http"],
        ["throwError", "$L3"],
        ["if>=than", "$P1.code", 402, 5],
        ["if<=than", "$P1.code", 509, 4],
        ["if!=than", "$P1.code", 503, 3],
        ["if!=than", "$P1.code", 404, 2],
        ["create", "$L3", "Error", "$L2", "Http"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 503, 2],
        ["create", "$L3", "Error", "$L2", "ServiceUnavailable"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 404, 2],
        ["create", "$L3", "Error", "$L2", "NotFound"],
        ["throwError", "$L3"]
    ],
    "simpleUpload": [
        ["create", "$L0", "Number"],
        ["string.lastIndexOf", "$L0", "$P1", "/"],
        ["if!=than", "$L0", 0, 5],
        ["string.substring", "$L1", "$P1", 0, "$L0"],
        ["callFunc", "checkIfPathExists", "$P0", "$L2", "$L1"],
        ["if==than", "$L2", "false", 2],
        ["create", "$L3", "Error", "Path does not exist.", "NotFound"],
        ["throwError", "$L3"],
        ["create", "$L0", "Object"],
        ["string.urlEncode", "$P1", "$P1"],
        ["string.concat", "$L20", "https://api.onedrive.com/v1.0/drive/root:", "$P1", ":/content"],
        ["if==than", "$P4", 0, 1],
        ["string.concat", "$L20", "$L20", "?%40name.conflictBehavior=fail"],
        ["set", "$L0.url", "$L20"],
        ["set", "$L0.method", "PUT"],
        ["create", "$L1", "Object"],
        ["string.concat", "$L2", "Bearer ", "$S0.accessToken"],
        ["set", "$L1.Authorization", "$L2"],
        ["set", "$L1.Content-Type", "text/plain"],
        ["string.concat", "$L1.Content-Length", "$P3"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["set", "$L0.requestBody", "$P2"],
        ["http.requestCall", "$L5", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L5"]
    ],
    "chunkedUpload": [
        ["callFunc", "getUploadSessionUrl", "$P0", "$L1", "$P2", "$P4"],
        ["set", "$L10", 9830400],
        ["set", "$L11", -9830400],
        ["stream.makeLimitedStream", "$L0", "$P1", "$L10"],
        ["callFunc", "chunkedStart", "$P0", "$L1", "$L0", "$P3"],
        ["math.add", "$L2", "$P3", "$L11"],
        ["set", "$L5", "$L10"],
        ["if>than", "$L2", "$L10", 7],
        ["stream.makeLimitedStream", "$L3", "$P1", "$L10"],
        ["callFunc", "chunkedAppend", "$P0", "$L3", "$L1", "$L5", "$P3"],
        ["math.add", "$L4", "$L2", "$L11"],
        ["set", "$L2", "$L4"],
        ["math.add", "$L6", "$L5", "$L10"],
        ["set", "$L5", "$L6"],
        ["jumpRel", -8],
        ["callFunc", "chunkedFinish", "$P0", "$P1", "$L1", "$L5", "$P3"]
    ],
    "getUploadSessionUrl": [
        ["create", "$L0", "Object"],
        ["string.urlEncode", "$L15", "$P2"],
        ["string.concat", "$L1", "https://api.onedrive.com/v1.0/drive/root:", "$L15", ":/upload.createSession?access_token=", "$S0.accessToken"],
        ["create", "$L2", "Object"],
        ["set", "$L2.Content-Type", "application/json"],
        ["create", "$L3", "Object"],
        ["create", "$L4", "Object"],
        ["callFunc", "getItemNameFromPath", "$P0", "$L5", "$P2"],
        ["set", "$L4.name", "$L5"],
        ["if==than", "$P3", 0, 1],
        ["set", "$L4", "fail", "@name.conflictBehavior"],
        ["set", "$L3.item", "$L4"],
        ["json.stringify", "$L6", "$L3"],
        ["stream.stringToStream", "$L7", "$L6"],
        ["size", "$L19", "$L6"],
        ["string.concat", "$L2.Content-Length", "$L19"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "POST"],
        ["set", "$L0.requestBody", "$L7"],
        ["set", "$L0.requestHeaders", "$L2"],
        ["http.requestCall", "$L8", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L8"],
        ["stream.streamToString", "$L9", "$L8.responseBody"],
        ["json.parse", "$L10", "$L9"],
        ["set", "$P1", "$L10.uploadUrl"]
    ],
    "chunkedStart": [
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "$P1"],
        ["set", "$L0.method", "PUT"],
        ["create", "$L1", "Object"],
        ["set", "$L1.Content-Length", "9830400"],
        ["string.concat", "$L10", "bytes ", 0, "-", "9830399", "/", "$P3"],
        ["set", "$L1.Content-Range", "$L10"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["set", "$L0.requestBody", "$P2"],
        ["http.requestCall", "$L3", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L3"]
    ],
    "chunkedAppend": [
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "$P2"],
        ["set", "$L0.method", "PUT"],
        ["create", "$L1", "Object"],
        ["math.add", "$L20", 9830399, "$P3"],
        ["string.concat", "$L21", "bytes ", "$P3", "-", "$L20", "/", "$P4"],
        ["set", "$L1.Content-Length", "9830400"],
        ["set", "$L1.Content-Range", "$L21"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["set", "$L0.requestBody", "$P1"],
        ["http.requestCall", "$L5", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L5"]
    ],
    "chunkedFinish": [
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "$P2"],
        ["set", "$L0.method", "PUT"],
        ["create", "$L1", "Object"],
        ["math.multiply", "$L20", "$P3", -1],
        ["math.add", "$L21", "$P4", "$L20"],
        ["math.add", "$L23", "$P4", -1],
        ["string.concat", "$L22", "bytes ", "$P3", "-", "$L23", "/", "$P4"],
        ["string.concat", "$L21", "$L21"],
        ["set", "$L1.Content-Length", "$L21"],
        ["set", "$L1.Content-Range", "$L22"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["set", "$L0.requestBody", "$P1"],
        ["http.requestCall", "$L5", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L5"]
    ],
    "checkAuth": [
        ["create", "$L0", "Date"],
        ["if==than", "$S0.accessToken", null, 2],
        ["callFunc", "authenticate", "$P0", "$P1", "accessToken"],
        ["return"],
        ["create", "$L1", "Date"],
        ["set", "$L1.time", "$S0.expireIn"],
        ["if<than", "$L1", "$L0", 2],
        ["callFunc", "authenticate", "$P0", "$P1", "refreshToken"],
        ["return"],
        ["set", "$P1", "$S0.accessToken"]
    ],
    "authenticate": [
        ["create", "$L2", "String"],
        ["if==than", "$P2", "accessToken", 4],
        ["string.concat", "$L0", "https://login.live.com/oauth20_authorize.srf?client_id=", "$P0.clientID", "&scope=", "wl.signin%20wl.emails%20wl.offline_access%20onedrive.readwrite", "&response_type=code&redirect_uri=", "$P0.redirectUri"],
        ["awaitCodeRedirect", "$L1", "$L0"],
        ["string.concat", "$L2", "client_id=", "$P0.clientID", "&redirect_uri=", "$P0.redirectUri", "&client_secret=", "$P0.clientSecret", "&code=", "$L1", "&grant_type=authorization_code"],
        ["jumpRel", 1],
        ["string.concat", "$L2", "client_id=", "$P0.clientID", "&redirect_uri=", "$P0.redirectUri", "&client_secret=", "$P0.clientSecret", "&refresh_token=", "$S0.refreshToken", "&grant_type=refresh_token"],
        ["stream.stringToStream", "$L3", "$L2"],
        ["create", "$L4", "Object"],
        ["set", "$L4", "application/x-www-form-urlencoded", "Content-Type"],
        ["size", "$L19", "$L2"],
        ["string.concat", "$L4.Content-Length", "$L19"],
        ["create", "$L5", "Object"],
        ["set", "$L5.url", "https://login.live.com/oauth20_token.srf"],
        ["set", "$L5.method", "POST"],
        ["set", "$L5.requestBody", "$L3"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "validateResponse", "$P0", "$L6"],
        ["stream.streamToString", "$L7", "$L6.responseBody"],
        ["json.parse", "$L8", "$L7"],
        ["set", "$S0.accessToken", "$L8.access_token"],
        ["set", "$S0.refreshToken", "$L8.refresh_token"],
        ["create", "$L10", "Date"],
        ["math.multiply", "$L9", "$L8.expires_in", 1000],
        ["math.add", "$L9", "$L9", "$L10.time", -60000],
        ["set", "$S0.expireIn", "$L9"],
        ["set", "$P1", "$L8.access_token"]
    ]
};
var OneDrive = (function () {
    function OneDrive(redirectReceiver, clientID, clientSecret, redirectUri, state) {
        this.interpreterStorage = {};
        this.persistentStorage = [{}];
        this.instanceDependencyStorage = {
            redirectReceiver: redirectReceiver
        };
        InitSelfTest_1.InitSelfTest.initTest("OneDrive");
        this.interpreterStorage["clientID"] = clientID;
        this.interpreterStorage["clientSecret"] = clientSecret;
        this.interpreterStorage["redirectUri"] = redirectUri;
        this.interpreterStorage["state"] = state;
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        if (SERVICE_CODE["init"]) {
            ip.callFunctionSync("init", this.interpreterStorage);
        }
    }
    OneDrive.prototype.download = function (filePath, callback) {
        Statistics_1.Statistics.addCall("OneDrive", "download");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("downloadSC", this.interpreterStorage, null, filePath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "download");
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
    OneDrive.prototype.upload = function (filePath, stream, size, overwrite, callback) {
        Statistics_1.Statistics.addCall("OneDrive", "upload");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("uploadSC", this.interpreterStorage, filePath, stream, size, overwrite ? 1 : 0).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "upload");
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
    OneDrive.prototype.move = function (sourcePath, destinationPath, callback) {
        Statistics_1.Statistics.addCall("OneDrive", "move");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("moveSC", this.interpreterStorage, sourcePath, destinationPath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "move");
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
    OneDrive.prototype.delete = function (filePath, callback) {
        Statistics_1.Statistics.addCall("OneDrive", "delete");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("deleteSC", this.interpreterStorage, filePath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "delete");
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
    OneDrive.prototype.copy = function (sourcePath, destinationPath, callback) {
        Statistics_1.Statistics.addCall("OneDrive", "copy");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("copySC", this.interpreterStorage, sourcePath, destinationPath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "copy");
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
    OneDrive.prototype.createFolder = function (folderPath, callback) {
        Statistics_1.Statistics.addCall("OneDrive", "createFolder");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("createFolderSC", this.interpreterStorage, folderPath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "createFolder");
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
    OneDrive.prototype.getMetadata = function (filePath, callback) {
        Statistics_1.Statistics.addCall("OneDrive", "getMetadata");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getMetadataSC", this.interpreterStorage, null, filePath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "getMetadata");
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
    OneDrive.prototype.getChildren = function (folderPath, callback) {
        Statistics_1.Statistics.addCall("OneDrive", "getChildren");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getChildrenSC", this.interpreterStorage, null, folderPath).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "getChildren");
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
    OneDrive.prototype.getUserLogin = function (callback) {
        Statistics_1.Statistics.addCall("OneDrive", "getUserLogin");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:getUserLogin", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "getUserLogin");
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
    OneDrive.prototype.getUserName = function (callback) {
        Statistics_1.Statistics.addCall("OneDrive", "getUserName");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:getUserName", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "getUserName");
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
    OneDrive.prototype.createShareLink = function (path, callback) {
        Statistics_1.Statistics.addCall("OneDrive", "createShareLink");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("createShareLink", this.interpreterStorage, null, path).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "createShareLink");
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
    OneDrive.prototype.getAllocation = function (callback) {
        Statistics_1.Statistics.addCall("OneDrive", "getAllocation");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getAllocation", this.interpreterStorage, null).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "getAllocation");
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
    OneDrive.prototype.exists = function (path, callback) {
        Statistics_1.Statistics.addCall("OneDrive", "exists");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("exists", this.interpreterStorage, null, path).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "exists");
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
    OneDrive.prototype.login = function (callback) {
        Statistics_1.Statistics.addCall("OneDrive", "login");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Authenticating:login", this.interpreterStorage).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "login");
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
    OneDrive.prototype.logout = function (callback) {
        Statistics_1.Statistics.addCall("OneDrive", "logout");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Authenticating:logout", this.interpreterStorage).then(function () {
            var error = ip.sandbox.thrownError;
            if (error != null) {
                Statistics_1.Statistics.addError("OneDrive", "logout");
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
    OneDrive.prototype.saveAsString = function () {
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        return ip.saveAsString();
    };
    OneDrive.prototype.loadAsString = function (savedState) {
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.loadAsString(savedState);
        this.persistentStorage = sandbox.persistentStorage;
    };
    OneDrive.prototype.resumeLogin = function (executionState, callback) {
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        sandbox.loadStateFromString(executionState);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.resumeFunction("Authenticating:login", this.interpreterStorage).then(function () { return callback(undefined); }, function (err) { return callback(err); });
    };
    return OneDrive;
}());
exports.OneDrive = OneDrive;
