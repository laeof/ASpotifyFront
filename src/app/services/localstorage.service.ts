import { Injectable } from "@angular/core";
import { QueueService } from "./queue.service";
import { PlaylistService } from "./playlist.service";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})

export class LocalStorageService {

    constructor(private queueService: QueueService,
        private playlistService: PlaylistService,
        private userService: UserService
    ) {
        this.queueService.getCurrentTrackId().subscribe(track => {
            if (track === undefined)
                return

            this.setLatestSong(track);
            this.userService.setLatestTrack(track);
        })

        this.playlistService.getPlayingPlaylistId().subscribe(playlist => {
            if (playlist === '')
                return

            this.setLatestPlaylist(playlist);
            this.userService.setLatestPlaylist(playlist);
        })
    }

    setLatestSong(trackId: string) {
        this.saveDataToLocalStorage("songId", trackId);
    }

    setLatestPlaylist(id: string) {
        this.saveDataToLocalStorage("playlistId", id);
    }

    getLatestSongId(): string | null {
        return this.getDataFromLocalStorage("songId");
    }

    getLatestPlaylistId(): string | null {
        return this.getDataFromLocalStorage("playlistId");
    }

    private saveDataToLocalStorage(key: string, value: any): void {
        // Convert the value to a JSON string
        const jsonValue = JSON.stringify(value);

        // Save to local storage
        localStorage.setItem(key, jsonValue);
    }

    private getDataFromLocalStorage<T>(key: string): T | null {
        // Retrieve the JSON string from local storage
        const jsonValue = localStorage.getItem(key);

        // If there is no value, return null
        if (jsonValue === null || jsonValue === 'undefined') {
            return null;
        }

        // Parse the JSON string back to its original form
        return JSON.parse(jsonValue) as T;
    }
}