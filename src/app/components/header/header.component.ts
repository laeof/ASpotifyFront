import { Component, HostListener, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';
import { UrlService } from '../../services/url.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    user: IUser | undefined;
    backRouteState: boolean = false;
    nextRouteState: boolean = false;
    constructor(private userService: UserService,
        private urlService: UrlService
    ) {
        this.user = this.userService.getCurrentUserInfo();
        this.urlService.getBackRouteState().subscribe(state => {
            this.backRouteState = state;
        });
        this.urlService.getNextRouteState().subscribe(state => {
            this.nextRouteState = state;
        });
    }

    redirectToHome() {
        let route = "/home";

        this.urlService.redirect(route);
    }

    getBackRouteState(): boolean {
        return this.backRouteState;
    }

    getNextRouteState(): boolean {
        return this.nextRouteState;
    }

    navigateNextRoute() {
        if (this.getNextRouteState())
            this.urlService.navigateNextRoute();
    }

    navigateBackRoute() {
        if (this.getBackRouteState())
            this.urlService.navigateBackRoute();
    }
}
