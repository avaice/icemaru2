import { Message, VoiceBasedChannel } from "discord.js"
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, VoiceConnection } from "@discordjs/voice"
import { playNext } from "./checkSkipCommand"
import { isLimiterEnabled } from "../utils/limiter"
import { JukeBoxQueue } from "./queue"
import ytdl from "@distube/ytdl-core"
export const playYouTube = (url: string, message: Message, connection: VoiceConnection, channel: VoiceBasedChannel) => {
  try {
    // TODO: Fix it 再帰関数になったからここが無限ループする可能性がある。。
    // if (isLimiterEnabled()) {
    //   return message.reply("ごめん今元気ないからまた今度でいい..?")
    // }

    // https://github.com/fent/node-ytdl-core/issues/902
    const stream = ytdl(ytdl.getURLVideoID(url), {
      filter: "audioonly",
      highWaterMark: 1 << 62,
      liveBuffer: 1 << 62
    })
    const player = createAudioPlayer()
    let resource = createAudioResource(stream)
    player.play(resource)
    resource.volume?.setVolume(0.5)

    player.on(AudioPlayerStatus.Idle, () => {
      stream.destroy()
      if (JukeBoxQueue.isRepeat()) {
        playYouTube(url, message, connection, channel)
      } else {
        playNext(message, connection, channel)
      }
    })

    connection.subscribe(player)
  } catch {
    message.reply(`${url}\n↑の曲、歌おうと思ったけどうまくいかなかった...`)
  }
}
