import { Component } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
    selector: 'app-audioplayer',
    standalone: true,
    imports: [],
    templateUrl: './audioplayer.component.html',
    styleUrl: './audioplayer.component.scss'
})
export class AudioplayerComponent {
    constructor(private audioService: AudioService) { }

    // playAudio() {
    //     this.audioService.streamAudio().subscribe(blob => {
    //         const audio = new Audio();
    //         audio.src = URL.createObjectURL(blob);
    //         audio.play();
    //     });
    // }
}
