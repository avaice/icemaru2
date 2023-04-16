import { Message } from "discord.js"
import { client } from "../.."

export const ava = (message: Message<boolean>): string | false => {
  if (!message.content.includes("何してる")) {
    return false
  }

  client.user?.setActivity("Alliance of Valiant Arms")
  const reply = "AVAだよ"

  return reply
}
