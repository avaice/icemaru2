import dotenv from "dotenv"

// 環境変数の読み込み
dotenv.config()

export const ENV_KEYS = {
  BOT_TOKEN: process.env.BOT_TOKEN,
}
