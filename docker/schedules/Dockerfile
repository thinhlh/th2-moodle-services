FROM node:16
ADD ["./services/schedules/nest-cli.json", "./services/schedules/package.json", "./services/schedules/tsconfig.json", "/data/"]
WORKDIR /data
RUN npm i
ADD ./services/schedules/ /data  
CMD [ "npm", "run", "start" ]