import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { IRegister } from '../../dtos/register';
import { debounceTime, delay, first } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IUser } from '../../dtos/user';
import { ITokens } from '../../dtos/tokens';
import { ILogin } from '../../dtos/login';
import { SpotifyCookieService } from '../../services/spotifycookie.service';
import { PlaylistService } from '../../services/playlist.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent {
    signUpForm: FormGroup;
    validUsername: boolean = false;
    validEmail: boolean = false;
    constructor(private accountService: AccountService,
        private cookieService: SpotifyCookieService,
        private playlistService: PlaylistService
    ) {
        this.signUpForm = new FormGroup({
            Email: new FormControl("", [Validators.email]),
            Password: new FormControl(""),
            Username: new FormControl("", [Validators.required]),
            gender: new FormControl("unspecified"),
        })

        this.signUpForm.controls['Username'].valueChanges
            .pipe(
                debounceTime(2000)
            )
            .subscribe(value => {
                this.accountService.ValidUsername(this.signUpForm.value.Username).pipe(first()).subscribe(
                    (response: boolean) => {
                        this.validUsername = response
                    }
                );
                
            });
        this.signUpForm.controls['Email'].valueChanges
            .pipe(
                debounceTime(5000)
            )
            .subscribe(value => {
                this.accountService.ValidEmail(this.signUpForm.value.Email).pipe(first()).subscribe(
                    (response: boolean) => {
                        this.validEmail = response
                    }
                )
            })
    }
    register() {
        const reg: IRegister = {
            email: this.signUpForm.value.Email,
            password: this.signUpForm.value.Password,
            gender: this.signUpForm.value.gender,
            username: this.signUpForm.value.Username
        }
        this.accountService.Register(reg).pipe(
            delay(2000),
            first()
        ).subscribe(
            (response: IUser) => {
                const login: ILogin = {
                    email: reg.email,
                    password: reg.password
                }
                this.accountService.Login(reg).pipe(
                    first()
                ).subscribe(
                    (response: ITokens) => {
                        this.cookieService.setAccessToken(response.accessToken);
                        this.cookieService.setRefreshToken(response.refreshToken);
                        window.location.href = 'Player';
                    }
                )
            }
        )
    }
}
