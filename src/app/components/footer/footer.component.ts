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
        Path: ''
    };
    playlist: IPlaylist = {
        Id: '',
        AuthorId: '',
        Image: '',
        Name: '',
        Type: PlaylistType.Playlist,
        TrackIds: []
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
            this.playlistService.getPlaylistByIdDev(latestPlayingPlaylist).subscribe((playlist: any) => {
                playlistPlayed = {
                    Id: playlist.id,
                    AuthorId: playlist.authorId,
                    Image: playlist.imagePath,
                    Name: playlist.name,
                    Type: playlist.types,
                    TrackIds: playlist.tracks
                }
                this.queueService.setQueue(playlistPlayed.TrackIds)
                this.queueService.setCurrentTrack(latestPlayingSong)
                this.audioService.setTrackPosition(latestSongTrackPosition)
                this.audioService.setTrackPause();
            })
        }

        this.queueService.getCurrentTrackId().subscribe(track => {
            this.trackService.getTrackByIdDev(track).subscribe((response: any) => {
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
                this.track = play;
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
        })

        this.playlistService.getPlaylistByIdDev(this.playingPlaylistId).subscribe((playlist: any) => {
            this.playlist = {
                Id: playlist.id,
                AuthorId: playlist.authorId,
                Image: playlist.imagePath,
                Name: playlist.name,
                Type: playlist.types,
                TrackIds: playlist.tracks
            }
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
        this.playerService.toggleAudio(this.track.Id, this.playlist.Id, true);
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
