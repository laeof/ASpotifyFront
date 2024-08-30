export interface IUser {
    Id: string,
    UserName: string,
    FirstName: string | null,
    LastName: string | null,
    Email: string,
    Image: string,
    lovedPlaylistId: string;
    latestPlayingTrack: string;
    latestPlayingPlaylist: string;
    Playlists: string[]
}