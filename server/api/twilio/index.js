'use strict';

var express = require('express');
var controller = require('./twilio.controller');

var router = express.Router();

router.get('/', controller.checkin);

module.exports = router;