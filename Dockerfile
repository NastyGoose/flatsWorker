FROM node:8
WORKDIR /app
ENV MONGO_FLATS mongodb+srv://Staaalker:Chernobyl1986@clusterino-beiho.mongodb.net/flats?retryWrites=true
ENV RELOAD_TIMEOUT 2
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]
