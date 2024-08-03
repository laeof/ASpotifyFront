import { AfterViewInit, Component, ElementRef, HostListener, Input, input, ViewChild } from '@angular/core';
import { ITrack } from '../../dtos/track';
import { ColorService } from '../../services/colorService';
import { TrackService } from '../../services/trackservice';
import { IPlaylist } from '../../dtos/playlist';
import { PlaylistService } from '../../services/playlistservice';
import { UserService } from '../../services/userservice';
import { IUser } from '../../dtos/user';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/internal/operators/delay';
import { ArtistService } from '../../services/artistservice';
import { IArtist } from '../../dtos/artist';
import { AlbumService } from '../../services/albumservice';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-playlist',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './playlist.component.html',
    styleUrl: './playlist.component.scss'
})
export class PlaylistComponent {
    user: IUser;
    toggledContextMenu: boolean = false;
    @ViewChild('imageElement', { static: false }) imageElement!: ElementRef;

    playlist: IPlaylist | undefined;

    constructor(private colorService: ColorService,
        private trackService: TrackService,
        private playlistService: PlaylistService,
        private userService: UserService,
        private route: ActivatedRoute,
        private artistService: ArtistService,
        private albumService: AlbumService
    ) {
        this.user = userService.getCurrentUserInfo();
        this.route.paramMap.subscribe(params => {
            this.playlist = this.playlistService.getPlaylistById(params.get('id') || "");
            setTimeout(() => this.extractColor(), 1);
        });
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

    getDuration(duration: number): string {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const secs = duration % 60;

        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = secs.toString().padStart(2, '0');

        if (hours > 0) {
            const hoursStr = hours.toString().padStart(2, '0');
            return `${hoursStr}:${minutesStr}:${secondsStr}`;
        } else {
            return `${minutesStr}:${secondsStr}`;
        }
    }

    extractColor() {
        const image = this.imageElement.nativeElement;
        this.colorService.extractColor(image).then(mostFrequentColor => {
            // Обработка результата
            console.log('Most Frequent Color:', mostFrequentColor);

            // Пример: установка пользовательского фона
            const rgb = mostFrequentColor.match(/\d+/g)?.map(Number);
            if (rgb && rgb.length === 3) {
                const darkenedColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
                document.documentElement.style.setProperty('--custom-bg-color', darkenedColor);
            }
        }).catch(error => {
            console.error('Error extracting color:', error);
        });
    }
}

