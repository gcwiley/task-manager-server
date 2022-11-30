// Import User Model
import { User } from '../models/user.js';

// import AUTH HERE!

// handler function to create a new user - SIGN UP USER
export const signUpUser = async (req, res) => {
  const user = new User(req.body);

  try {
    // saves to database
    await user.save();
    // generates a token for the saved user
    const token = await User.generateAuthToken();
    // sends back a 201 status code and user object
    res.status(201).send({ user: token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Route handler to login users - LOG IN
export const loginUser = async (req, res) => {
  try {
    // validating the credentials that are provided
    const user = await User.findByCredentials(req.body.email, req.body.password);
    // generate a token for a specific user
    const token = await user.generateAuthToken();
    // sends back user and token to requester
    // when we pass our objects to res.send they are getting stringified
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
};

// Route handler to allow user to log out - LOG OUT
export const logoutUser = async (req, res) => {
  try {
    // removing given item from tokens array by using array filter method
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    // save to database
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

// Route handler to allow user to log out of ALL sessions - LOG OUT ALL
export const logoutAll = async (req, res) => {
  try {
    // wiping the tokens array - set to empty array
    req.user.tokens = [];
    // save to database
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

// Route handler that allows user to get profile when they are authenticated.
export const getUserProfile = async (req, res) => {
  // send back user profile
  res.send(req.user);
};

// Route handler to update a individual user by ID
export const updateUserProfile = async (req, res) => {
  // Error handling - making sure the user is using the operation correctly
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    // if something goes wrong - like a validation issue
    res.status(400).send(error);
  }
};

// Route handler to allow logged in user to delete thier own user profile - REMOVE ACCOUNT
export const deleteUser = async (req, res) => {
  try {
    // removing the user who is authenicated
    await req.user.remove();

    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
};


