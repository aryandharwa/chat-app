const messageModel = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        
        const data = await messageModel.create({
            message: message,
            sender: from,
            receiver: to,
        });

        if (data) return res.json({ msg: "Message sent successfully" });
        return res.json({ msg: "Message not sent" });
    } catch (ex) {
        next(ex);
    }
};


module.exports.getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        console.log('Get All Messages Request:', { from, to });

        const messages = await messageModel
            .find({
                $or: [
                    { sender: from, receiver: to },
                    { sender: to, receiver: from },
                ],
            })
            .sort({ createdAt: 1 });

        console.log('Fetched Messages:', messages);

        const projectMessages = messages.map((msg) => ({
            fromSelf: msg.sender.equals(from),
            message: msg.message,
        }));

        return res.json({ messages: projectMessages }); // Send the response here
    } catch (ex) {
        console.error('Error in getAllMessage:', ex);
        next(ex);
    }
};
