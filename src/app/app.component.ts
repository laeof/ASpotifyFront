import { Component } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { LeftsidebarComponent } from './components/leftsidebar/leftsidebar.component';
import { MainComponent } from './components/main/main.component';
import { ColorService } from './services/color.service';
import { TrackService } from './services/track.service';
import { PlaylistService } from './services/playlist.service';
import { UserService } from './services/user.service';
import { ArtistService } from './services/artist.service';
import { AlbumService } from './services/album.service';
import { HttpClientModule } from '@angular/common/http';
import { AudioService } from './services/audio.service';
import { UrlService } from './services/url.service';
import { ApiService } from './services/api.service';
import { CommonModule } from '@angular/common';
import { ITrack } from './dtos/track';
import { HeaderComponent } from './components/header/header.component';
import { SidebarService } from './services/sidebar.service';
import { NowplayingsidebarComponent } from "./components/nowplayingsidebar/nowplayingsidebar.component";
import { HomeComponent } from './components/home/home.component';
import { QueueService } from './services/queue.service';
import { PlayerService } from './services/player.service';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { ContextMenuService } from './services/context-menu.service';
import { LocalStorageService } from './services/localstorage.service';
import { ProfileComponent } from './components/profile/profile.component';
import { AccountComponent } from './components/account/account.component';
import { ArtistsettingsComponent } from './components/artistsettings/artistsettings.component';
import { LyricsComponent } from './components/lyrics/lyrics.component';
import { QueueComponent } from './components/queue/queue.component';
import { FooterInfoComponent } from './components/footer-info/footer-info.component';
import { CreateComponent } from './components/create/create.component';
import { MediaService } from './services/media.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        HeaderComponent,
        FooterComponent,
        LeftsidebarComponent,
        MainComponent,
        HttpClientModule,
        CommonModule,
        NowplayingsidebarComponent,
        HomeComponent,
        ContextMenuComponent,
        ProfileComponent,
        AccountComponent,
        ArtistsettingsComponent,
        LyricsComponent,
        QueueComponent,
        CreateComponent
    ],
    providers: [
        ColorService,
        TrackService,
        PlaylistService,
        UserService,
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
        MediaService
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'ASpotifyFront';
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
    constructor(private queueService: QueueService,
        private trackService: TrackService
    ) {
        this.queueService.getCurrentTrackId().subscribe(track => {
            this.track = this.trackService.getTrackById(track);
        });
    }

    isActive() {
        return this.track.Id != '';
    }

}
