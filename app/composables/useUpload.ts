// composables/useUpload.ts
import { useSupabaseClient, useSupabaseUser } from '#imports'

export function useUpload() {
    const user = useSupabaseUser()
    const client = useSupabaseClient()

    const files = ref<any[]>([])
    const fileInput = ref<HTMLInputElement | null>(null)
    const uploadError = ref('')
    const uploadSuccess = ref('')
    const uploading = ref(false)
    const userData = ref(<User | null | undefined>(null))
    const USER_STORAGE_KEY = 'stream-user'

    const fetchFiles = async () => {
        if (!user.value) return
        const { data, error } = await client
            .from('music')
            .select('id, file, created_at')
            .eq('user_id', user.value.id)
            .order('created_at', { ascending: false })
        if (!error && data) {
            files.value = data
        }
    }

    const uploadFile = async () => {
        if (!fileInput.value?.files?.length) return
        const formData = new FormData()
        Array.from(fileInput.value.files).forEach((file) => {
            formData.append('files', file)
        })

        uploading.value = true
        try {
            const stored = localStorage.getItem(USER_STORAGE_KEY)
            if (stored) {
                try {
                    userData.value = JSON.parse(stored)
                } catch (e) {
                    console.warn('Failed to parse user from localStorage', e)
                }
            }
            const res = await $fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include', headers: userData.value ? { 'x-user-id': userData.value.auth_user_id } : {}, })
            if (res.error) throw new Error(res.error)

            uploadSuccess.value = 'Files uploaded successfully!'
            fetchFiles()
        } catch (err: any) {
            uploadError.value = err.message
        } finally {
            uploading.value = false
            setTimeout(() => {
                uploadError.value = ''
                uploadSuccess.value = ''
            }, 5000)
        }
    }

    const deleteFile = async (filename: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return
        try {
            const res = await $fetch('/api/deleteFile', {
                method: 'POST',
                body: { filename, table: 'music' },
                credentials: 'include',
                headers: useRequestHeaders(['cookie'])
            })
            if (res.error) throw new Error(res.error)
            fetchFiles()
        } catch (err: any) {
            alert(err.message || 'Failed to delete file')
        }
    }

    onMounted(fetchFiles)

    return {
        files,
        fileInput,
        uploadError,
        uploadSuccess,
        uploading,
        fetchFiles,
        uploadFile,
        deleteFile,
    }
}
