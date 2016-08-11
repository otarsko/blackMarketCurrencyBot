import TelegramBot from "node-telegram-bot-api";
import Message from "./message";
import CallbackQueryMessage from "./callbackQueryMessage";
import config from "../config"
import HandlerRouter from "../handlers";

const handlerRouter = new HandlerRouter();

export default class Messenger {

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.bot = new TelegramBot(config.telegram.token, { webHook: { port: config.telegram.port, host: config.telegram.host } });
      this.bot.setWebHook(config.telegram.externalUrl + ':443/bot' + config.telegram.token);
    } else {
      this.bot = new TelegramBot(config.telegram.token, { polling: {timeout: 10, interval: 100} });
    }
  }

  listen() {
    this.bot.on('callback_query', this.handleCallbackQuery.bind(this));
    this.bot.on('text', this.handleText.bind(this));

    return Promise.resolve();
  }

  handleText(msg) {
    var message = Message.mapMessage(msg);
    return handlerRouter.getCommandHandler(message).handle(message, this.bot);
  }

  handleCallbackQuery(msg) {
    var message = CallbackQueryMessage.mapMessage(msg);
    return handlerRouter.getCallbackQueryHandler(message).handleCallbackQuery(message, this.bot);
  }
}