import { Component } from '@angular/core';

@Component({
  selector: 'app-leftsidebar',
  standalone: true,
  imports: [],
  templateUrl: './leftsidebar.component.html',
  styleUrl: './leftsidebar.component.scss'
})
export class LeftsidebarComponent {
items: any[] = new Array(20);

}
