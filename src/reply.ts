import { Message } from "discord.js"
import { voiceTalk } from "./voiceTalk"

export const reply = async (message: Message<boolean>, text: string) => {
  const isJoinedVoiceChannel = !!(message.guild && voiceTalk.isJoined(message.guild?.id))

  if (isJoinedVoiceChannel && message.guild) {
    voiceTalk.say({
      guildId: message.guild.id,
      text: text
    })
  } else {
    message.reply(text)
  }
}
