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

Current API endpoints for manipulating the database. Parameters should be passed as a JSON object in the body of the request. Most requests must be sent from authenticated through sessions (see *Authentication* section). **Must send correct number of parameters with names as described in these tables.** Some fields are limited to an enumeration of valid values; see schema for respective object for those values.

### Permissions

Authenticated users have a permission role attachted to their session. See Permissions column of each API endpoint.

| Role             | General Description                            |
| ---              | ---                                            |
| user [default]   | Limited permissions for any new user account   |
| member           | Access to view and create Purchase Orders      |
| manager          | Access to edit and updat Purchase Orders       |
| admin            | Access to manage users accounts                |

Planned: Member must have set subteam, confirmed email, and admin approval

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

User emails are unique (see User Schema below) so User endpoints utilize the email field to identify the correct record to manipulate.

| HTTP VERB | URI                               | Description                       | Permissions                                |
| ---       | ---                               | ---                               | ---                                        |
| GET       | `/api/user`                       | Get all users                     | only admin                                 |
| GET       | `/api/user/:email`                | Get user with specified email     | user & manager -> own info; admin -> all   |
| PUT       | `/api/user/:email`                | Update user with specified email  | user & manager -> own info; admin -> all   |
| POST      | `/api/user/`                      | Create new user                   | only admin                                 |
| DELETE    | `/api/user/:email`                | Delete user with specified email  | user & manager -> own info; admin -> all   |
| GET       | `/api/user/:email/promote/:role`  | Increase user's permissions       | sender can promote any other to own level  |

#### POST `/api/user/`

##### Parameters

| Parameter  | Type             | Required  |
| ---        | ---              | ---       |
| name       | String           | yes       |
| email      | String           | yes       |
| subteam    | Enum (String)    | no        |
| password   | String           | yes       |

##### Return Data

New User JSON Object

#### PUT `/api/user/:email` 

##### Parameters

| Parameter  | Type             | Required |
| ---        | ---              | ---      |
| name       | String           | no       |
| email      | String           | no       |
| subteam    | Enum (String)    | no       |
| password   | String           | no       |

##### Return Data

Array of the fields updated

### PurchaseOrder

| HTTP VERB | URI                     | Description                                             | Permissions                                |
| ---       | ---                     | ---                                                     | ---                                        |
| GET       | `/api/po`               | Get all purchase orders                                 | member and above                           |
| GET       | `/api/po/:num`          | Get purchase order with specified number                | member and above                           |
| PUT       | `/api/po/:num`          | Update purchase order with specified number             | member -> own PO; manager & admin -> all   |
| POST      | `/api/po/`              | Create new purchase order                               | member and above                           |
| DELETE    | `/api/po/:num`          | Delete purchase order with specified number             | member -> own PO; manager & admin -> all   |
| GET       | `/api/po/sub/:subteam`  | Get all purchase orders for specified subteam           | member and above                           |
| GET       | `/api/po/user/:email`   | Get all purchase orders for specified user email        | member and above                           |
| POST      | `/api/po/:num/status`   | Set new status of purchase orders for specified number  | manager and above                          |

#### POST `/api/po/`

##### Parameters

| Parameter     | Type          | Required |
| ---           | ---           | ---      |
| owner (email) | String        | no*      |
| description   | String        | yes      |
| parts         | JSON Object   | yes      |
| status        | Enum (String) | no       |
| subteam       | Enum (String) | yes      |
| deadline      | String        | yes      |
| priority      | Enum (Number) | yes      |
| comment       | String        | no       |
| total_price   | Number        | yes      |

*Note: po_number will be ignored as server autogenerates this value*

\* If owner or subteam not sent, those values according to the user's session will be used 

##### Return Data

New PO JSON Object

#### PUT `/api/po/:num` 

##### Parameters

| Parameter     | Type          | Required |
| ---           | ---           | ---      |
| owner (email) | String        | no       |
| description   | String        | no       |
| parts         | JSON Object   | no       |
| status        | Enum (String) | no       |
| subteam       | Enum (String) | no       |
| deadline      | String        | no       |
| priority      | Enum (Number) | no       |
| comment       | String        | no       |
| total_price   | Number        | no       |

##### Return Data

Array of the fields updated

## Authentication

| HTTP VERB | URI                        | Description                        | POST Parameters                                |
| ---       | ---                        | ---                                | ---                                            |
| POST      | `/auth/login`              | Authenticates credentials          | "username", "password" [x-www-form-urlencoded] |
| POST      | `/auth/signup`             | Creates user                       | "name", "email", "password", "subteam"         |
| GET       | `/auth/logout`             | Ends authenticated session         | none                                           |
| GET       | `/auth/status`             | Returns current session status     | none                                           |

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
        enum: ["mech", "ece", "none", "unassigned"],
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
        enum: ["new", "seen", "submitted", "approved", "ordered", "delivered"],
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
- ~~refactor update and create PO to include all changable fields~~
- hash passwords (passport-local-mongoose)
- persitent sessions with database

- validate parts json
- implement array of po numbers in User schema
- update status route for PO
- only admin can demote logic
- determine deadline type in PO schema

- initialize counters dynamically
- ensure proper permissions for each request
- ensure no data is leaked by api response (re: update methods return objects with all fields)
- update documentation for returned data (per endpoint)
- improve console logging

- confirm permissions/schemas
- email notification system
- module for generating pdf/excel spreadsheet

- attach frontend
- reset password
- confirm email
- unit testing!!
- UF SAML??