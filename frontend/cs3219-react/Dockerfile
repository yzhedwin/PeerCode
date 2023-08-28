FROM node:18
WORKDIR /cs3219-react

COPY package*.json ./
COPY . .

RUN npm install
# RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
