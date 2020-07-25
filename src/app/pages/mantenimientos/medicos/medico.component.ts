import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public hospitales: Hospital[] = []
  public medicoForm: FormGroup
  public hospitalSeleccionado: Hospital;
  public medico_id: string;
  public medicoSeleccionado: Medico;
  constructor(private fb: FormBuilder,
              private hosp_s: HospitalService,
              private medico_s: MedicoService,
              private router: Router,
              private route: ActivatedRoute) { 
                this.medico_id =  this.route.snapshot.params.id
                if (this.medico_id === 'nuevo') {
                  this.medico_id = undefined
                }
              }

  ngOnInit(): void {


    this.medicoForm = this.fb.group({
      nombre: ['',Validators.required],
      hospital: ['',Validators.required]
    })

    
    
    this.cargarHospitales()
    

    this.medicoForm.get('hospital').valueChanges
        .subscribe( id => {
          this.hospitalSeleccionado = this.hospitales.find( hospital => hospital._id === id)})
        
  }

  cargarHospitales(){
    this.hosp_s.cargarHospitales()
        .subscribe(resp => {
          this.hospitales = resp
          this.verificarMedico()
        })
  }

  guardarMedico() {
    const {nombre} = this.medicoForm.value
    this.medico_s.crearMedico(this.medicoForm.value)
      .subscribe( (resp:any) => {
        this.medico_id = resp.medico._id
        this.verificarMedico()
        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
        Swal.fire("Medico creado", `${nombre} creado exitosamente`,'success');
      })
    
  }

  verificarMedico(){
    if(this.medico_id){
      this.medico_s.cargarMedicos()
        .subscribe((medicos: Medico[]) => {
              this.medicoSeleccionado = medicos.find( med => med._id === this.medico_id)
              this.hospitalSeleccionado = this.hospitales.find( hospital => hospital._id === this.medicoSeleccionado.hospital._id)
              this.medicoForm.setValue({nombre: this.medicoSeleccionado.nombre, hospital: this.hospitalSeleccionado._id})
            })
    }
  }

  actualizarMedico(){
    this.medico_s.actualizarMedico(this.medicoForm.value,this.medico_id)
      .subscribe( resp => Swal.fire("Medico Actualizado", '','success'))
  }
}
