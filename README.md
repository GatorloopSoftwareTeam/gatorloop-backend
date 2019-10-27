## Gatorloop Website Backend

### Overview

This package will run the database and authentication system behind the Gatorloop website. Built on Express.js and MongoDB.

### Development

Want to contribute to the project or test things out?

1. Download and install the latest stable version of node and npm [here](https://nodejs.org/en/).
2. Clone the repository into a local directory.
3. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to set up your own testing database. Follow the instructions to create a free tier instance.
4. To connect your test database, go to the MongoDB Atlas control panel. On your instance, select the CONNECT button. Select "Connect your application". Select "Node.js" driver version "3.0 or later". Copy and paste the url into the config file (found at <./Config/config.json>). The field is `development > database > url`.
4. Run `npm install` to install the compatible version of all dependencies.
5. Run `npm start` to launch the server!

Note: The sample database url in the config file will not run because the password has been redacted.

### API

Current API endpoints for manipulating the database. Parameters should be passed as a JSON object in the body of the request.

#### User

| HTTP VERB | URI                 | Description                       | Parameters                      |
| ---       | ---                 | ---                               | ---                             |
| GET       | `/api/user`         | Get all users                     | none                            |
| GET       | `/api/user/:email`  | Get user with specified email     | none                            |
| PUT       | `/api/user/:email`  | Update user with specified email  | name, email (new), password     |
| POST      | `/api/user/`        | Create new user                   | name, email, password           |
| DELETE    | `/api/user/:email`  | Delete user with specified email  | none                            |

### Authorization

Coming soon!

### Schemas

Each type of object stored in the database is defined by a schema (like a blueprint). For more information, see the mongoose documentation on the topic [here](https://mongoosejs.com/docs/guide.html).

#### User

```
{
       name: {
           type: String,
           trim: true
       },
       email: {
           type: String,
           unique: true,
           trim: true
       },
       password: {
           type: String,
           minlength: 8
       },
       role: {
           type: String,
           default: "user",
           enum: ["admin", "user"]
       }
}
```

#### Purchase Order

#### Invite