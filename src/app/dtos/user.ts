export interface IUser {
    Id: string,
    UserName: string,
    FirstName: string | null,
    LastName: string | null,
    Email: string,
    lovedPlaylistId: string;
    Image: string,
    Playlists: string[]
}