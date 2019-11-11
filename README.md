# Gatorloop Website Backend

## Overview

This package will run the database and authentication system behind the Gatorloop website. Built on Express.js and MongoDB.

## Development

Want to contribute to the project or test things out?

1. Download and install the latest stable version of node and npm [here](https://nodejs.org/en/).
2. Clone the repository into a local directory.
3. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to set up your own testing database. Follow the instructions to create a free tier instance.
4. To connect your test database, go to the MongoDB Atlas control panel. On your instance, select the CONNECT button. Select "Connect your application". Select "Node.js" driver version "3.0 or later". Copy and paste the url into the [config file](./Config/config.json). The field is `development > database > url`.
4. Run `npm install` to install the compatible version of all dependencies.
5. Run `npm start` to launch the server!

Note: The sample database url in the config file will not run because the password has been redacted.

## API

Current API endpoints for manipulating the database. Parameters should be passed as a JSON object in the body of the request. Most requests must be sent from authenticated through sessions (see *Authentication* section). **Must send correct number of parameters with names as described in these tables.**

### Response Format

Upon each API call, the server will return a JSON object with the following formats.

#### Success

```
{
    "success": true,
    "message": "message"
    "data": JSON
}
```

#### Error

```
{
    "success": false,
    "error": String
}
```

### User

| HTTP VERB | URI                               | Description                       | Permissions                                |
| ---       | ---                               | ---                               | ---                                        |
| GET       | `/api/user`                       | Get all users                     | only admin                                 |
| GET       | `/api/user/:email`                | Get user with specified email     | user & manager -> own info; admin -> all   |
| PUT       | `/api/user/:email`                | Update user with specified email  | user & manager -> own info; admin -> all   |
| POST      | `/api/user/`                      | Create new user                   | only admin                                 |
| DELETE    | `/api/user/:email`                | Delete user with specified email  | user & manager -> own info; admin -> all   |
| GET       | `/api/user/:email/promote/:role`  | Increase user's permissions       | sender can promote any other to own level  |

- add endpoint to get POs?

#### POST `/api/user/`

#### Parameters

| Parameter  | Required |
| ---        | ---      |
| name       | yes      |
| email      | yes      |
| subteam    | no       |
| password   | yes      |

#### Return Data

New User JSON Object

##### PUT `/api/user/:email` Parameters
| Parameter  | Required |
| ---        | ---      |
| name       | no       |
| email      | no       |
| subteam    | no       |
| password   | no       |

#### Return Data

Array of fields updated

### PurchaseOrder

| HTTP VERB | URI                     | Description                                             | POST Parameters        | Permissions                                |
| ---       | ---                     | ---                                                     | ---                    | ---                                        |
| GET       | `/api/po`               | Get all purchase orders                                 | none                   | manager & admin                            |
| GET       | `/api/po/:num`          | Get purchase order with specified number                | none                   | user -> own PO; manager & admin -> all     |
| PUT       | `/api/po/:num`          | Update purchase order with specified number             | TODO                   | user -> own PO; manager & admin -> all     |
| POST      | `/api/po/`              | Create new purchase order                               | TODO                   | all                                        |
| DELETE    | `/api/po/:num`          | Delete purchase order with specified number             | none                   | manager & admin                            |
| GET       | `/api/po/sub/:subteam`  | Get all purchase orders for specified subteam           | none                   | user -> own subteam; manager & admin       |
| GET       | `/api/po/user/:email`   | Get all purchase orders for specified user email        | none                   | user -> own email; manager & admin         |
| POST      | `/api/po/:num/status`   | Set new status of purchase orders for specified number  | new status             | manager & admin                            |

## Authentication

| HTTP VERB | URI                        | Description                        | POST Parameters                  |
| ---       | ---                        | ---                                | ---                              |
| POST      | `/auth/login`              | Authenticates credentials          | "username", "password"           |
| POST      | `/auth/signup`             | Creates user                       | "name", "username", "password"   |
| GET       | `/auth/logout`             | Ends authenticated session         | none                             |
| GET       | `/auth/status`             | Returns current session status     | none                             |

## Views

| URI       | Description                        | Access             |
| ---       | ---                                | ---                |
| /         | Redirect to home                   | all                |
| /home     | Default page with welcome message  | all                |
| /profile  | Shows user info                    | authenticated user |
| /login    | Shows login form                   | all                |
| /signup   | Shows signup form                  | all                |

## Schemas

Each type of object stored in the database is defined by a schema (like a blueprint). For more information, see the mongoose documentation on the topic [here](https://mongoosejs.com/docs/guide.html).

### User

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
    //deprecated
    password: {
        type: String,
        minlength: 8
    },
    password_hash: {
        type: String
    },
    password_salt: {
       type: String
    },
    role: {
        type: String,
        default: "user",
        enum: ["admin", "manager", "member", "user"]
    },
    subteam: {
        type: String,
        enum: ["Mech", "ECE", "None", "unassigned"],
        default: "unassigned"
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    email_confirmed: {
        type: Boolean,
        default: false
    }
}
```

- Is it necessary to keep an array of purchase orders if one can use `/api/po/user/:email` ?

### Purchase Order

```
{
    owner: {
        type: String
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    po_number: {
        type: Number,
        unique: true
    },
    description: {
        type: String
    },
    parts: [Part],
    status: {
        type: String,
        enum: ["New", "Seen", "Submitted", "Approved", "Ordered", "Delivered"],
        default: "New"
    },
    subteam: {
        type: String,
        enum: [],
        default: "unassigned"
    },
    last_updated: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date
    },
    priority: {
        type: Number,
        enum: [1,2,3,4,5]
    },
    comment: {
        type: String
    },
    total_price: {
        type: Number
    }
}
```

#### Part

Subset of Purchase Order Schema.

```
{
    url: String,
    vendor: String,
    price: Number,
    quantity: Number
}
```

## License

Copyright (C) 2019, Gatorloop Team, University of Florida. All Rights Reserved.

## TODO
- ~~standardize json responses~~
- ~~refactor update and create user to include all changeable fields~~
- refactor update and create PO to include all changable fields
- hash passwords (passport-local-mongoose)

- ensure proper permissions for each request
- ensure no data is leaked by api response (re: update methods)
- update documentation for returned data (per endpoint)
- improve console logging

- confirm permissions/schemas
- email notification system
- attach frontend
- reset password
- confirm email
- unit testing!!
- UF SAML??