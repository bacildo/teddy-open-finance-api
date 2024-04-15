FROM node:20.12.2

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app/

RUN npm run build

EXPOSE 3000
EXPOSE 3306

CMD ["npm", "start"]
