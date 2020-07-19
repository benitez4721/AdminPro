import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { linkSync } from 'fs';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {
  
 
  
  constructor( private s_settings: SettingsService) { }

  ngOnInit(): void {
    
    this.s_settings.checkCurrentTheme()
  }

  changeTheme( theme: string){
    this.s_settings.changeTheme(theme)  
  }
  
}
