'use strict';

var express = require('express');
var controller = require('./mobileuser.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.post('/:id/verify', controller.verify);
router.get('/:id/friends', controller.getFriends);
router.post('/:id/friends', controller.addFriends);
module.exports = router;
