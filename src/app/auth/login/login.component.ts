import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { log } from 'console';
import Swal from 'sweetalert2';

declare const gapi:any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent implements OnInit {

  
  public formSubmitted = false
  public auth2: any;

  public loginForm = this.fb.group({
    
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });


  constructor( private router: Router,
               private fb: FormBuilder,
               private user_s: UsuarioService,
               private ngZone: NgZone) { }

  ngOnInit(): void {
    this.renderButton();
    let email = localStorage.getItem('email')
    let password = localStorage.getItem('password')
    if (email && password) {
      this.loginForm.controls['email'].setValue(email)
      this.loginForm.controls['password'].setValue(password)
    }
  }

  login(){
    
    this.user_s.login( this.loginForm.value)
      .subscribe( 
        (resp) => {this.router.navigateByUrl('/')} ,
        (err) => {
        Swal.fire('Error',err.error.msg,'error')
      })
    
    
  }
  
  onSuccess(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
    

  }

  onFailure(error) {
    console.log(error);
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    this.startApp()
  }

  async startApp() {

      await this.user_s.googleInit()
      this.auth2 = this.user_s.auth2

      this.attachSignin(document.getElementById('my-signin2'));
    
  };

  attachSignin(element) {
    
    this.auth2.attachClickHandler(element, {},
        (googleUser) =>  {
          const id_token = googleUser.getAuthResponse().id_token;
          this.user_s.loginGoogle( id_token).subscribe( resp => {
            this.ngZone.run(() => {

              this.router.navigateByUrl('/')
            })
            
          }); 
        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
