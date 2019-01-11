var Task = require('../models/task');
var express = require('express');
var router = express.Router();
var dbHelper = require('../utils/dbHelper');
var serverMethods = require('../utils/serverMethods');
var checkSessionCookie = require('../middleware/checkSessionCookie');

router.use(checkSessionCookie);

router.get('/:id', function (req, res) {
    var taskID = req.params.id;

   dbHelper.findTaskwithID(taskID, function (task) {
       if (!req.body.mobile)
        return res.render("viewTask", {viewTask: task});
       else return res.send(task);
   })
});

module.exports = router;