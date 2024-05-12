import { Content, Message } from '../models';

class ContentService {
  static async addContent(content) {
    const { userId, prompt, answer } = content;
    const messages = new Message({ prompt, answer });
    const presavedContents = await Content.findOne({ userId });

    if (presavedContents) {
      presavedContents.messages.push(messages);
      return presavedContents.save();
    } else {
      return Content.create({ userId, messages });
    }
  }

  static getContents(userId) {
    return Content.findOne({ userId });
  }
}

export default ContentService;
