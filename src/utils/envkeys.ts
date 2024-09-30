import dotenv from "dotenv"

// 環境変数の読み込み
dotenv.config()

export const ENV_KEYS = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  MINECRAFT_SERVER: process.env.MINECRAFT_SERVER,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  TTS_SERVER_URL: process.env.TTS_SERVER_URL,
  MINECRAFT_SERVER_LOG: process.env.MINECRAFT_SERVER_LOG,
  MEMORY_LIMITER: Number(process.env.MEMORY_LIMITER ?? "0")
}
