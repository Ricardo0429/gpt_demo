import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import User from './user.model';

import { toJSON, paginate } from './plugins';

const businessSchema = mongoose.Schema(
  {
    profileId: {
      type: mongoose.ObjectId,
      reference: User._id,
    },
    companyName: {
      type: String,
      unique: true,
      trim: true,
    },
    businessEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    contactPhone: {
      type: String,
      unique: true,
      trim: true,
    },
    industry: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ businessEmail, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * @typedef User
 */
const BusinessProfile = mongoose.model('BusinessProfile', businessSchema);

export default BusinessProfile;
