import { Message } from "discord.js"
import { ENV_KEYS } from "../utils/envkeys"

export const minecraftServerInfo = async (message: Message<boolean>): Promise<boolean> => {
  if (message.content.includes("マイクラ") && message.content.includes("？") && message.guild) {
    // マイクラのサーバー接続人数取得

    if (!ENV_KEYS.MINECRAFT_SERVER) {
      message.reply(`サーバーのアドレスがわからないから調べられない・・`)
      return true
    }

    try {
      const users = Number(
        await (
          await fetch(`https://minecraft-api.com/api/ping/playeronline.php?ip=${ENV_KEYS.MINECRAFT_SERVER}&port=25565`)
        ).text()
      )

      if (users === 0) {
        message.reply(`今は誰もプレイしてないよ`)
      } else {
        message.reply(`今${users}人いるよ`)
      }
    } catch {
      message.reply("マイクラのサーバー、落ちてるかも？")
    }

    return true
  }
  return false
}
