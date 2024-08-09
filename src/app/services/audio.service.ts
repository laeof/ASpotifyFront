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
    trackid: string | undefined;
    constructor(private http: HttpClient) {
        this.audio = new Audio();
    }

    playAudio(item: ITrack) {
        this.trackId.next(item.Id);
        this.setCurrentTrack(item);
        this.streamAudio(item.Url).subscribe(blob => {
            this.audio.src = URL.createObjectURL(blob);
            this.audio.volume = this.volume.value;
            this.audio.play();
        });
    }

    playPlaylist(index: number = 0) {
        if (!this.playlist || this.playlist.Tracks.length === 0) {
            console.log("no playlist")
            return;
        }

        if (index >= this.playlist.Tracks.length) {
            index = 0;
        }

        this.playAudio(this.playlist.Tracks[index]);
        this.trackId.next(this.playlist.Tracks[index].Id);
        // Обновляем позицию трека каждую секунду
        let i = 0;
        const intervalId = setInterval(() => {
            i = this.audio.currentTime;
            if (i > this.playlist.Tracks[index].Duration) {
                clearInterval(intervalId);
                this.trackId.next("");
                this.playPlaylist(index + 1);
            }
        }, 1000);
    }

    stopAudio(item: ITrack) {
        this.trackId.next("");
        this.audio.pause();
    }

    getCurrentTrack(): Observable<ITrack> {
        return this.currentTrack.asObservable();
    }

    setCurrentTrack(track: ITrack) {
        this.currentTrack.next(track);
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