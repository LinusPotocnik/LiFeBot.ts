FROM node:21.7.3

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run clean-build

CMD ["npm", "start"]
