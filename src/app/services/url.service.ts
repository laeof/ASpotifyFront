import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UrlService {
    private activeIdSubject = new BehaviorSubject<string | null>(null);

    setActiveId(id: string | null) {
        this.activeIdSubject.next(id);
    }

    getActiveId() {
        return this.activeIdSubject.asObservable();
    }
}