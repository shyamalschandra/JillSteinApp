"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SandboxObject_1 = require("./SandboxObject");
var DetailErrors_1 = require("../errors/DetailErrors");
var SubscriptionPlan = (function (_super) {
    __extends(SubscriptionPlan, _super);
    function SubscriptionPlan(_amount, _created, _currency, _description, _id, _interval, _interval_count, _name) {
        _super.call(this);
        this._amount = _amount;
        this._created = _created;
        this._currency = _currency;
        this._description = _description;
        this._id = _id;
        this._interval = _interval;
        this._interval_count = _interval_count;
        this._name = _name;
        if (_currency == null || _description == null || _id == null || _interval == null || _name == null) {
            throw new DetailErrors_1.IllegalArgumentError("At least one of the parameters is undefined.");
        }
        else if (_amount < 0) {
            throw new DetailErrors_1.IllegalArgumentError("Amount can not be less than 0.");
        }
        else if (_currency.length !== 3) {
            throw new DetailErrors_1.IllegalArgumentError("Passed currency is not a valid three-letter currency code.");
        }
        else if (["day", "week", "month", "year"].indexOf(_interval) < 0) {
            throw new DetailErrors_1.IllegalArgumentError("Unknown interval. Allowed values are: 'day', 'week', 'month' or 'year'.");
        }
    }
    Object.defineProperty(SubscriptionPlan.prototype, "amount", {
        get: function () {
            return this._amount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscriptionPlan.prototype, "created", {
        get: function () {
            return this._created;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscriptionPlan.prototype, "currency", {
        get: function () {
            return this._currency;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscriptionPlan.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscriptionPlan.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscriptionPlan.prototype, "interval", {
        get: function () {
            return this._interval;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscriptionPlan.prototype, "interval_count", {
        get: function () {
            return this._interval_count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubscriptionPlan.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return SubscriptionPlan;
}(SandboxObject_1.SandboxObject));
exports.SubscriptionPlan = SubscriptionPlan;
