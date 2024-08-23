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
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './services/api.service';
import { CommonModule } from '@angular/common';
import { ITrack } from './dtos/track';
import { HeaderComponent } from './components/header/header.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        HeaderComponent,
        FooterComponent,
        LeftsidebarComponent,
        MainComponent,
        HttpClientModule,
        CommonModule
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
        ApiService
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
        Url: ''
    };
    constructor(private audioService: AudioService) {
        this.audioService.getCurrentTrack().subscribe(track => {
            this.track = track;
        });
    }

}
