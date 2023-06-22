import { Message } from "discord.js"
import os from "os"
export const botStatus = async (message: Message<boolean>): Promise<boolean> => {
  if (message.content.includes("あいす") && message.content.includes("元気") && message.guild) {
    const totalMemory = Math.round((os.totalmem() / 1024 / 1024) * 100) / 100 // 総メモリ容量
    const freeMemory = Math.round((os.freemem() / 1024 / 1024) * 100) / 100
    const usage = Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100
    const scale = totalMemory / 10

    const health = "🍮".repeat(Math.min(freeMemory / scale, 1))
    const healthMessage = freeMemory > 512 ? "元気だよ〜" : freeMemory > 256 ? "うーん普通..." : "元気ない・・"

    message.reply(
      `${healthMessage}\n残りの元気: ${health}\n Total ${totalMemory}M / Free ${freeMemory}M / Icemaru usage ${usage}M`
    )

    return true
  }
  return false
}
