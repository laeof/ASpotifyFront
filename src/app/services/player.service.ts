import { PlaylistService } from "./playlist.service";
import { BehaviorSubject, first, iif, Observable } from "rxjs";
import { AudioService } from "./audio.service";
import { QueueService } from "./queue.service";
import { TrackService } from "./track.service";
import { Injectable } from "@angular/core";
import { IPlaylist, PlaylistType } from "../dtos/playlist";
import { ITrack } from "../dtos/track";

@Injectable({
    providedIn: 'root'
})

export class PlayerService {
    private randomStateObs = new BehaviorSubject<boolean>(false);
    private repeatStateObs = new BehaviorSubject<boolean>(false);

    private nowPlayingPlaylist: IPlaylist = {
        id: "",
        authorId: "",
        imagePath: "",
        name: "",
        types: PlaylistType.Playlist,
        trackPlaylists: [],
        tracks: [],
        color: ""
    };
    private nowPlayingTrackId: string = '';

    constructor(private audioService: AudioService,
        private queueService: QueueService,
        private trackService: TrackService,
        private playlistService: PlaylistService,
    ) {
        this.queueService.getCurrentTrackId().subscribe(trackId => {
            this.nowPlayingTrackId = trackId;
        })

        this.playlistService.getPlayingPlaylist().subscribe(playlist => {
            this.nowPlayingPlaylist = playlist;
        })
    }

    playBack() {
        this.queueService.prevTrack();
        this.trackService.getTrackById(this.nowPlayingTrackId).subscribe(
            (track: ITrack) => {
                this.audioService.playTrack(track);
            }
        )
    }

    playNext() {
        this.queueService.nextTrack();
        this.trackService.getTrackById(this.nowPlayingTrackId).subscribe(
            (track: ITrack) => {
                this.audioService.playTrack(track);
            }
        )
    }

    toggleAudio(track: ITrack, playlist: IPlaylist, lockPlaylistCheck: boolean = false) {
        if (this.nowPlayingPlaylist.id != playlist.id) {
            this.queueService.setQueue(playlist.tracks.map(track => track.id))
        }
        this.audioService.toggleAudio(
            track, this.nowPlayingPlaylist, lockPlaylistCheck);

        if (this.nowPlayingPlaylist.id != playlist.id)
            this.playlistService.setPlayingPlaylist(playlist)
    }

    toggleRandom() {
        this.randomStateObs.next(!this.randomStateObs.value);

        if (this.randomStateObs.value)
            this.queueService.shuffleQueue();
    }

    getRandomState(): Observable<boolean> {
        return this.randomStateObs.asObservable();
    }

    toggleRepeat() {
        this.repeatStateObs.next(!this.repeatStateObs.value);
        this.queueService.toggleRepeatTrack(this.repeatStateObs.value);
    }

    getRepeatState(): Observable<boolean> {
        return this.repeatStateObs.asObservable();
    }

    setTrackPosition(position: number) {
        this.audioService.setTrackPosition(position);
    }

    setVolume(volume: number) {
        this.audioService.setVolume(volume);
    }

    getVolume(): Observable<number> {
        return this.audioService.getVolume();
    }
}