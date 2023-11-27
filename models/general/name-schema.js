const { Schema } = require("mongoose");

const nameSchema = new Schema({
    ar: {
        type: String
    },
    en: {
        type: String
    },
},
    { _id: false }
);

module.exports = nameSchema;
