import express from 'express';

// Define a new Router
const router = new express.Router();

// import user controller
import {
  signUpUser,
  loginUser,
  logoutUser,
  logoutAll,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from '../controllers/user.js';

// Route to create a new user - SIGN UP USER
router.post('/users', signUpUser);

// Route handler to login users - LOG IN USER
router.post('/user/login', loginUser);

// Route that allows user to log out - LOG OUT USER
router.post('/users/logout', logoutUser);

// Route that allows user to log out of all sessions - LOG OUT ALL
router.post('/users/logoutAll', logoutAll);

// Route handler that allows user to get profile when they are authenicated
router.get('/users/me', getUserProfile);

// Route handler to update an individual user by ID
router.patch('/users/me', updateUserProfile);

// Route handler to allow logged in user to delete thier own user profile - DELETE ACCOUNT
router.delete('/users/me', deleteUser);

export { router as userRouter };
