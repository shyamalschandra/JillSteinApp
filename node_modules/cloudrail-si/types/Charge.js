"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SandboxObject_1 = require("./SandboxObject");
var DetailErrors_1 = require("../errors/DetailErrors");
var Charge = (function (_super) {
    __extends(Charge, _super);
    function Charge(_amount, _created, _currency, _id, _refunded, _source, _status) {
        _super.call(this);
        this._amount = _amount;
        this._created = _created;
        this._currency = _currency;
        this._id = _id;
        this._refunded = _refunded;
        this._source = _source;
        this._status = _status;
        if (_currency == null || _id == null || _source == null || _status == null || _refunded == null) {
            throw new DetailErrors_1.IllegalArgumentError("One or more parameters are null.");
        }
        else if (_amount < 0) {
            throw new DetailErrors_1.IllegalArgumentError("The amount can not be less than 0.");
        }
        else if (_currency.length !== 3) {
            throw new DetailErrors_1.IllegalArgumentError("The passed currency is invalid.");
        }
        else if (["pending", "succeeded", "failed"].indexOf(_status) < 0) {
            throw new DetailErrors_1.IllegalArgumentError("The passed state should be one of: 'pending', 'succeeded' or 'failed'.");
        }
        this._currency = _currency.toUpperCase();
        this._refunded = !!_refunded;
    }
    Object.defineProperty(Charge.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Charge.prototype, "amount", {
        get: function () {
            return this._amount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Charge.prototype, "currency", {
        get: function () {
            return this._currency;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Charge.prototype, "source", {
        get: function () {
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Charge.prototype, "created", {
        get: function () {
            return this._created;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Charge.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Charge.prototype, "refunded", {
        get: function () {
            return this._refunded;
        },
        enumerable: true,
        configurable: true
    });
    return Charge;
}(SandboxObject_1.SandboxObject));
exports.Charge = Charge;
