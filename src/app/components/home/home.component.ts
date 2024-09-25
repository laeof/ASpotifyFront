import { Component } from '@angular/core';
import { IPlaylist } from '../../dtos/playlist';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';
import { PlaylistService } from '../../services/playlist.service';
import { ITrack } from '../../dtos/track';
import { UrlService } from '../../services/url.service';
import { PlayerService } from '../../services/player.service';
import { FooterInfoComponent } from "../footer-info/footer-info.component";
import { TrackService } from '../../services/track.service';
import { first } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IArtist } from '../../dtos/artist';
import { ArtistService } from '../../services/artist.service';

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
    popularplaylists: IPlaylist[] = [];
    popularPlaylistsArtistNames: { [key: string]: string } = {}

    private user: IUser = {
        id: '',
        userName: '',
        firstName: null,
        lastName: null,
        email: '',
        avatarUrl: '',
        lovedPlaylistId: '',
        latestTrackId: '',
        latestPlaylistId: '',
        playlists: []
    };
    constructor(private userService: UserService,
        private playlistService: PlaylistService,
        private playerService: PlayerService,
        private urlService: UrlService,
        private trackService: TrackService,
        private artistService: ArtistService
    ) {
        this.userService.getCurrentUserInfo().subscribe(user => {
            this.user = user;
            this.playlistService.getAllMyPlaylists()
                .pipe(first())
                .subscribe({
                    next: ((response: IPlaylist[]) => {
                        this.playlists = response
                    }),
                    error: ((response: Error) => {

                    })
                })
        });
        this.playlistService.getPopularPlaylists()
            .pipe(first())
            .subscribe({
                next: ((response: IPlaylist[]) => {
                    this.popularplaylists = response
                    response.forEach(element => {
                        this.artistService.getArtistById(element.authorId).pipe(first()).subscribe(
                            ((response: IArtist) => this.popularPlaylistsArtistNames[element.authorId] = response.userName)
                        )
                    })
                }),
                error: ((response: Error) => {

                })
            })
    }

    mouseMove(playlist: IPlaylist) {
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
