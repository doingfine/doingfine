//require the Twilio module and create a REST client
var ACCOUNT_SID = 'ACcc6bd88977d0eddd1ff935ecbc2cacee';
var AUTH_TOKEN = 'c9ba89f331e84936155f1916a5bca2fb';
var from = process.env.NODE_ENV === 'production' ? '+18052904005' : '+18025324118';

// twilio has amazing docs for node
// see: http://twilio.github.io/twilio-node/
var client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
var fromPhone = process.env.NODE_ENV === 'production' ? '+18052904005' : '+18025324118';


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
