# build enviroment
FROM node:18 as builder
WORKDIR /frontend

COPY package*.json /frontend
RUN npm install
COPY . .
# RUN npm ci --omit=dev
RUN npm run build

# production enviroment
FROM nginx:stable-alpine
COPY --from=builder /frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
