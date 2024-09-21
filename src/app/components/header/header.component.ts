import { Component, HostListener, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';
import { UrlService } from '../../services/url.service';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { ContextMenuService } from '../../services/context-menu.service';
import { LocalStorageService } from '../../services/localstorage.service';
import { PlaylistComponent } from '../playlist/playlist.component';
import { PlaylistService } from '../../services/playlist.service';
import { QueueService } from '../../services/queue.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule,
        ContextMenuComponent
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    authorized: boolean = false;

    user: IUser = {
        Id: '',
        UserName: '',
        FirstName: null,
        LastName: null,
        Email: '',
        lovedPlaylistId: '',
        Image: '',
        latestPlayingPlaylist: '',
        latestPlayingTrack: '',
        Playlists: []
    };

    backRouteState: boolean = false;
    nextRouteState: boolean = false;
    constructor(private userService: UserService,
        private urlService: UrlService,
        private contextMenuService: ContextMenuService,
    ) {

        this.userService.getCurrentUserInfo().subscribe(user => {
            this.user = user;
        });

        this.urlService.getBackRouteState().subscribe(state => {
            this.backRouteState = state;
        });

        this.urlService.getNextRouteState().subscribe(state => {
            this.nextRouteState = state;
        });
    }

    @ViewChild('contextMenu') contextMenu!: ContextMenuComponent;

    onProfileClick(event: MouseEvent) {
        this.contextMenu.menuItems = this.contextMenuService.getProfileActions();
        this.contextMenu.open(event);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        this.contextMenu.close();
    }

    redirectToSignIn() {
        window.location.href = "Account/SignIn"
    }
    redirectToSignUp() {
        window.location.href = "Account"
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
