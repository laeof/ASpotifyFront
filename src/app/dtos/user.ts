export interface IUser {
    id: string,
    userName: string,
    firstName: string | null,
    lastName: string | null,
    email: string,
    avatarUrl: string,
    lovedPlaylistId: string;
    latestTrackId: string;
    latestPlaylistId: string;
    playlists: string[];
}