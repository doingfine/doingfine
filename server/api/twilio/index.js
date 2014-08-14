'use strict';

var express = require('express');
var controller = require('./twilio.controller');

var router = express.Router();

router.get('/', controller.checkin);
router.post('/', controller.recordKeyPress);
router.post('/call', controller.callPost);
module.exports = router;
