import TelegramBot from "node-telegram-bot-api";
import Message from "./message";
import CallbackQueryMessage from "./callbackQueryMessage";
import config from "../config"
import HandlerRouter from "../handlers";
import I18n from '../services/i18n/i18n';

const handlerRouter = new HandlerRouter();

export default class Messenger {

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.bot = new TelegramBot(config.telegram.token, { webHook: { port: config.telegram.port, host: config.telegram.host } });
      this.bot.setWebHook(config.telegram.externalUrl + ':443/bot' + config.telegram.token);
    } else {
      this.bot = new TelegramBot(config.telegram.token, { polling: {timeout: 10, interval: 100} });
    }
    this.i18n = new I18n();
  }

  listen() {
    this.bot.on('callback_query', this.handleCallbackQuery.bind(this));
    this.bot.on('text', this.handleText.bind(this));

    return Promise.resolve();
  }

  handleText(msg) {
    return this.i18n.init(Message.mapMessage(msg)).
        then(message => handlerRouter.getCommandHandler(message).handle(message, this.bot))
        .catch((err) => {
          log.error('Messenger', err);
          this.bot.sendMessage(message.from, message.__('bot_error'));
        });
  }

  handleCallbackQuery(msg) {
    return this.i18n.init(CallbackQueryMessage.mapMessage(msg)).
        then(message => handlerRouter.getCallbackQueryHandler(message).handleCallbackQuery(message, this.bot))
        .catch((err) => {
          log.error('Messenger', err);
          this.bot.sendMessage(message.from, message.__('bot_error'));
        });
  }
}