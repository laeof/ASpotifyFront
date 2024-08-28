import { PlaylistService } from "./playlist.service";
import { BehaviorSubject, iif, Observable } from "rxjs";
import { AudioService } from "./audio.service";
import { QueueService } from "./queue.service";
import { TrackService } from "./track.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class PlayerService {

    randomStateObs = new BehaviorSubject<boolean>(false);
    repeatStateObs = new BehaviorSubject<boolean>(false);

    private nowPlayingPlaylistId: string = '';
    private activePlaylistId: string = '';
    private nowPlayingTrackId: string = '';

    constructor(private audioService: AudioService,
        private queueService: QueueService,
        private trackService: TrackService,
        private playlistService: PlaylistService,
    ) {
        this.queueService.getCurrentTrack().subscribe(trackId => {
            this.nowPlayingTrackId = trackId;
        })

        this.playlistService.getPlayingPlaylistId().subscribe(playlistId => {
            this.nowPlayingPlaylistId = playlistId;
        })

        this.playlistService.getActiveId().subscribe(playlistId => {
            this.activePlaylistId = playlistId
        })
    }

    playBack() {
        this.queueService.prevTrack();
        this.audioService.playTrack(
            this.trackService.getTrackById(
                this.nowPlayingTrackId));
    }

    playNext() {
        this.queueService.nextTrack();
        this.audioService.playTrack(
            this.trackService.getTrackById(
                this.nowPlayingTrackId));
    }

    toggleAudio(trackId: string, playlistId: string) {
        if (this.nowPlayingPlaylistId != playlistId) {
            this.queueService.setQueue(
                this.playlistService.getPlaylistById(playlistId).TrackIds);
        }

        this.audioService.toggleAudio(
            this.trackService.getTrackById(
                trackId),
            this.playlistService.getPlaylistById(
                this.nowPlayingPlaylistId));

        if (this.nowPlayingPlaylistId != playlistId)
            this.setNowPlayingPlaylistId(playlistId);
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

    setNowPlayingPlaylistId(playlistId: string) {
        this.playlistService.setPlayingPlaylistId(playlistId);
    }
}