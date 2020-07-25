import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  private img$: Subscription;
  public hospitales: Hospital[] = [];
  public hospitalTemp: Hospital[] = []
  public cargando: boolean = true
  constructor( private hospital_s: HospitalService,
               private modal_s: ModalImagenService,
               private busqueda_s: BusquedasService) { }

  ngOnInit(): void {
    this.cargarHospitales()
    this.img$ = this.modal_s.nuevaImagen
                .pipe(
                  delay(100)
                )
                .subscribe( resp => this.cargarHospitales())
                

  }

  ngOnDestroy(): void {
    this.img$.unsubscribe()
  }

  cargarHospitales() {
    this.hospital_s.cargarHospitales()
      .subscribe( resp => {
        this.cargando = false;  
        this.hospitales = resp;
        this.hospitalTemp = resp;
        })
  }

  crearHospital(){

  }

  guardarCambios( hospital: Hospital){

    this.hospital_s.actualizarHospital(hospital._id,hospital.nombre).subscribe(resp => {
      Swal.fire('Actualizado',hospital.nombre,'success')
    })

  }

  eliminarHospital( hospital: Hospital){
    this.hospital_s.borrarHospital( hospital._id).subscribe( resp => {
      Swal.fire('Eliminado',hospital.nombre,'success')
    })
  }

  async abrirSweetAlert() {
    const {value = ''} = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospitar',
      showCancelButton: true
      
    })
    if( value.trim().length > 0 ) {
      this.hospital_s.crearHospital( value )
        .subscribe( (resp:any) => {
         this.hospitales.push( resp.hospital)
        })
    }

  }
  
  abrirModal( hospital: Hospital){
    this.modal_s.abrirModal('hospitales',hospital._id,hospital.img)      
  }

  buscar( termino: string){
    
    if (termino.length === 0) {
      return this.hospitales = this.hospitalTemp
    }
    this.busqueda_s.buscar( 'hospitales', termino)
        .subscribe(resp => {
          this.hospitales = resp
        })
  }
  

}
