import { Message } from "discord.js"
import { client } from "."
import { checkMentionedEvents } from "./talkFunctions/checkMentionedEvents"

//メッセージを受け取った時のイベント
export const recievedMessage = async (message: Message<boolean>) => {
  //BOT自身が送ったメッセージだったとき
  if (client.user && message.author.id === client.user.id) {
    return
  }
  if (message.content === "こんにちは") {
    message.reply("やっほー")
  }

  // メンションされた時のイベントがトリガーされるか調べる
  if (checkMentionedEvents(message)) {
    return
  }
}
