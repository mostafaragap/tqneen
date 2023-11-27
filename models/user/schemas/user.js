const { Schema, Types } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const roleEnum = require("../../../constants/user");
const { autoIncrement } = require("../../autoIncremant/methods/autoIncrement");

const userSchema = new Schema({
  id: {
    type: Number,
    unique: true, // Ensure the ID field is unique
  }, // Make the ID field required },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  firebaseToken : {
    type : String,
    default : null
  },
  email: {
    type: String,
    required: function () {
      return this.type === 'admin';
    },
  },
  address: {
    type: String
  },
  freeTrialCount: {
    type: Number, default: function () {
      if (this.type === "customer") {
        return 3
      } else {
        return null
      }
    }
  },
  phone: {
    type: String,
    unique: true,
    required: function () {
      return this.type !== 'admin';
    },
    default: function () {
      if (this.type === "admin") {
        return null
      }
    }
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    default: function () {
      if (this.type === "admin") {
        return "male"
      }
    }
  },

  type: {
    type: String,
    default: "customer",
    enum: [...roleEnum, "admin"]
  },

  otp: {
    type: String
  },

  full_name: {
    type: String,
    required: true
  },

  avatar: {
    type: String,
    default: null
  },

  is_active: {
    type: Boolean,
    required: true,
    default: true
  },

  area: {
    type: Number,
    require: true,
    default: function () {
      if (this.type === "admin") {
        return null
      }
    }
  },

  phone_verified_at: {
    type: Date, // for now use Now
    default: null
  },

  // lowyer
  status: {
    type: String, enum: ["active", "not active", "in call"], default: function () {
      if (this.type === "customer" || this.type === "admin") {
        return "active"
      } else {
        return "not active"
      }
    }
  },

  specializations: {
    type: [Number],
    default: function () {
      if (this.type === "customer") {
        return null
      } else {
        return []
      }
    }
  },
  fees: { type: Number },
  title: { type: String },
  bio: { type: String },
  languages: {
    type: [String],
    default: function () {
      if (this.type === "admin") {
        return null
      }
    }
  },
  idImages: {
    type: [String],
    default: function () {
      if (this.type === "admin") {
        return null
      }
    }
  },
  cardImages: {
    type: [String],
    default: function () {
      if (this.type === "admin") {
        return null
      }
    }
  },
  numOfExperience: { type: Number },
  isCompleteProfile: { type: Boolean }
}, { timestamps: true });

userSchema.pre('save', autoIncrement('id'));
userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

module.exports = userSchema;
