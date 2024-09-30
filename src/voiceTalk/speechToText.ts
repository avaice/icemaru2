import { Configuration, OpenAIApi } from "openai"
import fs from "fs"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

export const speechToText = async (wavPath: string) => {
  try {
    // 全体的に肩が凝るコードだが、これはopenaiの仕様によるもの
    const result = await openai.createTranscription(
      fs.createReadStream(wavPath) as any,
      "whisper-1",
      undefined,
      "text",
      undefined,
      "ja"
    )
    if (result.status === 200) {
      return result.data as unknown as string
    }
    return null
  } catch (e) {
    console.error(e)
    return null
  }
}
