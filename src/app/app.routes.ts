import { Routes } from '@angular/router';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent},
    { path: 'playlists/:id', component: PlaylistComponent },
];
