import { Message } from "discord.js"

export const ohm = (message: Message<boolean>): string | false => {
  if (!message.content.includes("って言って")) {
    return false
  }

  const reactions = ["わかった", "うん", "えー・・・", "しかたないな〜", "おっけ〜"]
  const reply = `${reactions[Math.floor(Math.random() * 5)]}\n${message.content
    .replace("って言って", "")
    .replace(/<@.*>/g, "")
    .trim()}`

  return reply
}
