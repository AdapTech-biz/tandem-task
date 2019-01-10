var Task = require('../models/task');
var express = require('express');
var router = express.Router();
var dbHelper = require('../utils/dbHelper');
var serverMethods = require('../utils/serverMethods');
var checkSessionCookie = require('../middleware/checkSessionCookie');

router.use(checkSessionCookie);

router.get('/:id', function (req, res) {
    var taskID = req.params.id;
   Task.findById(taskID, function (err, foundTask) {
      try{
          res.send(foundTask);
      } catch (err) {
          console.log(err);
      }
   });
});

module.exports = router;