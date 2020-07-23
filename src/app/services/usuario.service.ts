import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { Loginform } from '../interfaces/login-form.interface';
import { map, tap, catchError } from 'rxjs/operators';
import { log } from 'console';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url
declare const gapi: any
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  public auth2: any;
  public usuario: Usuario
  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone) { 
                 this.googleInit()
               }
  
  cambiarImagen(img: string){
    this.usuario.img = img
    return true
  }

  get token():string{
    return localStorage.getItem('token') || ''
  }            
  googleInit(){

    return new Promise( resolve => {
      console.log("google init");
      
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '377670571762-eaihrnruhu5etgobkapa5nl1djqhomvl.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });
        resolve();
      });
    })
  }             

  logout() {
    localStorage.removeItem('token');

    
    this.auth2.signOut().then( () => {
      this.ngZone.run(() => {

        this.router.navigateByUrl('/login')
      })
    });
     
    
  }

  validarToken() {

    return this.http.get(`${base_url}/login/renew`, {
            headers:{
              'x-token' : this.token
            }}).pipe(
              map((resp: any) => {
                
                const {
                    nombre,
                    email,
                    google,
                    img = '',
                    role,
                    uid
                } = resp.usuario
                
                this.usuario = new Usuario(nombre,email,img,google,role,uid);
                
                localStorage.setItem('token', resp.token);
                return true
              }),
              catchError( error => of(false))
            )
  }

  crearUsuario( formData: RegisterForm) {
    
    return this.http.post(`${base_url}/usuarios`, formData);
    
  }

  actualizarPerfil( data: {email: string, nombre: string, role: string}) {
    data = {
      ...data,
      role: this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${this.usuario.uid}`, data, {
      headers: {
        'x-token' : this.token
      }
    })
    .pipe(
      map( (resp:any) => {
        this.usuario.nombre = resp.usuario.nombre
        this.usuario.email = resp.usuario.email
        return true
      })
    )
  }

  login( formData: Loginform){

    
    if (formData.remember) {
      localStorage.setItem('email', formData.email)
      localStorage.setItem('password', formData.password)
    }else{
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
    return this.http.post(`${base_url}/login`, formData)
        .pipe(
          map( (resp:any) => {
            localStorage.setItem('token',resp.token);
            return true
          })
        );
  }
 
  loginGoogle( token){

    
    return this.http.post(`${base_url}/login/google`, {token})
        .pipe(
          map( (resp:any) => {
            localStorage.setItem('token',resp.token);
            return true
          })
        );
  }

}
