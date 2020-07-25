import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[];
  public medicosTemp: Medico[];
  public cargando: boolean = true
  public img$: Subscription
  constructor(private medicos_s: MedicoService,
              private modal_s: ModalImagenService,
              private busqueda_s: BusquedasService
              ) { }

  ngOnInit(): void {
    this.cargarMedicos()

    this.img$ = this.modal_s.nuevaImagen
      .pipe(
        delay(200)
      )
      .subscribe( resp => this.cargarMedicos())

  }

  ngOnDestroy(): void {
    this.img$.unsubscribe()
  }

  cargarMedicos(){
    this.medicos_s.cargarMedicos()
      .subscribe( resp => {
        this.cargando = false
        this.medicosTemp = resp
        this.medicos = resp
      })
  }

  abrirModalImg(medico: Medico){
    this.modal_s.abrirModal('medicos', medico._id,medico.img)
  }

  buscar(termino: string){
    
    if (termino.length === 0) {
      return this.medicos = this.medicosTemp
    }
    this.busqueda_s.buscar( 'medicos', termino)
        .subscribe(resp => {
          this.medicos = resp
          
        })
  }

  eliminarMedico( medico: Medico){
    Swal.fire({
      title: 'Borrar Medico',
      text: `Esta a punto de borrar al medico ${ medico.nombre}` ,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borralo!'
    }).then((result) => {
      if (result.value) {
        this.medicos_s.borrarMedico(medico._id).subscribe(resp => {
          
          this.cargarMedicos()
          Swal.fire(
            'Medico borrado',
            `Usuario ${medico.nombre} ha sido eliminado satisfactoriamente`,
            'success'
          );
        })
      }
    })
  }

  async abrirSweetAlert(){
    const value = await Swal.fire<string>({
      title: 'Crear Medico',
      text: 'Ingrese datos para el nuevo medico',
      input: 'text',
      inputPlaceholder: 'Nombre del hospitar',
      showCancelButton: true
      
    })
  }

}
