import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { Loginform } from '../interfaces/login-form.interface';
import { map, tap, catchError } from 'rxjs/operators';
import { log } from 'console';
import { of } from 'rxjs';
import { Router } from '@angular/router';

const base_url = environment.base_url
declare const gapi: any
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  public auth2: any;
  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone) { 
                 this.googleInit()
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
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${base_url}/login/renew`, {
            headers:{
              'x-token' : token
            }}).pipe(
              tap((resp: any) => {
                localStorage.setItem('token', resp.token);
              }),
              map( resp => true),
              catchError( error => of(false))
            )
  }

  crearUsuario( formData: RegisterForm) {
    
    return this.http.post(`${base_url}/usuarios`, formData);
    
  }

  login( formData: Loginform){

    console.log(formData.remember);
    
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
