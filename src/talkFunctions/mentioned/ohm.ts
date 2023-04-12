import { Message } from "discord.js"

export const ohm = (message: Message<boolean>): boolean => {
  if (!message.content.includes("って言って")) {
    return false
  }

  const reactions = ["わかった", "うん", "えー・・・", "しかたないな〜", "おっけ〜"]
  const reply = `${reactions[Math.floor(Math.random() * 5)]}\n${message.content
    .replace("って言って", "")
    .replace(/<@.*>/g, "")
    .trim()}`
  message.reply(reply)

  return true
}
