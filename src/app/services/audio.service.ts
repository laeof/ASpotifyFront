import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITrack } from '../dtos/track';
import { IPlaylist } from '../dtos/playlist';
import { PlaylistType } from '../dtos/playlist';
import { ApiService } from './api.service';
import { PlaylistService } from './playlist.service';
import { PlayerService } from './player.service';
import { TrackService } from './track.service';
import { QueueService } from './queue.service';

@Injectable({
    providedIn: 'root'
})

export class AudioService {
    private musicApi = "";
    private audio: any;

    private trackPosition = new BehaviorSubject<number>(0);
    private volume = new BehaviorSubject<number>(0.05);
    private isPaused = new BehaviorSubject<boolean>(false);
    private trackid: string = "";
    private nextTrackId: string = '';
    private playlistActiveId = '';
    private playlistPlayingId = '';

    private playlist: IPlaylist = {
        Id: '',
        UserId: '',
        Image: '',
        Name: '',
        Type: PlaylistType.Playlist,
        TrackIds: []
    }

    constructor(private http: HttpClient,
        private api: ApiService,
        private trackService: TrackService,
        private queueService: QueueService,
        private playlistService: PlaylistService
    ) {
        this.audio = new Audio();
        this.musicApi = this.api.getMusicApi();
        this.queueService.getNextPlayingTrack().subscribe(nextId => {
            this.nextTrackId = nextId
        })

        this.queueService.getCurrentPlayingTrack().subscribe(trackId => {
            this.trackid = trackId
        })

        this.playlistService.getPlayingPlaylistId().subscribe(value => {
            this.playlistPlayingId = value;
        })

        this.playlistService.getActiveId().subscribe(value => {
            this.playlistActiveId = value;
        })
    }

    private intervalId: any;

    playTrack(track: ITrack, nextTrack: ITrack = this.trackService.getTrackById(this.nextTrackId)) {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.playAudio(track);
        this.setTrackPositionTracking(0);

        this.intervalId = setInterval(() => {
            let currentTime = Math.round(this.audio.currentTime);

            this.setTrackPositionTracking(currentTime);

            if (this.trackService.getTrackById(this.trackid).Duration == currentTime)
                this.playTrack(nextTrack);
        }, 1000);
    }

    toggleAudio(item: ITrack, playlist: IPlaylist) {
        if (!this.audio.paused && item.Id === this.trackid && this.playlist.Id == this.playlistPlayingId) {
            this.stopAudio();
            return;
        }

        if (this.audio.src != "" && this.playlist.Id == this.playlistPlayingId) {
            this.resumeAudio();
            return;
        }

        if (this.audio.src == "") {
            this.playTrack(item);
            return;
        }
    }

    playAudio(item: ITrack) {
        this.isPaused.next(false);
        this.streamAudio(item.Url).subscribe(blob => {
            this.audio.src = URL.createObjectURL(blob);
            this.audio.volume = this.volume.value;
            this.audio.play();
        });
    }

    stopAudio() {
        this.audio.pause();
        this.isPaused.next(true);
    }

    resumeAudio() {
        let time = this.audio.currentTime;
        this.audio.play();
        this.audio.currentTime = time;
        this.isPaused.next(false);
    }

    setTrackPositionTracking(position: number) {
        this.trackPosition.next(position);
    }

    setTrackPosition(position: number) {
        this.trackPosition.next(position);
        this.audio.currentTime = position;
    }

    getTrackPosition(): Observable<number> {
        return this.trackPosition.asObservable();
    }

    setVolume(volume: number) {
        this.volume.next(volume);
        this.audio.volume = volume;
    }

    getVolume(): Observable<number> {
        return this.volume.asObservable();
    }

    isTrackPaused(): Observable<boolean> {
        return this.isPaused.asObservable();
    }

    streamAudioFromServer(path: string): Observable<Blob> {
        return this.http.get(`${this.musicApi}/stream/` + path, { responseType: 'blob' });
    }

    streamAudio(path: string): Observable<Blob> {
        return new Observable<Blob>(observer => {
            let blob: Blob | null = null;

            fetch("../assets/music/" + path)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(fetchedBlob => {
                    blob = fetchedBlob;
                    observer.next(blob);
                    blob = null;
                })
                .catch(error => {
                    console.error('Error loading file:', error);
                    observer.next(new Blob());
                })
                .finally(() => observer.complete());
        });
    }
}