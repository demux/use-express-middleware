"use strict"

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

      // Setup sequence:
      var fnSeq = [].concat(middleware).map(function(fn, i) {
        return function(err) {
          if(err) {return middlewareError(err)}
          fn(req, res, fnSeq[i+1] || allMiddlewareLoaded)
        }
      })

      function middlewareError(err) {
        if(props.isValidUser !== undefined) {
          return props.catchMiddlewareError(err)
        }
        throw err
      }

      function allMiddlewareLoaded() {
        scope.req = req
        scope.res = res

        if(props.isValidUser !== undefined) {
          return props.isValidUser.call(scope, connectionData, authData, callback)
        }
      }

      // Init sequence:
      fnSeq[0]()
    },
    canPerformAction: props.canPerformAction ? props.canPerformAction.bind(scope) : undefined,
    onClientDisconnect: props.onClientDisconnect ? props.onClientDisconnect.bind(scope) : undefined
  }
}
