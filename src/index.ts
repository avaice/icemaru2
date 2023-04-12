import { Client, Events, GatewayIntentBits } from "discord.js"
import { ENV_KEYS } from "./utils/envkeys"
import { recievedMessage } from "./recievedMessage"

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.once(Events.ClientReady, (c) => {
  console.log(`Discordに${c.user.tag}としてログインしました`)
})

// メッセージを受け取った時
client.on("messageCreate", recievedMessage)

if (ENV_KEYS.BOT_TOKEN) {
  client.login(ENV_KEYS.BOT_TOKEN)
} else {
  throw new Error(
    "DiscordのBOTトークンが指定されていません。\n.envファイルにBOT_TOKENとして登録してください。"
  )
}
