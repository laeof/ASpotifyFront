import { Component } from '@angular/core';
import { MainComponent } from './components/main/main.component';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        MainComponent,
        HttpClientModule,
        RouterOutlet
    ],
    providers: [
        UserService,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'ASpotify';
    constructor(
    ) {

    }

}
