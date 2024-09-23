import { Component } from '@angular/core';
import { SigninComponent } from "../signin/signin.component";
import { SignupComponent } from "../signup/signup.component";
import { RouterOutlet } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [SigninComponent,
        SignupComponent,
        RouterOutlet],
    providers: [
        ApiService
    ],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
