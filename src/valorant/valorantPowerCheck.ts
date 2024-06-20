import { Message } from "discord.js"
import HenrikDevValorantAPI from "unofficial-valorant-api"

export const valorantPowerCheck = async (message: Message<boolean>): Promise<boolean> => {
  const regexp = message.content.match(/.{1,15}#.{1,5}[^の戦績]/)
  if (regexp && message.guild) {
    const VAPI = new HenrikDevValorantAPI()
    const [name, tag] = regexp[0].split("#")

    const mmr_data = await VAPI.getMMR({
      version: "v1",
      region: "ap", // If you want to get the MMR expecting ap region, change it.
      name,
      tag
    })

    if (mmr_data.status === 200 && mmr_data.data) {
      const data = mmr_data.data as any
      message.reply(`${name}ちゃんは${data.currenttierpatched}の${data.ranking_in_tier}だよ。`)
    } else {
      message.reply("わからない..")
      console.log(mmr_data)
    }

    return true
  }
  return false
}
