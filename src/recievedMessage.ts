import { Message } from "discord.js"
import { client } from "."
import { checkPlayCommand } from "./jukeBox/checkPlayCommand"
import { jukeBox } from "./jukeBox/jukeBox"
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

  if (jukeBox(message)) {
    return
  }

  // メンションされた時のイベントがトリガーされるか調べる
  const mentionEvents = checkMentionedEvents(message)
  if (mentionEvents) {
    message.reply(mentionEvents)
    return
  }
}
