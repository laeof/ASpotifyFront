import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlaylistComponent } from '../playlist/playlist.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet,
            PlaylistComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
