import * as mongoose from "mongoose";
import {Document, Model, Schema, SchemaTypes} from "mongoose";

const schema = new Schema{
    username: {
        type: SchemaTypes.String,
        required: true
    }
}