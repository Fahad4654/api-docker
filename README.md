# api-docker
# HOW TO GET START THE API SERVICE (for ubuntu/linux)

step-1:
        1. curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

        close terminal.

        2. nvm --version

        install node v-22 via nvm

        3. nvm install 22
        4. nvm use v22
        5. nvm alias default 22
        6. node -v

step-2:
        npm install -g pm2@latest   (if pm2 isn't installed)

step-3:
        git clone git@github.com:Fahad4654/api-docker.git

step-4: 
        cd api-docker/

step-5:
        create .env as example at root directory

step-6:
        npm install

step-7:
        pm2 start app.js --name=<name>
        example: pm2 start app.js --name=api-docker
        
step-8:
        pm2 log <name>
        example: pm2 log api-docker