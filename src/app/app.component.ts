import { Component } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { LeftsidebarComponent } from './components/leftsidebar/leftsidebar.component';
import { MainComponent } from './components/main/main.component';
import { ColorService } from './services/colorService';
import { TrackService } from './services/trackservice';
import { PlaylistService } from './services/playlistservice';
import { UserService } from './services/userservice';
import { ArtistService } from './services/artistservice';
import { AlbumService } from './services/albumservice';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent,
            LeftsidebarComponent,
            MainComponent,
  ],
  providers: [ColorService,
              TrackService,
              PlaylistService,
              UserService,
              ArtistService,
              AlbumService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ASpotifyFront';
}
