import { ITrack } from './track';

export interface IPlaylist {
    Id: string,
    UserId: string,
    Image: string,
    Name: string,
    Tracks: ITrack[]
}