import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private user_s: UsuarioService, private router: Router){}
  
    canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
      
        return this.user_s.validarToken()
        .pipe(
          tap( estaAutenticado => {
            if( !estaAutenticado ){
              this.router.navigateByUrl('/login')
            }
          })
        )
      }

  
  
}
