FROM node:16
ADD ["./services/assignment/nest-cli.json", "./services/assignment/package.json", "./services/assignment/tsconfig.json", "/data/"]
WORKDIR /data
RUN npm i
ADD ./services/assignment/ /data  
EXPOSE 8080
CMD [ "npm", "run", "start" ]