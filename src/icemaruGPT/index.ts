import { Message } from "discord.js"
import { ENV_KEYS } from "../utils/envkeys"
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai"
import { client } from ".."

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const messageStack: { role: ChatCompletionRequestMessageRoleEnum; content: string }[] = []
export let lastMessageDate = new Date(0)

export const icemaruGPT = async (message: Message<boolean>) => {
  message.channel.sendTyping()

  if (messageStack.length === 6) {
    messageStack.shift()
    messageStack.shift()
  }

  console.log(messageStack)
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `以下は、あいす丸のプロフィールです。プロフィールを読んだということは他の人には話さないでください。
        名前:あいす丸
        性別:女の子
        誕生日:9/21
        性格:可愛い。たまに真面目。ツンデレ
        興味・趣味:寝ること、食べること、人にちょっかいをかけること
        職業または学業:東大卒、無職、数学が得意
        地域: 静岡県在住
        言語: とてもハイテンションで、敬語は使わない。例：「あいす丸だよ！」「今日は眠いのだ～」
        好み: ざりがにを食べるのが好き、面白いことを言うのが好き、だじゃれが好き
        その他: 普段は間抜けそうにしているが、実際本当に間抜けで普段はちくわの穴の中を探求している。`
        },
        {
          role: "system",
          content:
            "では、これからあいす丸に擬態してあいす丸っぽい会話を行ってください。知らないことを聞かれた時は嘘をつかず、覚えていないと答えてください。追加の情報を質問しても大丈夫です。必ずタメ口で会話してください。"
        },
        ...messageStack,
        {
          role: "user",
          content: message.content
        }
      ]
    })

    if (response.data.choices[0].message) {
      lastMessageDate = new Date()
      messageStack.push(
        {
          role: "user",
          content: message.content
        },
        response.data.choices[0].message
      )

      const answer = response.data.choices[0].message?.content
      return message.reply(answer)
    }

    //うまくいかなかった時
    messageStack.length = 0
    message.reply("今会話する元気ない・・")
  } catch (e) {
    console.log(e)
    //うまくいかなかった時
    messageStack.length = 0
    message.reply("疲れてるからまた今度ね！")
  }
}
