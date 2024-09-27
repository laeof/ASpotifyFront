import { AfterViewInit, Component, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { ITrack } from '../../dtos/track';
import { AudioService } from '../../services/audio.service';
import { ArtistService } from '../../services/artist.service';
import { PlaylistService } from '../../services/playlist.service';
import { IPlaylist, PlaylistType } from '../../dtos/playlist';
import { findIndex, first } from 'rxjs';
import { QueueService } from '../../services/queue.service';
import { TrackService } from '../../services/track.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { ContextMenuService } from '../../services/context-menu.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';
import { IArtist } from '../../dtos/artist';
import { UrlSerializer } from '@angular/router';
import { UrlService } from '../../services/url.service';

@Component({
    selector: 'app-nowplayingsidebar',
    standalone: true,
    imports: [CommonModule,
        ContextMenuComponent
    ],
    templateUrl: './nowplayingsidebar.component.html',
    styleUrl: './nowplayingsidebar.component.scss'
})
export class NowplayingsidebarComponent implements OnDestroy {
    nowPlayingVisible = false;
    toggledContextMenu: boolean = false;
    artist: IArtist = {
        id: '',
        userName: '',
        firstName: '',
        lastName: '',
        albums: []
    }
    nextartist: IArtist = {
        id: '',
        userName: '',
        firstName: '',
        lastName: '',
        albums: []
    }

    track: ITrack = {
        id: '',
        name: '',
        artistId: '',
        createdDate: 0,
        albumId: '',
        duration: 0,
        imagePath: '',
        urlPath: ''
    };

    nextTrack: ITrack = {
        id: '',
        name: '',
        artistId: '',
        createdDate: 0,
        albumId: '',
        duration: 0,
        imagePath: '',
        urlPath: ''
    };

    playlist: IPlaylist = {
        id: '',
        authorId: '',
        imagePath: '',
        name: '',
        types: PlaylistType.Playlist,
        tracks: [],
        color: '',
        trackPlaylists: []
    };

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

    constructor(private sidebarService: SidebarService,
        private audioService: AudioService,
        private artistService: ArtistService,
        private queueService: QueueService,
        private trackService: TrackService,
        private playlistService: PlaylistService,
        private contextMenuService: ContextMenuService,
        private userService: UserService,
        private urlService: UrlService
    ) {
        this.userService.getCurrentUserInfo().subscribe(user => {
            this.user = user;
        });

        this.sidebarService.isNowPlayingVisible().subscribe(nowPlaying => {
            this.nowPlayingVisible = nowPlaying;
        });

        this.queueService.getCurrentTrackId().subscribe(trackId => {
            this.trackService.getTrackById(trackId).pipe(
                first()
            ).subscribe(
                (response: ITrack) => {
                    this.track = response;
                    this.artistService.getArtistById(response.artistId).pipe(first()).subscribe(
                        (response: IArtist) => this.artist = response
                    )
                })
        })

        this.queueService.getNextTrack().subscribe(trackId => {
            this.trackService.getTrackById(trackId).pipe(
                first()
            ).subscribe(
                (response: ITrack) => {
                    this.nextTrack = response;
                    this.artistService.getArtistById(response.artistId).pipe(first()).subscribe(
                        (response: IArtist) => this.nextartist = response
                    )
                })
        })

        this.playlistService.getPlayingPlaylist().subscribe((playlist) => {
            this.playlist = playlist
        })
    }
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }

    redirectToPlaylist(id: string) {
        let route = "/playlists/" + id;

        this.urlService.redirect(route);
    }

    toggleLikedSongs(track: ITrack) {
        if (this.playlistService.getLovedTrackState(track)) {
            this.playlistService.removeFromPlaylist(this.user.lovedPlaylistId, track.id);
            return;
        }
        this.playlistService.addToPlaylist(this.user.lovedPlaylistId, track.id);
    }

    getLikedSongsState(track: ITrack) {
        return this.playlistService.getLovedTrackState(track);
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

    toggleSideBar() {
        this.sidebarService.toggleNowPlayingVisible();
    }

}
