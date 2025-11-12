const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' }
}, { timestamps: true });

// Pre-save hook: hash password if it's new or modified
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();

    const saltRounds = 10;
    try {
        this.password = bcrypt.hashSync(this.password, saltRounds);
        return next();
    } catch (err) {
        return next(err);
    }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
