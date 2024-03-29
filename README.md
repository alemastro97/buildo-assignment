# Buildo Assignment
This is a small project that incorporates a service written in express with a MongoDb database
## Prerequisites
This project works with docker, in case you don't have docker and the compose plugin installed, I refer you to the guide:
- [Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Linux](https://docs.docker.com/engine/install/ubuntu/)
- [Mac](https://docs.docker.com/desktop/install/mac-install/)

## Installation
Clone the git repository:
```bash
git clone git@github.com:alemastro97/buildo-assignment.git
```
Move inside the repository
```bash
cd build-assignment/docker
```
Run the docker compose file:
```bash
docker-compose up --build
```
## Running Tests
If you want to run the tests in the **test/** folder you have to enter the service container with the following command:
```bash
docker exec -it <container_name> bash
```
and run the command
```bash
npm test
```
## Technologies involved

- <a href="https://expressjs.com/it/">**Express**</a>, or simply Express, is a web application framework for Node.js.

- <a href="https://joi.dev/api/?v=17.9.1">**Joi**</a> library used to create validation schemas.

- <a href="https://mongoosejs.com">**Mongoose**</a> is used for Database transactions which is an elegant solution to mongodb object modeling for node.js.

- <a href="https://www.docker.com">**Docker**</a>: platform designed to help developers build, share, and run modern applications

- <a href="https://docs.docker.com/compose/">**Docker-compose**</a>:  is a tool for defining and running multi-container Docker applications.

- <a href="https://www.passportjs.org/">**Passport.js**</a>: is authentication middleware for Node.js.

## Project Structure
``` bash
.
├── app.js
├── auth.js
├── config
├── controllers
│   ├── Configuration.Controller.js
│   └── User.Controller.js
├── db.js
├── docker
│   ├── docker-compose.yml
│   └── Dockerfile
├── middleware
│   ├── Configuration.validator.js
│   ├── ErrorHandler.js
│   └── Passport.js
├── models
│   ├── Configuration.model.js
│   └── User.model.js
├── package.json
├── package-lock.json
├── README.md
├── routes
│   ├── Auth.route.js
│   └── Configuration.route.js
└── test
    └── index.js
```
- **app.js**: This is the main file that initializes the Express application and sets up the middleware, routes, and other configurations.

</br>

- **auth.js**: This is the configuration file to setup everything concern the passport library used to check the authentication

</br>

- **config/**: This folder contains configuration files for the application such as environment variables, database connection strings, etc. This folder is usually separated from other code to keep configuration separate from application code and to make it easy to change configuration settings without modifying the code.

</br>

- **controllers/**: This folder contains the logic for handling requests and responses for each route.

</br>

- **db.js**: This is the configuration file to setup everything concern the mongodb database.

</br>

- **docker**: this folder contains all the configuration files to be able to run the project locally via docker

</br>

- **middleware/**: This folder contains the middleware functions that can be used to modify the request and response objects before and after the controller

</br>

- **models/**: This folder contains the code that defines the data schema and interacts with the database. Each file in this folder corresponds to a different table or collection in the database.

</br>

- **package.json**: This file contains metadata about the application and the list of dependencies required by the application.

</br>

- **routes/**: This folder contains the code that maps URLs to controllers and defines the endpoints for the API.

</br>

- **test/**: Some unit tests created with <a href="https://mochajs.org/">Mocha</a> + <a href="https://www.chaijs.com/">Chai</a> following this <a href="https://alexanderpaterson.com/posts/how-to-start-unit-testing-your-express-apps">tutorial</a>





## Exposed APIs
| Method   | URL                     |         Body        | Description                              |
| -------- | ------------------------|---------------- | ---------------------------------------- |
| `POST`   | `/register`        |         `{ name: String, username: String, password: String}`            | Create a new User                       |
| `POST`   | `/login`        |         `{ name: String, username: String, password: String}`            | Get the bearer token **to includes in all the next requests**.                       |
| `POST`   | `/configuration/`        |         `{ name:String, host:String, port:Number, database_url:String, logging_level:String}` all these keys are mandatory, you can also add key based on the type of service            | Create a new configuration.                       |
| `GET`    | `/configuration/`         |                    | Retrieve all configurations.                      |
| `GET`    | `/configuration/:id`       |                   | Retrieve configuration with the specified id.                       |
| `PATCH`  | `/configuration/:id`        |           If the key is already present it will be overwrite, otherwise it is created       | Update data for configuration with a given id.                 |
| `DELETE`   | `/configuration/:id`       |          | Delete configuration with a certain id.                 |


## HTTP Response Status Codes

One of the most important things in an API is how it returns response codes. Each response code means a different thing and consumers of your API rely heavily on these codes.

| Code  | Title                     | Description                              |
| ----- | ------------------------- | ---------------------------------------- |
| `200` | `OK`                      | When a request was successfully processed (e.g. when using `GET`, `PATCH`, `PUT` or `DELETE`). |
| `201` | `Created`                 | Every time a record has been added to the database (e.g. when creating a new user or post). |
| `304` | `Not modified`            | When returning a cached response. |
| `400` | `Bad request`             | When the request could not be understood (e.g. invalid syntax). |
| `401` | `Unauthorized`            | When authentication failed. |
| `403` | `Forbidden`               | When an authenticated user is trying to perform an action, which he/she does not have permission to. |
| `404` | `Not found`               | When URL or entity is not found. |
| `440` | `No accept header`        | When the required "Accept" header is missing from the request. |
| `422` | `Unprocessable entity`    | Whenever there is something wrong with the request (e.g. missing parameters, validation errors) even though the syntax is correct (ie. `400` is not warranted). |
| `500` | `Internal server error`   | When an internal error has happened (e.g. when trying to add/update records in the database fails). |
| `502` | `Bad Gateway`             | When a necessary third party service is down. |

## TODOs
- [] Implement service hot reload on docker-compose
- [] Split the service that performs authorization with the one that manages configurations
- [] Write more test cases
- [] Optimize the mongodb queries
- [] Try to completely substitute Mongoose.Schema with Joi
- [] Validate also the response with Joi

## Possible infrastructure:
<img src= "./infra-buildo.drawio.png"/>

- **EC2 Instance**: An EC2 (Elastic Compute Cloud) instance is a virtual machine that can be used to run the backend service. The cost of an EC2 instance depends on the instance type, which determines the amount of CPU, RAM, and storage available. We can consider a small instance with 2 CPUs and 4GB of RAM that costs around $0.025 per hour.

- **Amazon DocumentDB**: can be used to host our Mongo Database. The cost of DocumentDB depends on the instance size and the amount of storage needed. We can consider a medium instance with 4 CPUs and 32GB of storage can cost around $0.42 per hour.

- **Load Balancer**: in AWS is charged on an hourly basis, which means that we pay for the time that the load balancer is active. AWS charges based on the number of Application Load Balancer Capacity Units (ALCU) used per hour. The ALCU is a combination of the number of new connections, active connections, and the data processed per hour. The first 10 ALCUs are free per month. Beyond that, the cost per ALCU-hour varies by region and starts at $0.008 per ALCU-hour in the US East (N. Virginia) region.

- **Cloud Watch Logs**: The cost of CloudWatch Logs depends on the volume of ingested logs, the amount of data scanned for insights, and the number of times data is accessed. The pricing starts at $0.50 per GB ingested per month, and additional charges apply for data retention and insights.