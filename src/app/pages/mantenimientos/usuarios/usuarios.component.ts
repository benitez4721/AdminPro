import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public cargando: boolean = true;
  public desde: number = 0;

  private img$: Subscription;
  constructor(private user_s: UsuarioService,
              private busqueda_s: BusquedasService,
              private modal_s: ModalImagenService ) { }

  ngOnInit(): void {
    this.user_s.cargarUsuarios(this.desde)
      .subscribe( ({ total, usuarios}) => {
        this.cargando = false
        this.totalUsuarios = total
        this.usuarios = usuarios
        this.usuariosTemp = usuarios
      })
    
    this.img$ = this.modal_s.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img => this.cargarUsuarios())  
  }

  ngOnDestroy(): void {
    this.img$.unsubscribe()
  }

  cargarUsuarios() {
    this.user_s.cargarUsuarios(this.desde)
      .subscribe( ({ total, usuarios}) => {
        this.cargando = false
        this.totalUsuarios = total
        this.usuarios = usuarios
        
      })
  }
  cambiarPagina( valor: number) {
    this.cargando = true
    this.desde += valor;

    if( this.desde < 0){
      this.desde = 0
    }
    else if( this.desde > this.totalUsuarios) {
      this.desde -= valor
    }

    this.cargarUsuarios();


  }

  buscar( termino: string){
    
    if ( termino.length === 0){
      
      return  this.usuarios = this.usuariosTemp
    }
    
    
    this.busqueda_s.buscar( 'usuarios', termino)
        .subscribe(resp => {
          this.usuarios = resp
        })
    
  }

  eliminarUsuario( usuario: Usuario){
    
    if (usuario.uid === this.user_s.usuario.uid) {
      return Swal.fire('Error','No te puedes borrar a ti mismo','error')
    }
    
    
    Swal.fire({
      title: 'Borrar Usuario',
      text: `Esta a punto de borrar a ${ usuario.nombre}` ,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borralo!'
    }).then((result) => {
      if (result.value) {
        this.user_s.eliminarUsuario(usuario).subscribe(resp => {
          
          this.cargarUsuarios()
          Swal.fire(
            'Usuario borrado',
            `Usuario ${usuario.nombre} ha sido eliminado satisfactoriamente`,
            'success'
          );
        })
      }
    })
    
  }

  cambiarRole(usuario: Usuario){
    
    this.user_s.guardarUsuario( usuario ).subscribe( resp => console.log(resp))
    
  }

  abrirModal( usuario: Usuario){
    this.modal_s.abrirModal('usuarios',usuario.uid,usuario.img)
    
  }

}
