const keys = require('./keys');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretName;

module.exports=passport =>{
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
        if(jwt_payload&&jwt_payload.id){
            // console.log(jwt_payload);
            return done(null,jwt_payload);
        }else{
            return done(null,false);
        }
    }));

}