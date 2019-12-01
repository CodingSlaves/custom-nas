const mongoose = require('mongoose');
const bcyrpt = require('bcrypt');

mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true
    },
    PW: {
        type: String,
        required: true
    }
});

userSchema.statics.create = function(username, PW) {
    const user = new this({
        username: username,
        PW: PW
    });

    return user.save();
}


userSchema.statics.findOneByUsername = function(username){
    return this.findOne({ username : username });
}

userSchema.pre('save', function(next){
    let user = this;
    if (!user.isModified('PW')) next();
    bcyrpt.hash(user.PW, 10)
        .then((hash) => {
            user.PW = hash;
            next();
        })
        .catch((err) => {
            next(err);
        });
});

userSchema.methods.comparePW = function(PW) {
    return bcyrpt.compare(PW, this.PW);
}

module.exports = mongoose.model('User', userSchema);