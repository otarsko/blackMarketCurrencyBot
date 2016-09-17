export default class CallbackQueryMessage {
    static mapMessage(msg) {
        return {
            from: msg.from.id,
            data: msg.data
        }
    }
}
