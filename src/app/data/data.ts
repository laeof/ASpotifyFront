import { ITrack } from "../dtos/track";
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
        Image: "assets/imgs/bg1.png",
        Url: ""
    },
    {
        Id: "track2",
        Name: "Song Two",
        ArtistId: "artist1",
        Date: new Date('2023-02-15'),
        AlbumId: "album1",
        Duration: 200,
        Image: "assets/imgs/bg1.png",
        Url: ""
    },
    {
        Id: "track3",
        Name: "Song Three",
        ArtistId: "artist2",
        Date: new Date('2023-03-10'),
        AlbumId: "album2",
        Duration: 210,
        Image: "assets/imgs/bg1.png",
        Url: ""
    },
    {
        Id: "track4",
        Name: "Song Four",
        ArtistId: "artist2",
        Date: new Date('2023-04-25'),
        AlbumId: "album2",
        Duration: 240,
        Image: "assets/imgs/bg1.png",
        Url: ""
    },
    {
        Id: "track5",
        Name: "Девочка",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 188,
        Image: "../assets/imgs/webp/apfs.webp",
        Url: "devochkaapfs.mp3"
    },
    {
        Id: "track6",
        Name: "Опиаты",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 192,
        Image: "../assets/imgs/webp/apfs.webp",
        Url: "opiatyapfs.mp3"
    },
    {
        Id: "track7",
        Name: "Сонный паралич",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 122,
        Image: "../assets/imgs/webp/apfs.webp",
        Url: "sonniyapfs.mp3"
    },
    {
        Id: "track8",
        Name: "Аф",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 161,
        Image: "../assets/imgs/webp/apfs.webp",
        Url: "afapfs.mp3"
    },
    {
        Id: "track9",
        Name: "Порно",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 158,
        Image: "../assets/imgs/webp/apfs.webp",
        Url: "pornoapfs.mp3"
    },
    {
        Id: "track10",
        Name: "Метадон",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 166,
        Image: "../assets/imgs/webp/apfs.webp",
        Url: "metadonapfs.mp3"
    },
    {
        Id: "track11",
        Name: "Таблетки",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 102,
        Image: "../assets/imgs/webp/apfs.webp",
        Url: "tabletkiafps.mp3"
    },
    {
        Id: "track12",
        Name: "Давай поправимся",
        ArtistId: "artist3",
        Date: new Date('2023-04-25'),
        AlbumId: "album3",
        Duration: 110,
        Image: "../assets/imgs/webp/apfs.webp",
        Url: "davaypopravimsyaapfs.mp3"
    },
    {
        Id: "track13",
        Name: "Демоны",
        ArtistId: "artist4",
        Date: new Date('2023-04-25'),
        AlbumId: "album4",
        Duration: 204,
        Image: "/assets/imgs/loveaddiction.jpg",
        Url: "01. Демоны.mp3"
    },
    {
        Id: "track14",
        Name: "Малышка рок-н-ролл",
        ArtistId: "artist4",
        Date: new Date('2023-04-25'),
        AlbumId: "album4",
        Duration: 209,
        Image: "/assets/imgs/loveaddiction.jpg",
        Url: "02. Малышка рок-н-ролл.mp3"
    },
    {
        Id: "track15",
        Name: "Про любовь",
        ArtistId: "artist4",
        Date: new Date('2023-04-25'),
        AlbumId: "album4",
        Duration: 136,
        Image: "/assets/imgs/loveaddiction.jpg",
        Url: "03. Про любовь.mp3"
    },
    // {
    //     Id: "track12",
    //     Name: "Давай поправимся",
    //     ArtistId: "artist3",
    //     Date: new Date('2023-04-25'),
    //     AlbumId: "album3",
    //     Duration: 110,
    //     Image: "../assets/imgs/webp/apfs.webp",
    //     Url: "davaypopravimsyaapfs.mp3"
    // },
    // {
    //     Id: "track12",
    //     Name: "Давай поправимся",
    //     ArtistId: "artist3",
    //     Date: new Date('2023-04-25'),
    //     AlbumId: "album3",
    //     Duration: 110,
    //     Image: "../assets/imgs/webp/apfs.webp",
    //     Url: "davaypopravimsyaapfs.mp3"
    // },
    // {
    //     Id: "track12",
    //     Name: "Давай поправимся",
    //     ArtistId: "artist3",
    //     Date: new Date('2023-04-25'),
    //     AlbumId: "album3",
    //     Duration: 110,
    //     Image: "../assets/imgs/webp/apfs.webp",
    //     Url: "davaypopravimsyaapfs.mp3"
    // },
    // {
    //     Id: "track12",
    //     Name: "Давай поправимся",
    //     ArtistId: "artist3",
    //     Date: new Date('2023-04-25'),
    //     AlbumId: "album3",
    //     Duration: 110,
    //     Image: "../assets/imgs/webp/apfs.webp",
    //     Url: "davaypopravimsyaapfs.mp3"
    // },
    // {
    //     Id: "track12",
    //     Name: "Давай поправимся",
    //     ArtistId: "artist3",
    //     Date: new Date('2023-04-25'),
    //     AlbumId: "album3",
    //     Duration: 110,
    //     Image: "../assets/imgs/webp/apfs.webp",
    //     Url: "davaypopravimsyaapfs.mp3"
    // },
    // {
    //     Id: "track12",
    //     Name: "Давай поправимся",
    //     ArtistId: "artist3",
    //     Date: new Date('2023-04-25'),
    //     AlbumId: "album3",
    //     Duration: 110,
    //     Image: "../assets/imgs/webp/apfs.webp",
    //     Url: "davaypopravimsyaapfs.mp3"
    // },
    // {
    //     Id: "track12",
    //     Name: "Давай поправимся",
    //     ArtistId: "artist3",
    //     Date: new Date('2023-04-25'),
    //     AlbumId: "album3",
    //     Duration: 110,
    //     Image: "../assets/imgs/webp/apfs.webp",
    //     Url: "davaypopravimsyaapfs.mp3"
    // },
    // {
    //     Id: "track12",
    //     Name: "Давай поправимся",
    //     ArtistId: "artist3",
    //     Date: new Date('2023-04-25'),
    //     AlbumId: "album3",
    //     Duration: 110,
    //     Image: "../assets/imgs/webp/apfs.webp",
    //     Url: "davaypopravimsyaapfs.mp3"
    // },
];

