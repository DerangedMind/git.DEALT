'use strict'

const express = require('express')
const router = express.Router()

module.exports = function(app, passport) {

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { 
      title: 'LCG Castle' 
    })
  })

  router.get('/lobby', function(req, res, next) {
    res.render('lobby', {
      title: ''
    })
  })

  router.get('/create', function(req, res, next) {
    res.render('create', {
      title: ''
    })
  })

  return router
}