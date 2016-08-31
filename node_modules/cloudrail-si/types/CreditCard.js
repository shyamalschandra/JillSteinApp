"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SandboxObject_1 = require("./SandboxObject");
var DetailErrors_1 = require("../errors/DetailErrors");
var InternalError_1 = require("../errors/InternalError");
var Helper_1 = require("../helpers/Helper");
var CreditCard = (function (_super) {
    __extends(CreditCard, _super);
    function CreditCard(cvc, expire_month, expire_year, number, type, firstName, lastName, address) {
        _super.call(this);
        this.cvc = cvc;
        this.expire_month = expire_month;
        this.expire_year = expire_year;
        this.number = number;
        this.type = type;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
    }
    Object.defineProperty(CreditCard.prototype, "expire_month", {
        get: function () {
            return this._expire_month;
        },
        set: function (value) {
            if (value == null)
                throw new DetailErrors_1.IllegalArgumentError("Expiration month shouldn't be null");
            if (value <= 0 || value > 12) {
                throw new DetailErrors_1.IllegalArgumentError("Expiration month needs to be between 1 and 12.");
            }
            this._expire_month = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CreditCard.prototype, "expire_year", {
        get: function () {
            return this._expire_year;
        },
        set: function (value) {
            if (value == null)
                throw new DetailErrors_1.IllegalArgumentError("Expiration year shouldn't be null");
            if (value < 1970 || value.toString().length !== 4) {
                throw new DetailErrors_1.IllegalArgumentError("Expiration year needs to be a four digit number.");
            }
            this._expire_year = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CreditCard.prototype, "number", {
        get: function () {
            return this._number;
        },
        set: function (value) {
            if (value == null) {
                throw new DetailErrors_1.IllegalArgumentError("Card number is not allowed to be null.");
            }
            this._number = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CreditCard.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (value) {
            if (value == null) {
                throw new DetailErrors_1.IllegalArgumentError("Card type is not allowed to be null.");
            }
            else if (["visa", "mastercard", "discover", "amex"].indexOf(value) < 0) {
                throw new DetailErrors_1.IllegalArgumentError("Unknown card type. Allowed values are: 'visa', 'mastercard', 'discover' or 'amex'.");
            }
            this._type = value;
        },
        enumerable: true,
        configurable: true
    });
    CreditCard.prototype.compareTo = function (obj) {
        if (obj == null || !(obj instanceof CreditCard)) {
            throw new InternalError_1.InternalError("CreditCards must only be compared with other non-null CreditCards");
        }
        var another = obj;
        var compare;
        compare = Helper_1.Helper.compare(this.firstName, another.firstName);
        if (compare)
            return compare;
        compare = Helper_1.Helper.compare(this.lastName, another.lastName);
        if (compare)
            return compare;
        compare = Helper_1.Helper.compare(this.number.substring(12), another.number.substring(12));
        if (compare)
            return compare;
        compare = Helper_1.Helper.compare(this.expire_month, another.expire_month);
        if (compare)
            return compare;
        compare = Helper_1.Helper.compare(this.expire_year, another.expire_year);
        if (compare)
            return compare;
        return Helper_1.Helper.compare(this.type, another.type);
    };
    return CreditCard;
}(SandboxObject_1.SandboxObject));
exports.CreditCard = CreditCard;
