import { Injectable } from "@angular/core";
import { MenuItem } from "../dtos/menuItem";
import { QueueService } from "./queue.service";
import { PlaylistService } from "./playlist.service";
import { BehaviorSubject } from "rxjs";
import { UrlService } from "./url.service";

@Injectable({
    providedIn: 'root'
})

export class ContextMenuService {

    constructor(private queueService: QueueService,
        private playlistService: PlaylistService,
        private urlService: UrlService
    ) {

    }

    getTrackActions(trackId: string = '', playlistId: string = ''): MenuItem[] {
        return [
            {
                svg: '',
                label: 'Add to queue',
                action: () => this.queueService.addTrackAtIndex(trackId)
            },
            {
                svg: '',
                label:
                    'Add to playlist',
                action: () => this.playlistService.addToPlaylist(trackId, playlistId)
            },
            { svg: '', label: 'Track func 3', action: () => console.log('Action 3 clicked') },
        ];
    }

    getPlaylistActions(): MenuItem[] {
        return [
            { svg: '', label: 'Playlist func 1', action: () => console.log('Action 1 clicked') },
            { svg: '', label: 'Playlist func 2', action: () => console.log('Action 2 clicked') },
            { svg: '', label: 'Playlist func 3', action: () => console.log('Action 3 clicked') },
        ];
    }

    getProfileActions(): MenuItem[] {
        return [
            {
                svg: '',
                label: 'Account',
                action: () => this.urlService.redirect('/account')
            },
            {
                svg: '',
                label: 'Show profile',
                action: () => this.urlService.redirect('/profile')
            },
            {
                svg: '',
                label: 'Artist settings',
                action: () => this.urlService.redirect('/artist')
            }, 
            {
                svg: '',
                label: 'Log out',
                action: () => console.log('Action 4 clicked')
            },
        ];
    }



}