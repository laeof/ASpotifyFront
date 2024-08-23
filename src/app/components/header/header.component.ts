import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { IUser } from '../../dtos/user';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    user: IUser | undefined;
    constructor(private userService: UserService) {
        this.user = this.userService.getCurrentUserInfo();
    }
}
