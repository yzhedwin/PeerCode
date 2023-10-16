FROM node:18
WORKDIR /frontend

COPY package*.json /frontend
RUN npm install
COPY . .
# RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
