'use strict'

var Promise = require('bluebird')
var MockExpressRequest = require('mock-express-request')
var MockExpressResponse = require('mock-express-response')


module.exports = function useExpressMiddleware(headers, middleware) {
  var req = new MockExpressRequest({
    method: 'GET',
    url: '/',
    headers: headers
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
    return {req: req, res: res}
  })
}
