import { Component, OnInit } from '@angular/core';
import { Theme } from '@app/enums/theme';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  favoriteTheme: string = Theme.ClassName;
  constructor() { }

  ngOnInit(): void {
  }

}
