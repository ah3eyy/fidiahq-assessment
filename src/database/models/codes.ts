import {Schema, model} from 'mongoose'
import bcrypt from 'bcrypt';

const CodeSchema = new Schema({
    code: {type: String, default: null},
    uid: {type: String, default: null}
}, {
    timestamps: true
})

CodeSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

export default model("Code", CodeSchema);