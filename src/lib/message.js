export default class Message {

  static mapMessage(msg) {

    var command,
        options;

    if (msg.text.indexOf(' ') > -1) {
      var splitted = msg.text.split(' ');
      command = splitted[0];
      options = splitted.slice(1).join(' '); //to get options with spaces

      //todo: use some lib for options extraction?
    } else {
      command = msg.text;
    }

    return {
      from: msg.from.id,
      command: command,
      options: options
    }
  }
}
