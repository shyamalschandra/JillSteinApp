"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SandboxObject_1 = require("./SandboxObject");
var DetailErrors_1 = require("../errors/DetailErrors");
var Subscription = (function (_super) {
    __extends(Subscription, _super);
    function Subscription(_created, _description, _id, _lastCharge, _name, _nextCharge, _creditCard, _state, _subscriptionPlanID) {
        _super.call(this);
        this._created = _created;
        this._description = _description;
        this._id = _id;
        this._lastCharge = _lastCharge;
        this._name = _name;
        this._nextCharge = _nextCharge;
        this._creditCard = _creditCard;
        this._state = _state;
        this._subscriptionPlanID = _subscriptionPlanID;
        if (_description == null || _id == null || _name == null || _creditCard == null || _state == null || _subscriptionPlanID == null) {
            throw new DetailErrors_1.IllegalArgumentError("At least one of the parameters is undefined.");
        }
        else if (["active", "cancelled"].indexOf(_state) < 0) {
            throw new DetailErrors_1.IllegalArgumentError("Unknown state. Allowed values are: 'active' or 'canceled'.");
        }
    }
    Object.defineProperty(Subscription.prototype, "created", {
        get: function () {
            return this._created;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subscription.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subscription.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subscription.prototype, "lastCharge", {
        get: function () {
            return this._lastCharge;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subscription.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subscription.prototype, "nextCharge", {
        get: function () {
            return this._nextCharge;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subscription.prototype, "creditCard", {
        get: function () {
            return this._creditCard;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subscription.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subscription.prototype, "subscriptionPlanID", {
        get: function () {
            return this._subscriptionPlanID;
        },
        enumerable: true,
        configurable: true
    });
    return Subscription;
}(SandboxObject_1.SandboxObject));
exports.Subscription = Subscription;
