FROM node:20.19.0

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build  

CMD ["node", "dist/main.js"]
