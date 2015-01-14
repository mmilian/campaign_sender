var eventEmitter = new (require('events').EventEmitter)();

function emitEvent(str, arg1) {
    'use strict';
    eventEmitter.emit(str,arg1);
}

function registerEvent(str, callback) {
    'use strict';
    eventEmitter.on(str, callback);
}

function registerEventOnce(str, callback) {
    'use strict';
    eventEmitter.once(str, callback);
}

exports.emitEvent = emitEvent;
exports.registerEvent = registerEvent;
exports.registerEventOnce = registerEventOnce;