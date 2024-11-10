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


module.exports.getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};
