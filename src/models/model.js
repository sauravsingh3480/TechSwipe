const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            maxLength: 15
        },
        lastName: {
            type: String,
            maxLength: 15
        },
        age: {
            type: Number,
            required: true
        },
        gender: {
            type: String,
            required: true,
            enum: {
                values: ["Male", "Female", "Other"],
                message: '{VALUE} is not correct gender'
            }
        },
        emailId: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profileImageURL: {
            type: String
        },
        feedDetails: [
            {
                feedImageURL: { type: String, required: true },
                caption: { type: String, default: null },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        bio: {
            type: String,
            maxLength: [250, "Add smaller bio"]
        },
        skills: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
);

const connectionSchema = mongoose.Schema(
    {
        fromId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        toId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true,
            default : "Pending"
        }
    },
    {
        timestamps: true
    }
);
const userModel = mongoose.model("User", userSchema);
const connectionModel = mongoose.model("Connections",connectionSchema);

module.exports = { User: userModel, Connections : connectionModel };