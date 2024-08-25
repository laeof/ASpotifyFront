import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITrack } from '../dtos/track';
import { IPlaylist } from '../dtos/playlist';
import { ApiService } from './api.service';
import { PlaylistService } from './playlist.service';

@Injectable({
    providedIn: 'root'
})

export class AudioService {
    private musicApi = "";
    private audio: any;
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

    private nextTrackObs = new BehaviorSubject<ITrack>({
        AlbumId: "",
        Id: '',
        Name: '',
        ArtistId: '',
        Date: new Date,
        Duration: 0,
        Image: '',
        Url: ''
    });

    private currentPlaylist = new BehaviorSubject<IPlaylist>({
        Id: '',
        UserId: '',
        Image: '',
        Name: '',
        Tracks: []
    });

    private playlist: IPlaylist = {
        Id: '',
        UserId: '',
        Image: '',
        Name: '',
        Tracks: []
    };
    private trackPosition = new BehaviorSubject<number>(0);
    private volume = new BehaviorSubject<number>(0.05);
    private trackId = new BehaviorSubject<string>("");
    private playlistId = new BehaviorSubject<string>("");
    private isPaused = new BehaviorSubject<boolean>(false);
    private index: number = 0;
    private trackid: string = "";
    private repeat: boolean = false;
    private random: boolean = false;
    private prevTrackIndex: number[] = [];

    constructor(private http: HttpClient,
        private api: ApiService,
        private playlistService: PlaylistService
    ) {
        this.audio = new Audio();
        this.musicApi = api.getMusicApi();
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

        this.prevTrackIndex.push(index);
        this.genRandomTrack();
        this.playAudio(this.playlist.Tracks[index]);
        this.trackId.next(this.playlist.Tracks[index].Id);
        this.trackid = this.playlist.Tracks[index].Id;
        this.playlistId.next(this.playlist.Id);
        this.setTrackPositionTracking(0);

        let wait = false;

        this.intervalId = setInterval(() => {
            let currentTime = Math.round(this.audio.currentTime);
            //console.log("currenttime: ", currentTime)
            this.setTrackPositionTracking(currentTime);
            if (wait) {
                wait = false;

                if (this.repeat) {
                    this.playPlaylist(index);
                }
                else if (this.random) {
                    this.playRandom();
                }
                else {
                    this.playPlaylist(index + 1);
                }
            }
            if (Math.round(currentTime) === this.playlist.Tracks[index].Duration) {
                wait = true;
            }
        }, 1000);
    }

    toggleAudio(item: ITrack, index: number = this.index, playlist: IPlaylist = this.playlist, currentPlaylist: IPlaylist = this.playlist) {
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
            this.playlistService.setRandomTrack(this.playlist.Tracks)
            this.playPlaylist(index);
            //console.log(3)
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
        this.audio.pause();
        this.isPaused.next(true);
    }

    resumeAudio() {
        let time = this.audio.currentTime;
        this.audio.play();
        this.audio.currentTime = time;
        this.isPaused.next(false);
    }

    randomTrack: ITrack = {
        Id: '',
        Name: '',
        ArtistId: '',
        Date: new Date(),
        AlbumId: '',
        Duration: 0,
        Image: '',
        Url: ''
    }

    playRandom() {
        this.playPlaylist(this.playlist.Tracks.findIndex(index => index.Id === this.randomTrack.Id))
    }

    isActive() {
        return this.trackid != "";
        // return true;
    }

    isTrackPaused(): Observable<boolean> {
        return this.isPaused;
    }

    getPrevTrackIndex() {
        this.prevTrackIndex.pop();
        return this.prevTrackIndex.pop();
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
        this.currentPlaylist.next(this.playlist)
    }

    getPlaylistId(): Observable<string> {
        return this.playlistId;
    }

    getPlaylist(): Observable<IPlaylist> {
        return this.currentPlaylist;
    }

    getRepeat(): boolean {
        return this.repeat;
    }

    toggleRepeat() {
        this.repeat = !this.repeat;
        this.genNotRandomTrack();
    }

    genNotRandomTrack() {
        if (!this.repeat)
            this.nextTrackObs.next(this.playlist.Tracks[this.playlist.Tracks.findIndex(track => track.Id === this.trackid) + 1]);
        else {
            this.nextTrackObs.next(this.playlist.Tracks[this.playlist.Tracks.findIndex(track => track.Id === this.trackid)]);
        }
    }

    genRandomTrack() {
        this.randomTrack = this.playlistService.getRandomTrack() || this.randomTrack;

        if (this.randomTrack.Id != '') {
            this.nextTrackObs.next(this.randomTrack);
            return
        }

        this.playlistService.resetPlaylist();
        this.genRandomTrack();
    }

    getRandomTrack() {
        return this.randomTrack;
    }

    getNextTrack(): Observable<ITrack> {
        let track;
        if (this.random)
            track = this.getRandomTrack();
        else
            track = this.playlist.Tracks[this.playlist.Tracks.findIndex(track => track.Id === this.trackid) + 1]

        this.nextTrackObs.next(track);

        return this.nextTrackObs.asObservable();
    }

    getRandomState() {
        return this.random;
    }

    toggleRandom() {
        this.random = !this.random;
        if (this.random)
            this.genRandomTrack();
        else 
            this.genNotRandomTrack();
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