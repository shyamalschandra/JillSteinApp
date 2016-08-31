"use strict";
var Box_1 = require("./services/Box");
var Foursquare_1 = require("./services/Foursquare");
var Dropbox_1 = require("./services/Dropbox");
var Facebook_1 = require("./services/Facebook");
var GitHub_1 = require("./services/GitHub");
var GoogleDrive_1 = require("./services/GoogleDrive");
var GooglePlaces_1 = require("./services/GooglePlaces");
var GooglePlus_1 = require("./services/GooglePlus");
var Instagram_1 = require("./services/Instagram");
var LinkedIn_1 = require("./services/LinkedIn");
var MailJet_1 = require("./services/MailJet");
var MicrosoftLive_1 = require("./services/MicrosoftLive");
var Nexmo_1 = require("./services/Nexmo");
var OneDrive_1 = require("./services/OneDrive");
var PayPal_1 = require("./services/PayPal");
var SendGrid_1 = require("./services/SendGrid");
var Slack_1 = require("./services/Slack");
var Stripe_1 = require("./services/Stripe");
var Twilio_1 = require("./services/Twilio");
var Twitter_1 = require("./services/Twitter");
var Yahoo_1 = require("./services/Yahoo");
var Yelp_1 = require("./services/Yelp");
var Address_1 = require("./types/Address");
var Charge_1 = require("./types/Charge");
var CloudMetaData_1 = require("./types/CloudMetaData");
var CreditCard_1 = require("./types/CreditCard");
var DateOfBirth_1 = require("./types/DateOfBirth");
var Location_1 = require("./types/Location");
var POI_1 = require("./types/POI");
var Refund_1 = require("./types/Refund");
var Subscription_1 = require("./types/Subscription");
var SubscriptionPlan_1 = require("./types/SubscriptionPlan");
var SpaceAllocation_1 = require("./types/SpaceAllocation");
var Settings_1 = require("./Settings");
var RedirectReceivers_1 = require("./RedirectReceivers");
module.exports = {
    "services": {
        "Box": Box_1.Box,
        "Dropbox": Dropbox_1.Dropbox,
        "Facebook": Facebook_1.Facebook,
        "Foursquare": Foursquare_1.Foursquare,
        "GitHub": GitHub_1.GitHub,
        "GoogleDrive": GoogleDrive_1.GoogleDrive,
        "GooglePlaces": GooglePlaces_1.GooglePlaces,
        "GooglePlus": GooglePlus_1.GooglePlus,
        "Instagram": Instagram_1.Instagram,
        "LinkedIn": LinkedIn_1.LinkedIn,
        "MailJet": MailJet_1.MailJet,
        "MicrosoftLive": MicrosoftLive_1.MicrosoftLive,
        "Nexmo": Nexmo_1.Nexmo,
        "OneDrive": OneDrive_1.OneDrive,
        "PayPal": PayPal_1.PayPal,
        "SendGrid": SendGrid_1.SendGrid,
        "Slack": Slack_1.Slack,
        "Stripe": Stripe_1.Stripe,
        "Twilio": Twilio_1.Twilio,
        "Twitter": Twitter_1.Twitter,
        "Yahoo": Yahoo_1.Yahoo,
        "Yelp": Yelp_1.Yelp
    },
    "types": {
        "Address": Address_1.Address,
        "Charge": Charge_1.Charge,
        "CloudMetaData": CloudMetaData_1.CloudMetaData,
        "CreditCard": CreditCard_1.CreditCard,
        "DateOfBirth": DateOfBirth_1.DateOfBirth,
        "Location": Location_1.Location,
        "POI": POI_1.POI,
        "Refund": Refund_1.Refund,
        "Subscription": Subscription_1.Subscription,
        "SubscriptionPlan": SubscriptionPlan_1.SubscriptionPlan,
        "SpaceAllocation": SpaceAllocation_1.SpaceAllocation
    },
    "Settings": Settings_1.Settings,
    "RedirectReceivers": RedirectReceivers_1.RedirectReceivers
};
