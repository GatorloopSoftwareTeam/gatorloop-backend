## Gatorloop Website Backend

### Overview

This package will run the database and authentication system behind the Gatorloop website. Built on Express.js and MongoDB.

### Development

Want to contribute to the project or test things out?

1. Download and install the latest stable version of node and npm [here](https://nodejs.org/en/).
2. Clone the repository into a local directory.
3. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to set up your own testing database. Follow the instructions to create a free tier instance.
4. To connect your test database, go to the MongoDB Atlas control panel. On your instance, select the CONNECT button. Select "Connect your application". Select "Node.js" driver version "3.0 or later". Copy and paste the url into the [config file](./Config/config.json). The field is `development > database > url`.
4. Run `npm install` to install the compatible version of all dependencies.
5. Run `npm start` to launch the server!

Note: The sample database url in the config file will not run because the password has been redacted.

### API

Current API endpoints for manipulating the database. Parameters should be passed as a JSON object in the body of the request. Most requests must be sent from authenticated through sessions (see *Authentication* section).

#### User

| HTTP VERB | URI                        | Description                       | POST Parameters                      | Permissions                                |
| ---       | ---                        | ---                               | ---                             | ---                                        |
| GET       | `/api/user`                | Get all users                     | none                            | only admin                                 |
| GET       | `/api/user/:email`         | Get user with specified email     | none                            | user & manager -> own info; admin -> all   |
| PUT       | `/api/user/:email`         | Update user with specified email  | name, email (new), password     | user & manager -> own info; admin -> all   |
| POST      | `/api/user/`               | Create new user                   | name, email, password           | invite code needed (no auth needed)        |
| DELETE    | `/api/user/:email`         | Delete user with specified email  | none                            | user & manager -> own info; admin -> all   |
| GET       | `/api/user/:email/promote` | Increase user's permissions       | none                            | sender can promote any other to own level  |

- add endpoint to get POs?

#### PurchaseOrder

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

#### Invite

| HTTP VERB | URI                          | Description                                    | POST Parameters                               | Permissions                           |
| ---       | ---                          | ---                                            | ---                                      | ---                                        |
| GET       | `/api/invite`                | Get all invite codes                           | none                                     | only admin                                 |
| GET       | `/api/invite/:email`         | Get invite code with specified user email      | none                                     | user & manager -> own info; admin -> all   |
| PUT       | `/api/invite/:email`         | Update invite code with specified user email   | code, (new) user email, inviting email   | user & manager -> own info; admin -> all   |
| POST      | `/api/invite/`               | Create new invite code                         | code, (new) user email, inviting email   | manager & admin                            |
| DELETE    | `/api/invite/:email`         | Delete invite code with specified user email   | none                                     | user & manager -> own info; admin -> all   |
| GET       | `/api/invite/confirm/:code`  | Check whether code and user email match        | email                                    | all                                        |

- Might remove edit feature; just delete and create a new one.
- Access by email or by code?
- Is confirm necessary if `/auth/signup` calls same functionality internally?

### Authentication

| HTTP VERB | URI                        | Description                       | Parameters                           |
| ---       | ---                        | ---                               | ---                                  |
| GET       | `/auth/login`              | Shows login screen                 | none                                 |
| POST      | `/auth/login`              | Authenticates credentials          | email, password                      |
| GET       | `/auth/signup`             | Shows signup screen                | none                                 |
| POST      | `/auth/signup`             | Creates user                       | name, email, password, invite code   |
| GET       | `/auth/logout`             | Ends authenticated session         | none                                 |

### Views

| URI       | Description                        | Access             |
| ---       | ---                                | ---                |
| /         | Redirect to home                   | all                |
| /home     | Default page with welcome message  | all                |
| /profile  | Shows user info                    | authenticated user |
| /login    | Shows login form                   | all                |
| /signup   | Shows signup form                  | all                |

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
        enum: ["admin", "manager", "user"]
    },
    purchase_orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseOrder'
    }],
    subteam: {
        type: String,
        enum: [],
        default: "unassigned"
    },
    date_created: {
        type: Date,
        default: Date.now
    }
}
```

- Is it necessary to keep an array of purchase orders if one can use `/api/po/user/:email` ?

#### Purchase Order

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
    file_location: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ["New", "Seen", "Submitted", "Approved", "Ordered", "Delivered"],
        default: "New"
    },
    last_updated: {
        type: Date,
        default: Date.now
    }
}
```

#### Invite

```
{
    user_email: {
        type: String,
        unique: true,
        trim: true
    },
    code: {
      type: String,
      unique: true
    },
    is_confirmed: {
        type: Boolean,
        default: false
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    inviting_email: {
        type: String,
        trim: true
    }
}
```

### TODO
- confirm permissions/schemas
- email notification system
- hash passwords
- attach frontend
- reset password
- confirm email
- request invite code
- UF SAML??