import { BehaviorSubject, Observable } from "rxjs";
import { USERS } from "../data/data";
import { IUser } from "../dtos/user";

export class UserService {
    private users: IUser[] = USERS;

    private currentUser = new BehaviorSubject<IUser>(
        {
            Id: "",
            UserName: "",
            FirstName: null,
            LastName: null,
            Email: "",
            lovedPlaylistId: "",
            Image: "",
            latestPlayingPlaylist: '',
            latestPlayingTrack: '',
            Playlists: []
        })

    constructor() {
        this.currentUser.next(this.users[0]);
    }

    getCurrentUserInfo(): Observable<IUser> {
        return this.currentUser.asObservable();
    }

    getUserInfoById(id: string): IUser | undefined {
        return this.users.find(user => user.Id === id)
    }

    setLatestTrack(trackId: string) {
        this.currentUser.value.latestPlayingPlaylist = trackId;
    }

    setLatestPlaylist(playlistId: string) {
        this.currentUser.value.latestPlayingPlaylist = playlistId;
    }

    addPlaylistToUserById(userId: string, playlistId: string) {
        if (userId == this.currentUser.value.Id) {
            this.addPlaylistToCurrentUser(playlistId)
            return
        }
        
        this.users.find(user => user.Id === userId)?.Playlists.push(playlistId)
    }

    addPlaylistToCurrentUser(playlistId: string) {
        this.currentUser.value.Playlists.push(playlistId)
        this.currentUser.next(this.currentUser.value)
    }
}