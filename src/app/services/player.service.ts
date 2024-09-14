import { PlaylistService } from "./playlist.service";
import { BehaviorSubject, iif, Observable } from "rxjs";
import { AudioService } from "./audio.service";
import { QueueService } from "./queue.service";
import { TrackService } from "./track.service";
import { Injectable } from "@angular/core";
import { IPlaylist, PlaylistType } from "../dtos/playlist";
import { ITrack } from "../dtos/track";

@Injectable({
    providedIn: 'root'
})

export class PlayerService {
    private randomStateObs = new BehaviorSubject<boolean>(false);
    private repeatStateObs = new BehaviorSubject<boolean>(false);

    private nowPlayingPlaylistId: string = '';
    private nowPlayingPlaylist: IPlaylist = {
        Id: "",
        AuthorId: "",
        Image: "",
        Name: "",
        Type: PlaylistType.Playlist,
        TrackIds: []
    };
    private nowPlayingTrackId: string = '';

    constructor(private audioService: AudioService,
        private queueService: QueueService,
        private trackService: TrackService,
        private playlistService: PlaylistService,
    ) {
        this.queueService.getCurrentTrackId().subscribe(trackId => {
            this.nowPlayingTrackId = trackId;
        })

        this.playlistService.getPlayingPlaylistId().subscribe(playlistId => {
            this.nowPlayingPlaylistId = playlistId;
        })

        this.playlistService.getPlaylistByIdDev(this.nowPlayingPlaylistId).subscribe((playlist: any) => {
            this.nowPlayingPlaylist = {
                Id: playlist.id,
                AuthorId: playlist.authorId,
                Image: playlist.imagePath,
                Name: playlist.name,
                Type: playlist.types,
                TrackIds: playlist.tracks
            }
        })
    }

    playBack() {
        const sub = this.trackService.getTrackByIdDev(this.nowPlayingTrackId).subscribe((response: any) => {
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

            this.queueService.prevTrack();
            this.audioService.playTrack(play);
        })

        sub.unsubscribe();
    }

    playNext() {
        const sub = this.trackService.getTrackByIdDev(this.nowPlayingTrackId).subscribe((response: any) => {
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

            this.queueService.nextTrack();
            this.audioService.playTrack(play);
        })

        sub.unsubscribe();
    }

    toggleAudio(trackId: string, playlistId: string, lockPlaylistCheck: boolean = false) {
        if (this.nowPlayingPlaylistId != playlistId) {
            const sub = this.playlistService.getPlaylistByIdDev(playlistId).subscribe((playlist: any) => {
                let play = {
                    Id: playlist.id,
                    AuthorId: playlist.authorId,
                    Image: playlist.imagePath,
                    Name: playlist.name,
                    Type: playlist.types,
                    TrackIds: playlist.tracks
                }
                this.queueService.setQueue(play.TrackIds)
            })

            sub.unsubscribe();
        }

        this.trackService.getTrackByIdDev(trackId).subscribe((response: any) => {
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
            this.audioService.toggleAudio(
                play, this.nowPlayingPlaylist, lockPlaylistCheck);
        })

        if (this.nowPlayingPlaylistId != playlistId)
            this.playlistService.setPlayingPlaylistId(playlistId)
    }

    toggleRandom() {
        this.randomStateObs.next(!this.randomStateObs.value);

        if (this.randomStateObs.value)
            this.queueService.shuffleQueue();
    }

    getRandomState(): Observable<boolean> {
        return this.randomStateObs.asObservable();
    }

    toggleRepeat() {
        this.repeatStateObs.next(!this.repeatStateObs.value);
        this.queueService.toggleRepeatTrack(this.repeatStateObs.value);
    }

    getRepeatState(): Observable<boolean> {
        return this.repeatStateObs.asObservable();
    }

    setTrackPosition(position: number) {
        this.audioService.setTrackPosition(position);
    }

    setVolume(volume: number) {
        this.audioService.setVolume(volume);
    }

    getVolume(): Observable<number> {
        return this.audioService.getVolume();
    }
}