import { Message } from "discord.js"
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice"
import ytdl from "ytdl-core"
import { JukeBoxQueue } from "./queue"
import { playYouTube } from "./playYouTube"
import { isLimiterEnabled } from "../utils/limiter"

export const checkPlayCommand = (message: Message<boolean>) => {
  if (message.content.startsWith("!play") && message.guild) {
    const url = message.content.replace("!play", "").trim()
    if (!ytdl.validateURL(url)) {
      message.reply("ちゃんとYouTubeのURLを入力してね")
      return false
    }

    // コマンドを実行したメンバーがいるボイスチャンネルを取得
    const channel = message.member?.voice?.channel

    if (!channel) {
      message.reply("どこで再生すればいいのか教えてくれないと歌えないよ～")
      return false
    }

    if (isLimiterEnabled()) {
      return message.reply("ごめん今元気ないからまた今度でいい..?")
    }

    if (!getVoiceConnection(channel.guild.id)) {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
      })
      const connection = getVoiceConnection(channel.guild.id)

      if (!connection) {
        message.reply("なんかうまく歌えない・・")
        return false
      }

      message.reply(`おっけ～、まかせなさい！`)
      playYouTube(url, message, connection, channel)
    } else {
      JukeBoxQueue.set(channel.guild.id, url)
      message.reply(`次に歌うね！`)
    }

    return true
  } else {
    return false
  }
}
