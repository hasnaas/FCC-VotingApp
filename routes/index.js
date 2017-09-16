var express = require('express');
var passport=require('../config/passport');
var poll_controller=require('../controllers/pollController');

var router = express.Router();

// Initialize Passport and restore authentication state, if any, from the
// session
router.use(passport.initialize());
router.use(passport.session());

/*Authentication */
router.get('/auth/twitter',passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', { display:'popup',failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
});
router.get('/logout',function(req,res){
req.logout();
res.redirect('/polls');
});
/* GET home page. */
router.get('/',poll_controller.polls_list);
/* List all polls */
router.get('/polls',poll_controller.polls_list);
/* List the polls of a particular user */
router.get('/mypolls',poll_controller.mypolls_list);
/*delete a poll*/
router.post('/poll/delete',poll_controller.delete_poll);
/* display summary + update form */
router.get('/poll/:id',poll_controller.poll_details); 
router.post('/poll/:id',poll_controller.update_poll); 
/*create a new poll */
router.get('/newpoll',function(req,res){
    res.render('new_poll',{title:"VotingApp",user:req.user,active:"newpoll"});
})
router.post('/newpoll',poll_controller.create_poll);



module.exports=router;