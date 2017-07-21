'use strict'
const express = require('express')
const router = express.Router()
const gops = require('../games/gopsHelpers');

module.exports = function(app, passport) {

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', {
      title: 'LCG Castle',
      message: req.flash('loginMessage')
    })
  })

  router.get('/lobby', isLoggedIn, function(req, res, next) {
    res.render('lobby', {
      title: ''
    })
  })

  router.get('/create', isLoggedIn, function(req, res, next) {
    res.render('create', {
      title: ''
    })
  })

  router.post('/create', function(req,res, next){

  });


  router.get('/auth/facebook',
              passport.authenticate('facebook', {
                scope:'email'
              }
            ))
  router.get('/auth/facebook/callback',
              passport.authenticate('facebook', {
                successRedirect: '/lobby',
                failureRedirect: '/'
                }
            ))
  router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout()
    res.redirect('/')
  })

  router.get('/gops/:game_id', isLoggedIn, function(req, res, next) {
    console.log(req.cookies)
    res.render('gopsgame', {
      'title': '',
      'playerHand': [1,2,3,4,5,6,7,8,9,10,11,12,13]
    })
  })

  router.post('/gops/:game_id', isLoggedIn, function(req, res, next) {

  })
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }

    res.redirect('/')
  }

  return router
}