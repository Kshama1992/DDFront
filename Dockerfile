FROM node

RUN mkdir -p /app
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn cache clean

RUN yarn install
COPY . ./

RUN yarn build

EXPOSE $PORT
CMD ["node", "./build/server.js"]
