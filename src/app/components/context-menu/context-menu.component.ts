import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface MenuItem {
    label: string;
    action: () => void;
}

@Component({
    selector: 'app-context-menu',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './context-menu.component.html',
    styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent {
    @Input() menuItems: MenuItem[] = [];
    visible = false;
    x = 0;
    y = 0;

    constructor() { }

    open(event: MouseEvent) {
        event.preventDefault();

        const { innerWidth, innerHeight } = window;
        const menuWidth = 220;
        const menuHeight = this.menuItems.length * 30;

        this.x = event.clientX + menuWidth > innerWidth ? innerWidth - menuWidth : event.clientX;
        this.y = event.clientY + menuHeight > innerHeight ? innerHeight - menuHeight : event.clientY;

        this.visible = true;
    }

    close() {
        this.visible = false;
    }

    onMenuItemClick(item: MenuItem) {
        item.action();
        this.close();
    }
}
