"use strict";
exports.__esModule = true;
exports.MessageSchema = void 0;
var mongoose_1 = require("mongoose");
exports.MessageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.SchemaTypes.String,
        required: true
    },
    time: {
        type: mongoose_1.SchemaTypes.Date,
        required: true
    },
    text: {
        type: mongoose_1.SchemaTypes.ObjectId,
        required: true
    }
});
