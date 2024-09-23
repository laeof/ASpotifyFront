import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable(
    {
        providedIn: 'root'
    }
)

export class SpotifyCookieService {

    accessToken = new BehaviorSubject<string>('');
    refreshToken = new BehaviorSubject<string>('');

    constructor(private cookieService: CookieService) {
        this.refreshToken.next(this.cookieService.get('refresh'))
        this.accessToken.next(this.cookieService.get('access'))
    }

    setRefreshToken(token: string) {
        this.cookieService.delete("refresh", '/');
        this.cookieService.set("refresh", token, {path: '/', expires: 10});
        this.refreshToken.next(token)
    }

    getRefreshToken(): Observable<string> {
        return this.refreshToken.asObservable();
    }

    setAccessToken(token: string) {
        this.cookieService.delete("access", '/');
        this.cookieService.set("access", token, {path: '/', expires: 10});
        this.accessToken.next(token)
    }

    getAccessToken(): Observable<string> {        
        return this.accessToken.asObservable();
    }

    deleteTokens() {
        this.cookieService.delete("access", '/');
        this.cookieService.delete("refresh", '/');
        this.accessToken.next('')
        this.refreshToken.next('')
    }
}