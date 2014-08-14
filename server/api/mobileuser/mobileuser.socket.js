/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Mobileuser = require('./mobileuser.model');

exports.register = function(socket) {
  Mobileuser.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Mobileuser.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('mobileuser:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('mobileuser:remove', doc);
}