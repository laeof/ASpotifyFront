import { Component } from '@angular/core';
import { ITrack } from '../../dtos/track';
import { ArtistService } from '../../services/artist.service';
import { AudioService } from '../../services/audio.service';
import { IPlaylist, PlaylistType } from '../../dtos/playlist';
import { CommonModule } from '@angular/common';
import { PlaylistService } from '../../services/playlist.service';
import { SidebarService } from '../../services/sidebar.service';
import { QueueService } from '../../services/queue.service';
import { TrackService } from '../../services/track.service';
import { PlayerService } from '../../services/player.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';
import { LocalStorageService } from '../../services/localstorage.service';
import { UrlService } from '../../services/url.service';
import { first } from 'rxjs';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
    track: ITrack = {
        id: '',
        name: '',
        artistId: '',
        createdDate: new Date,
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
        tracks: []
    };
    playingPlaylistId: string = ''
    volume: number = 0;
    trackPosition: number = 0;
    paused: boolean = true;
    toggledNowPlaying = false;
    random: boolean = false;
    repeat: boolean = false;

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

    constructor(private artistService: ArtistService,
        private audioService: AudioService,
        private sidebarService: SidebarService,
        private trackService: TrackService,
        private playlistService: PlaylistService,
        private queueService: QueueService,
        private playerService: PlayerService,
        private userService: UserService,
        private localStorageService: LocalStorageService,
        private urlService: UrlService
    ) {
        this.userService.getCurrentUserInfo().subscribe(user => {
            this.user = user;
        });
        /*
        todo:
            save latest data to user
        */
        let latestPlayingPlaylist = this.localStorageService.getLatestPlaylistId() ?? this.user.latestPlayingPlaylist;
        let latestPlayingSong = this.localStorageService.getLatestSongId() ?? this.user.latestPlayingTrack;
        let latestSongTrackPosition = this.localStorageService.getLatestSongTrackPosition() ?? 0;

        console.log("latest song: " + latestPlayingSong)
        console.log("latest playlist: " + latestPlayingPlaylist)

        if (latestPlayingSong != null && latestPlayingPlaylist != null) {
            this.playlistService.setPlayingPlaylistId(latestPlayingPlaylist)
            let playlistPlayed: IPlaylist;
            this.playlistService.getPlaylistById(latestPlayingPlaylist).pipe(first()).subscribe(
                (playlist: IPlaylist) => {
                    playlistPlayed = playlist
                    this.queueService.setQueue(playlistPlayed.tracks)
                    this.queueService.setCurrentTrack(latestPlayingSong)
                    this.audioService.setTrackPosition(latestSongTrackPosition)
                    this.audioService.setTrackPause();
                })
        }

        this.queueService.getCurrentTrackId().subscribe(track => {
            this.trackService.getTrackById(track).pipe(first()).subscribe(
                (response: any) => {
                    this.track = response;
                })
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
            this.playingPlaylistId = playlist
            this.playlistService.getPlaylistById(this.playingPlaylistId).pipe(first()).subscribe(
                (playlist: IPlaylist) => {
                    this.playlist = playlist
                })
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

    toggleLyrics() {
        let route = "/lyrics";

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

    toggleNowPlaying() {
        this.sidebarService.toggleNowPlayingVisible();
    }

    isNowPlayingToggled() {
        return this.toggledNowPlaying;
    }

    isActive(): boolean {
        return this.track.id != '';
    }

    isPaused(): any {
        return this.paused
    }

    toggleAudio() {
        this.playerService.toggleAudio(this.track, this.playlist, true);
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
