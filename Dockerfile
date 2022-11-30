# Use an official Node.js runtime as a parent image
FROM node:16

# set the working directory to /app
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
# where available (npm@5)

# copy the current directory contents into a container at /app
COPY package*.json ./

# Install any needed packages specified in package.json file
RUN npm Install

# Bundle app source
COPY . .

#Make port 8080 available to the world outside this container
EXPOSE 8080

# Run server.js when container launches
CMD [ "node", "src/server.js" ]