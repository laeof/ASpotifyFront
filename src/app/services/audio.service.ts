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

@Injectable({
    providedIn: 'root'
})

export class AudioService {
    private musicApi = "";
    private audio: any;

    private currentPlaylist = new BehaviorSubject<IPlaylist>({
        Id: '',
        UserId: '',
        Image: '',
        Name: '',
        Type: PlaylistType.Playlist,
        TrackIds: []
    });

    private playlist: IPlaylist = {
        Id: '',
        UserId: '',
        Image: '',
        Name: '',
        Type: PlaylistType.Playlist,
        TrackIds: []
    };
    private trackPosition = new BehaviorSubject<number>(0);
    private volume = new BehaviorSubject<number>(0.05);
    private playlistId = new BehaviorSubject<string>("");
    private isPaused = new BehaviorSubject<boolean>(false);
    private trackid: string = "";

    constructor(private http: HttpClient,
        private api: ApiService,
        private trackService: TrackService
    ) {
        this.audio = new Audio();
        this.musicApi = this.api.getMusicApi();
    }

    private intervalId: any;

    //save
    playTrack(track: ITrack, repeat: boolean = false) {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.playAudio(track);
        this.playlistId.next(this.playlist.Id);
        this.setTrackPositionTracking(0);

        this.intervalId = setInterval(() => {
            let currentTime = Math.round(this.audio.currentTime);

            this.setTrackPositionTracking(currentTime);
            if (repeat)
                this.playTrack(track);
            else {
                // playnexttrack
                this.playTrack(track);
            }
        }, 1000);
    }

    //save
    toggleAudio(item: ITrack, playlist: IPlaylist = this.playlist, currentPlaylist: IPlaylist = this.playlist) {
        //fixme
        if (this.trackid == item.Id && !this.audio.paused && playlist.Id === currentPlaylist.Id) {
            this.stopAudio(item);
            //console.log(1)
        }
        else if (this.audio.src != "" && item.Id == this.trackid && this.audio.paused && playlist.Id === currentPlaylist.Id) {
            this.resumeAudio();
            //console.log(2)
        }
        else {
            this.setPlaylist(playlist);
            this.playTrack(item);
            //console.log(3)
        }
    }

    //save
    playAudio(item: ITrack) {
        //this.trackId.next(item.Id);
        //this.trackid = item.Id;
        //this.setCurrentTrack(item);
        this.isPaused.next(false);
        this.streamAudio(item.Url).subscribe(blob => {
            this.audio.src = URL.createObjectURL(blob);
            this.audio.volume = this.volume.value;
            this.audio.play();
        });
    }

    //save
    stopAudio(item: ITrack) {
        this.audio.pause();
        this.isPaused.next(true);
    }

    //save
    resumeAudio() {
        let time = this.audio.currentTime;
        this.audio.play();
        this.audio.currentTime = time;
        this.isPaused.next(false);
    }

    //save
    setTrackPositionTracking(position: number) {
        this.trackPosition.next(position);
    }

    //save
    setTrackPosition(position: number) {
        this.trackPosition.next(position);
        this.audio.currentTime = position;
    }

    //save
    getTrackPosition(): Observable<number> {
        return this.trackPosition.asObservable();
    }

    //save
    setVolume(volume: number) {
        this.volume.next(volume);
        this.audio.volume = volume;
    }

    //save
    getVolume(): Observable<number> {
        return this.volume.asObservable();
    }

    //save
    setPlaylist(playlist: IPlaylist) {
        this.playlist = playlist;
        this.currentPlaylist.next(this.playlist)
    }

    //save
    getPlaylistId(): Observable<string> {
        return this.playlistId;
    }

    getPlaylist(): Observable<IPlaylist> {
        return this.currentPlaylist;
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

    getDuration(duration: number): string {
        return this.trackService.getDuration(duration);
    }
}