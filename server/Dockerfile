FROM node:20

# Create app directory
WORKDIR /private-markets-api

COPY package.json ./
RUN npm i 

# Bundle app source
COPY . .

RUN npm run gen-doc

EXPOSE 2058

CMD [ "npm", "start" ]