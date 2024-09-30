import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection
} from "@discordjs/voice"
import { Message } from "discord.js"
import { JukeBoxQueue } from "../jukeBox/queue"
import { ENV_KEYS } from "../utils/envkeys"
import fs from "fs"
import { join } from "path"

let voiceConnections = new Map<string, VoiceConnection>()

export const voiceTalk = {
  isJoined: (guildId: string) => {
    return voiceConnections.has(guildId)
  },
  join: async (message: Message<boolean>) => {
    try {
      if (!message.member?.voice.channelId || !message.guild) {
        message.reply("ボイスチャンネルに入ってから言ってね！")
        return
      }
      const connection = joinVoiceChannel({
        channelId: message.member.voice.channelId,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      })
      voiceConnections.set(message.guild.id, connection)
    } catch (e) {
      console.log(e)
      message.reply("なんかうまく入れない〜、あいす丸のこと再起動してほしいな")
      return
    }
  },
  say: async ({ guildId, text }: { guildId: string; text: string }) => {
    const currentVoiceConnection = voiceConnections.get(guildId)

    if (!currentVoiceConnection) {
      return
    }

    // audio/wavが返ってくる
    const fetchVoice = await fetch(`${ENV_KEYS.TTS_SERVER_URL}/voice?text=${encodeURIComponent(text)}`)

    // wavとして実行パス/temp/voice/${timestamp}.wavに保存
    const voiceBuffer = await fetchVoice.arrayBuffer()
    const voicePath = join(__dirname, "../../", "temp/voice/")
    if (!fs.existsSync(voicePath)) {
      fs.mkdirSync(voicePath, { recursive: true })
    }
    const savePath = join(voicePath, `${Date.now()}.wav`)
    fs.writeFileSync(savePath, new Uint8Array(voiceBuffer))

    const player = createAudioPlayer()

    let resource = createAudioResource(savePath)
    player.play(resource)
    resource.volume?.setVolume(0.5)

    currentVoiceConnection.subscribe(player)

    player.on(AudioPlayerStatus.Idle, () => {
      fs.unlinkSync(savePath)
    })
  }
}
