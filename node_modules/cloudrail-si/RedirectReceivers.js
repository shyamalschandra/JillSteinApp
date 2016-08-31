"use strict";
var http = require("http");
var opn = require("opn");
var RedirectReceivers = (function () {
    function RedirectReceivers() {
    }
    RedirectReceivers.getLocalAuthenticator = function (port, respHtml) {
        if (port === void 0) { port = 12345; }
        if (respHtml === void 0) { respHtml = "<h2>Authentication successful, you can close this window now</h2>"; }
        return function (url, state, callback) {
            try {
                var sockets_1 = {};
                var nextSocketId_1 = 0;
                var server_1 = http.createServer(function (req, res) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/html");
                    res.end(respHtml);
                    server_1.close(function () { return callback(undefined, req.url); });
                    for (var socketId in sockets_1)
                        sockets_1[socketId].destroy();
                });
                server_1.on("connection", function (socket) {
                    var socketId = nextSocketId_1++;
                    sockets_1[socketId] = socket;
                    socket.on("close", function () { return delete sockets_1[socketId]; });
                });
                server_1.listen(port);
                opn(url);
            }
            catch (err) {
                callback(err);
            }
        };
    };
    RedirectReceivers.getElectronAuthenticator = function (BrowserWindow, redirectUrl) {
        return function (url, currentState, callback) {
            var authWindow = new BrowserWindow({
                webPreferences: {
                    nodeIntegration: false,
                    partition: Math.random().toString()
                }
            });
            authWindow.loadURL(url);
            function incomingRedirect(url) {
                if (url.indexOf(redirectUrl) === 0) {
                    authWindow.destroy();
                    callback(undefined, url);
                }
            }
            authWindow.webContents.on("will-navigate", function (event, url) { return incomingRedirect(url); });
            authWindow.webContents.on("did-get-redirect-request", function (event, oldUrl, newUrl) { return incomingRedirect(newUrl); });
            authWindow.on("close", function () {
                authWindow = null;
                callback(new Error("Authentication window was closed"));
            }, false);
        };
    };
    return RedirectReceivers;
}());
exports.RedirectReceivers = RedirectReceivers;
