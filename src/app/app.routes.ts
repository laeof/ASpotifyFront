import { Routes } from '@angular/router';
import { PlaylistComponent } from './components/playlist/playlist.component';

export const routes: Routes = [
    { path: 'playlists/:id', component: PlaylistComponent },
];
