import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@app/services/theme-service/theme.service';

@Component({
    selector: 'app-loading-screen',
    templateUrl: './loading-screen.component.html',
    styleUrls: ['./loading-screen.component.scss'],
})
export class LoadingScreenComponent implements OnInit {
    theme: string = this.themeService.curruntTheme;
    constructor(private themeService: ThemeService) {}

    ngOnInit(): void {
        this.theme = this.themeService.curruntTheme;
    }
}
