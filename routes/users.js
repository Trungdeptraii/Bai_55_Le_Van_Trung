var express = require('express');
var router = express.Router();
const userController = require(`${__dirname}/../controllers/user.controller.js`);

/* GET users listing. */
router.get('/', userController.index);
router.get('/add', userController.add);
router.post('/add', userController.handleAdd);
router.get('/delete/:id', userController.handleId);
router.get('/edit/:id', userController.handleId);
router.post('/delete/:id', userController.handleDelete);
router.post('/edit/:id', userController.handleEdit);

module.exports = router;
