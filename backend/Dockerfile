FROM node:18
WORKDIR /backend

COPY package*.json ./
COPY . .

RUN npm install
# RUN npm ci --omit=dev

EXPOSE 5000
CMD ["node", "server.js"]
