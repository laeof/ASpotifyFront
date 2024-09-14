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

    private nowPlayingPlaylistId: string = '';
    private nowPlayingPlaylist: IPlaylist = {
        id: "",
        authorId: "",
        imagePath: "",
        name: "",
        types: PlaylistType.Playlist,
        tracks: []
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

        this.playlistService.getPlayingPlaylistId().subscribe(playlistId => {
            this.nowPlayingPlaylistId = playlistId;
            this.playlistService.getPlaylistById(this.nowPlayingPlaylistId).pipe(first()).subscribe(
                (playlist: IPlaylist) => {
                    this.nowPlayingPlaylist = playlist
                })
        })
    }

    playBack() {
        this.trackService.getTrackById(this.nowPlayingTrackId).subscribe(
            (track: ITrack) => {
                this.queueService.prevTrack();
                this.audioService.playTrack(track);
            }
        )
    }

    playNext() {
        this.trackService.getTrackById(this.nowPlayingTrackId).subscribe(
            (track: ITrack) => {
                this.queueService.nextTrack();
                this.audioService.playTrack(track);
            }
        )
    }

    toggleAudio(track: ITrack, playlist: IPlaylist, lockPlaylistCheck: boolean = false) {
        if (this.nowPlayingPlaylistId != playlist.id) {
            this.queueService.setQueue(playlist.tracks)
        }
        this.audioService.toggleAudio(
            track, this.nowPlayingPlaylist, lockPlaylistCheck);

        if (this.nowPlayingPlaylistId != playlist.id)
            this.playlistService.setPlayingPlaylistId(playlist.id)
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