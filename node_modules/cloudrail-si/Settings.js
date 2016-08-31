"use strict";
var Settings = (function () {
    function Settings() {
    }
    Settings.setKey = function (key) {
        Settings.licenseKey = key;
    };
    return Settings;
}());
exports.Settings = Settings;
