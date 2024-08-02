import { IAlbum } from "./album";
import { ITrack } from "./track";

export interface IArtist {
    Id: string,
    FirstName: string,
    LastName: string,
    NickName: string,
    UserId: string,
    Tracks: ITrack[],
    Albums: IAlbum[],
}