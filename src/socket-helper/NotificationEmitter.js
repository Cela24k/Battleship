"use strict";
exports.__esModule = true;
var NotificationEmitter = /** @class */ (function () {
    function NotificationEmitter(ios, receiver) {
        this.event = 'notification';
        this.ios = ios;
        this.receiver = receiver;
    }
    NotificationEmitter.prototype.emit = function (payload) {
        //this.ios.to(this.receiver).emit(this.event);
        this.ios.emit(this.event);
    };
    return NotificationEmitter;
}());
exports["default"] = NotificationEmitter;
