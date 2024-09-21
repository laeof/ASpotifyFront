import { Component } from '@angular/core';
import { SigninComponent } from "../signin/signin.component";
import { SignupComponent } from "../signup/signup.component";
import { RouterOutlet } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [SigninComponent,
        SignupComponent,
        RouterOutlet],
    providers: [
        AccountService
    ],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
