import { Component } from '@angular/core';
import { IPlaylist } from '../../dtos/playlist';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';
import { PlaylistService } from '../../services/playlist.service';
import { Router } from '@angular/router';
import { ITrack } from '../../dtos/track';
import { AudioService } from '../../services/audio.service';
import { UrlService } from '../../services/url.service';

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
        private audioService: AudioService,
        private urlService: UrlService
    ) {
        this.user = this.userService.getCurrentUserInfo();
        this.playlists = this.playlistService.getAllPlaylists(this.user.Id);
    }

    redirectToPlaylist(id: string) {
        let route = "/playlists/" + id;

        this.urlService.redirect(route);
    }

    toggleAudio(item: ITrack, index: number, playlist: IPlaylist) {
        this.audioService.toggleAudio(item, index, playlist)
    }
}
