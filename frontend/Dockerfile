FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve@14.2.4
COPY build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
