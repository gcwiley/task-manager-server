import jwt from 'jsonwebtoken';

// Import the User model
import { User } from '../models/user.js';

// middleware function
const auth = async (req, res, next) => {
  try {
    // finds header that the user is expected to provide
    const token = req.header('Authorization').replace('Bearer ', '');
    // makes sure token is valid and has not expired - validates header
    const decoded = jwt.verify(token, 'thisismynewcourse');
    // finds the user in the database - looks for a user that has a given token value in the array
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    // if no user is found
    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    // next() lets the route handler run
    next();
  } catch (error) {
    // error handler
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// export the auth function
export { auth };
