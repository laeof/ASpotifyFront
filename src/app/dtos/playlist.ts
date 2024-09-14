import { ITrack } from './track';

export interface IPlaylist {
    id: string,
    authorId: string,
    imagePath: string,
    name: string,
    types: PlaylistType,
    tracks: string[]
}

export enum PlaylistType {
    Playlist = 0,
    Album = 1,
    Single = 2
}