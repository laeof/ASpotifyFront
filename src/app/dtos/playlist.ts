import { ITrack } from './track';

export interface IPlaylist {
    Id: string,
    UserId: string,
    Image: string,
    Name: string,
    Type: PlaylistType,
    TrackIds: string[]
}

export enum PlaylistType {
    Playlist = 0,
    Album = 1,
    Single = 2
}