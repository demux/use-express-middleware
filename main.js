"use strict"

var Promise = require('bluebird')
var passport = require('passport')
var MockExpressRequest = require('mock-express-request')
var MockExpressResponse = require('mock-express-response')


function deepstreamPassport(session, props) {
  var user = null

  return {
    isValidUser: function(connectionData, authData, callback) {
      var req = new MockExpressRequest({
        method: 'GET',
        url: '/',
        headers: {
          Cookie: connectionData.headers.cookie
        }
      })
      var res = new MockExpressResponse({request: req})

      function use(fn) {
        return new Promise(function(resolve, reject) {
          return fn(req, res, function(err) {
            return err ? reject(err) : resolve()
          })
        })
      }

      return use(session).then(function() {
        return use(passport.initialize())

      }).then(function() {
        return use(passport.session())

      }).then(function() {
        user = req.user

        if(props.isValidUser !== undefined) {
          return props.isValidUser(user, callback)
        }

        if(user) {
          return callback(null, user.id)
        }

        return callback(null, 'anon')
      })
    },

    canPerformAction: function(id, message, callback) {
      props.canPerformAction(user, callback)
    },

    onClientDisconnect: function(user) {
      if(typeof props.onClientDisconnect !== 'undefined') {
        props.onClientDisconnect(user)
      }
    }
  }
}


module.exports = deepstreamPassport
