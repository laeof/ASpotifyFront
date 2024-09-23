import { BehaviorSubject, debounceTime, first, Observable } from "rxjs";
import { IUser } from "../dtos/user";
import { AccountService } from "./account.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ApiService } from "./api.service";
import { SpotifyCookieService } from "./spotifycookie.service";
import { ITokens } from "../dtos/tokens";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class UserService {
    public emptyUser: IUser = {
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
    }

    private currentUser = new BehaviorSubject<IUser>(this.emptyUser)

    constructor(private accountService: AccountService,
        private http: HttpClient,
        private apiService: ApiService,
        private cookieService: SpotifyCookieService
    ) {
        this.cookieService.getAccessToken().subscribe(response => {
            this.accountService.accessToken = response
            if (response == '')
                this.currentUser.next(this.emptyUser)
        })

        this.cookieService.getRefreshToken().subscribe(response => {
            this.accountService.refreshToken = response
        })
    }

    setCurrentUser(user: IUser) {
        this.currentUser.next(user);
    }

    getUserInfo(): Observable<IUser> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.accountService.accessToken}`
        });

        return this.http.get<IUser>(this.apiService.getAuthApi() + 'User/GetUser/', { headers })
    }

    getCurrentUserInfo(): Observable<IUser> {
        return this.currentUser.asObservable();
    }

    getUserInfoById(id: string): IUser | undefined {
        return this.emptyUser
    }

    setLatestTrack(trackId: string) {
        this.currentUser.value.latestTrackId = trackId;
    }

    setLatestPlaylist(playlistId: string) {
        this.currentUser.value.latestPlaylistId = playlistId;
    }

    addPlaylistToUserById(userId: string, playlistId: string) {
        if (userId == this.currentUser.value.id) {
            this.addPlaylistToCurrentUser(playlistId)
            return
        }
    }

    addPlaylistToCurrentUser(playlistId: string) {
        this.currentUser.value.playlists.push(playlistId)
        this.currentUser.next(this.currentUser.value)
    }
}
