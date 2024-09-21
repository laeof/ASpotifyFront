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
import { TrackService } from '../../services/track.service';
import { first } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [FooterInfoComponent, CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    hover: boolean = false;
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
        private urlService: UrlService,
        private trackService: TrackService
    ) {
        this.userService.getCurrentUserInfo().subscribe(user => {
            this.user = user;
        });

        this.playlistService.getAllPlaylistsUserId("bf1d50fd-3d82-4cac-b0bd-322768ff2873").subscribe(playlists => {
            this.playlists = playlists;
        })
    }

    mouseMove(playlist: IPlaylist) {
        console.log('moved')
        document.documentElement.style.setProperty('--custom-bg-color', playlist.color);
        this.hover = true;
    }

    mouseLeave() {
        this.hover = false;
    }

    redirectToPlaylist(id: string) {
        let route = "/playlists/" + id;

        this.urlService.redirect(route);
    }

    toggleAudio(item: string, playlist: IPlaylist) {
        this.trackService.getTrackById(item).pipe(
            first()
        ).subscribe(
            (response: ITrack) => {
                this.playerService.toggleAudio(response, playlist)
            })
    }
}
