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
import ffmpegPath from "ffmpeg-static"
import child_process from "child_process"
import { speechToText } from "./speechToText"
import { icemaruGPT, isTalkingToIcemaru } from "../icemaruGPT"
import { reply } from "../reply"

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

          const streamToPCM = new prism.opus.Decoder({
            frameSize: 960,
            channels: 2,
            rate: 48000
          })
          const audioStream = connection.receiver.subscribe(userId)
          const savePath = join(voicePath, `${hearing.timestamp}.pcm`)
          const writeStream = fs.createWriteStream(savePath)

          // pipelineの代わりにpipeを使用する
          audioStream.pipe(streamToPCM as any).pipe(writeStream)
        }
      })
      connection.receiver.speaking.on("end", async (userId) => {
        if (!hearing) {
          return
        }

        const savePath = join(voicePath, `${hearing.timestamp}.pcm`)

        try {
          // 300ms 未満の間隔で発言が終わった場合は無視
          if (hearing.userId === userId && Date.now() - hearing.timestamp < 300) {
            fs.unlinkSync(savePath)
            hearing = null
            return
          }

          const bin = ffmpegPath
          if (!bin) {
            console.log("ffmpegPathが見つかりません")
            return
          }
          // ffmpegでwavに変換して、File型で取得する
          const wavPath = join(voicePath, `${hearing.timestamp}.wav`)

          child_process.execSync(`${bin} -f s16le -ar 48k -ac 2 -i ${savePath} ${wavPath}`, { stdio: "ignore" })
          fs.unlinkSync(savePath)

          // ファイルが作成されるまで待つ
          while (!fs.existsSync(wavPath)) {
            await new Promise((resolve) => setTimeout(resolve, 100))
          }

          const text = await speechToText(wavPath)
          fs.unlinkSync(wavPath)
          if (text && isTalkingToIcemaru(text)) {
            const replyMessage = await icemaruGPT(text, message.channel.id)
            if (replyMessage.includes("LEAVE")) {
              reply(message, "またね～、ばいばい～")
              setTimeout(() => {
                connection.destroy()
                voiceConnections.delete(message.guild!.id)
              }, 2000)
            } else {
              reply(message, replyMessage)
            }

            console.log(text, replyMessage)
          }
        } catch {
          console.log("エラーが発生しました")
        } finally {
          hearing = null
        }
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
