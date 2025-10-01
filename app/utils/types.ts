export type User = {
    id: string
    auth_user_id: string
    created_at: string
    email: string
    username: string | null
}

export type Song = { id: number; file: string; title: string; artist: string; album: string; created_at: string }

export type PlaylistItem = { id: number; position: number; file: Song }
export type Playlist = { id: number; title: string; created_at: string; playlist_items: PlaylistItem[] }

export type PlayerItem = {
    id: number
    title: string
    src: string
    artist: string
    album: string
    file: string
}
