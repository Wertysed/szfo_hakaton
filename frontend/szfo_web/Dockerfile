FROM node:alpine as build


copy package.json package.json
RUN npm install 
COPY . . 

RUN npm run build

FROM nginx:stable-alpine

copy --from=build  /build /usr/share/nginx/html
copy --from=build nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000 
CMD ["nginx", "-g", "daemon off;"]
