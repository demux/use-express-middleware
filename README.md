# deepstream-passport

## Install:

```bash
npm install deepstream-passport --save
```

## Usage:

```javascript
import Deepstream from 'deepstream.io'
import deepstreamPassport from 'deepstream-passport'
import expressSession from 'express-session'

const server = new Deepstream()

// You can define this somewhere in your app and then import it both
//  for express and deepstream.
// If you use a store such as redis for you sessions, you'll be able
//  to run express and deepstream in two seperate processes and/or on
//  two seperate ports if you so please.
const session = expressSession({
  ...options
})

// Basic:
server.set('permissionHandler', deepstreamPassport(session, {
  canPerformAction(user, callback) {
    callback(null, user.isAdmin)
  }
}))

// Custom `isValidUser`:
server.set('permissionHandler', deepstreamPassport(session, {
  isValidUser: (user, callback) => {
    if(user) {
      callback(null, user.id)
    } else {
      callback(null, 'open')
    }
  },

  canPerformAction(user, callback) {
    callback(null, user.isAdmin)
  }
}))
```
