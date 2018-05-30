FROM node:10.2.1-alpine 

COPY . /app/
WORKDIR /app
RUN npm i && \
    npm run build && \
    npm uninstall @babel/core @babel/cli @babel/node @babel/preset-env babel-preset-minify --save-dev && \
    npm cache clean && \
    rm -r src 
CMD [ "dist/index.js" ]
ENTRYPOINT [ "node" ]
