export default class Message {

  constructor(userId, text) {
    this.from = userId;
    this.text = text;
  }

  static mapMessage(msg) {
    return {
      from: msg.from.id,
      text: msg.text
    }
  }
}
