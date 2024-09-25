import { Component } from '@angular/core';
import { MainComponent } from './components/main/main.component';
import { UserService } from './services/user.service';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch, } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { LocalStorageService } from './services/localstorage.service';
import { AccountService } from './services/account.service';
import { SpotifyCookieService } from './services/spotifycookie.service';
import { ApiService } from './services/api.service';
import { IUser } from './dtos/user';
import { debounceTime, first, interval, switchMap } from 'rxjs';
import { ITokens } from './dtos/tokens';
import { Guard } from './services/guard.service';
import { PlaylistService } from './services/playlist.service';
import { QueueService } from './services/queue.service';
import { ArtistService } from './services/artist.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        MainComponent,
        RouterOutlet,
    ],
    providers: [
        UserService,
        SpotifyCookieService,
        AccountService,
        ApiService,
        Guard,
        PlaylistService,
        QueueService,
        ArtistService
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'ASpotify';

    constructor(private cookieService: SpotifyCookieService,
        private accountService: AccountService,
        private userService: UserService
    ) {
        this.userService.getUserInfo().pipe(first()).subscribe(
            (response: IUser) => this.userService.setCurrentUser(response)
        );

        if (this.accountService.accessToken != '')
            this.checkUserInfo();
    }

    private checkUserInfo() {
        interval(5000)
            .pipe(
                switchMap(() => this.userService.getUserInfo())
            )
            .subscribe({
                next: (response: IUser) => {
                    this.userService.setCurrentUser(response);
                },
                error: (error: Error) => {
                    const tokens: ITokens = {
                        accessToken: this.cookieService.accessToken.value,
                        refreshToken: this.cookieService.refreshToken.value
                    }
                    this.accountService.RegenerateAccessToken(tokens).pipe(first()).subscribe({
                        next: (response: ITokens) => {
                            this.cookieService.setAccessToken(response.accessToken);
                            this.cookieService.setRefreshToken(response.refreshToken);
                        },
                        error: (response: Error) => {
                            this.accountService.Logout();
                            this.userService.setCurrentUser(this.userService.emptyUser);
                        }
                    });
                }
            })
    }
}
