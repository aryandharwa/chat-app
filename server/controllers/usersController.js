const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {

    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) 
            return res.json({ msg: "Username already exists", status: false });
        const emailCheck = await User.findOne({ email });
        if (emailCheck) 
            return res.json({ msg: "Email already exists", status: false });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email, 
            username, 
            password: hashedPassword,
        });
        delete user.password;
        return res.json({ status: true, user });
    }
    catch (err) {
        next(err);
    }               
}

module.exports.login = async (req, res, next) => {

try {
    const { username, password } = req.body;
    const userProfile = await User.findOne({ username });
    if (!userProfile)
        return res.json({ msg: "Incorrect username or password", status: false });
    const isPasswordValid = await bcrypt.compare(password, userProfile.password);
    if (!isPasswordValid)
        return res.json({ msg: "Incorrect username or password", status: false });
    delete userProfile.password;

    return res.json({ status: true, user: userProfile }); 
}
catch (err) {
    next(err);
}               
}


module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage  = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            avatarImage,
            isAvatarImageSet: true,
        });

        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    }
    catch (err) {
        next(err);
    }
};


module.exports.getAllUsers = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const users = await User.find({ _id: { $ne: userId } }).select(
            "email username avatarImage _id"
        );
        return res.json(users);
    } catch (err) {
        next(err);
    }
};

