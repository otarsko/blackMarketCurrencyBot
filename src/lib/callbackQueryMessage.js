export default class CallbackQueryMessage {
    static mapMessage(msg) {
        return {
            from: msg.from.id,
            data: msg.data,
            user: {
                firstName: msg.from.first_name,
                lastName: msg.from.last_name
            }
        }
    }
}
