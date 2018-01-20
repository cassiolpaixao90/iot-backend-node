
'use strict';

module.exports = function IotError(message, status) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message || "Falha ao processar sua requisição";
  this.status = status || 500;
};

require('util').inherits(module.exports, Error);