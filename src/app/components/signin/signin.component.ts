import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILogin } from '../../dtos/login';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'app-signin',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './signin.component.html',
    styleUrl: './signin.component.scss'
})
export class SigninComponent {
    logInForm: FormGroup;
    constructor(private accountService: AccountService) {
        this.logInForm = new FormGroup({
            Email: new FormControl("", [Validators.email]),
            Password: new FormControl("", [Validators.minLength(8)])
        })
    }

    register() {
        const reg: ILogin = {
            email: this.logInForm.value.Email,
            password: this.logInForm.value.Password,
        }
        this.accountService.Login(reg)
    }
}
