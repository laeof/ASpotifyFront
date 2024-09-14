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
import { Observable, Subscription, switchMap } from 'rxjs';
import { QueueService } from '../../services/queue.service';
import { TrackService } from '../../services/track.service';
import { PlayerService } from '../../services/player.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { ContextMenuService } from '../../services/context-menu.service';
import { LocalStorageService } from '../../services/localstorage.service';
import { FooterInfoComponent } from "../footer-info/footer-info.component";

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

    activePlaylistId: string = ''

    //playing
    currentPlaylist: IPlaylist = {
        Id: '',
        AuthorId: '',
        Image: '',
        Name: '',
        Type: PlaylistType.Playlist,
        TrackIds: []
    };

    tracks: ITrack[] = []

    currentPlaylistId: string = ''

    sub: Subscription;
    subActive0: Subscription | undefined
    subActive: Subscription | undefined;
    subCurrent0: Subscription | undefined
    SubCurrent: Subscription | undefined;


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
        Path: ''
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
        private route: ActivatedRoute
    ) {

        this.userService.getCurrentUserInfo().subscribe(user => {
            this.user = user;
        });

        this.sub = this.route.paramMap.subscribe(params => {
            let id = params.get('id') || "";
            this.playlistService.setActiveId(id);
        });

        this.subActive0 = this.playlistService.getActiveId().subscribe(playlist => {
            this.activePlaylistId = playlist
            this.subActive = this.playlistService.getPlaylistByIdDev(this.activePlaylistId).subscribe((playlist: any) => {
                this.playlist = {
                    Id: playlist.id,
                    AuthorId: playlist.authorId,
                    Image: playlist.imagePath,
                    Name: playlist.name,
                    Type: playlist.types,
                    TrackIds: playlist.tracks
                }

                this.playlist.TrackIds.forEach(element => {
                    console.log(element)
                    this.trackService.getTrackByIdDev(element).subscribe((response: any) => {
                        let play: ITrack = {
                            Id: response.id,
                            ArtistId: response.artistId,
                            Image: response.imagePath,
                            Name: response.name,
                            AlbumId: response.albumId,
                            Path: response.urlPath,
                            Duration: response.duration,
                            Date: response.createdDate
                        };
                        this.tracks.push(play);
                    })
                });
                setTimeout(() => this.extractColor(), 1);
            })
        })

        console.log(this.tracks)

        this.subCurrent0 = this.playlistService.getPlayingPlaylistId().subscribe(playlist => {
            this.currentPlaylistId = playlist
            this.SubCurrent = this.playlistService.getPlaylistByIdDev(this.currentPlaylistId).subscribe((playlist: any) => {
                this.currentPlaylist = {
                    Id: playlist.id,
                    AuthorId: playlist.authorId,
                    Image: playlist.imagePath,
                    Name: playlist.name,
                    Type: playlist.types,
                    TrackIds: playlist.tracks
                }
            })
        })

        this.queueService.getCurrentTrackId().subscribe((trackId) => {
            this.trackId = trackId;
        });

        this.audioService.isTrackPaused().subscribe((ispaused) => {
            this.paused = ispaused
        })

    }

    ngOnDestroy(): void {
        this.playlistService.setActiveId("");
        if (this.subActive != undefined)
            this.subActive.unsubscribe();
        if (this.SubCurrent != undefined)
            this.SubCurrent.unsubscribe();
        if (this.subActive0 != undefined)
            this.subActive0.unsubscribe();
        if (this.subCurrent0 != undefined)
            this.subCurrent0.unsubscribe();
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
        console.log("tracK: " + item)
        console.log("playing: " + this.currentPlaylist.Id)
        console.log("activepl: " + this.playlist.Id)
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

    downloadedImg = new Image();
    extractColor() {
        const image = this.imageElement.nativeElement;
        this.downloadedImg.crossOrigin = 'AllowAngularApp';
        // this.downloadedImg.addEventListener("load", this.imageReceived, false);
        // this.downloadedImg.src = this.playlist.Image
    }

    imageReceived() {
        this.colorService.extractColor(this.downloadedImg).then(mostFrequentColor => {
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
}

