'use strict'

var MockExpressRequest = require('mock-express-request')
var MockExpressResponse = require('mock-express-response')


module.exports = function deepstreamExpress(middleware, isValidUser, catchMiddlewareError) {
  return function(connectionData, authData, callback) {
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
      if(catchMiddlewareError !== undefined) {
        return catchMiddlewareError(err)
      }
      throw err
    }

    function allMiddlewareLoaded() {
      if(isValidUser !== undefined) {
        var scope = {
          req: req,
          res: res
        }
        return isValidUser.call(scope, connectionData, authData, callback)
      }
    }

    // Init sequence:
    fnSeq[0]()
  }
}
