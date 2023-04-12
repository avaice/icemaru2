import { Message } from "discord.js"
import { client } from "."

//メッセージを受け取った時のイベント
export const recievedMessage = async (message: Message<boolean>) => {
  //BOT自身が送ったメッセージだったとき
  if (client.user && message.author.id === client.user.id) {
    return
  }
  if (message.content === "こんにちは") {
    message.reply("やっほー")
  }
}
