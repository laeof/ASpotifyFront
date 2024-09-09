import { Component } from '@angular/core';
import { FooterInfoComponent } from "../footer-info/footer-info.component";
import { UrlService } from '../../services/url.service';

@Component({
    selector: 'app-artistsettings',
    standalone: true,
    imports: [FooterInfoComponent],
    templateUrl: './artistsettings.component.html',
    styleUrl: './artistsettings.component.scss'
})
export class ArtistsettingsComponent {
    constructor(private urlService: UrlService) {
        
    }

    redirectToCreate() {
        this.urlService.redirect('artist/create')
    }
}
