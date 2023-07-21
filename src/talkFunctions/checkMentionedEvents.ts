import { Message } from "discord.js"
import { client } from ".."
import { ohm } from "./mentioned/ohm"
import { ava } from "./mentioned/ava"
import { kakkoii } from "./mentioned/kakkoii"
import { icemaruGPT } from "../icemaruGPT"

export const checkMentionedEvents = (message: Message<boolean>): string | false => {
  if (!client.user || !message.mentions.has(client.user.id)) {
    return false
  }

  const checkFunctions = [ohm /* おうむ返し */, ava /* AVAしてる */, kakkoii /* かっこいいorかわいい */]

  for (let i = 0; i < checkFunctions.length; i++) {
    const result = checkFunctions[i](message)
    if (result) {
      return result
    }
  }

  return false
}
