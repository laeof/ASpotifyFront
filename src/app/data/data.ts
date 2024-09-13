import { ITrack } from "../dtos/track";
import { IPlaylist } from "../dtos/playlist";
import { IUser } from "../dtos/user";

export const TRACKS: ITrack[] = [
    {
        Id: "track5",
        Name: "Девочка",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 188,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "devochkaapfs.mp3"
    },
    {
        Id: "track6",
        Name: "Опиаты",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 192,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "opiatyapfs.mp3"
    },
    {
        Id: "track7",
        Name: "Сонный паралич",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 122,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "sonniyapfs.mp3"
    },
    {
        Id: "track8",
        Name: "Аф",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 161,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "afapfs.mp3"
    },
    {
        Id: "track9",
        Name: "Порно",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 158,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "pornoapfs.mp3"
    },
    {
        Id: "track10",
        Name: "Метадон",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 166,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "metadonapfs.mp3"
    },
    {
        Id: "track11",
        Name: "Таблетки",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 102,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "tabletkiafps.mp3"
    },
    {
        Id: "track12",
        Name: "Давай поправимся",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 110,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "davaypopravimsyaapfs.mp3"
    },
    {
        Id: "track13",
        Name: "Демоны",
        ArtistId: "3",
        Date: new Date('2023-04-25'),
        AlbumId: "3",
        Duration: 204,
        Image: "/assets/imgs/loveaddiction.jpg",
        Path: "01. Демоны.mp3"
    },
    {
        Id: "track14",
        Name: "Малышка рок-н-ролл",
        ArtistId: "3",
        Date: new Date('2023-04-25'),
        AlbumId: "3",
        Duration: 209,
        Image: "/assets/imgs/loveaddiction.jpg",
        Path: "02. Малышка рок-н-ролл.mp3"
    },
    {
        Id: "track15",
        Name: "Про любовь",
        ArtistId: "3",
        Date: new Date('2023-04-25'),
        AlbumId: "3",
        Duration: 136,
        Image: "/assets/imgs/loveaddiction.jpg",
        Path: "03. Про любовь.mp3"
    },
    {
        Id: "track16",
        Name: "Опианариум",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 150,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "03 - Опианариум.mp3"
    },
    {
        Id: "track17",
        Name: "Слепые",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 117,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "05 - Слепые.mp3"
    },
    {
        Id: "track18",
        Name: "Мам я умираю",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 149,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "09 - Мам, я умираю.mp3"
    },
    {
        Id: "track19",
        Name: "Голая красивая",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 131,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "11 - Голая, красивая.mp3"
    },
    {
        Id: "track20",
        Name: "Оргазм",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 209,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "12 - Оргазм.mp3"
    },
    {
        Id: "track21",
        Name: "Панацея",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 164,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "14 - Панацея.mp3"
    },
    {
        Id: "track22",
        Name: "Я некрасивый",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "2",
        Duration: 237,
        Image: "../assets/imgs/webp/apfs.webp",
        Path: "15 - Я некрасивый.mp3"
    },
    {
        Id: "track23",
        Name: "Идите нахуй",
        ArtistId: "2",
        Date: new Date('2023-04-25'),
        AlbumId: "6",
        Duration: 210,
        Image: "../assets/imgs/webp/dogwaltz.webp",
        Path: "01 - идите нахуй.mp3"
    },
];

export const PLAYLISTS: IPlaylist[] = [
    { Id: "c5f38099-382b-4ccb-a8a5-c8bc98241cb2", AuthorId: 'bf1d50fd-3d82-4cac-b0bd-322768ff2873', Image: "/assets/imgs/1111.jpg", Name: "Liked songs", Type: 0, TrackIds: TRACKS.slice(0, 10).map(track => track.Id) },
    { Id: "2", AuthorId: '1', Image: "/assets/imgs/webp/apfs.webp", Name: "Опианариум", Type: 1, TrackIds: TRACKS.slice(0, 8).map(track => track.Id).concat(TRACKS.slice(11, 18).map(track => track.Id)) },
    { Id: "3", AuthorId: '1', Image: "/assets/imgs/loveaddiction.jpg", Name: "Любовь, аддикция и марафоны", Type: 1, TrackIds: TRACKS.slice(8, 11).map(track => track.Id) },
    { Id: "4", AuthorId: '2', Image: "/assets/imgs/1111.jpg", Name: "Liked songs", Type: 0, TrackIds: TRACKS.slice(0, 10).map(track => track.Id) },
    { Id: "5", AuthorId: '3', Image: "/assets/imgs/1111.jpg", Name: "Liked songs", Type: 0, TrackIds: TRACKS.slice(0, 10).map(track => track.Id) },
    { Id: "6", AuthorId: '2', Image: "/assets/imgs/webp/dogwaltz.webp", Name: "Собачий вальс", Type: 1, TrackIds: TRACKS.slice(18, 24).map(track => track.Id) },
];

export const USERS: IUser[] = [
    {
        Id: "bf1d50fd-3d82-4cac-b0bd-322768ff2873",
        UserName: 'wandered thoughts',
        Email: 'laoef@example.com',
        Image: '/assets/imgs/bg.png',
        lovedPlaylistId: 'c5f38099-382b-4ccb-a8a5-c8bc98241cb2',
        FirstName: "First",
        LastName: "Last",
        latestPlayingPlaylist: 'c5f38099-382b-4ccb-a8a5-c8bc98241cb2',
        latestPlayingTrack: 'track5',
        Playlists: PLAYLISTS.slice(0, 1).map(playlist => playlist.Id)
    },
    {
        Id: "2",
        UserName: 'Автостопом по фазе сна',
        Email: 'jane.smith@example.com',
        Image: '/assets/imgs/image.png',
        lovedPlaylistId: '4',
        FirstName: null,
        LastName: null,
        latestPlayingPlaylist: '',
        latestPlayingTrack: '',
        Playlists: PLAYLISTS.slice(3, 4).map(playlist => playlist.Id),
    },
    {
        Id: "3",
        UserName: 'Три дня дождя',
        Email: 'alice.jones@example.com',
        Image: '/assets/imgs/image.png',
        lovedPlaylistId: '5',
        FirstName: null,
        LastName: null,
        latestPlayingPlaylist: '',
        latestPlayingTrack: '',
        Playlists: PLAYLISTS.slice(4, 5).map(playlist => playlist.Id),
    }
];