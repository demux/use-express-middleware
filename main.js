'use strict'

var MockExpressRequest = require('mock-express-request')
var MockExpressResponse = require('mock-express-response')


module.exports = function useExpressMiddleware(headers, middleware, callback) {
  var req = new MockExpressRequest({
    method: 'GET',
    url: '/',
    headers: headers
  })
  var res = new MockExpressResponse({request: req})

  var fnSeq = [].concat(middleware).reduceRight(function(next, fn) {
    return function() {fn(req, res, next)}
  }, function() {
    callback(req, res)
  })

  if(callback) {
    fnSeq()
  } else {
    return new Promise(function(resolve, reject) {
      try {
        callback = function(req, res) {
          resolve({req, res})
        }
        fnSeq()
      } catch (e) {
        reject(e)
      }
    })
  }
}
