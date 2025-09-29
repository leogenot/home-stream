import { useState } from '#imports'

export type PlayerItem = {
  id: number
  title: string
  src: string
}

// Small util to shuffle an array immutably
function shuffle<T>(list: T[]): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function useQueue() {
  const queue = useState<PlayerItem[]>('player.queue', () => [])
  const currentIndex = useState<number>('player.currentIndex', () => -1)
  const isManagerOpen = useState<boolean>('player.queue.managerOpen', () => false)

  const currentItem = computed(() => {
    if (currentIndex.value < 0 || currentIndex.value >= queue.value.length) {
      return null as PlayerItem | null
    }
    return queue.value[currentIndex.value]
  })


  function setQueue(items: PlayerItem[]) {
    queue.value = items
  }


  /**
   * Sets the current index to the given index and attempts to play the item at that index.
   * If the index is out of bounds, does nothing.
   * @param {number} index The index to set as the current index.
   */
  function playAt(index: number) {
    if (index < 0 || index >= queue.value.length) return
    currentIndex.value = index
  }

  /**
   * Maps a song object to a player item object.
   * @param {{ id: number; title: string }} song The song object to map.
   * @returns {PlayerItem} The mapped player item object.
   * @example
   * const song = { id: 1, title: 'song1.mp3' }
   * const item = mapSongToPlayerItem(song)
   * item is { id: 1, title: 'song1', src: '/uploads/music/song1.mp3' }
   */
  function mapSongToPlayerItem(song: { id: number; title: string }): PlayerItem {
    const title = song.title.replace(/\.[^.]+$/, '')
    const src = `/uploads/music/${song.title}`
    return { id: song.id, title, src }
  }

  /**
   * Plays all songs in an array in order.
   * @param {({ id: number; title: string }[])} songs An array of songs to play.
   * @example playAllNow([{ id: 1, title: 'song1.mp3' }, { id: 2, title: 'song2.mp3' }])
   */
  function playAllNow(songs: { id: number; title: string }[]) {
    const items = songs.map(mapSongToPlayerItem)
    console.log('Playing all items', items)
    setQueue(items)
    playAt(items.length > 0 ? 0 : -1)
  }

  /**
   * Plays all songs in a random order.
   * @param {({ id: number; title: string }[])} songs An array of songs to play.
   */
  function playAllRandomNow(songs: { id: number; title: string }[]) {
    const items = shuffle(songs.map(mapSongToPlayerItem))
    console.log('Shuffled items', items)
    setQueue(items)
    playAt(items.length > 0 ? 0 : -1)
  }

  /**
   * Plays a song at a given index from an array of songs.
   * @param {number} index The index of the song to play.
   * @param {Array<{id: number, title: string}>} songs The array of songs.
   */
  function playSong(index: number, songs: { id: number; title: string }[]) {
    const items = songs.map(mapSongToPlayerItem)
    console.log('Playing song at index', index, 'from items', items)
    setQueue(items)
    playAt(index)
  }

  // Queue management helpers
  function playFrom(index: number) {
    if (index < 0 || index >= queue.value.length) return
    // Trim everything before the selected index and reset current to 0
    queue.value = queue.value.slice(index)
    currentIndex.value = 0
  }

  function enqueue(item: PlayerItem) {
    queue.value = [...queue.value, item]
  }

  function enqueueMany(items: PlayerItem[]) {
    queue.value = [...queue.value, ...items]
  }

  function addToQueue(song: { id: number; title: string }) {
    enqueue(mapSongToPlayerItem(song))
  }

  function addManyToQueue(songs: { id: number; title: string }[]) {
    enqueueMany(songs.map(mapSongToPlayerItem))
  }

  function removeAt(index: number) {
    if (index < 0 || index >= queue.value.length) return
    const wasCurrent = index === currentIndex.value
    const beforeCurrent = index < currentIndex.value
    queue.value = queue.value.filter((_, i) => i !== index)
    if (queue.value.length === 0) {
      currentIndex.value = -1
      return
    }
    if (wasCurrent) {
      const nextIndex = Math.min(index, queue.value.length - 1)
      currentIndex.value = nextIndex
    } else if (beforeCurrent) {
      currentIndex.value = Math.max(0, currentIndex.value - 1)
    }
  }

  function moveItem(fromIndex: number, toIndex: number) {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      fromIndex >= queue.value.length ||
      toIndex < 0 ||
      toIndex >= queue.value.length
    )
      return
    const newQueue = [...queue.value]
    const [moved] = newQueue.splice(fromIndex, 1)
    newQueue.splice(toIndex, 0, moved)

    const ci = currentIndex.value
    if (ci === fromIndex) currentIndex.value = toIndex
    else if (ci > fromIndex && ci <= toIndex) currentIndex.value = ci - 1
    else if (ci < fromIndex && ci >= toIndex) currentIndex.value = ci + 1

    queue.value = newQueue
  }

  function clearQueue() {
    queue.value = []
    currentIndex.value = -1
  }

  function toggleManager() {
    isManagerOpen.value = !isManagerOpen.value
  }

  return {
    // state
    queue,
    currentIndex,
    currentItem,
    isManagerOpen,
    // controls
    setQueue,
    playAt,
    playFrom,
    playAllNow,
    playAllRandomNow,
    playSong,
    // management
    enqueue,
    enqueueMany,
    addToQueue,
    addManyToQueue,
    removeAt,
    moveItem,
    clearQueue,
    toggleManager,
  }
}


