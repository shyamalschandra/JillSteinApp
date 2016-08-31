"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SandboxObject_1 = require("./SandboxObject");
var DetailErrors_1 = require("../errors/DetailErrors");
var Refund = (function (_super) {
    __extends(Refund, _super);
    function Refund(_amount, _chargeID, _created, _id, _state, _currency) {
        _super.call(this);
        this._amount = _amount;
        this._chargeID = _chargeID;
        this._created = _created;
        this._id = _id;
        this._state = _state;
        this._currency = _currency;
        if (_chargeID == null || _id == null || _state == null) {
            throw new DetailErrors_1.IllegalArgumentError("At least one of the parameters is null.");
        }
        else if (["pending", "succeeded", "failed"].indexOf(_state) < 0) {
            throw new DetailErrors_1.IllegalArgumentError("Unknown state. Allowed values are: 'succeeded', 'failed' or 'pending'.");
        }
        else if (_currency.length !== 3) {
            throw new DetailErrors_1.IllegalArgumentError("The passed currency is invalid.");
        }
        this._currency = _currency.toUpperCase();
    }
    Object.defineProperty(Refund.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Refund.prototype, "amount", {
        get: function () {
            return this._amount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Refund.prototype, "created", {
        get: function () {
            return this._created;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Refund.prototype, "currency", {
        get: function () {
            return this._currency;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Refund.prototype, "chargeID", {
        get: function () {
            return this._chargeID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Refund.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    return Refund;
}(SandboxObject_1.SandboxObject));
exports.Refund = Refund;
