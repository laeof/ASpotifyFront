import { CanActivate, Router } from "@angular/router";
import { SpotifyCookieService } from "./spotifycookie.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class Guard implements CanActivate {
    accessToken: boolean = false;

    constructor(private cookieService: SpotifyCookieService, private router: Router) {
        this.cookieService.getAccessToken().subscribe(
            (response: string) => {
                if (response != '')
                    this.accessToken = true;
                else {
                    this.accessToken = false;
                }
            }
        )
    }

    canActivate(): boolean {
        if (this.accessToken) {
            window.location.href = 'Player/'
            return false;
        } else {
            return true;
        }
    }
}