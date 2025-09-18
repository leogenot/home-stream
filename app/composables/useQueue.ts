import { useStorage } from '@vueuse/core'

type QueueItem = {
    id: number
    src: string
    title: string
}

const STORAGE_KEY = 'stream-queue-v1'

export default function useQueue() {
    const queue = useStorage<QueueItem[]>(STORAGE_KEY, [])
    const currentIndex = useState<number>('queue-current-index', () => 0)

    const currentItem = computed(() => queue.value[currentIndex.value])

    const addToQueue = (items: QueueItem | QueueItem[]) => {
        const list = Array.isArray(items) ? items : [items]
        queue.value = [...queue.value, ...list]
    }

    const removeFromQueue = (idx: number) => {
        if (idx < 0 || idx >= queue.value.length) return
        const next = [...queue.value]
        next.splice(idx, 1)
        queue.value = next
        if (currentIndex.value >= queue.value.length) {
            currentIndex.value = Math.max(0, queue.value.length - 1)
        }
    }

    const clearQueue = () => {
        queue.value = []
        currentIndex.value = 0
    }

    const moveItem = (fromIndex: number, toIndex: number) => {
        if (
            fromIndex === toIndex ||
            fromIndex < 0 ||
            fromIndex >= queue.value.length ||
            toIndex < 0 ||
            toIndex >= queue.value.length
        )
            return
        const next = [...queue.value]
        const [moved] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, moved)
        queue.value = next
        if (currentIndex.value === fromIndex) currentIndex.value = toIndex
        else if (fromIndex < currentIndex.value && toIndex >= currentIndex.value) currentIndex.value -= 1
        else if (fromIndex > currentIndex.value && toIndex <= currentIndex.value) currentIndex.value += 1
    }

    const playAt = (idx: number) => {
        if (idx < 0 || idx >= queue.value.length) return
        currentIndex.value = idx
    }

    return {
        queue,
        currentIndex,
        currentItem,
        addToQueue,
        removeFromQueue,
        clearQueue,
        moveItem,
        playAt,
    }
}


