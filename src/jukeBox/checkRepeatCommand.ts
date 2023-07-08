import { Message } from "discord.js"
import { JukeBoxQueue } from "./queue"

export const checkRepeatCommand = (message: Message<boolean>) => {
  if (message.content.startsWith("!repeat-this") && message.guild) {
    message.reply("今流れてる曲をリピートするね！次に行きたくなったら`!skip`してね")
    JukeBoxQueue.setRepeat(true)
    return true
  } else {
    return false
  }
}
