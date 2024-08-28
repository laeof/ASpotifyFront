import { Component } from '@angular/core';
import { ITrack } from '../../dtos/track';
import { ArtistService } from '../../services/artist.service';
import { AudioService } from '../../services/audio.service';
import { map, Observable } from 'rxjs';
import { IPlaylist, PlaylistType } from '../../dtos/playlist';
import { CommonModule } from '@angular/common';
import { PlaylistService } from '../../services/playlist.service';
import { SidebarService } from '../../services/sidebar.service';
import { QueueService } from '../../services/queue.service';
import { TrackService } from '../../services/track.service';
import { PlayerService } from '../../services/player.service';

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
        Type: PlaylistType.Playlist,
        TrackIds: []
    };
    volume: number = 0;
    trackPosition: number = 0;
    paused: boolean = true;
    toggledNowPlaying = false;
    random: boolean = false;
    repeat: boolean = false;

    constructor(private artistService: ArtistService,
        private audioService: AudioService,
        private sidebarService: SidebarService,
        private trackService: TrackService,
        private playlistService: PlaylistService,
        private queueService: QueueService,
        private playerService: PlayerService
    ) {
        this.queueService.getCurrentTrack().subscribe(track => {
            this.track = this.trackService.getTrackById(track);
        });

        this.audioService.getTrackPosition().subscribe(trackpos => {
            this.trackPosition = trackpos;
        });

        this.playerService.getVolume().subscribe(volume => {
            this.volume = volume * 100;
        });

        this.audioService.isTrackPaused().subscribe((ispaused) => {
            this.paused = ispaused
        })

        this.playlistService.getPlayingPlaylistId().subscribe((playlist) => {
            this.playlist = this.playlistService.getPlaylistById(playlist)
        })

        this.sidebarService.isNowPlayingVisible().subscribe(visible => {
            this.toggledNowPlaying = visible;
        }) 

        this.playerService.getRandomState().subscribe(random => {
            this.random = random;
        })
        
        this.playerService.getRepeatState().subscribe(repeat => {
            this.repeat = repeat
        })
    }

    toggleNowPlaying() {
        this.sidebarService.toggleNowPlayingVisible();
    }

    isNowPlayingToggled() {
        return this.toggledNowPlaying;
    }

    isActive(): boolean {
        return this.track.Id != '';
    }

    isPaused(): any {
        return this.paused
    }

    toggleAudio() {
        this.playerService.toggleAudio(this.track.Id, this.playlist.Id);
    }

    toggleRandom(): any {
        this.playerService.toggleRandom();
    }

    getRandom() {
        return this.random;
    }

    toggleRepeat() {
        this.playerService.toggleRepeat();
    }

    getRepeat() {
        return this.repeat
    }

    nextAudio() {
        this.playerService.playNext();
    }

    prevAudio() {
        this.playerService.playBack();
    }

    onPositionChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const position = +input.value;
        this.audioService.setTrackPosition(position);
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
        return this.trackService.getDuration(duration);
    }
}
