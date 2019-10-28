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

Current API endpoints for manipulating the database. Parameters should be passed as a JSON object in the body of the request. Most requests must be sent from authenticated through sessions (see next section).

#### User

| HTTP VERB | URI                        | Description                       | Parameters                      | Permissions                                |
| ---       | ---                        | ---                               | ---                             | ---                                        |
| GET       | `/api/user`                | Get all users                     | none                            | only admin                                 |
| GET       | `/api/user/:email`         | Get user with specified email     | none                            | user & manager -> own info; admin -> all   |
| PUT       | `/api/user/:email`         | Update user with specified email  | name, email (new), password     | user & manager -> own info; admin -> all   |
| POST      | `/api/user/`               | Create new user                   | name, email, password           | invite code needed (no auth needed)        |
| DELETE    | `/api/user/:email`         | Delete user with specified email  | none                            | user & manager -> own info; admin -> all   |
| GET       | `/api/user/:email/promote` | Increase user's permissions       | none                            | sender can promote any other to own level  |

#### PurchaseOrder

#### Invite

### Authorization

| HTTP VERB | URI                        | Description                       | Parameters                      | Permissions        |
| ---       | ---                        | ---                               | ---                             | ---                |
| GET       | `/auth/login`              | Show login screen                 | none                            | no auth needed     |
| POST      | `/auth/login`              | Authenticate credentials          | username, password              | no auth needed     |
| GET       | `/auth/logout`             | End authenticated session         | none                            | no auth needed     |

### Views

| URI       | Description                        | Access             |
| ---       | ---                                | ---                |
| /         | redirect to home                   | all                |
| /home     | default page with welcome message  | all                |
| /profile  | shows user info                    | authenticated user |

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

#### Purchase Order

```
{
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    }
}
```