FROM node:16.18.0

WORKDIR /backend/match_service
COPY package*.json /backend/match_service
RUN npm install
COPY . .
EXPOSE 5002
CMD bash run.sh
