import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ITrack } from '../../dtos/track';
import { ColorService } from '../../services/color.service';
import { IPlaylist } from '../../dtos/playlist';
import { PlaylistService } from '../../services/playlist.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { UrlService } from '../../services/url.service';

@Component({
    selector: 'app-playlist',
    standalone: true,
    imports: [CommonModule,

    ],
    templateUrl: './playlist.component.html',
    styleUrl: './playlist.component.scss'
})
export class PlaylistComponent {

    user: IUser;
    toggledContextMenu: boolean = false;
    @ViewChild('imageElement', { static: false }) imageElement!: ElementRef;

    playlist: IPlaylist = {
        Id: '',
        UserId: '',
        Image: '',
        Name: '',
        Tracks: []
    };
    //playing
    currentPlaylist: IPlaylist = {
        Id: '',
        UserId: '',
        Image: '',
        Name: '',
        Tracks: []
    };

    trackId: string | undefined;
    paused: boolean = false;
    trackDuration: number = 0;
    currentTrack: ITrack | undefined;
    currentIndex: number = 0;

    constructor(private colorService: ColorService,
        private playlistService: PlaylistService,
        private userService: UserService,
        private route: ActivatedRoute,
        private artistService: ArtistService,
        private albumService: AlbumService,
        private audioService: AudioService,
        private urlParamService: UrlService
    ) {
        this.user = this.userService.getCurrentUserInfo();

        this.route.paramMap.subscribe(params => {
            let id = params.get('id') || "";
            this.urlParamService.setActiveId(id);
            this.playlist = this.playlistService.getPlaylistById(id)
            setTimeout(() => this.extractColor(), 1);
        });

        this.audioService.getCurrentTrack().subscribe((track) => {
            this.trackId = track.Id

            if (this.playlist.Id == this.currentPlaylist.Id) {
                this.currentTrack = track;
                this.currentIndex = this.currentPlaylist.Tracks.findIndex(track => track.Id === track.Id)
            }
        });

        this.audioService.isTrackPaused().subscribe((ispaused) => {
            this.paused = ispaused
        })

        this.audioService.getPlaylist().subscribe((playlist) => {
            this.currentPlaylist = playlist
        })
    }

    isActive(item: string): boolean {
        return item === this.trackId && this.playlist.Id == this.currentPlaylist.Id;
    }

    isPaused(item: string): any {
        return this.paused
    }

    toggleAudio(item: ITrack, index: number) {
        this.audioService.toggleAudio(item, index, this.playlist)
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
        return this.audioService.getDuration(duration);
    }
}

