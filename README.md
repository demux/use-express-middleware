# deepstream-passport

## Install:

```bash
npm install use-express-middleware --save
```

## Usage:

### Deepstream passport authentication:

```javascript
import Deepstream from 'deepstream.io'
import useExpressMiddleware from 'use-express-middleware'
import expressSession from 'express-session'
import passport from 'passport'

const server = new Deepstream()

// You can define this somewhere in your app and then import it both
//  for express and deepstream.
// If you use a store such as redis for you sessions, you'll be able
//  to run express and deepstream in two seperate processes and/or on
//  two seperate ports if you so please.
const session = expressSession({
  ...options
})

const middleware = [session, passport.initialize(), passport.session()]

// Using a callback:
server.set('permissionHandler', {
  isValidUser(connectionData, authData, callback) {
    useExpressMiddleware(connectionData.headers, middleware, (req, res) => {
      if(req.user) {
        callback(null, req.user.id)
      } else {
        callback(null, 'open')
      }
    })
  },

  canPerformAction(id, message, callback) {
    const user = getUserFromId(id)  // pseudo code

    callback(null, user.isAdmin)
  }
})

// Using promises and async/await:
server.set('permissionHandler', {
  isValidUser: async (connectionData, authData, callback) => {
    const {req, res} = await useExpressMiddleware(connectionData.headers, middleware)

    if(req.user) {
      callback(null, req.user.id)
    } else {
      callback(null, 'open')
    }
  },

  ...
})
```
