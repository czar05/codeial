const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.createSession = async function (req, res) {

    try {
        let user = await User.findOne({email: req.body.email});
    

        if(!user || user.password != req.body.password){
            return res.json(422, {
                messgae: "Invalid username or password"
            });
        }

         return res.json(200, {
             messgae: 'Sign in successfully, here is your token, please keep it safe',
             data: {
                 token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '100000'})
             }
         })

    } catch (error) {
        console.log('*****', error);
        return res.json(500, {
            messgae: "Internal server Error"
        });
    }
};
