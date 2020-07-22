import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ ('../login/login.component.css')]
})
export class RegisterComponent {

  public formSubmitted = false

  public registerForm = this.fb.group({
    nombre: ['',  Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    terminos: [false, Validators.required]
  },{
    validators: this.passwordsIguales('password','password2')
  });

  constructor( private fb: FormBuilder,
               private user_s: UsuarioService,
               private router: Router ) { 
  }

  crearUsuario() {
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if( this.registerForm.invalid) {
      return; 
    }

    this.user_s.crearUsuario(this.registerForm.value)
          .subscribe( resp => {
            this.router.navigateByUrl('login')
            
          }, (err) => {
            Swal.fire('Error', err.error.msg, 'error');
          })
    
  }

  campoNoValido( campo: string) : boolean {
    if( this.registerForm.get(campo).invalid && this.formSubmitted){
      return true
    }
    return false
  }

  aceptaTermino(){
    return !this.registerForm.get('terminos').value && this.formSubmitted
  }

  constrasenasNoValidas(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if ( (pass1 !== pass2) && this.formSubmitted){
      return true
    }
    return false

  }

  passwordsIguales(pass1: string, pass2: string){
    return ( formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);
      
      
      if ( pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null)
      } else {
        pass2Control.setErrors({ noEsIgual: true })
      }

    }
  }

  

}
