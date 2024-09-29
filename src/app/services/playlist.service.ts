import { BehaviorSubject, first, forkJoin, Observable, switchMap } from "rxjs";
import { IPlaylist, PlaylistType } from "../dtos/playlist";
import { QueueService } from "./queue.service";
import { Injectable } from "@angular/core";
import { IUser } from "../dtos/user";
import { UserService } from "./user.service";
import { HttpClient, HttpContext, HttpHeaders } from "@angular/common/http";
import { ApiService } from "./api.service";
import { ITrack } from "../dtos/track";
import { AccountService } from "./account.service";

@Injectable({
    providedIn: 'root'
})

export class PlaylistService {

    private emptyPlaylist = new BehaviorSubject<IPlaylist>({
        id: '',
        authorId: '',
        name: '',
        imagePath: '',
        types: PlaylistType.Playlist,
        tracks: [],
        trackPlaylists: [],
        color: ''
    })

    private currentPlaylistPlaying = new BehaviorSubject<IPlaylist>({
        id: '',
        authorId: '',
        name: '',
        imagePath: '',
        types: PlaylistType.Playlist,
        tracks: [],
        trackPlaylists: [],
        color: ''
    });
    private activePlaylist = new BehaviorSubject<IPlaylist>({
        id: '',
        authorId: '',
        name: '',
        imagePath: '',
        types: PlaylistType.Playlist,
        trackPlaylists: [],
        tracks: [],
        color: ''
    });

    private lovedPlaylist: IPlaylist = {
        id: "",
        authorId: "",
        imagePath: "",
        name: "",
        types: PlaylistType.Playlist,
        tracks: [],
        trackPlaylists: [],
        color: ""
    }

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
        private accountService: AccountService
    ) {
        this.userService.getCurrentUserInfo().subscribe((user: any) => {
            this.user = user;
            this.getPlaylistById(user.lovedPlaylistId).pipe(first()).subscribe(
                (response: IPlaylist) => this.lovedPlaylist = response
            )
        });
    }

    getPopularPlaylists(): Observable<IPlaylist[]> {
        return this.http.get<IPlaylist[]>(this.apiService.getPlaylistApi() + 'Playlist/popularplaylists');
    }

    getPlaylistById(id: string): Observable<IPlaylist> {
        if (id === '' || id === undefined)
            return this.emptyPlaylist;
        return this.http.get<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist/' + id);
    }

    addTrackToPlaylist(playlistId: string, trackId: string) {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.accountService.accessToken}`
        });

        return this.http.put<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist/addtoplaylist', { playlistId, trackId }, { headers });
    }

    removeTrackFromPlaylist(playlistId: string, trackId: string) {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.accountService.accessToken}`
        });

        return this.http.put<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist/removefromplaylist', { playlistId, trackId }, { headers });
    }

    addToPlaylist(playlistId: string, trackId: string) {
        this.addTrackToPlaylist(playlistId, trackId).pipe(first()).subscribe(
            (response: IPlaylist) => {
                let index = this.user.playlists.findIndex(x => x == playlistId)

                if (index == -1) return

                this.user.playlists[index] = response.id

                if(playlistId == this.activePlaylist.value.id)
                    this.activePlaylist.next(response)

                this.userService.setCurrentUser(this.user)
            }
        );

        if (playlistId == this.currentPlaylistPlaying.value.id)
            this.queueService.addTrackAtIndex(trackId, 0);
    }

    removeFromPlaylist(playlistId: string, trackId: string) {
        this.removeTrackFromPlaylist(playlistId, trackId).pipe(first()).subscribe(
            (response: IPlaylist) => {
                let index = this.user.playlists.findIndex(x => x == playlistId)

                if (index == -1) return

                this.user.playlists[index] = response.id

                if(playlistId == this.activePlaylist.value.id)
                    this.activePlaylist.next(response)

                this.userService.setCurrentUser(this.user)
            }
        );
    }

    getLovedTrackState(track: ITrack): boolean {
        if (this.lovedPlaylist.tracks.findIndex(t => t.id === track.id) != -1)
            return true;
        return false;
    }

    getAllPlaylistsUserId(id: string): Observable<IPlaylist[]> {
        return this.userService.getUserInfoById(id).pipe(
            switchMap((user: IUser) => {
                const playlistObservables = user.playlists.map((id: string) => this.getPlaylistById(id));

                return forkJoin(playlistObservables);
            })
        )
    }

    getAllMyPlaylists(): Observable<IPlaylist[]> {
        return forkJoin(this.user.playlists.map((id: string) => this.getPlaylistById(id)));
    }

    createNewPlaylist(dto: IPlaylist) {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.accountService.accessToken}`
        });
        this.http.post<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist', dto, { headers })
            .pipe(first())
            .subscribe({
                next: (response: any) => {
                    this.userService.addPlaylistToUserById(response.authorId, response.id);
                },
                error: (error: any) => {
                    console.log(error)
                }
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
            color: "rgb(15,0,148)",
            trackPlaylists: []
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