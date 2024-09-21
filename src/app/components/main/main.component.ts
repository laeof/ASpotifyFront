import { Component, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlaylistComponent } from '../playlist/playlist.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { FooterInfoComponent } from "../footer-info/footer-info.component";
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { LeftsidebarComponent } from '../leftsidebar/leftsidebar.component';
import { NowplayingsidebarComponent } from '../nowplayingsidebar/nowplayingsidebar.component';
import { CommonModule } from '@angular/common';
import { AccountComponent } from '../account/account.component';
import { ArtistsettingsComponent } from '../artistsettings/artistsettings.component';
import { CreateComponent } from '../create/create.component';
import { HomeComponent } from '../home/home.component';
import { LyricsComponent } from '../lyrics/lyrics.component';
import { ProfileComponent } from '../profile/profile.component';
import { QueueComponent } from '../queue/queue.component';
import { AlbumService } from '../../services/album.service';
import { ApiService } from '../../services/api.service';
import { ArtistService } from '../../services/artist.service';
import { AudioService } from '../../services/audio.service';
import { ContextMenuService } from '../../services/context-menu.service';
import { LocalStorageService } from '../../services/localstorage.service';
import { MediaService } from '../../services/media.service';
import { PlayerService } from '../../services/player.service';
import { QueueService } from '../../services/queue.service';
import { SidebarService } from '../../services/sidebar.service';
import { UrlService } from '../../services/url.service';
import { TrackService } from '../../services/track.service';
import { first } from 'rxjs';
import { ITrack } from '../../dtos/track';
import { PlaylistService } from '../../services/playlist.service';
import { MainplayerComponent } from "../mainplayer/mainplayer.component";
import { IUser } from '../../dtos/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
    PlaylistComponent,
    FooterInfoComponent,
    HeaderComponent,
    FooterComponent,
    LeftsidebarComponent,
    NowplayingsidebarComponent,
    CommonModule,
    HomeComponent,
    ContextMenuComponent,
    ProfileComponent,
    AccountComponent,
    ArtistsettingsComponent,
    LyricsComponent,
    QueueComponent,
    CreateComponent, 
    MainplayerComponent],
    providers: [
        TrackService,
        PlaylistService,
        ArtistService,
        AlbumService,
        AudioService,
        UrlService,
        ApiService,
        SidebarService,
        QueueService,
        PlayerService,
        ContextMenuService,
        LocalStorageService,
        MediaService,
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss'
})
export class MainComponent {
    track: ITrack = {
        id: '',
        name: '',
        artistId: '',
        createdDate: 0,
        albumId: '',
        duration: 0,
        imagePath: '',
        urlPath: ''
    };

    user: IUser = {
        Id: '',
        UserName: '',
        FirstName: null,
        LastName: null,
        Email: '',
        Image: '',
        lovedPlaylistId: '',
        latestPlayingTrack: '',
        latestPlayingPlaylist: '',
        Playlists: []
    }
    constructor(private queueService: QueueService,
        private trackService: TrackService,
        private userService: UserService
    ) {
        this.queueService.getCurrentTrackId().subscribe(track => {
            this.trackService.getTrackById(track).pipe(first()).subscribe((response: any) => {
                this.track = response;
            })
        });
        this.userService.getCurrentUserInfo().subscribe(user => {
            this.user = user;
        })
    }
    isActive() {
        return this.track.id != '' && this.user.Id != '';
    }
}
