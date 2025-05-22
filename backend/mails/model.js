import mongoose from "mongoose";

const MailSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  reciever: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["primary", "updates", "promotions", "social"],
    default: "primary",
  },
  subject: {
    type: String,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["seen", "unseen"],
    default: "seen",
  },
  starred: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// export default mongoose.model("Mail", MailSchema);
const MailModel = (mongoose.models.Mail) || (mongoose.model("Mail", MailSchema))
export default MailModel
