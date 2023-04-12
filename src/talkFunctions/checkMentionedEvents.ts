import { Message } from "discord.js"
import { client } from ".."
import { ohm } from "./mentioned/ohm"
import { ava } from "./mentioned/ava"

export const checkMentionedEvents = (message: Message<boolean>): boolean => {
  if (!client.user || !message.mentions.has(client.user.id)) {
    return false
  }

  // おうむ返し
  if (ohm(message)) {
    return true
  }

  // 何してる？→AVA
  if (ava(message)) {
    return true
  }

  return false
}
