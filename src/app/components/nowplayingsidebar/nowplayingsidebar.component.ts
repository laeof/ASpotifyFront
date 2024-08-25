import { AfterViewInit, Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { ITrack } from '../../dtos/track';
import { AudioService } from '../../services/audio.service';
import { ArtistService } from '../../services/artist.service';
import { PlaylistService } from '../../services/playlist.service';
import { IPlaylist } from '../../dtos/playlist';
import { findIndex } from 'rxjs';

@Component({
    selector: 'app-nowplayingsidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './nowplayingsidebar.component.html',
    styleUrl: './nowplayingsidebar.component.scss'
})
export class NowplayingsidebarComponent {
    nowPlayingVisible = false;
    toggledContextMenu: boolean = false;
    track: ITrack = {
        AlbumId: "",
        Id: '',
        Name: '',
        ArtistId: '',
        Date: new Date,
        Duration: 0,
        Image: '',
        Url: ''
    };

    nextTrack: ITrack = {
        AlbumId: "",
        Id: '',
        Name: '',
        ArtistId: '',
        Date: new Date,
        Duration: 0,
        Image: '',
        Url: ''
    };

    playlist: IPlaylist = {
        Id: '',
        UserId: '',
        Image: '',
        Name: '',
        Tracks: []
    };

    constructor(private sidebarService: SidebarService,
        private audioService: AudioService,
        private artistService: ArtistService
    ) {
        this.sidebarService.isNowPlayingVisible().subscribe(nowPlaying => {
            this.nowPlayingVisible = nowPlaying;
        });

        this.audioService.getCurrentTrack().subscribe(track => {
            this.track = track;

            this.audioService.getNextTrack().subscribe(track => {
                this.nextTrack = track
            })
        })

        this.audioService.getPlaylist().subscribe((playlist) => {
            this.playlist = playlist
        })
    }

    playAudio() {
        this.audioService.playAudio(this.nextTrack);
    }

    toggleContextMenu() {
        this.toggledContextMenu = !this.toggledContextMenu;
    }

    getArtistName(id: string) {
        return this.artistService.getArtistNameById(id);
    }

    getPlaylistName() {
        return this.playlist.Name
    }

    toggleSideBar() {
        this.sidebarService.toggleNowPlayingVisible();
    }

}
