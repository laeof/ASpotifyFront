import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ITrack } from '../../dtos/track';
import { IPlaylist, PlaylistType } from '../../dtos/playlist';
import { PlaylistService } from '../../services/playlist.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { first, firstValueFrom, map, Observable, of, Subscription, switchMap, take } from 'rxjs';
import { QueueService } from '../../services/queue.service';
import { TrackService } from '../../services/track.service';
import { PlayerService } from '../../services/player.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { ContextMenuService } from '../../services/context-menu.service';
import { LocalStorageService } from '../../services/localstorage.service';
import { FooterInfoComponent } from "../footer-info/footer-info.component";
import { IArtist } from '../../dtos/artist';

@Component({
    selector: 'app-playlist',
    standalone: true,
    imports: [CommonModule,
        ContextMenuComponent,
        FooterInfoComponent],
    templateUrl: './playlist.component.html',
    styleUrl: './playlist.component.scss'
})
export class PlaylistComponent implements OnDestroy {
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
    toggledContextMenu: boolean = false;
    @ViewChild('imageElement', { static: false }) imageElement!: ElementRef;

    //active
    playlist: IPlaylist = {
        id: '',
        authorId: '',
        imagePath: '',
        name: '',
        types: PlaylistType.Playlist,
        tracks: [],
        color: ''
    };

    //playing
    currentPlaylist: IPlaylist = {
        id: '',
        authorId: '',
        imagePath: '',
        name: '',
        types: PlaylistType.Playlist,
        tracks: [],
        color: ''
    };

    activePlaylist: IPlaylist = {
        id: '',
        authorId: '',
        imagePath: '',
        name: '',
        types: PlaylistType.Playlist,
        tracks: [],
        color: ''
    };

    artistNames: { [key: string]: string } = {}
    albumNames: { [key: string]: string } = {}
    trackDates: { [key: string]: string } = {}

    sub: Subscription;
    subActive0: Subscription | undefined
    subActive: Subscription | undefined;
    subCurrent0: Subscription | undefined
    SubCurrent: Subscription | undefined;

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
    paused: boolean = false;
    trackDuration: number = 0;

    constructor(
        private playlistService: PlaylistService,
        private userService: UserService,
        private artistService: ArtistService,
        private audioService: AudioService,
        private playerService: PlayerService,
        private queueService: QueueService,
        private trackService: TrackService,
        private contextMenuService: ContextMenuService,
        private route: ActivatedRoute
    ) {

        this.userService.getCurrentUserInfo().subscribe(user => {
            this.user = user;
        });

        this.sub = this.route.paramMap.subscribe(params => {
            let id = params.get('id') || "";
            this.playlistService.getPlaylistById(id).pipe(first()).subscribe((response: IPlaylist) => {
                this.playlistService.setActivePlaylist(response)
            })
        });

        this.subActive0 = this.playlistService.getActivePlaylist().subscribe((playlist: IPlaylist) => {
            this.playlist = playlist
            this.getArtistNames(this.playlist.authorId)

            this.playlist.tracks.forEach(element => {
                this.trackDates[element.id] = (new Date(element.createdDate).toDateString());
                if (!this.albumNames[element.albumId])
                    this.playlistService.getPlaylistById(element.albumId).pipe(first()).subscribe(
                        (response: IPlaylist) => {
                            this.albumNames[response.id] = response.name;
                            if (!this.artistNames[response.authorId])
                                this.getArtistNames(response.authorId)
                        })
                if (!this.artistNames[element.artistId]) {
                    this.getArtistNames(element.artistId)
                }
            })

            setTimeout(() => this.extractColor(), 1);
        })

        this.subCurrent0 = this.playlistService.getPlayingPlaylist().subscribe(playlist => {
            this.currentPlaylist = playlist
        })

        this.queueService.getCurrentTrackId().subscribe((trackId) => {
            this.trackService.getTrackById(trackId).pipe(first()).subscribe(
                (track: ITrack) => {
                    this.track = track;
                }
            )
        });

        this.audioService.isTrackPaused().subscribe((ispaused) => {
            this.paused = ispaused
        })

    }

    ngOnDestroy(): void {
        this.playlistService.setActivePlaylist({
            id: '',
            authorId: '',
            imagePath: '',
            name: '',
            types: PlaylistType.Playlist,
            tracks: [],
            color: ''
        });
        if (this.subActive != undefined)
            this.subActive.unsubscribe();
        if (this.SubCurrent != undefined)
            this.SubCurrent.unsubscribe();
        if (this.subActive0 != undefined)
            this.subActive0.unsubscribe();
        if (this.subCurrent0 != undefined)
            this.subCurrent0.unsubscribe();
    }

    dateToNormal(date: Date) {
    }

    getArtistNames(response: string) {
        this.artistService.getArtistById(response).pipe(first()).subscribe(
            (response: IArtist) => {
                this.artistNames[response.id] = response.userName;
            })
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

    //big play button
    getTrackForPlay(): ITrack {
        if (this.playlist.id == this.currentPlaylist.id)
            return this.track;

        return this.playlist.tracks[0];
    }

    isActive(item: string): boolean {
        return item == this.track.id && this.playlist.id == this.currentPlaylist.id;
    }

    isPaused(): any {
        return this.paused
    }

    toggleAudio(item: ITrack) {
        this.track = item;
        this.playerService.toggleAudio(item, this.playlist)
        console.log("tracK: " + item)
        console.log("playing: " + this.currentPlaylist.id)
        console.log("activepl: " + this.playlist.id)
    }

    toggleContextMenu() {
        this.toggledContextMenu = !this.toggledContextMenu;
    }

    getPlaylistType(type: PlaylistType = this.playlist.types) {
        return this.playlistService.getPlaylistType(type);
    }

    extractColor() {
        document.documentElement.style.setProperty('--custom-bg-color', this.playlist.color);
    }

    getDuration(duration: number) {
        return this.trackService.getDuration(duration);
    }
}

