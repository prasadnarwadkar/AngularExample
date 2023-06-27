# Angular App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.6.

## NodeJS Web API project from the following repo is used in this repo
- [`MongoDB Nodejs Web Api`](https://github.com/prasadnarwadkar/MongoDBNodejsWebApi/)

# API used in this app
This app doesn't talk to the `MongoDB` db directly. Rather, it talks to an API that talks to MongoDB. The API is in the project [here](https://github.com/prasadnarwadkar/MongoDBNodejsWebApi/). 

- Please clone the `API project repo` on your machine.
- [Install MongoDB on your machine](https://www.mongodb.com/docs/manual/installation/)
- [You can also use a `docker container` for `MongoDB` if you have docker on your machine](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-community-with-docker/)
- [You can also use Atlas for storing your `MongoDB` collections and dbs on the cloud.](https://www.mongodb.com/developer/products/atlas/) Follow the instructions, create a project and/or cluster in Atlas, and enable one or two db users for use with the `MongoDB` connection URI. The Atlas-based URIs have the format `mongodb+srv://{username}:{password}@cluster1.xxxx.mongodb.net/?retryWrites=true&w=majority`. Please replace the username, password, and the exact cluster URI with your own Atlas account settings.
- Go to the `.env` of this API project and update the `MONGO_HOST` environment var with your `MongoDB` URI. If `MongoDB` is running on your local machine, it could be `mongodb://127.0.0.1:27017`. If it is an Atlas cluster, it could be as per the above item.
- After all the above settings are done, please run `npm start` at the root of the API project. This runs the API on a port such as `3002`.
- The API URI should be configured in this `Angular` `(MEAN)` app in the `config.js` file like below. Please update this as per the port your MongoDB NodeJS API is running on. For me, it was `3002` on the local host. The `config.js` file is in the `assets` sub-directory under `src` which itself is under the `root` directory of this Web API.

    `apiBaseUrl` points to the Web API deployment.
    `apiBaseUrl2` points to the `authentication` server which is run as explained in the last bullet point below.
    
    ```
    var config = {
      apiBaseUrl: "http://localhost:3002/api/",
      apiBaseUrl2: "http://localhost:1337/api/"
    }
      
    function getConfig()
    {
        return config;
    }
    
    ```

- On my machine, I followed the steps above and was able to run the `MongoDB` `NodeJS` `API`.
  `process.env.MONGO_HOST:mongodb://127.0.0.1:27017`
   `Server listening on port 3002`
- In addition to this, please run the following command on the root of the Web API project. This mini-app runs a simple `authentication` server. It is in the `server` sub-directory. 
    `node .\server\index.js`.
  
## Authentication and authorization
The `server` sub-directory in the Web API project serves as a simple `authentication` server as stated in the last bullet point in the above paragraph. 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
**Note: Please run this Angular app only after running the NodeJS Web API successfully. The Angular app cannot function without the Web API**

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
