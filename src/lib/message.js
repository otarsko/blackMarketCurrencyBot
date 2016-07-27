export default class Message {
  static mapMessage(msg) {
    return {
      from: msg.from.id,
      text: msg.text,
      user: {
        firstName: msg.from.first_name,
        lastName: msg.from.last_name
      }
    }
  }
  
}
