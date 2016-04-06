import 'babel-polyfill'

import path from 'path'
import assert from 'assert'
import expressSession from 'express-session'
import sessionFileStore from 'session-file-store'
import passport from 'passport'

import useExpressMiddleware from '../main.js'

import headers from './headers'


const FileStore = sessionFileStore(expressSession)


describe('Passport', () => {
  const user = {
    id: '51e02eb3-f8d5-426f-9d1e-4bcd944c2830',
    name: 'tester',
  }

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((id, done) => {
    done(null, id === user.id ? user : null)
  })

  describe('Session Middleware', () => {
    const session = expressSession({
      store: new FileStore({
        path: path.join(__dirname, 'sessions'),
      }),
      secret: '60dd06aa-cf8e-4cf8-8925-6de720015ebf',
      resave: false,
      saveUninitialized: false,
      name: 'sid',
      cookie: {
        secure: false,
        maxAge: 2147483647  // Never expire
      },
    })

    const middleware = [session, passport.initialize(), passport.session()]

    it('should get the logged in user from session', async (done) => {
      console.log(headers)
      const {req, res} = await useExpressMiddleware(headers, middleware)
      console.log(req)

      assert(req.sessionID === 'VfIvWVttCoYPwMmGLgV3rfQWIphmgixz')
      assert(req.user.id === user.id)

      done()
    })
  })

  describe('OAuth2 Middleware', () => {
    it('has not yet been implemented', () => {
      assert(true)
    })
  })
})
