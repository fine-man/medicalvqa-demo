const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    fname: {
        type: String,
        required: true
    },

    lname: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    role: {
        type: String,
        required: true,
        enum: ["viewer", "editor", "admin"],
        default: 'viewer'
    },

    contact: {
        type: Number,
        required: true
    },

    // questions added by the user (can only by added by "editor" or "admin")
    questions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Question'
        }
    ],

    // images added by the user (can only be added by "editor" or "admin")
    images: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Image'
        }
    ],
})

userSchema.statics.signup = async function ({email, password, fname, lname, age, contact}) {
    if (!email || !password) {
        throw Error('Email and Password must be filled')
    }

    const exists = await this.findOne({ email })
    console.log(exists)

    if (exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash, fname, lname, age, contact })
    return user
}

userSchema.statics.login = async function ({ email, password }) {
    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    // here returned user is of type mongoose.Document
    const user = await this.findOne({ email })

    if (!user) {
        throw Error("Incorrect email")
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect Password')
    }

    return user
}

const User = new mongoose.model('User', userSchema)

module.exports = User