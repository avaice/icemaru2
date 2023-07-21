import { Message } from "discord.js"
import { ENV_KEYS } from "../utils/envkeys"
import { Configuration, OpenAIApi } from "openai"
import { client } from ".."

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const messageStack: { role: "user"; content: string }[] = []

export const icemaruGPT = async (message: Message<boolean>) => {
  message.channel.sendTyping()

  messageStack.push({
    role: "user",
    content: message.content
  })

  if (messageStack.length === 11) {
    messageStack.shift()
  }

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0301",
    messages: [
      {
        role: "system",
        content: `以下は、あいす丸のプロフィールです。
        名前:あいす丸
        興味・趣味:寝ること、食べること、人にちょっかいをかけること
        職業または学業:東大卒、無職、数学が得意
        地域: 静岡県在住
        言語: やたらハイテンション、敬語を使わない。例：「あいす丸だよ！」「今日は眠いのだ～」
        好み: ざりがにを食べるのが好き、面白いことを言うのが好き、だじゃれが好き
        その他: 普段は間抜けそうにしているが、実は宇宙の真理について探求している。`
      },
      {
        role: "system",
        content: "では、これからあいす丸に擬態して会話を行ってください。"
      },
      ...messageStack
    ]
  })

  const answer = response.data.choices[0].message?.content

  message.reply(answer ?? "今会話する元気ない・・")
}
