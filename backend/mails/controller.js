import MailModel from "./model.js";

export const createMail = async (req, res) => {
  const { sender, reciever, type, body } = req.body;

  try {
    const mail = new MailModel({
      sender,
      reciever,
      type,
      body,
    });

    await mail.save();
    res.status(201).json(mail);
  } catch (error) {
    res.status(500).json({ message: "Error creating mail", error });
  }
};

export const getMails = async (req, res) => {
  try {
    const mails = await MailModel.find();
    res.status(200).json(mails);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMail = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the mail by ID and delete it
    await MailModel.deleteOne({
      _id: id,
    })
    
    res.status(500).json({ message: "Mail deleted", error });
  } catch (error) {
    res.status(500).json({ message: "Error deleting mail", error });
  }
};

export const starMail = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the mail by ID and mark it as starred
    const mail = await MailModel.findOne({
      _id: id,
    })

    if (!mail) return res.status(404).json({ message: "Mail not found" });
    mail.starred = !mail.starred
    await mail.save()
    res.status(201).json(mail);

  } catch (error) {
    res.status(500).json({ message: "Error starring mail", error });
  }
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the mail by ID and mark it as read
    const mail = await MailModel.findOne({
      _id: id,
    })
    console.log("read/mail",mail)

    if (!mail) return res.status(404).json({ message: "Mail not found" });
    mail.status = 'seen'
    await mail.save()
    res.status(201).json(mail);

  } catch (error) {
    res.status(500).json({ message: "Error starring mail", error });
  }
};
