import { Routes } from '@angular/router';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ArtistsettingsComponent } from './components/artistsettings/artistsettings.component';
import { AccountComponent } from './components/account/account.component';
import { LyricsComponent } from './components/lyrics/lyrics.component';
import { CreateComponent } from './components/create/create.component';
import { ProfilemodifyComponent } from './components/profilemodify/profilemodify.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent},
    { path: 'playlists/:id', component: PlaylistComponent },
    { path: 'profile', component: ProfileComponent},
    { path: 'profile/modify', component: ProfilemodifyComponent},
    { path: 'account', component: AccountComponent},
    { path: 'artist', component: ArtistsettingsComponent},
    { path: 'artist/create', component: CreateComponent},
    { path: 'lyrics', component: LyricsComponent},
];
