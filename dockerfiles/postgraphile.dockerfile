# Base image
FROM node:18

# Create app directory
WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./

# Install app dependencies
RUN yarn

# Bundle app source
COPY . .

CMD [ "yarn", "start" ]
