
FROM node:18

WORKDIR /
COPY package*.json ./
RUN npm install
RUN npm install axios
COPY . .

EXPOSE 3001
CMD ["npm", "start"]