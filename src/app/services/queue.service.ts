import { BehaviorSubject, Observable, ObservableLike } from "rxjs";
import { LocalStorageService } from "./localstorage.service";

export class QueueService {

    private originalTracks: string[] = [];
    private tracks: string[] = [];
    private currentIndex: number = 0;
    private repeatTrack: boolean = false;
    private randomTrack: boolean = false;

    private currentPlayingTrack = new BehaviorSubject<string>('');
    private nextPlayingTrack = new BehaviorSubject<string>('');

    shuffleQueue(): void {
        for (let i = this.tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
        }
        this.setTracks(this.tracks.findIndex(i => i === this.currentPlayingTrack.value));
        this.currentIndex = 0;
    }

    toggleRepeatTrack(repeat: boolean): void {
        this.repeatTrack = repeat;
    }

    setRandomTrack(random: boolean) {
        this.randomTrack = random;
    }

    setCurrentTrack(id: string) {
        this.currentIndex = this.tracks.findIndex(i => i === id);
        this.setTracks();
    }

    getCurrentTrackId(): Observable<string> {
        this.setTracks();
        return this.currentPlayingTrack.asObservable();
    }

    getNextTrack(): Observable<string> {
        return this.nextPlayingTrack.asObservable();
    }

    nextTrack(): void {
        if (this.repeatTrack) {
            return;
        }

        this.currentIndex = (this.currentIndex + 1) % this.tracks.length;

        if (this.currentIndex + 1 == this.tracks.length) {
            if (this.randomTrack)
                this.shuffleQueue();
        }

        this.setTracks();
    }

    prevTrack(): void {
        if (this.repeatTrack) {
            return;
        }
        this.currentIndex = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;

        this.setTracks();
    }

    private setTracks(index: number = this.currentIndex) {
        this.currentPlayingTrack.next(this.tracks[index]);
        this.nextPlayingTrack.next(this.tracks[(this.currentIndex + 1) % this.tracks.length])
    }

    resetQueue(): void {
        this.tracks = [...this.originalTracks];
        this.currentIndex = 0;
    }

    setQueue(newTracks: string[]): void {
        this.originalTracks = [...newTracks];
        this.tracks = [...newTracks];
        this.currentIndex = this.currentIndex || 0;
        this.setTracks();
    }

    getQueue() {
        return this.tracks;
    }

    addTrackAtIndex(track: string, index: number = this.currentIndex + 1): void {
        if (index < 0 || index > this.tracks.length) {
            console.error("index out of range.");
            return;
        }
        
        this.tracks.splice(index, 0, track);

        if (index <= this.currentIndex) {
            this.currentIndex++;
        }
        
        //update tracks
        this.setTracks();
    }
}