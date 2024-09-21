import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { IRegister } from '../../dtos/register';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent {
    signUpForm: FormGroup;
    constructor(private accountService: AccountService) {
        this.signUpForm = new FormGroup({
            Email: new FormControl("", [Validators.email]),
            Password: new FormControl("", [Validators.minLength(8)]),
            Username: new FormControl("")
        })
    }

    register() {
        const reg: IRegister = {
            email: this.signUpForm.value.Email,
            password: this.signUpForm.value.Password,
            gender: this.signUpForm.value.Username
        }
        this.accountService.Register(reg)
    }
}
