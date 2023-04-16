import { getVoiceConnection } from "@discordjs/voice"
import { Message } from "discord.js"

export const checkStopCommand = (message: Message<boolean>) => {
  if (message.content.startsWith("!stop") && message.guild) {
    // コマンドを実行したメンバーがいるボイスチャンネルを取得
    const channel = message.member?.voice?.channel

    if (!channel) {
      message.reply("そのコマンドは再生しているチャンネルにいる人じゃないと使えないよ～")
      return false
    }
    const connection = getVoiceConnection(channel.guild.id)
    if (!connection) {
      message.reply("私はうたってないよ～")
      return false
    }

    connection.destroy()
    message.reply("ばいばい～")

    return true
  } else {
    return false
  }
}
