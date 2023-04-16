import { Message, VoiceBasedChannel } from "discord.js"
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection
} from "@discordjs/voice"
import ytdl from "ytdl-core"
import { JukeBoxQueue } from "./queue"
import { playNext } from "./checkSkipCommand"

export const checkPlayCommand = (message: Message<boolean>) => {
  if (message.content.startsWith("!play") && message.guild) {
    const url = message.content.replace("!play", "").trim()
    if (!ytdl.validateURL(url)) {
      message.reply("ちゃんとYouTubeのURLを入力してね")
    }

    // コマンドを実行したメンバーがいるボイスチャンネルを取得
    const channel = message.member?.voice?.channel

    if (!channel) {
      message.reply("どこで再生すればいいのか教えてくれないと歌えないよ～")
      return false
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

export const playYouTube = (url: string, message: Message, connection: VoiceConnection, channel: VoiceBasedChannel) => {
  // https://github.com/fent/node-ytdl-core/issues/902
  const stream = ytdl(ytdl.getURLVideoID(url), {
    filter: "audioonly",
    highWaterMark: 1 << 62,
    liveBuffer: 1 << 62
  })
  const player = createAudioPlayer()
  const resource = createAudioResource(stream)
  player.play(resource)
  resource.volume?.setVolume(0.5)

  player.on(AudioPlayerStatus.Idle, () => {
    playNext(message, connection, channel)
  })

  connection.subscribe(player)
}
