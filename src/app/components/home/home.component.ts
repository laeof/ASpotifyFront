import { Component } from '@angular/core';
import { IPlaylist } from '../../dtos/playlist';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';
import { PlaylistService } from '../../services/playlist.service';
import { Router } from '@angular/router';
import { ITrack } from '../../dtos/track';
import { AudioService } from '../../services/audio.service';
import { UrlService } from '../../services/url.service';
import { PlayerService } from '../../services/player.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    playlists: IPlaylist[] = [];
    user: IUser | undefined;
    constructor(private userService: UserService,
        private playlistService: PlaylistService,
        private playerService: PlayerService, 
        private urlService: UrlService
    ) {
        this.user = this.userService.getCurrentUserInfo();
        this.playlistService.getAllPlaylistsUserId(this.user.Id).map(playlist => {
            this.playlists.push(this.playlistService.getPlaylistById(playlist))
        });
    }

    redirectToPlaylist(id: string) {
        let route = "/playlists/" + id;

        this.urlService.redirect(route);
    }

    toggleAudio(item: string, playlist: string) {
        this.playerService.toggleAudio(item, playlist)
    }
}
