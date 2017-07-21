const router = express.Router()

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

module.exports = router
