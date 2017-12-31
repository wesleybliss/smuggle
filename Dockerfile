FROM mhart/alpine-node:latest

EXPOSE 3000
EXPOSE 3100
EXPOSE 8080

# Update & install dependencies"
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh && \
    apk add sudo && \
    apk add curl

# Install global deps
RUN npm i -g \
    pm2@latest \
    sabu

# Install NVM
#RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | ash
#RUN echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.profile
#RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.profile

WORKDIR /

# Clone example repo
RUN rm -rf /app
RUN mkdir /app
RUN git clone https://github.com/wesleybliss/draw-with-me.git /app

# Copy Smuggle config
COPY ./smuggle.json /app/smuggle.json

WORKDIR /app/server
RUN rm -rf node_modules

##WORKDIR /app/client
##RUN rm -rf node_modules
##RUN npm cache clear

WORKDIR /app

# Install Node deps & build
RUN npm run build:server
RUN npm run build:client

# Run server with PM2 via sudo
WORKDIR /app/server
##RUN sudo npm run pm2

# RUN echo "Starting client"
# WORKDIR /app/client
# RUN sabu -c sabu.conf.json &

##ADD ./example/setup.sh /smuggle/example/setup.sh
##RUN ash /smuggle/example/setup.sh

WORKDIR /app

# RUN echo "Starting Smuggle daemon"
##CMD ["node", "/smuggle/bin/smuggle", "--config", "/app/smuggle.json"]
##CMD ["ash", "/smuggle/example/startup.sh"]

#ADD ./example/environment.json /smuggle/example/environment.json
COPY . /smuggle/

CMD ["pm2", "start", "/smuggle/example/environment.json", "--no-daemon"]
