'use strict'

var MockExpressRequest = require('mock-express-request')
var MockExpressResponse = require('mock-express-response')


module.exports = function useExpressMiddleware(middleware, headers, callback) {
  var req = new MockExpressRequest({
    method: 'GET',
    url: '/',
    headers: headers
  })
  var res = new MockExpressResponse({request: req})

  // Setup sequence:
  var fnSeq = [].concat(middleware).map(function(fn, i) {
    return function(err) {
      if(err) {return callback(err, req, res)}
      fn(req, res, fnSeq[i+1] || allMiddlewareLoaded)
    }
  })

  function allMiddlewareLoaded() {
    callback(null, req, res)
  }

  // Init sequence:
  fnSeq[0]()
}
