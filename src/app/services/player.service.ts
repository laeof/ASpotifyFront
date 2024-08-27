import { HttpClient } from "@angular/common/http";
import { ApiService } from "./api.service";
import { PlaylistService } from "./playlist.service";
import { BehaviorSubject, Observable } from "rxjs";
import { AudioService } from "./audio.service";

export class PlayerService {

    private randomState: boolean = false;
    randomStateObs = new BehaviorSubject<boolean>(false);

    private repeatState: boolean = false;
    repeatStateObs = new BehaviorSubject<boolean>(false);

    private nowPlayingTrackIdObs = new BehaviorSubject<string>('');
    private nowPlayingPlaylistObs = new BehaviorSubject<string>('');

    constructor(private audioService: AudioService) {

    }

    playBack() {
        
    }

    playNext() {

    }

    toggleAudio(trackId: string, playlistId: string) {
        this.nowPlayingTrackIdObs.next(trackId);
        this.nowPlayingPlaylistObs.next(playlistId);
    }

    toggleRandom() {
        this.randomState = !this.randomState;
        this.randomStateObs.next(this.randomState);
    }

    getRandomState(): Observable<boolean> {
        return this.randomStateObs.asObservable();
    }

    toggleRepeat() {
        this.repeatState = !this.repeatState;
        this.repeatStateObs.next(this.repeatState);
    }

    getRepeatState(): Observable<boolean> {
        return this.repeatStateObs.asObservable();
    }

    setTrackPosition() {

    }

    setVolume() {

    }

    getVolume() {

    }

    getNowPlayingTrackId(): Observable<string> {
        return this.nowPlayingTrackIdObs.asObservable();
    }

    getNowPlayingPlaylistId(): Observable<string> {
        return this.nowPlayingPlaylistObs.asObservable();
    }
}