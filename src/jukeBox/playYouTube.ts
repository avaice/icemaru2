import { Message, VoiceBasedChannel } from "discord.js"
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, VoiceConnection } from "@discordjs/voice"
import ytdl from "ytdl-core"
import { playNext } from "./checkSkipCommand"
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
