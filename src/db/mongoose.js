import mongoose from 'mongoose';
import process from 'process';

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// opens Mongoose's default connection to MongoDB
// connection method returns a promise
mongoose
  .connect(`mongodb://127.0.0.1:27017/${process.env.DATABASE_NAME}`, connectionOptions)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.error('Unable to connect to database', error);
  });
