import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  EndBehaviorType,
  joinVoiceChannel,
  VoiceConnection
} from "@discordjs/voice"
import { Message } from "discord.js"
import { ENV_KEYS } from "../utils/envkeys"
import fs from "fs"
import { join } from "path"
import prism from "prism-media"

let voiceConnections = new Map<string, VoiceConnection>()

const voicePath = join(__dirname, "../../", "temp/voice/")
if (!fs.existsSync(voicePath)) {
  fs.mkdirSync(voicePath, { recursive: true })
}

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
        adapterCreator: message.guild.voiceAdapterCreator,
        selfDeaf: false
      })

      let hearing: {
        userId: string
        timestamp: number
      } | null = null
      connection.receiver.speaking.on("start", (userId) => {
        if (hearing === null) {
          hearing = {
            userId,
            timestamp: Date.now()
          }

          const pcmToWav = new prism.opus.Decoder({
            frameSize: 960,
            channels: 2,
            rate: 48000
          })
          const audioStream = connection.receiver.subscribe(userId)
          const savePath = join(voicePath, `${Date.now()}.pcm`)
          const writeStream = fs.createWriteStream(savePath)

          // pipelineの代わりにpipeを使用する
          audioStream.pipe(pcmToWav as any).pipe(writeStream)

          writeStream.on("finish", () => {
            console.log(`Recording for user ${userId} finished.`)
          })
        }
      })
      connection.receiver.speaking.on("end", async (userId) => {
        if (!hearing) {
          return
        }
        // 300ms 未満の間隔で発言が終わった場合は無視
        if (hearing.userId === userId && Date.now() - hearing.timestamp > 300) {
          hearing = null
          return
        }

        hearing = null
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
