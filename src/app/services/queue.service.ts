import { BehaviorSubject, Observable } from "rxjs";

export class QueueService {

    private queue = new BehaviorSubject<string[]>([]);
    private playedQueue = new BehaviorSubject<string[]>([]);

    private currentPlayingTrack = new BehaviorSubject<string>('');
    private nextPlayingTrack = new BehaviorSubject<string>('');

    private repeatState = false;

    setQueue(queue: string[]) {
        this.queue.next(queue);
    }

    addToQueue(trackId: string) {
        this.queue.value.push(trackId);
    }

    removeFromQueue(trackId: string) {
        this.queue.value.splice(this.queue.value.findIndex(id => id == trackId), 1);
    }

    shuffleQueue() {
        this.queue.value.sort(() => Math.random() - 0.5);
    }

    prevQueueItem() {
        this.addToQueue(this.removeFromPlayedQueue());
    }

    nextQueueItem() {
        return this.addToPlayedQueue(this.queue.value.pop() || '');
    }

    getQueue(): Observable<string[]> {
        return this.queue.asObservable();;
    }

    setCurrentPlayingTrack(id: string) {
        this.currentPlayingTrack.next(id);
    }

    getCurrentPlayingTrack(): Observable<string> {
        var nextTrack;

        //track play now
        nextTrack = this.queue.value.pop() || '';
        this.currentPlayingTrack.next(nextTrack);

        //track will play
        if(!this.repeatState)
            nextTrack = this.queue.value.pop() || '';
        
        this.nextPlayingTrack.next(nextTrack);

        return this.currentPlayingTrack.asObservable();
    }

    getNextPlayingTrack(): Observable<string> {
        return this.nextPlayingTrack.asObservable();
    }

    toggleRepeatState() {
        this.repeatState = !this.repeatState;
    }

    private addToPlayedQueue(trackId: string) {
        this.playedQueue.value.push(trackId);
    }

    private removeFromPlayedQueue(): string {
        return this.playedQueue.value.pop() || this.currentPlayingTrack.value;
    }
}