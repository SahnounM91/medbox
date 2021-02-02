FROM debian:buster-slim
RUN apt-get update && apt-get install -y nginx nano
RUN apt-get install -y curl software-properties-common && curl -sL https://deb.nodesource.com/setup_12.x | bash - && apt-get install -y nodejs
WORKDIR /medbox
COPY . ./
RUN npm install
CMD npm run-script build
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY /medbox  /var/www/html/

RUN chown -R www-data. /var/www/html/*
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
