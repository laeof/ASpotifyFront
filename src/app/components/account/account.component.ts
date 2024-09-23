import { Component } from '@angular/core';
import { FooterInfoComponent } from "../footer-info/footer-info.component";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FooterInfoComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

}
