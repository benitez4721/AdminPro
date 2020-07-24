import { Component, OnInit, EventEmitter } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;
  public usuario: Usuario;
  public imgTemp: any = null;

  
  constructor( public modal_s: ModalImagenService,
               public file_s: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modal_s.cerrarModal()
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

    const id = this.modal_s.id
    const tipo = this.modal_s.tipo
    this.file_s.actualizarFoto(this.imagenSubir, tipo, id) 
      .then( img => {
        Swal.fire('Guardado', 'Imagen actualizada', 'success')
        this.cerrarModal()
        this.modal_s.nuevaImagen.emit(img);
      })
  }

}
