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
    gopsgame.createGame(req.session.passport.user[0].id);
    console.log("Post Successful");
    res.redirect("/lobby");
  });

  router.get('/users/:id', function(req, res, next) {
    let gameList = { }

    knex.select('game_id', 'name')
      .count('user_id')
      .from('gamedetails')
      .join('user_games', 'gamedetails.id', '=', 'user_games.game_id')
      .join('users', 'user_games.user_id', '=', 'users.id')
      .where('users.id', '=', req.params.id)
      .groupBy('game_id', 'name')
      .orderBy('game_id')
      .then( function(gameids) {
        console.log(gameids)

        gameids.forEach(function (game) {
          gameList[game.game_id] = { }
          gameList[game.game_id].id = game.game_id
          gameList[game.game_id].players = game.count
          gameList.name = game.name
        })

        res.render('profile', {
          title: '',
          id: req.params.id,
          gameList: gameList
        })
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

  router.get('/join/:game_id', isLoggedIn, function(req, res, next) {
    let gameid = req.params.game_id
    let userid = req.session.passport.user[0].id

    let addPlayer = new Promise(
      (resolve, reject) => {
        resolve(gopsgame.addPlayer(gameid, userid))
      }
    )
    addPlayer.then(
      res.redirect(`/gops/${gameid}`)
    )
  }) 

  router.get('/gops/:game_id', isLoggedIn, function(req, res, next) {
    
    // if the number of players in the game is less than 2
    // add the player first
    // then continue

    // if the game is full and player is not in game
    // redirect to lobby
    // if we can, leave a small .alert

    console.log(req.cookies)
    let gameid = req.params.game_id
    let userid = req.session.passport.user[0].id

    knex.select('user_id', 'name')
      .from('users')
      .join('user_games', 'user_games.user_id', '=', 'users.id')
      .where('user_games.game_id', '=', req.params.game_id)
      .then( function(names) {
        console.log(names)

        let players = { }
        for (let player in names) {
          players[player] = { }
          players[player].id = names[player].user_id
          players[player].name = names[player].name
          players[player].played = gopsgame.showPlayerPlayed(gameid, names[player].user_id)
          players[player].score = gopsgame.showPoints(gameid, names[player].user_id)
        }
        // list of users playing gameid
        // their names
        // their scores
        // whether they have played
        // therefore, i need each player's userid

        res.render('gopsgame', {
          'title': '',
          'playerHand': gopsgame.showHand(gameid, userid),
          'readyCards': gopsgame.showPlayedCount(gameid),
          'players': players,
          'currentPrize': gopsgame.showPrize(gameid)
        })
    })
  })

  router.get('/gops/:game_id/ready_check', isLoggedIn, function(req, res, next) {
    
  })

  router.post('/gops/:game_id', isLoggedIn, function(req, res, next) {
    console.log('testing post')
    gopsgame.playCard(req.params.game_id, req.session.passport.user[0].id, req.body.card);
    gopsgame.endRound(req.params.game_id);
    // gopsgame.getGameWinner(req.params.game_id);
    res.send(200)

  })

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }

    res.redirect('/')
  }

  return router
}