var Poll=require('../models/poll');

//all polls
exports.polls_list=function(req,res,next){
    Poll.find({}).exec(function(err,list_polls){
    if(err) {next(err);}
    if(req.isAuthenticated){
       res.render('welcome',{title:'VotingApp',polls_list:list_polls,user:req.user,active:"home"});  
    }
       else{
        res.render('welcome',{title:'VotingApp',polls_list:list_polls,active:"home"});    
       }
       
    });
    
    
};
//list of polls owned by a user 
exports.mypolls_list=function(req,res,next){
    
    Poll.find({owner:req.user._id}).exec(function(err,list_polls){
    if(err) {next(err);}
       res.render('welcome',{title:'VotingApp',polls_list:list_polls,user:req.user,active:"mypolls"}); 
    });
    
    
};
//show poll's details
exports.poll_details=function(req,res,next){
   Poll.findOne({_id:req.params.id}).exec(function(err,found){
       if(err) throw err;
       
        res.render('update_poll',{title:'VotingApp',poll:found,options_list:Object.keys(found.options),user:req.user,active:''});   
   })
    
    
};

//update a poll
exports.update_poll=function(req,res,next){
    req.checkBody('sel1', 'Invalid option').isAlphanumeric();
    req.sanitizeBody('sel1').escape().trim();
    
    var errors = req.validationErrors();
    
    Poll.findOne({_id: req.params.id},function(err,the_poll){
      if(err) throw err;
      if (errors) {
    
    //res.render('update_poll',{title:'VotingApp',poll:the_poll,options_list:Object.keys(the_poll.options),active:'',errors:[{msg:"Invalid option"}]});   
    res.send({"success":false,"reason":"Invalid Option"})
    }
    else{
        
      if(req.user){
          if(the_poll.u_voters.indexOf(req.user.id)!==-1){
              res.send({"success":false,"reason":"Only one vote is allowed per user or ip address"});
          }
          else{
             if (Object.keys(the_poll.options).indexOf(req.body.sel1)==-1){
                 the_poll.options[req.body.sel1]=0;
             }
             the_poll.options[req.body.sel1]++;
             the_poll.u_voters.push(req.user.id);
             the_poll.markModified('options');
             the_poll.markModified("u_voters");
             
                    the_poll.save(function(err, saved_poll,num_rows){
          if(err) throw err;
          res.send({"success":true});
      });
             
          }
          
      }
      else {
          if(the_poll.a_voters.indexOf(req.header("x-forwarded-for").split(',')[0])!==-1){
              res.send({"success":false,"reason":"Only one vote is allowed per user or ip address"});
              
          }
          else{
              if (Object.keys(the_poll.options).indexOf(req.body.sel1)==-1){
                 the_poll.options[req.body.sel1]=0;
             }
              the_poll.options[req.body.sel1]++;
             the_poll.a_voters.push(req.header("x-forwarded-for").split(',')[0]);
             the_poll.markModified('options');
             the_poll.markModified("a_voters");
             
             the_poll.save(function(err, saved_poll,num_rows){
          if(err) throw err;
          res.send({"success":true});
      });
          }
      }
    }
      
  });
  
      
    
    
   
};

//create a new poll
exports.create_poll=function(req,res,next){
  //validation and sanitization of entered fields
  req.checkBody('title', 'Invalid title').isAlphanumeric();
  req.checkBody('options','Invalid option(s)').areOptions();
  
  req.sanitizeBody('title').escape().trim();
  req.sanitizeBody('userid').trim();
  
  var errors = req.validationErrors();
    if (errors) {
    // Render the form using error information
    res.render('new_poll',{title:"VotingApp",user:req.user,active:"newpoll",ptitle:req.body.title,poptions:req.body.options,errors:errors});
    }
    else {
   //check if the polls's title is not already used
   Poll.findOne({title:req.body.title}).exec(function(err,doc){
       if(err) throw err;
       if(doc){
           //if it is , re-render with an error message
           res.render('new_poll',{title:"VotingApp",user:req.user,active:"newpoll",ptitle:req.body.title,poptions:req.body.options,errors:[{msg:"a poll with this title already exists."}]});
       }
       else{
           //if it is not, creat a new poll and redirect to its detail page
           var newPoll=new Poll();
  newPoll.owner=req.body.userid;
  newPoll.title=req.body.title;
  var voted_options={};
  req.body.options.split(',').forEach(function(o){
     voted_options[o]=0;
  });
  newPoll.options=voted_options;
  newPoll.a_voters=[];
  newPoll.u_voters=[];
  newPoll.save(function(err){
     if(err) throw err;
     res.redirect(/poll/+newPoll._id);
  });
  
           
       }
   })
    
    }
  
};

//delete a poll by its owner
exports.delete_poll=function(req,res,next){
  Poll.deleteOne({_id:req.body.pollid},function(err){
      if(err) throw err;
  });
  res.redirect('/polls');
};

