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
import { FooterInfoComponent } from "../footer-info/footer-info.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [FooterInfoComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    playlists: IPlaylist[] = [];
    private user: IUser = {
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
    constructor(private userService: UserService,
        private playlistService: PlaylistService,
        private playerService: PlayerService,
        private urlService: UrlService
    ) {
        this.userService.getCurrentUserInfo().subscribe(user => {
            this.user = user;
        });

        this.playlistService.getAllMyPlaylists().subscribe(playlists => {
            this.playlists = playlists;
        })
    }

    redirectToPlaylist(id: string) {
        let route = "/playlists/" + id;

        this.urlService.redirect(route);
    }

    toggleAudio(item: string, playlist: string) {
        this.playerService.toggleAudio(item, playlist)
    }
}
