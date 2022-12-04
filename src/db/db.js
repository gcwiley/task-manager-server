import process from 'process';
import { Sequelize } from 'sequelize';

import * as dotenv from 'dotenv';

// Loads .env file contents into process.env.
dotenv.config();

const sequelize = new Sequelize(`postgres://${process.env.USERNAME}:${process.env.PASSWORD}@postgre-sql-server-wiley.postgres.database.azure.com/postgres?sslmode=require`, {
  dialect: 'postgres',
  ssl: true,
});

// test the connection by trying to authenicate
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

// export the sequelize instance
export { sequelize };