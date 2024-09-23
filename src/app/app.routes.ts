import { Routes } from '@angular/router';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ArtistsettingsComponent } from './components/artistsettings/artistsettings.component';
import { AccountComponent } from './components/account/account.component';
import { LyricsComponent } from './components/lyrics/lyrics.component';
import { CreateComponent } from './components/create/create.component';
import { ProfilemodifyComponent } from './components/profilemodify/profilemodify.component';
import { MainComponent } from './components/main/main.component';
import { AuthComponent } from './components/auth/auth.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { Guard } from './services/guard.service';

export const routes: Routes = [
    {
        path: '', redirectTo: 'Player', pathMatch: 'full'
    },
    {
        path: 'Player',
        title: 'ASpotifyPlayer',
        component: MainComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'playlists/:id', component: PlaylistComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'profile/modify', component: ProfilemodifyComponent },
            { path: 'account', component: AccountComponent },
            { path: 'artist', component: ArtistsettingsComponent },
            { path: 'artist/create', component: CreateComponent },
            { path: 'lyrics', component: LyricsComponent },
        ]
    },
    {
        path: 'Account',
        title: 'ASpotifyAuth',
        component: AuthComponent,
        canActivate: [Guard],
        children: [
            { path: '', redirectTo: 'SignUp', pathMatch: 'full' },
            { path: 'SignUp', component: SignupComponent },
            { path: 'SignIn', component: SigninComponent }
        ]
    }
];
