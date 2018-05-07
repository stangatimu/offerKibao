const express   = require('express'),
      checkAuth = require("../middleware/checkAuth.js"),
      usersController = require("../controllers/users.js"),
       router   = express.Router();


router.post("/signup", usersController.users_signup); 

router.get("/confirmation/:token", usersController.email_confirmation ); 

router.post("/confirmation/resend", usersController.resend_confirmation);
router.post("/login",usersController.users_login);

router.delete('/:id',checkAuth, usersController.users_delete);
router.get('/profile',checkAuth, usersController.users_profile);
router.post('/edit',checkAuth, usersController.users_edit);

module.exports = router; 