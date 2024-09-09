import { Component, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlaylistComponent } from '../playlist/playlist.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { FooterInfoComponent } from "../footer-info/footer-info.component";

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [RouterOutlet,
    PlaylistComponent, FooterInfoComponent],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss'
})
export class MainComponent {
    
}
