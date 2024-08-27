import { AfterViewInit, Component } from '@angular/core';
import { IPlaylist, PlaylistType } from '../../dtos/playlist';
import { PlaylistService } from '../../services/playlist.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UrlService } from '../../services/url.service';
import { AudioService } from '../../services/audio.service';

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
    isPaused: boolean = false;
    activeId: string | null = null;
    playingId: string | null = null;
    constructor(private playlistService: PlaylistService,
        private userService: UserService,
        private urlService: UrlService,
        private audioService: AudioService,
    ) {
        this.playlistService.getActiveId().subscribe(id => {
            this.activeId = id;
        });
        this.playlistService.getPlayingPlaylistId().subscribe(play => {
            this.playingId = play;
        })
        this.audioService.isTrackPaused().subscribe(pause => {
            this.isPaused = pause
        })
        this.user = this.userService.getCurrentUserInfo();
        this.items = playlistService.getAllPlaylists(this.user.Id);
    }

    redirectToPlaylist(id: string) {
        this.activeId = id;

        let route = "/playlists/" + id;

        this.urlService.redirect(route);
    }

    isActive(id: string): boolean {
        return this.activeId === id;
    }

    isPlaying(id: string): boolean {
        return this.playingId === id;
    }

    createNewPlaylist() {
        var id = this.items.length + 1;
        var newPlaylist: IPlaylist = {
            Id: id.toString(),
            UserId: this.user?.Id || "",
            Image: '../assets/imgs/image.png',
            Name: 'Playlist ' + id,
            Type: PlaylistType.Playlist,
            TrackIds: []
        }
        this.items.push(newPlaylist);
        this.playlistService.createNewPlaylist(newPlaylist);
    }
}
