#FROM node:alpine
FROM node:16-slim

USER root
RUN mkdir /app
WORKDIR /app
COPY . .

RUN apt-get update ; apt install -y libfontconfig1
RUN npm install --info

#CMD ["node", "index.js"]
CMD ["node", "."]
