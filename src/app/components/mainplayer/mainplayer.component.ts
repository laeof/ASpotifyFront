import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { debounceTime, first } from 'rxjs';
import { ITokens } from '../../dtos/tokens';
import { IUser } from '../../dtos/user';
import { SpotifyCookieService } from '../../services/spotifycookie.service';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'app-mainplayer',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './mainplayer.component.html',
    styleUrl: './mainplayer.component.scss'
})
export class MainplayerComponent {
    constructor(private userService: UserService,
        private cookieService: SpotifyCookieService,
        private accountService: AccountService
    ) {
        
    }
}
