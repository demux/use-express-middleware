'use strict'

var MockExpressRequest = require('mock-express-request')
var MockExpressResponse = require('mock-express-response')


module.exports = function deepstreamExpress(middleware, isValidUser, catchMiddlewareError) {
  return function(connData, authData, callback) {
    var self = this

    var req = new MockExpressRequest({
      method: 'GET',
      url: '/',
      headers: connData.headers
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
        return catchMiddlewareError.call(self, err)
      }
      throw err
    }

    function allMiddlewareLoaded() {
      connData.req = req
      connData.res = res
      return isValidUser.call(self, connData, authData, callback)
    }

    // Init sequence:
    fnSeq[0]()
  }
}