export const PLAYLISTS: IPlaylist[] = [
    { Id: "1", UserId: '1', Image: "/assets/imgs/1111.jpg", Name: "Liked songs", Type: 0, TrackIds: TRACKS.slice(4, 24).map(track => track.Id) },
    { Id: "2", UserId: '1', Image: "/assets/imgs/webp/apfs.webp", Name: "Опианариум", Type: 1, TrackIds: TRACKS.slice(4, 12).map(track => track.Id) },
    { Id: "3", UserId: '1', Image: "/assets/imgs/loveaddiction.jpg", Name: "Любовь, аддикция и марафоны", Type: 1, TrackIds: TRACKS.slice(12, 24).map(track => track.Id) }
];

export const USERS: IUser[] = [
    {
        Id: "1",
        UserName: 'wandered thoughts',
        Email: 'laoef@example.com',
        Image: '/assets/imgs/bg.png',
        FirstName: null,
        LastName: null
    },
    {
        Id: "2",
        UserName: 'Автостопом по фазе сна',
        Email: 'jane.smith@example.com',
        Image: '/assets/imgs/image.png',
        FirstName: null,
        LastName: null
    },
    {
        Id: "3",
        UserName: 'Три дня дождя',
        Email: 'alice.jones@example.com',
        Image: '/assets/imgs/image.png',
        FirstName: null,
        LastName: null
    }
];