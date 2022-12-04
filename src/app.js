import path from 'path';
import process from 'process';
import express from 'express';
import logger from 'morgan';
import * as dotenv from 'dotenv';

// load environmental variables
dotenv.config();

const __dirname = path.resolve();

// Import Routes
import { userRouter } from './routers/user.js';
import { taskRouter } from './routers/task.js';

// create the express application by executing express package
const app = express();

const port = process.env.PORT || 8080;

// allow static access to the angular folder - fix formatting
app.use('/', express.static(path.join(__dirname, './dist/task-manager-client')));

// automatically parse incoming JSON to an object so we can access it in our request handlers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// creates a logger middleware
app.use(logger('dev'));

// register the Routers
app.use(userRouter);
app.use(taskRouter);

// all other requests are handled with angular - return angular index.html file
app.use((req, res) => {
  res.sendFile(path.join(__dirname, './dist/task-manager-client', 'index.html'));
});

app.listen(port, () => {
  console.log('Successfully started server');
});
