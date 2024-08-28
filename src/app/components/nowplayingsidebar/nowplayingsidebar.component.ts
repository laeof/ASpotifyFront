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
        Type: PlaylistType.Playlist,
        TrackIds: []
    };

    constructor(private sidebarService: SidebarService,
        private audioService: AudioService,
        private artistService: ArtistService,
        private queueService: QueueService,
        private trackService: TrackService,
        private playlistService: PlaylistService,
        private contextMenuService: ContextMenuService
    ) {
        this.sidebarService.isNowPlayingVisible().subscribe(nowPlaying => {
            this.nowPlayingVisible = nowPlaying;
        });

        this.queueService.getCurrentTrack().subscribe(trackId => {
            this.track = this.trackService.getTrackById(trackId);
        })

        this.queueService.getNextTrack().subscribe(trackId => {
            this.nextTrack = this.trackService.getTrackById(trackId)
        })

        this.playlistService.getPlayingPlaylistId().subscribe((playlist) => {
            this.playlist = this.playlistService.getPlaylistById(playlist)
        })
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
