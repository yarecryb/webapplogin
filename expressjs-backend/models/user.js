import mongoose from "mongoose";
import bcrypt from "bcrypt";

var SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema(
    {
        //make usernames unique!
        username: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        token: {
            type: String,
        }
    },
    { collection: "users_list" }
);

// The following functions are from https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
// bcrypt integration from mongodb and npm package bcrypt
UserSchema.pre("save", function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(isMatch);
            }
        });
    });
};

export default mongoose.model("User", UserSchema);