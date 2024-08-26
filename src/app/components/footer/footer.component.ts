import { Component } from '@angular/core';
import { ITrack } from '../../dtos/track';
import { ArtistService } from '../../services/artist.service';
import { AudioService } from '../../services/audio.service';
import { map, Observable } from 'rxjs';
import { IPlaylist } from '../../dtos/playlist';
import { CommonModule } from '@angular/common';
import { PlaylistService } from '../../services/playlist.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
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
    playlist: IPlaylist = {
        Id: '',
        UserId: '',
        Image: '',
        Name: '',
        Tracks: []
    };
    volume: number = 0;
    trackPosition: number = 0;
    paused: boolean = true;
    toggledNowPlaying = false;
    trackId: string = "";
    random: boolean = true;

    constructor(private artistService: ArtistService,
        private audioService: AudioService,
        private sidebarService: SidebarService
    ) {
        this.audioService.getCurrentTrack().subscribe(track => {
            this.track = track;
        });

        this.audioService.getTrackPosition().subscribe(trackpos => {
            this.trackPosition = trackpos;
        });

        this.audioService.getVolume().subscribe(volume => {
            this.volume = volume * 100;
        });

        this.audioService.getCurrentTrack().subscribe((trackid) => {
            this.trackId = trackid.Id
        });

        this.audioService.isTrackPaused().subscribe((ispaused) => {
            this.paused = ispaused
        })

        this.audioService.getPlaylist().subscribe((playlist) => {
            this.playlist = playlist
        })

        this.sidebarService.isNowPlayingVisible().subscribe(visible => {
            this.toggledNowPlaying = visible;
        }) 
    }

    toggleNowPlaying() {
        this.sidebarService.toggleNowPlayingVisible();
    }

    isNowPlayingToggled() {
        return this.toggledNowPlaying;
    }

    isActive(): boolean {
        return this.audioService.isActive();
    }

    isPaused(): any {
        return this.paused
    }

    toggleAudio() {
        this.audioService.toggleAudio(this.track);
    }

    toggleRandom(): any {
        this.audioService.toggleRandom();
    }

    getRandom() {
        return this.audioService.getRandomState();
    }

    toggleRepeat() {
        this.audioService.toggleRepeat();
    }

    getRepeat() {
        return this.audioService.getRepeat();
    }

    nextAudio() {
        if(!this.audioService.getRandomState())
            this.audioService.playPlaylist(this.playlist.Tracks.findIndex(track => track.Id === this.track.Id) + 1)
        else {
            this.audioService.playRandom();
        }
    }

    prevAudio() {
        let prevIndex = this.audioService.getPrevTrackIndex();
        this.audioService.playPlaylist(prevIndex)
    }

    onPositionChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const position = +input.value;
        this.audioService.setTrackPosition(position);
        console.log("changed")
    }

    onVolumeChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const volume = +input.value;
        this.audioService.setVolume(volume / 100);
    }

    getArtistById(id: string) {
        return this.artistService.getArtistNameById(id);
    }

    getDuration(duration: number) {
        return this.audioService.getDuration(duration);
    }
}
