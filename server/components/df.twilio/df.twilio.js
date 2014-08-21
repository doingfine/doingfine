var fs = require('fs');
var config;
if(fs.existsSync(__dirname + "/../../config/local.env.js")){
  config = require(__dirname + "/../../config/local.env.js");
}
console.log('sid truthy: ', !!process.env.TWILIO_ACCOUNT_SID);
//require the Twilio module and create a REST client
var accountFallback, authFallback;
if(config === undefined){
  accountFallback = '';
  authFallback = '';
} else {
  accountFallback = config.TWILIO_ACCOUNT_SID;
  authFallback = config.TWILIO_AUTH_TOKEN;
}

var ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || accountFallback;
var AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || authFallback;

// twilio has amazing docs for node
// see: http://twilio.github.io/twilio-node/
var client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
var fromPhone = process.env.NODE_ENV === 'production' ? '+18052904005' : process.env.PHONE_NUMBER;
var server = process.env.NODE_ENV === 'production' ? 'http://doingfine.azurewebsites.net' : process.env.TWILIO_URL;
var twilioUrl = server +  '/api/twilio/call/'
module.exports.sendText = function(phone, msg) {
  //Send an text message
  client.sendMessage({

    to: phone,
    from: fromPhone, // A number you bought from Twilio and can use for outbound communication
    body: msg // body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio

      if (!err) { // "err" is an error received during the request, if any

          // "responseData" is a JavaScript object containing data received from Twilio.
          // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
          // http://www.twilio.com/docs/api/rest/sending-sms#example-1

          console.log(responseData.from); // outputs "+14506667788"
          console.log(responseData.body); // outputs "word to your mother."

      }

  });
};
module.exports.call = function(phone){
  //Place a phone call, and respond with TwiML instructions from the given URL
  client.makeCall({
    to: phone, // Any number Twilio can call
    from: fromPhone, // A number you bought from Twilio and can use for outbound communication
    url: twilioUrl // A URL that produces an XML document (TwiML) which contains instructions for the call

    }, function(err, responseData) {
      if(err){
        console.log(err);
      }
      //executed when the call has been initiated.
      console.log('call successful from: ', responseData.from); // log caller phone

  });
};
