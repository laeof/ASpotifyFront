import { BehaviorSubject, catchError, first, forkJoin, map, Observable, switchMap, throwError } from "rxjs";
import { IPlaylist, PlaylistType } from "../dtos/playlist";
import { QueueService } from "./queue.service";
import { Injectable } from "@angular/core";
import { IUser } from "../dtos/user";
import { UserService } from "./user.service";
import { HttpClient, HttpContext } from "@angular/common/http";
import { ApiService } from "./api.service";
import { ITrack } from "../dtos/track";
import { ArtistService } from "./artist.service";
import { IArtist } from "../dtos/artist";

@Injectable({
    providedIn: 'root'
})

export class PlaylistService {
    private currentPlaylistPlaying = new BehaviorSubject<IPlaylist>({
        id: '',
        authorId: '',
        name: '',
        imagePath: '',
        types: PlaylistType.Playlist,
        tracks: [],
        color: ''
    });
    private activePlaylist = new BehaviorSubject<IPlaylist>({
        id: '',
        authorId: '',
        name: '',
        imagePath: '',
        types: PlaylistType.Playlist,
        tracks: [],
        color: ''
    });

    private user: IUser = {
        id: "",
        userName: "",
        firstName: null,
        lastName: null,
        email: "",
        avatarUrl: "",
        lovedPlaylistId: "",
        latestTrackId: "",
        latestPlaylistId: "",
        playlists: []
    };

    constructor(private queueService: QueueService,
        private userService: UserService,
        private http: HttpClient,
        private apiService: ApiService,
        private artistService: ArtistService//temporary, need to use user
    ) {
        this.userService.getCurrentUserInfo().subscribe((user: any) => {
            this.user = user;
        });
    }

    getPlaylistById(id: string): Observable<IPlaylist> {
        if(id === '' || id === undefined)
            return throwError(() => new Error('Playlist ID is undefined'));
        return this.http.get<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist/' + id)
    }

    addTrackToPlaylist(playlistId: string, trackId: string) {
        return this.http.put<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist', { playlistId, trackId })
    }

    //todo
    //add to backend
    removeTrackFromPlaylist(playlistId: string, trackId: string) {
        return this.http.put<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist', { playlistId, trackId })
    }

    addToPlaylist(playlistId: string, trackId: string) {
        this.addToPlaylist(playlistId, trackId)
        if (playlistId == this.currentPlaylistPlaying.value.id)
            this.queueService.addTrackAtIndex(trackId, 0);
    }

    removeFromPlaylist(playlistId: string, trackId: string) {
        this.removeFromPlaylist(playlistId, trackId);
    }

    getLovedTrackState(track: ITrack): boolean {
        if(this.user.playlists.findIndex(trackId => trackId === track.id) != -1)
            return true
        return false;
    }

    getAllPlaylistsUserId(id: string): Observable<IPlaylist[]> {
        return this.artistService.getArtistById(id).pipe(
            switchMap((user: IArtist) => {
                const playlistObservables = user.albums.map((id: string) => this.getPlaylistById(id));
    
                return forkJoin(playlistObservables);
            })
        )
    }

    getAllMyPlaylists(): Observable<IPlaylist[]> {
        return forkJoin(this.user.playlists.map((id: string) => this.getPlaylistById(id)));
    }

    createNewPlaylist(dto: IPlaylist) {

        this.http.post<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist', dto)
            .subscribe(
                (response: any) => {
                    this.userService.addPlaylistToUserById(response.authorId, response.id);
                },
                (error: any) => {
                    console.log(error)
                }
            );
    }
    createNewLovedPlaylist(userid: string) {
        const playlist: IPlaylist = {
            id: "00000000-0000-0000-0000-000000000000",
            authorId: userid,
            imagePath: "http://localhost:5283/Image/loved.webp",
            name: "Loved Songs",
            types: PlaylistType.Playlist,
            tracks: [],
            color: "rgb(61,50,154)"
        }

        const formData = new FormData();

        this.http.post<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist', playlist).subscribe({
            next: ((response: any) => {
                console.log(response)
            }),
            error: ((response: Error) => {
                console.log(response)
            })
        });
    }
    
    createNewEmptyPlaylist() {
        const playlist: IPlaylist = {
            id: "",
            authorId: this.user.id,
            imagePath: "http://localhost:5283/Image/loved.webp",
            name: "Loved Songs",
            types: PlaylistType.Playlist,
            tracks: [],
            color: "rgb(15,0,148)"
        }

        const formData = new FormData();

        this.http.post<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist', playlist).subscribe();
    }

    setActivePlaylist(id: IPlaylist) {
        this.activePlaylist.next(id);
    }

    getActivePlaylist(): Observable<IPlaylist> {
        return this.activePlaylist.asObservable();
    }

    setPlayingPlaylist(id: IPlaylist) {
        this.currentPlaylistPlaying.next(id);
    }

    getPlayingPlaylist(): Observable<IPlaylist> {
        return this.currentPlaylistPlaying.asObservable();
    }

    getPlaylistType(type: PlaylistType): string {
        switch (type) {
            case 0:
                return 'Playlist';
            case 1:
                return 'Album';
            case 2:
                return 'Single'
        }

        return ''
    }
}