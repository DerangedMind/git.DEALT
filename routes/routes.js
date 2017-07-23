'use strict'
const express = require('express')
const router = express.Router()
const gopsgame = require('../lib/knexFunctions')
const knex = require('../knexserver')

module.exports = function(app, passport) {

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', {
      title: 'LCG Castle',
      message: req.flash('loginMessage')
    })
  })

  router.get('/lobby', isLoggedIn, function(req, res, next) {
    let gameList = { }
    
    knex.select('game_id')
      .count('user_id')
      .from('gamedetails')
      .join('user_games', 'gamedetails.id', '=', 'user_games.game_id')
      .join('users', 'user_games.user_id', '=', 'users.id')
      .where('gamedetails.status', '=', 'In Queue')
      .groupBy('game_id')
      .orderBy('game_id')
      .then( function(gameids) {
        console.log(gameids)
        gameids.forEach(function (game) {
          gameList[game.game_id] = { }
          gameList[game.game_id].players = game.count
        })
        console.log(gameList)
        res.render('lobby', {
          title: '',
          gameList: gameList
        })
      })
  })

  router.get('/create', isLoggedIn, function(req, res, next) {
    res.render('create', {
      title: ''
    })
  })
  
  router.post('/create', function(req,res, next){

  });

  router.get('/users/:id', function(req, res, next) {
    res.render('profile', {
      title: '',
      id: req.params.id,
    })
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
      'playerHand': ['A',2,3,4,5,6,7,8,9,10,'J','Q','K']
    })
  })

  router.get('/gops/:game_id/ready_check', isLoggedIn, function(req, res, next) {

  })

  router.post('/gops/:game_id', isLoggedIn, function(req, res, next) {
    console.log('testing post')
    playCard(req.params.game_id, req.session.passport.user[0], req.body.card)

  })

  function isLoggedIn(req, res, next) {
    // if (req.isAuthenticated()) {
      return next()
    // }

    res.redirect('/')
  }

  return router
}