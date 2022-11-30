import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// import the task model
import { Task } from './task.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain the word "password".');
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be a positive number.');
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// set up virtual property - relationship between two entities - user and tasks
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

// this is a function on the individual instance
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  // use the delete operator to delete stuff off of the object
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// generate Auth Token function
// model methods are available on the instances - instance methods
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  // creates the token
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse');

  user.tokens = user.tokens.concat({ token: token });
  // save to database
  await user.save();

  return token;
};

// This is a async function that helps users login
// statics methods are available on the model - model methods
userSchema.statics.findByCredentials = async (email, password) => {
  // find user by e-mail in database
  const user = await User.findOne({ email: email });

  // unable to find user with that email
  if (!user) {
    throw new Error('Unable to login user');
  }

  // verify the password is correct - password and hashed password match
  const isMatch = await bcrypt.compare(password, user.password);

  // if it is not a match
  if (!isMatch) {
    throw new Error('Unable to login user');
  }

  // return user if found and the password is a match
  return user;
};

// use a method on userSchema to set up middleware - customise behavior of mongoose model
// hashes the plain text password before saving to database
userSchema.pre('save', async function (next) {
  const user = this; // this = individual document being saved

  // if user has a modified password property
  if (user.isModified('password')) {
    // taking the plain text password and hashing it and then using the hash value to override the plain text value
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete user tasks when user is removed - this is mongoose middleware
// whenever a user is removed, this code will remove thier task as well.
userSchema.pre('remove', async function (next) {
  const user = this;

  // delete mulitiple tasks using just the owner field
  await Task.deleteMany({ owner: user._id });
  // next() lets mongoose know when we are done running our code
  next();
});

const User = mongoose.model('User', userSchema);

export { User };
