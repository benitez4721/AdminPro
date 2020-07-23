import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {


  public perfilForm: FormGroup;
  public imagenSubir: File;
  public usuario: Usuario;
  public imgTemp: any = null;
  constructor( private fb: FormBuilder,
               private user_s: UsuarioService,
               private fileUl_s: FileUploadService) { 
                 this.usuario = this.user_s.usuario
               }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.user_s.usuario.nombre, Validators.required],
      email: [this.user_s.usuario.email,[ Validators.required, Validators.email]],
    });

  }

  actualizarPerfil(){
    this.user_s.actualizarPerfil( this.perfilForm.value)
      .subscribe( resp => {
        Swal.fire('Guardado', 'Cambios Fueron guardados', 'success')
      },
      (error) => {
        Swal.fire('Error', error.error.msg, 'error')
      })
    
    
    
  }
  
  cambiarImagen( file: File){
    this.imagenSubir = file

    if(!file){
      return this.imgTemp = null
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);
    reader.onloadend = () =>{
      this.imgTemp = reader.result
      
    }
    
  }

  subirImagen() {
    this.fileUl_s.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid) 
      .then( img => {this.usuario.img = img;
        Swal.fire('Guardado', 'Imagen actualizada', 'success')})
  }

}
