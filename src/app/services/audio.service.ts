import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITrack } from '../dtos/track';
import { IPlaylist } from '../dtos/playlist';

@Injectable({
    providedIn: 'root'
})
export class AudioService {
    private apiUrl = 'http://localhost:5283/Audio';
    audio: any;
    private currentTrack = new BehaviorSubject<ITrack>({
        AlbumId: "",
        Id: '',
        Name: '',
        ArtistId: '',
        Date: new Date,
        Duration: 0,
        Image: '',
        Url: ''
    });

    playlist: IPlaylist = {
        Id: '',
        UserId: '',
        Image: '',
        Name: '',
        Tracks: []
    };
    private trackPosition = new BehaviorSubject<number>(0);
    private volume = new BehaviorSubject<number>(1);
    private trackId = new BehaviorSubject<string>("");
    private playlistId = new BehaviorSubject<string>("");
    private isPaused = new BehaviorSubject<boolean>(false);
    private index: number = 0;
    trackid: string = "";
    constructor(private http: HttpClient) {
        this.audio = new Audio();
    }

    private intervalId: any;

    playPlaylist(index: number = 0) {
        if (!this.playlist || this.playlist.Tracks.length === 0) {
            console.log("no playlist")
            return;
        }

        if (index >= this.playlist.Tracks.length) {
            index = 0;
        }

        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.playAudio(this.playlist.Tracks[index]);
        this.trackId.next(this.playlist.Tracks[index].Id);
        this.trackid = this.playlist.Tracks[index].Id;
        this.playlistId.next(this.playlist.Id);
        this.setTrackPositionTracking(0);

        let wait = false;

        this.intervalId = setInterval(() => {
            let currentTime = Math.round(this.audio.currentTime);
            console.log("currenttime: ", currentTime)
            this.setTrackPositionTracking(currentTime);
            if (wait) {
                wait = false;
                this.playPlaylist(index + 1);
            }
            if (Math.round(currentTime) === this.playlist.Tracks[index].Duration) {
                wait = true;
            }
        }, 1000);
    }

    toggleAudio(item: ITrack, index: number = this.index, playlist: IPlaylist = this.playlist) {
        // if (this.isActive(item.Id)) {
        //     this.trackId = ""
        //     this.audioService.stopAudio(item);
        // }
        // else {
        //     this.trackId = this.playlist.Tracks[index].Id;
        //     this.audioService.setPlaylist(this.playlist);
        //     this.audioService.playPlaylist(index);
        // }
        if (this.trackid == item.Id && !this.audio.paused) {
            this.stopAudio(item);
            console.log(1)
        }
        else if (this.audio.src != "" && item.Id == this.trackid && this.audio.paused) {
            this.resumeAudio();
            console.log(2)
        }
        else {
            this.setPlaylist(playlist);
            this.playPlaylist(index);
            console.log(3)
            this.index = index;
        }
    }

    playAudio(item: ITrack) {
        this.trackId.next(item.Id);
        this.trackid = item.Id;
        this.setCurrentTrack(item);
        this.isPaused.next(false);
        this.streamAudio(item.Url).subscribe(blob => {
            this.audio.src = URL.createObjectURL(blob);
            this.audio.volume = this.volume.value;
            this.audio.play();
        });
    }

    stopAudio(item: ITrack) {
        //this.trackId.next("");
        //this.playlistId.next("");
        this.audio.pause();
        this.isPaused.next(true);
    }

    resumeAudio() {
        let time = this.audio.currentTime;
        this.audio.play();
        this.audio.currentTime = time;
        this.isPaused.next(false);
    }

    isTrackPaused(): Observable<boolean> {
        return this.isPaused;
    }

    getCurrentTrack(): Observable<ITrack> {
        return this.currentTrack.asObservable();
    }

    setCurrentTrack(track: ITrack) {
        this.currentTrack.next(track);
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

    setPlaylist(playlist: IPlaylist) {
        this.playlist = playlist;
    }

    getPlaylistId(): Observable<string> {
        return this.playlistId;
    }

    streamAudioFromServer(path: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/stream/` + path, { responseType: 'blob' });
    }

    streamAudio(path: string): Observable<Blob> {
        return new Observable<Blob>(observer => {
            fetch("../assets/music/" + path)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => observer.next(blob))
                .catch(error => {
                    console.error('Ошибка при загрузке файла:', error);
                    observer.next(new Blob()); // Возвращаем пустой Blob в случае ошибки
                })
                .finally(() => observer.complete());
        });
    }
    getDuration(duration: number): string {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const secs = duration % 60;

        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = secs.toString().padStart(2, '0');

        if (hours > 0) {
            const hoursStr = hours.toString().padStart(2, '0');
            return `${hoursStr}:${minutesStr}:${secondsStr}`;
        } else {
            return `${minutesStr}:${secondsStr}`;
        }
    }
}