import { Message } from "discord.js"
import { ENV_KEYS } from "../utils/envkeys"
import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

export const minecraftNews = async (message: Message<boolean>): Promise<boolean> => {
  if (message.content.includes("マイクラ") && message.content.includes("ニュース") && message.guild) {
    // マイクラのニュース

    if (!ENV_KEYS.OPENAI_API_KEY || !ENV_KEYS.MINECRAFT_SERVER_LOG) {
      message.reply(`あいすがこの機能の設定を行っていないから、今は使えないよ`)
      return true
    }

    message.reply(`今書くから待っててね♪`)

    message.channel.sendTyping()

    try {
      console.log("minecraftNews: サーバーログ取得中")
      const serverLog = await (
        await (await fetch(ENV_KEYS.MINECRAFT_SERVER_LOG)).text()
      )
        .replace(/.*UUID.*/g, "")
        .replace(/.*logged in with entity.*/g, "")
        .replace(/.* lost connection: Disconnected/g, "")
        .replace(/.* left the game/g, "")
        .replace(/Mismatch in destroy block pos:.*/g, "")
        .replace(/.*]:/g, "")
        .replace(/\n\n/g, "\n")

      console.log("minecraftNews: GPTレスポンス取得中")
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0301",
        messages: [
          {
            role: "system",
            content: `送られてくるマインクラフトのサーバーログを「今日のマイクラニュース！」として「あいす丸」というかわいい女の子になりきって紹介してください。`
          },
          {
            role: "system",
            content: `敬語を使わないで、「〜〜だよ！」「〜〜だー」みたいなゆるい口調で一つの文章として出力してください。`
          },
          {
            role: "system",
            content: `英単語は日本語に訳してから出力してください。`
          },
          {
            role: "user",
            content: serverLog
          }
        ]
      })
      console.log("minecraftNews: データ取得完了")

      const answer = response.data.choices[0].message?.content
      if (answer) {
        message.reply(
          answer
            .replace(/。/g, "。\n")
            .replace(/\r\n\r\n/g, "\n")
            .replace(/「|」/g, "")
        )
      } else {
        message.reply("今日は元気がないから無理・・")
      }
    } catch (e) {
      console.error(e)
      message.reply("あれ？ペンが折れちゃった")
    }

    return true
  }
  return false
}
