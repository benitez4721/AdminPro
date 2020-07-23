import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public imgUrl: string;
  public usuario: Usuario
  menuItems: any[]
  constructor( private s_sidebar: SidebarService, private user_s: UsuarioService) { 
    this.menuItems = s_sidebar.menu;
    this.usuario = this.user_s.usuario
    this.imgUrl = this.user_s.usuario.imagenUrl
    
  }

  ngOnInit(): void {
  }

}
