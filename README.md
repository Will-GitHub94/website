# Vanilla Node Server

Vanilla Node Server was initially based off of the MEAN stack *(with the client stripped out)*. This project has since:

 - Been converted to es6 syntax
 - Introduced; eslint, jshint, & babel
 - Introduced Webpack as a module bundler

Changes that are planned to happen are:

 - Increase logging granularity
 - Introduce the option for integration with [CouchDB](https://couchdb.apache.org/)
 - Refactor large closures
 - Optimise passport authentication
 - Switch to use Express Router

## About
The reason for developing this project *(modify MEAN.js as I should say)* is that I found it monotonous to re-write a basic server for every project I did. Future projects will now be cloned from this repo so it is much easier to spin up applications.<br>
I differed from the standard MEAN stack for the reason that the syntax was still in es5. I give large credit to the MEAN.js contributors for the structural layout of this application.<br>
Even though it is a base project, there are still features that should be addressed that are included here:

 - [Node.js](https://nodejs.org/en/) as a server
 - [Webpack](https://webpack.js.org/) as the module bundler
 - [Express](https://expressjs.com/) as the API middleware
 - [ACL](https://www.npmjs.com/package/acl) for the auth of Express endpoints
 - [Passport](http://www.passportjs.org/) for the auth middleware to 3rd party services *(i.e. Facebook)*
 - [Gulp](https://gulpjs.com/) as the task runner
 - [MongoDB](https://www.mongodb.com/) as the data store
 - [Mongoose](http://mongoosejs.com/) for object modelling
 - [Winston](https://www.npmjs.com/package/winston) as the logging mechanism
 - [Socket.io](https://socket.io/) for real-time bidirectional event-based comms
 - [Mocha](https://mochajs.org/) as the unit testing framework

## Before You Begin
Before you begin we recommend you read about the basic building blocks that assemble a MEAN.JS application:
* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), which has a [Getting Started](http://expressjs.com/starter/installing.html) guide, as well as an [ExpressJS](http://expressjs.com/en/guide/routing.html) guide for general express topics. You can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.


## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).


## Install
To install project dependencies, run:

```bash
$ npm install
```


## Running Your Application

As mentioned above, the task runner is gulp. To run the default gulp tak, run:

```bash
$ npm start
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

Explore `config/env/development.js` for development environment configuration options.

### Running in Production mode
To run your application with *production* environment configuration:

```bash
$ npm run start:prod
```

Explore `config/env/production.js` for production environment configuration options.

### Running with User Seed
To have default account(s) seeded at runtime:

In Development:
```bash
MONGO_SEED=true npm start
```
It will try to seed the users 'user' and 'admin'. If one of the user already exists, it will display an error message on the console. Just grab the passwords from the console.

In Production:
```bash
MONGO_SEED=true npm start:prod
```
This will seed the admin user one time if the user does not already exist. You have to copy the password from the console and save it.

### Running with TLS (SSL)
Application will start by default with secure configuration (SSL mode) turned on and listen on port 8443.
To run your application in a secure manner you'll need to use OpenSSL and generate a set of self-signed certificates. Unix-based users can use the following command:

```bash
$ npm run generate-ssl-certs
```

Windows users can follow instructions found [here](http://www.websense.com/support/article/kbarticle/How-to-use-OpenSSL-and-Microsoft-Certification-Authority).
After you've generated the key and certificate, place them in the *config/sslcerts* folder.

Finally, execute prod task `npm run start:prod`
* enable/disable SSL mode in production environment change the `secure` option in `config/env/production.js`


## Testing Your Application
You can run the full test suite included with MEAN.JS with the test task:

```bash
$ npm test
```
This will run both the server-side tests (located in the `app/tests/` directory) and the client-side tests (located in the `public/modules/*/tests/`).

To execute only the server tests, run the test:server task:

```bash
$ npm run test:server
```

To execute only the server tests and run again only changed tests, run the test:server:watch task:

```bash
$ npm run test:server:watch
```

And to run only the client tests, run the test:client task:

```bash
$ npm run test:client
```

## Development and deployment With Docker

* Install [Docker](https://docs.docker.com/installation/#installation)
* Install [Compose](https://docs.docker.com/compose/install/)

* Local development and testing with compose:
```bash
$ docker-compose up
```

* Local development and testing with just Docker:
```bash
$ docker build -t vanilla_node_server .
$ docker run -p 27017:27017 -d --name db mongo
$ docker run -p 3000:3000 --link db:db_1 vanilla_node_server
$
```

* To enable live reload, forward port 35729 and mount /app and /public as volumes:
```bash
$ docker run -p 3000:3000 -p 35729:35729 -v /Users/mdl/workspace/vanilla_node_server/public:/home/vanilla_node_server/public -v /Users/mdl/workspace/vanilla_node_server/app:/home/vanilla_node_server/app --link db:db_1 vanilla_node_server
```

### Production deploy with Docker

* Production deployment with compose:
```bash
$ docker-compose -f docker-compose-production.yml up -d
```

* Production deployment with just Docker:
```bash
$ docker build -t mean -f Dockerfile-production .
$ docker run -p 27017:27017 -d --name db mongo
$ docker run -p 3000:3000 --link db:db_1 vanilla_node_server
```

### Amazon S3 configuration

To save the profile images to S3, simply set those environment variables:
UPLOADS_STORAGE: s3
S3_BUCKET: the name of the bucket where the images will be saved
S3_ACCESS_KEY_ID: Your S3 access key
S3_SECRET_ACCESS_KEY: Your S3 access key password

## License
[The MIT License](LICENSE.md)
