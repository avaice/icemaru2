const queue = new Map<string, string[]>()
let repeat = false

export const JukeBoxQueue = {
  set: (cId: string, videoId: string) => {
    const playList = queue.get(cId) || []
    playList.push(videoId)
    queue.set(cId, playList)
  },
  get: (cId: string) => {
    return queue.get(cId)
  },
  shift: (cId: string) => {
    const playList = queue.get(cId) || []
    const poped = playList.shift()
    queue.set(cId, playList)
    return poped
  },
  isRepeat: () => repeat,
  setRepeat: (trig: boolean) => (repeat = trig)
}
