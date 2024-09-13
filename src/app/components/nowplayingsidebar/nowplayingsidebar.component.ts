import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { ITrack } from '../../dtos/track';
import { AudioService } from '../../services/audio.service';
import { ArtistService } from '../../services/artist.service';
import { PlaylistService } from '../../services/playlist.service';
import { IPlaylist, PlaylistType } from '../../dtos/playlist';
import { findIndex } from 'rxjs';
import { QueueService } from '../../services/queue.service';
import { TrackService } from '../../services/track.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { ContextMenuService } from '../../services/context-menu.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';

@Component({
    selector: 'app-nowplayingsidebar',
    standalone: true,
    imports: [CommonModule,
        ContextMenuComponent
    ],
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
        Path: ''
    };

    nextTrack: ITrack = {
        AlbumId: "",
        Id: '',
        Name: '',
        ArtistId: '',
        Date: new Date,
        Duration: 0,
        Image: '',
        Path: ''
    };

    playlist: IPlaylist = {
        Id: '',
        AuthorId: '',
        Image: '',
        Name: '',
        Type: PlaylistType.Playlist,
        TrackIds: []
    };

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

    constructor(private sidebarService: SidebarService,
        private audioService: AudioService,
        private artistService: ArtistService,
        private queueService: QueueService,
        private trackService: TrackService,
        private playlistService: PlaylistService,
        private contextMenuService: ContextMenuService,
        private userService: UserService
    ) {
        this.userService.getCurrentUserInfo().subscribe(user => {
            this.user = user;
        });

        this.sidebarService.isNowPlayingVisible().subscribe(nowPlaying => {
            this.nowPlayingVisible = nowPlaying;
        });

        this.queueService.getCurrentTrackId().subscribe(trackId => {
            this.track = this.trackService.getTrackById(trackId);
        })

        this.queueService.getNextTrack().subscribe(trackId => {
            this.nextTrack = this.trackService.getTrackById(trackId)
        })

        this.playlistService.getPlayingPlaylistId().subscribe((playlist) => {
            this.playlist = this.playlistService.getPlaylistById(playlist)
        })
    }

    toggleLikedSongs(trackId: string) {
        if (this.playlistService.getLovedTrackState(this.user.lovedPlaylistId, trackId)) {
            this.playlistService.removeFromPlaylist(this.user.lovedPlaylistId, trackId);
            return;
        }
        this.playlistService.addToPlaylist(this.user.lovedPlaylistId, trackId);
    }

    getLikedSongsState(trackId: string) {
        return this.playlistService.getLovedTrackState(this.user.lovedPlaylistId, trackId);
    }

    @ViewChild('contextMenu') contextMenu!: ContextMenuComponent;

    onActionsClick(event: MouseEvent) {
        this.contextMenu.menuItems = this.contextMenuService.getTrackActions();
        this.contextMenu.open(event);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        this.contextMenu.close();
    }

    playAudio() {
        this.audioService.playTrack(this.nextTrack);
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
