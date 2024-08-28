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
import { UrlService } from '../../services/url.service';
import { Subscription } from 'rxjs';
import { QueueService } from '../../services/queue.service';
import { TrackService } from '../../services/track.service';
import { PlayerService } from '../../services/player.service';

@Component({
    selector: 'app-playlist',
    standalone: true,
    imports: [CommonModule,

    ],
    templateUrl: './playlist.component.html',
    styleUrl: './playlist.component.scss'
})
export class PlaylistComponent implements OnDestroy {

    user: IUser;
    toggledContextMenu: boolean = false;
    @ViewChild('imageElement', { static: false }) imageElement!: ElementRef;

    //active
    playlist: IPlaylist = {
        Id: '',
        UserId: '',
        Image: '',
        Name: '',
        Type: PlaylistType.Playlist,
        TrackIds: []
    };
    //playing
    currentPlaylist: IPlaylist = {
        Id: '',
        UserId: '',
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
        private route: ActivatedRoute,
    ) {
        this.user = this.userService.getCurrentUserInfo();

        this.sub = this.route.paramMap.subscribe(params => {
            let id = params.get('id') || "";
            this.playlistService.setActiveId(id);
            // this.playlistService.getPlaylistById(id);
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

    ngOnDestroy(): void {
        this.playlistService.setActiveId("");
    }

    //big play button
    getTrackForPlay(): string {
        if(this.playlist.Id == this.currentPlaylist.Id)
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

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        if (this.toggledContextMenu) {
            this.toggledContextMenu = false;
        }
    }

    getAlbumName(id: string) {
        return this.albumService.getAlbumNameById(id);
    }

    getArtistName(id: string) {
        return this.artistService.getArtistNameById(id);
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

