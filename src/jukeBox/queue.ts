const cue = new Map<string, string[]>()

export const JukeBoxQueue = {
  set: (cId: string, videoId: string) => {
    const playList = cue.get(cId) || []
    playList.push(videoId)
    cue.set(cId, playList)
  },
  get: (cId: string) => {
    return cue.get(cId)
  },
  shift: (cId: string) => {
    const playList = cue.get(cId) || []
    const poped = playList.shift()
    cue.set(cId, playList)
    return poped
  }
}
