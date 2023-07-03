import { Message } from "discord.js"

/** 全体的に汚いコードでごめん */

export const valorantPick = async (message: Message<boolean>): Promise<boolean> => {
  if ((message.content.includes("構成") || message.content.includes("ピック")) && message.guild) {
    // コマンドを実行したボイスチャンネルのメンバーを取得
    const members = message.member?.voice?.channel?.members
    if (!members) {
      message.reply("どのメンバーでピックすればいいのかな？お友達を集めてボイスチャンネルに入った状態でやってね")
      return false
    }

    // Valorant APIのエージェント一覧取得
    const apiResult: {
      status: number
      data: any[] // ごめん
    } = await (await fetch("https://valorant-api.com/v1/agents?language=ja-JP")).json()
    if (apiResult.status !== 200) {
      message.reply(
        "Valorant APIと接続できなかったからピックができなかった・・・。Valorantってどんなキャラがいたんだっけ・・・"
      )
      return false
    }

    const agentUuid = {
      duelist: "dbe8757e-9e92-4ed4-b39f-9dfc589691d4",
      initiator: "1b47567f-8f7b-444b-aae3-b0c634622d10",
      sentinel: "5fc02f99-4091-4486-a531-98459a3e95e9",
      controller: "4ee40330-ecdd-4f2f-98a8-eb1243428373"
    } as const
    const filterAgent = (uuid: string) =>
      apiResult.data.filter((v) => {
        if (!v.isPlayableCharacter) {
          return false
        }
        return v.role.uuid === uuid
      })
    const agents = {
      duelist: filterAgent(agentUuid.duelist),
      initiator: filterAgent(agentUuid.initiator),
      controller: filterAgent(agentUuid.controller),
      sentinel: filterAgent(agentUuid.sentinel)
    }
    const GOLDEN_RATIO = ["duelist", "initiator", "controller", "sentinel", "duelist"].sort(() => Math.random() - 0.5)
    const picks: string[][] = []

    for (const key of members.keys()) {
      const member = members.get(key)
      if (!member) {
        message.reply("謎のエラーが起こったのでピックができなかったよ。\nERROR_REASON: Can't find the member " + key)
        return false
      }

      if (!member.user.bot) {
        const role = GOLDEN_RATIO.pop()
        if (!role) {
          message.reply("５人以上ボイスチャンネルに参加してるのかな？うまくピックができなかったよ。")
          return false
        }

        // ごめん
        const agent = (agents as any)[role].shift()
        picks.push([member.displayName, agent.displayName, agent.abilities[Math.floor(Math.random() * 4)].displayName])
      }
    }

    let replyMessage = "みんなにぴったりなエージェントを選んだよ！\n"
    picks.forEach((v) => {
      replyMessage =
        replyMessage +
        `${v[0]}${Math.random() < 0.2 ? "さん" : ""}は${v[1]} ${
          Math.random() < 0.2 ? `\n↑${v[0]}は${v[2]}が得意そうに見える！` : ""
        }\n`
    })
    replyMessage = replyMessage + `これで${Math.random() < 0.2 ? "絶対" : "たぶん"}勝てるはずだよ〜`

    message.reply(replyMessage)

    return true
  }
  return false
}
