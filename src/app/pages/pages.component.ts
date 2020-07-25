import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';
declare function customInitFunctions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  
  constructor(private s_settings: SettingsService,
              private side_s: SidebarService) { 
                
                this.side_s.cargarMenu()
                
              }

  ngOnInit(): void {

    customInitFunctions();

  }

}
