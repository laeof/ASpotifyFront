import { ITrack } from "./track";

export interface IAlbum {
    Id: string,
    ArtistId: string,
    Name: string,
    Tracks: ITrack[]
}