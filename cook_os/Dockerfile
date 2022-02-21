FROM node:15.12.0
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY ./cook_os/package.json ./

RUN npm install
RUN npm install -D react-scripts

COPY ./cook_os/. ./

CMD ["npm", "start"]