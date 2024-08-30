import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { IPlaylist, PlaylistType } from '../../dtos/playlist';
import { PlaylistService } from '../../services/playlist.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';
import { CommonModule } from '@angular/common';
import { UrlService } from '../../services/url.service';
import { AudioService } from '../../services/audio.service';
import { ContextMenuService } from '../../services/context-menu.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
    selector: 'app-leftsidebar',
    standalone: true,
    imports: [CommonModule,
        ContextMenuComponent
    ],
    templateUrl: './leftsidebar.component.html',
    styleUrl: './leftsidebar.component.scss'
})
export class LeftsidebarComponent {
    items: IPlaylist[] = [];
    private user: IUser = {
        Id: '',
        UserName: '',
        FirstName: null,
        LastName: null,
        Email: '',
        lovedPlaylistId: '',
        Image: '',
        Playlists: []
    };
    isPaused: boolean = false;
    activeId: string | null = null;
    playingId: string | null = null;
    constructor(private playlistService: PlaylistService,
        private userService: UserService,
        private urlService: UrlService,
        private audioService: AudioService,
        private contextMenuService: ContextMenuService
    ) {
        this.userService.getCurrentUserInfo().subscribe(user => {
            this.user = user;
            playlistService.getAllPlaylistsUserId(this.user.Id).map(playlist => {
                if (!this.items.includes(this.playlistService.getPlaylistById(playlist)))
                    this.items.push(this.playlistService.getPlaylistById(playlist))
            });
        });

        this.playlistService.getActiveId().subscribe(id => {
            this.activeId = id;
        });

        this.playlistService.getPlayingPlaylistId().subscribe(play => {
            this.playingId = play;
        });

        this.audioService.isTrackPaused().subscribe(pause => {
            this.isPaused = pause
        });

    }
    
    getPlaylistType(type: PlaylistType) {
        return this.playlistService.getPlaylistType(type);
    }

    @ViewChild('contextMenu') contextMenu!: ContextMenuComponent;

    onPlaylistClick(event: MouseEvent) {
        this.contextMenu.menuItems = this.contextMenuService.getPlaylistActions();
        this.contextMenu.open(event);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        this.contextMenu.close();
    }

    redirectToPlaylist(id: string) {
        this.activeId = id;

        let route = "/playlists/" + id;

        this.urlService.redirect(route);
    }

    isActive(id: string): boolean {
        return this.activeId === id;
    }

    isPlaying(id: string): boolean {
        return this.playingId === id;
    }

    createNewPlaylist() {
        this.playlistService.createNewPlaylist();
        // this.items.push(this.playlistService.getPlaylistById());
    }
}
