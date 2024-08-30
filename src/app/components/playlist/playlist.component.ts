import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ITrack } from '../../dtos/track';
import { ColorService } from '../../services/color.service';
import { IPlaylist, PlaylistType } from '../../dtos/playlist';
import { PlaylistService } from '../../services/playlist.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { Subscription } from 'rxjs';
import { QueueService } from '../../services/queue.service';
import { TrackService } from '../../services/track.service';
import { PlayerService } from '../../services/player.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { ContextMenuService } from '../../services/context-menu.service';

@Component({
    selector: 'app-playlist',
    standalone: true,
    imports: [CommonModule,
        ContextMenuComponent
    ],
    templateUrl: './playlist.component.html',
    styleUrl: './playlist.component.scss'
})
export class PlaylistComponent implements OnDestroy {
    private user: IUser = {
        Id: '',
        UserName: '',
        FirstName: null,
        LastName: null,
        Email: '',
        lovedPlaylistId: '',
        Image: '',
        Playlists: []
    };
    toggledContextMenu: boolean = false;
    @ViewChild('imageElement', { static: false }) imageElement!: ElementRef;

    //active
    playlist: IPlaylist = {
        Id: '',
        AuthorId: '',
        Image: '',
        Name: '',
        Type: PlaylistType.Playlist,
        TrackIds: []
    };
    //playing
    currentPlaylist: IPlaylist = {
        Id: '',
        AuthorId: '',
        Image: '',
        Name: '',
        Type: PlaylistType.Playlist,
        TrackIds: []
    };

    sub: Subscription;

    trackId: string = '';
    paused: boolean = false;
    trackDuration: number = 0;
    currentTrack: ITrack = {
        Id: '',
        Name: '',
        ArtistId: '',
        Date: new Date,
        AlbumId: '',
        Duration: 0,
        Image: '',
        Url: ''
    };

    constructor(private colorService: ColorService,
        private playlistService: PlaylistService,
        private userService: UserService,
        private artistService: ArtistService,
        private albumService: AlbumService,
        private audioService: AudioService,
        private playerService: PlayerService,
        private queueService: QueueService,
        private trackService: TrackService,
        private contextMenuService: ContextMenuService,
        private route: ActivatedRoute,
    ) {
        this.userService.getCurrentUserInfo().subscribe(user => {
            this.user = user;
        });

        this.sub = this.route.paramMap.subscribe(params => {
            let id = params.get('id') || "";
            this.playlistService.setActiveId(id);
            setTimeout(() => this.extractColor(), 1);
        });

        this.playlistService.getActiveId().subscribe(playlist => {
            this.playlist = this.playlistService.getPlaylistById(playlist)
        })

        this.playlistService.getPlayingPlaylistId().subscribe(playlist => {
            this.currentPlaylist = this.playlistService.getPlaylistById(playlist)
        })

        this.queueService.getCurrentTrack().subscribe((trackId) => {
            if (this.playlist.Id == this.currentPlaylist.Id) {
                this.trackId = trackId;
            }
        });

        this.audioService.isTrackPaused().subscribe((ispaused) => {
            this.paused = ispaused
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

    onTrackClick(event: MouseEvent, id: string) {
        this.contextMenu.menuItems = this.contextMenuService.getTrackActions(id);
        this.contextMenu.open(event);
    }

    onPlaylistClick(event: MouseEvent) {
        this.contextMenu.menuItems = this.contextMenuService.getPlaylistActions();
        this.contextMenu.open(event);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        this.contextMenu.close();
    }

    ngOnDestroy(): void {
        this.playlistService.setActiveId("");
    }

    //big play button
    getTrackForPlay(): string {
        if (this.playlist.Id == this.currentPlaylist.Id)
            return this.trackId;

        return this.playlist.TrackIds[0];
    }

    isActive(item: string): boolean {
        return item == this.trackId && this.playlist.Id == this.currentPlaylist.Id;
    }

    isPaused(): any {
        return this.paused
    }

    toggleAudio(item: string) {
        this.trackId = item;
        this.playerService.toggleAudio(item, this.playlist.Id)
    }

    toggleContextMenu() {
        this.toggledContextMenu = !this.toggledContextMenu;
    }

    getAlbumName(id: string) {
        return this.albumService.getAlbumNameById(id);
    }

    getArtistName(id: string) {
        return this.artistService.getArtistNameById(id);
    }

    getPlaylistType(type: PlaylistType = this.playlist.Type) {
        return this.playlistService.getPlaylistType(type);
    }

    extractColor() {
        const image = this.imageElement.nativeElement;
        this.colorService.extractColor(image).then(mostFrequentColor => {
            console.log('Most Frequent Color:', mostFrequentColor);

            const rgb = mostFrequentColor.match(/\d+/g)?.map(Number);
            if (rgb && rgb.length === 3) {
                const darkenedColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
                document.documentElement.style.setProperty('--custom-bg-color', darkenedColor);
            }
        }).catch(error => {
            console.error('Error extracting color:', error);
        });
    }

    getDuration(duration: number) {
        return this.trackService.getDuration(duration);
    }

    getTrackById(id: string): ITrack {
        return this.trackService.getTrackById(id);
    }
}

