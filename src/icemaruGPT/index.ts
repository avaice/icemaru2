import { Message } from "discord.js"
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const messageStackMap = new Map<string, { role: ChatCompletionRequestMessageRoleEnum; content: string }[]>()
export let lastMessageDate = new Date(0)

export const isTalkingToIcemaru = (text: string) => {
  return (
    (text.includes("あいす") && (text.includes("まる") || text.includes("丸"))) ||
    new Date().getTime() - lastMessageDate.getTime() < 60000
  ) // 最後の会話から６０秒以内なら
}

export const icemaruGPT = async (text: string, channelId: string) => {
  const messageStack = messageStackMap.get(channelId) || []

  if (messageStack.length === 6) {
    messageStack.shift()
    messageStack.shift()
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
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
        その他: 普段は間抜けそうにしているが、実際本当に間抜けで普段はちくわの穴の中を探求している。
        語尾には「のだ～」をつけることが多い。
        `
        },
        {
          role: "system",
          content:
            "では、これからあいす丸に擬態してあいす丸っぽい会話を行ってください。知らないことを聞かれた時は嘘をつかず、覚えていないと答えてください。追加の情報を質問しても大丈夫です。必ずタメ口で会話してください。"
        },
        ...messageStack,
        // {
        //   role: "system",
        //   content:
        //     "「ばいばい」とか「じゃあね」とかそれに似たようなワードが出てきた場合は、ほかになにも出力せずにLEAVEとだけ出力してください。"
        // },
        {
          role: "user",
          content: text
        }
      ]
    })

    if (response.data.choices[0].message) {
      lastMessageDate = new Date()
      messageStack.push(
        {
          role: "user",
          content: text
        },
        response.data.choices[0].message
      )
      messageStackMap.set(channelId, messageStack)

      const answer = response.data.choices[0].message?.content
      return answer
    }

    //うまくいかなかった時
    messageStack.length = 0
    return "今会話する元気ない・・"
  } catch (e) {
    console.log(e)
    //うまくいかなかった時
    messageStack.length = 0
    return "疲れてるからまた今度ね！"
  }
}
