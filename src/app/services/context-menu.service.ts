import { Injectable } from "@angular/core";
import { MenuItem } from "../dtos/menuItem";
import { QueueService } from "./queue.service";

@Injectable({
    providedIn: 'root'
})

export class ContextMenuService {

    constructor(private queueService: QueueService) {

    }

    getTrackActions(id: string = ''): MenuItem[] {
        return [
            {
                svg: '',
                label: 'Add to queue',
                action: () => this.queueService.addTrackAtIndex(id)
            },
            { svg: '', label: 'Track func 2', action: () => console.log('Action 2 clicked') },
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
            { svg: '', label: 'Profile func 1', action: () => console.log('Action 1 clicked') },
            { svg: '', label: 'Profile func 2', action: () => console.log('Action 2 clicked') },
            { svg: '', label: 'Profile func 3', action: () => console.log('Action 3 clicked') },
        ];
    }

}