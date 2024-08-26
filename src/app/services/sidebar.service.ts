import { BehaviorSubject, Observable } from "rxjs";

export class SidebarService {

    private nowPlayingVisible = true;
    private nowPlayingVisibleObservable = new BehaviorSubject<boolean>(true);

    toggleNowPlayingVisible() {
        this.nowPlayingVisible = !this.nowPlayingVisible;
        this.nowPlayingVisibleObservable.next(this.nowPlayingVisible);
    }

    isNowPlayingVisible(): Observable<boolean> {
        return this.nowPlayingVisibleObservable.asObservable();
    }
}