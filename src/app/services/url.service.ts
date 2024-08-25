import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UrlService {

    private nextRoute = new BehaviorSubject<boolean>(false);
    private backRoute = new BehaviorSubject<boolean>(false);
    constructor(private route: Router
    ) {

    }

    lastroute: string = "";
    backroutes: string[] = [];
    nextroutes: string[] = [];

    redirect(route: string) {
        if (this.getCurrentUrl() === route)
            return;

        this.addBackRoute(this.getCurrentUrl());

        this.route.navigate([route]);
    }

    getCurrentUrl(): string {
        return this.route.url
    }

    addBackRoute(route: string) {
        if (route == this.backroutes[this.backroutes.length - 1])
            return;

        console.log(this.lastroute)

        this.backroutes.push(route);
        this.nextroutes = [];
        this.nextRoute.next(false);
        this.backRoute.next(true);
    }

    getBackRouteState(): Observable<boolean> {
        return this.backRoute.asObservable();
    }

    getNextRouteState(): Observable<boolean> {
        return this.nextRoute.asObservable();
    }

    navigateBackRoute() {
        //next route += backroute which will be removed
        const popped = this.backroutes.pop();

        if (popped == null)
            return;

        this.nextroutes.push(this.getCurrentUrl());
        this.nextRoute.next(true);

        if (this.backroutes.length === 0) {
            this.backRoute.next(false);
            console.log('next')
            console.log(this.nextroutes);

            console.log('back')
            console.log(this.backroutes);
        }

        this.route.navigate([popped]);
    }

    navigateNextRoute() {
        //back route += nextroute which will be removed
        const popped = this.nextroutes.pop();

        if (popped == null)
            return

        this.backroutes.push(this.getCurrentUrl());
        this.backRoute.next(true);

        if (this.nextroutes.length === 0) {
            this.nextRoute.next(false);
            console.log('next')
            console.log(this.nextroutes);

            console.log('back')
            console.log(this.backroutes);
        }

        this.route.navigate([popped]);
    }

    private activeIdSubject = new BehaviorSubject<string | null>(null);

    setActiveId(id: string | null) {
        this.activeIdSubject.next(id);
    }

    getActiveId() {
        return this.activeIdSubject.asObservable();
    }

}