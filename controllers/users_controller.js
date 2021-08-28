
const User = require('../models/user');
const fs = require('fs');
const path = require('path');


module.exports.profile = function(req, res){
  
      User.findById(req.params.id, function (err, user){
          
              return res.render('user_profile', {
                  title :  'User Profile',
                  profile_user : user
              });
            });
}


module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //        req.flash('success', 'Updated');
    //      return res.redirect('back');
    //     })
    // }else{
    //       req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    // } 
    if(req.user.id == req.params.id){
         try {
             let user = await User.findById(req.params.id);
             User.uploadAvatar(req, res, function(err){
             if(err){console.log('****Multer Error:', err)}
             
             user.name = req.body.name;
             user.email = req.body.email;
             if(req.file){
           //   this is saving the path of the uploaded file into the avatar field in the user
             if(user.avatar){
               fs.unlinkSync(path.join(__dirname, '..', user.avatar));
             }



             user.avatar = User.avatarPath + '/' + req.file.filename;
             }
             user.save();
             return res.redirect('back');
         });
         } catch (error) {
            req.flash('error', error);
            console.log("error thrown is: ", error);
            return res.redirect('back');
         }
    }else{
            req.flash('error', 'Unauthorized!');
            return res.status(401).send('Unauthorized');
         } 
}



module.exports.signUp = function(req, res){
     if(req.isAuthenticated()){
       return  res.redirect('/users/profile');
     }

    return res.render('user_sign_up',{
        title : "Codeial | Sign Up"
    })
}



module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
      return  res.redirect(`/users/profile/${req.user.id}`);
    }

    return res.render('user_sign_in',{ 
        title : "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function (req, res) {
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email : req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user in while signing up'); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }
    });
}

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
     req.flash('success', 'Logged in Successfully');
     return res.redirect('/');
}


module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You Have Logged Out!')
    return res.redirect('/');
}