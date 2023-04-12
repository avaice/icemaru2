import { Message } from "discord.js"
import { client } from "../.."

export const ava = (message: Message<boolean>): boolean => {
  if (!message.content.includes("何してる")) {
    return false
  }

  client.user?.setActivity("Alliance of Valiant Arms")
  const reply = "AVAだよ"
  message.reply(reply)

  return true
}
