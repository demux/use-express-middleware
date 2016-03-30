"use strict"

var Promise = require('bluebird')
var passport = require('passport')
var MockExpressRequest = require('mock-express-request')
var MockExpressResponse = require('mock-express-response')


module.exports = function deepstreamExpress(middleware, props) {
  var scope = {}

  return {
    isValidUser: function(connectionData, authData, callback) {
      var req = new MockExpressRequest({
        method: 'GET',
        url: '/',
        headers: connectionData.headers
      })
      var res = new MockExpressResponse({request: req})

      function use(fn) {
        return new Promise(function(resolve, reject) {
          return fn(req, res, function(err) {
            return err ? reject(err) : resolve()
          })
        })
      }

      return Promise.each([].concat(middleware), use).then(function() {
        scope.req = req
        scope.res = res

        if(props.isValidUser !== undefined) {
          return props.isValidUser.call(scope, connectionData, authData, callback)
        }
      })
    },
    canPerformAction: props.canPerformAction ? props.canPerformAction.bind(scope) : undefined,
    onClientDisconnect: props.onClientDisconnect ? props.onClientDisconnect.bind(scope) : undefined
  }
}
