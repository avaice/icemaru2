import { Message } from "discord.js"

export const kakkoii = (message: Message<boolean>): string | false => {
  if (!message.content.includes("かっこいい") && !message.content.includes("かわいい")) {
    return false
  }

  const reactions = ["わかる", "わからなくもない", "冗談きついよ", "たしかに☆", "はいはい〜"]
  const reply = reactions[Math.floor(Math.random() * 5)]

  return reply
}
