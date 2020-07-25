import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public imgUrl = ''
  public usuario: Usuario
  constructor(private user_s: UsuarioService,
              private router: Router) { 
    this.imgUrl = user_s.usuario.imagenUrl
    this.usuario = user_s.usuario
    
  }

  logout(){
    this.user_s.logout();
  }
  
  buscar(termino: string){
    if( termino.length == 0){
      return
    }
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`)
    
  }

}
