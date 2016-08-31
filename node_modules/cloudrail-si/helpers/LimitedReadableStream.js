"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream = require("stream");
var CHUNK_SIZE = 8 * 1024;
var LimitedReadableStream = (function (_super) {
    __extends(LimitedReadableStream, _super);
    function LimitedReadableStream(source, limit) {
        var _this = this;
        _super.call(this);
        this.source = source;
        this.limit = limit;
        this.shouldPush = false;
        this.sourceReadable = source.readable;
        source.on("readable", function () {
            _this.sourceReadable = true;
            _this.process();
        });
        source.on("end", function () {
            _this.push(null);
        });
        source.on("error", function (err) {
            _this.emit("error", err);
        });
    }
    LimitedReadableStream.prototype._read = function () {
        this.shouldPush = true;
        this.process();
    };
    LimitedReadableStream.prototype.process = function () {
        if (this.shouldPush && this.sourceReadable) {
            var chunk = void 0;
            while ((chunk = this.source.read(Math.min(this.limit, CHUNK_SIZE))) !== null) {
                this.limit -= chunk.length;
                if (this.limit === 0) {
                    this.push(chunk);
                    this.push(null);
                    return;
                }
                if (!this.push(chunk)) {
                    this.shouldPush = false;
                    return;
                }
            }
        }
    };
    return LimitedReadableStream;
}(stream.Readable));
exports.LimitedReadableStream = LimitedReadableStream;
