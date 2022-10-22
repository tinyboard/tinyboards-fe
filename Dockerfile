# Dockerfile
FROM node:18.6.0-alpine

# create destination directory
RUN mkdir -p /usr/src/app/.nuxt
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
#FROM BASE AS BUILD
# update and install dependency
RUN apk update && apk upgrade
RUN apk add git
RUN npm install -g npm@8.19.2
RUN npm i 
#--only=production && \
#    npm cache clean --force

# copy the app, note .dockerignore
COPY . /usr/src/app
#RUN npm i
#RUN npm i --only=production && \
#    npm cache clean --force
RUN npm run build

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD [ "npx", "nuxi", "start" ]
