import { Component } from '@angular/core';
import { IPlaylist } from '../../dtos/playlist';
import { PlaylistService } from '../../services/playlistservice';
import { UserService } from '../../services/userservice';
import { IUser } from '../../dtos/user';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-leftsidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './leftsidebar.component.html',
    styleUrl: './leftsidebar.component.scss'
})
export class LeftsidebarComponent {
    items: IPlaylist[];
    user: IUser | undefined;
    playing: boolean = false;
    activeId: string | null = null;
    constructor(private playlistService: PlaylistService,
        private userService: UserService,
        private router: Router
    ) {
        this.user = this.userService.getCurrentUserInfo();
        this.items = playlistService.getAllPlaylists(this.user.Id);
    }

    redirectToPlaylist(id: string) {
        this.activeId = id;
        this.router.navigate(["playlists/" + id]);
    }

    isActive(id: string): boolean {
        console.log(this.activeId);
        return this.activeId === id;
    }
}
