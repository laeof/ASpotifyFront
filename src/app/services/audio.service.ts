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
    private volume = new BehaviorSubject<number>(0.1);
    private isPaused = new BehaviorSubject<boolean>(false);
    private track: ITrack = {
        id: '',
        name: '',
        artistId: '',
        createdDate: new Date,
        albumId: '',
        duration: 0,
        imagePath: '',
        urlPath: ''
    }
    private nextTrack: ITrack = {
        id: '',
        name: '',
        artistId: '',
        createdDate: new Date,
        albumId: '',
        duration: 0,
        imagePath: '',
        urlPath: ''
    }
    private playlistActiveId = '';

    constructor(private http: HttpClient,
        private api: ApiService,
        private queueService: QueueService,
        private playlistService: PlaylistService,
        private trackService: TrackService
    ) {
        this.audio = new Audio();
        this.musicApi = this.api.getMusicApi();
        this.queueService.getNextTrack().subscribe(nextId => {
            this.trackService.getTrackById(nextId).subscribe(
                (track: ITrack) => {
                    this.nextTrack = track;
                }
            )
        })

        this.queueService.getCurrentTrackId().subscribe(trackId => {
            this.trackService.getTrackById(trackId).subscribe(
                (track: ITrack) => {
                    this.track = track;
                }
            )
        })

        this.playlistService.getActiveId().subscribe(value => {
            this.playlistActiveId = value;
        })
    }

    private intervalId: any;
    private intervalResume: any;

    playTrack(track: ITrack) {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        if (this.track.id !== track.id)
            this.queueService.setCurrentTrack(track.id);

        this.playAudio(track);
        this.setTrackPositionTracking(0);

        this.intervalId = setInterval(() => {
            let currentTime = Math.round(this.audio.currentTime);

            this.setTrackPositionTracking(currentTime);

            if (this.track.duration == currentTime)
                this.playTrack(this.nextTrack);
        }, 1000);
    }

    toggleAudio(item: ITrack, playlist: IPlaylist, lockPlaylistCheck: boolean = false) {
        if (item.id === this.track.id && (playlist.id == this.playlistActiveId || lockPlaylistCheck)) {
            if (!this.audio.paused) {
                this.stopAudio();
                console.log('stopped')
                return;
            }

            if (this.audio.src != "" || item.id != '') {
                this.resumeAudio();
                console.log('resumed')
                return;
            }
        }

        console.log(this.track.id)
        console.log(item.id)

        if (this.track.id != item.id)
            this.setTrackPosition(0)

        this.playTrack(item);

    }

    playAudio(item: ITrack) {
        this.isPaused.next(false);
        this.streamAudioFromServer(item.urlPath).subscribe(blob => {
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
        this.isPaused.next(false);

        let time = this.audio.currentTime ?? this.trackPosition.value;

        if (this.audio.src == "")
            this.playAudio(this.track);
        else
            this.audio.play();

        if (this.intervalResume) {
            clearInterval(this.intervalResume);
        }

        this.setTrackPosition(Math.round(time));

        this.intervalResume = setInterval(() => {

            let currentTime = Math.round(this.audio.currentTime);

            this.setTrackPositionTracking(currentTime);

            if (this.track.duration == currentTime)
                this.playTrack(this.nextTrack);
        }, 1000);
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

    setTrackPause() {
        this.isPaused.next(true);
    }

    isTrackPaused(): Observable<boolean> {
        return this.isPaused.asObservable();
    }

    streamAudioFromServer(path: string): Observable<Blob> {
        return this.http.get(`${this.musicApi}Audio/Stream/` + path, { responseType: 'blob' });
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