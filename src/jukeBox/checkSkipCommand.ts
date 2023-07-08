import { getVoiceConnection, VoiceConnection } from "@discordjs/voice"
import { Message, VoiceBasedChannel } from "discord.js"
import { JukeBoxQueue } from "./queue"
import { playYouTube } from "./playYouTube"
import { isLimiterEnabled } from "../utils/limiter"

export const checkSkipCommand = (message: Message<boolean>) => {
  if (message.content.startsWith("!skip") && message.guild) {
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

    playNext(message, connection, channel)

    return true
  } else {
    return false
  }
}

export const playNext = (message: Message, connection: VoiceConnection, channel: VoiceBasedChannel) => {
  const next = JukeBoxQueue.shift(channel.guild.id)
  if (next) {
    message.reply("次に行くよ〜")
    JukeBoxQueue.setRepeat(false)
    playYouTube(next, message, connection, channel)
  } else {
    message.reply("おわり～")
    connection.destroy()
  }
}
