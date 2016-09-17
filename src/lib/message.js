export default class Message {

  static mapMessage(msg) {
    return {
      from: msg.from.id,
      text: msg.text
    }
  }
}
