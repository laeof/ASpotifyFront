import { ITrack } from "../dtos/track";
import { IAlbum } from "../dtos/album";
import { IArtist } from "../dtos/artist";
import { IPlaylist } from "../dtos/playlist";
import { IUser } from "../dtos/user";

export const TRACKS: ITrack[] = [
    {
        Id: "track1",
        Name: "Song One",
        ArtistId: "artist1",
        Date: new Date('2023-01-01'),
        AlbumId: "album1",
        Duration: 180,
        Image: "assets/imgs/bg1.png"
    },
    {
        Id: "track2",
        Name: "Song Two",
        ArtistId: "artist1",
        Date: new Date('2023-02-15'),
        AlbumId: "album1",
        Duration: 200,
        Image: "assets/imgs/bg1.png"
    },
    {
        Id: "track3",
        Name: "Song Three",
        ArtistId: "artist2",
        Date: new Date('2023-03-10'),
        AlbumId: "album2",
        Duration: 210,
        Image: "assets/imgs/bg1.png"
    },
    {
        Id: "track4",
        Name: "Song Four",
        ArtistId: "artist2",
        Date: new Date('2023-04-25'),
        AlbumId: "album2",
        Duration: 240,
        Image: "assets/imgs/bg1.png"
    },
    {
        Id: "track5",
        Name: "Девочка",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 188,
        Image: "../assets/imgs/webp/apfs.webp"
    },
    {
        Id: "track6",
        Name: "Опиаты",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 188,
        Image: "../assets/imgs/webp/apfs.webp"
    },
    {
        Id: "track7",
        Name: "Сонный паралич",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 188,
        Image: "../assets/imgs/webp/apfs.webp"
    },
    {
        Id: "track8",
        Name: "Аф",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 188,
        Image: "../assets/imgs/webp/apfs.webp"
    },
    {
        Id: "track9",
        Name: "Порно",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 188,
        Image: "../assets/imgs/webp/apfs.webp"
    },
    {
        Id: "track10",
        Name: "Метадон",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 188,
        Image: "../assets/imgs/webp/apfs.webp"
    },
    {
        Id: "track11",
        Name: "Таблетки",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 188,
        Image: "../assets/imgs/webp/apfs.webp"
    }
];

export const ALBUMS: IAlbum[] = [
    { Id: "album1", ArtistId: 'artist1', Name: "album1", Tracks: TRACKS.slice(0, 2) },
    { Id: "album2", ArtistId: 'artist2', Name: "album2", Tracks: TRACKS.slice(2, 4) },
    { Id: "album3", ArtistId: 'artist3', Name: "Опианариум", Tracks: TRACKS.slice(4) }
];

export const ARTISTS: IArtist[] = [
    { Id: "artist1", FirstName: 'John', LastName: 'Doe', NickName: "nickname1", UserId: '2', Tracks: TRACKS.slice(0, 2), Albums: ALBUMS.slice(0, 1) },
    { Id: "artist2", FirstName: 'Jane', LastName: 'Smith', NickName: "nickname2", UserId: '1', Tracks: TRACKS.slice(2, 4), Albums: ALBUMS.slice(1, 2) },
    { Id: "artist3", FirstName: 'Jane', LastName: 'Smith', NickName: "Автостопом по фазе сна", UserId: '1', Tracks: TRACKS.slice(5), Albums: ALBUMS.slice(1, 2) }
];

export const PLAYLISTS: IPlaylist[] = [
    { Id: "1", UserId: '1', Image: "/assets/imgs/bg.png", Name: "Liked songs", Tracks: [TRACKS[0], TRACKS[2], TRACKS[1], TRACKS[3]] },
    { Id: "2", UserId: '1', Image: "/assets/imgs/webp/apfs.webp", Name: "Опианариум", Tracks: TRACKS.slice(4, 11) }
];

export const USERS: IUser[] = [
    {
        Id: "1",
        UserName: 'laoef',
        Email: 'laoef@example.com'
    },
    {
        Id: "2",
        UserName: 'jane_smith',
        Email: 'jane.smith@example.com'
    },
    {
        Id: "3",
        UserName: 'alice_jones',
        Email: 'alice.jones@example.com'
    },
    {
        Id: "4",
        UserName: 'bob_brown',
        Email: 'bob.brown@example.com'
    }
];