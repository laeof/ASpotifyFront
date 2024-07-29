import { Routes } from '@angular/router';
import { PlaylistComponent } from './components/playlist/playlist.component';

export const routes: Routes = [
    { path: '', redirectTo: '/Home', pathMatch: 'full' },
    { path: 'Home', component: PlaylistComponent },
];
