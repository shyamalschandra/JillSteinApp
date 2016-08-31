"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream = require("stream");
var SequenceReadableStream = (function (_super) {
    __extends(SequenceReadableStream, _super);
    function SequenceReadableStream(stream1, stream2) {
        var _this = this;
        _super.call(this);
        this.stream1 = stream1;
        this.stream2 = stream2;
        this.first = true;
        this.shouldPush = false;
        this.info1 = {
            readable: stream1.readable
        };
        this.info2 = {
            readable: stream2.readable
        };
        stream1.on("readable", function () {
            _this.info1.readable = true;
            _this.process();
        });
        stream1.on("end", function () {
            _this.first = false;
            _this.process();
        });
        stream1.on("error", function (err) {
            _this.emit("error", err);
        });
        stream2.on("readable", function () {
            _this.info2.readable = true;
            _this.process();
        });
        stream2.on("end", function () {
            _this.push(null);
        });
        stream2.on("error", function (err) {
            _this.emit("error", err);
        });
    }
    SequenceReadableStream.prototype._read = function () {
        this.shouldPush = true;
        this.process();
    };
    SequenceReadableStream.prototype.process = function () {
        var info = this.first ? this.info1 : this.info2;
        if (this.shouldPush && info.readable) {
            var source = this.first ? this.stream1 : this.stream2;
            var chunk = void 0;
            while ((chunk = source.read()) !== null) {
                if (!this.push(chunk)) {
                    this.shouldPush = false;
                    return;
                }
            }
            info.readable = false;
        }
    };
    return SequenceReadableStream;
}(stream.Readable));
exports.SequenceReadableStream = SequenceReadableStream;
