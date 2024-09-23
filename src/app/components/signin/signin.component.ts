import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILogin } from '../../dtos/login';
import { AccountService } from '../../services/account.service';
import { first } from 'rxjs';
import { ITokens } from '../../dtos/tokens';
import { SpotifyCookieService } from '../../services/spotifycookie.service';

@Component({
    selector: 'app-signin',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './signin.component.html',
    styleUrl: './signin.component.scss'
})
export class SigninComponent {
    logInForm: FormGroup;
    constructor(private accountService: AccountService,
        private cookieService: SpotifyCookieService
    ) {
        this.logInForm = new FormGroup({
            Email: new FormControl("", [Validators.email]),
            Password: new FormControl("")
        })
    }

    login() {
        const reg: ILogin = {
            email: this.logInForm.value.Email,
            password: this.logInForm.value.Password,
        }

        this.accountService.Login(reg).pipe(first()).subscribe(
            (response: ITokens) => {
                this.cookieService.setAccessToken(response.accessToken);
                this.cookieService.setRefreshToken(response.refreshToken);
                window.location.href = 'Player';
            }
        )
    }
}
