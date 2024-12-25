FROM node:14.19.1

WORKDIR /usr/src/app

COPY . .
RUN npm install
#RUN npm install -g serve
#RUN npm run dev
EXPOSE 5000
ENTRYPOINT ["npm"]
CMD ["run","start"]
