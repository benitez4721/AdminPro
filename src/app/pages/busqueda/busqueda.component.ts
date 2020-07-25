import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from '../../models/usuario.model';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public termino: string
  public usuarios: Usuario[] = []
  public medicos: Medico[] = []
  public hospitales: Hospital[] = []
  constructor( private route: ActivatedRoute,
               private router: Router,
               private busqueda_s: BusquedasService ) { }

  ngOnInit(): void {
    // this.termino = this.route.snapshot.params.termino
    // console.log(this.termino);
    // this.router.navigateByUrl('/dashboard/buscar/hola')

    this.route.params.subscribe( resp => this.busquedaGlobal(resp.termino)
    )

    
  }

  busquedaGlobal( termino: string){
    this.busqueda_s.busquedaGlobal(termino).subscribe( (resp:any) => {

      this.usuarios = resp.usuarios
      this.medicos = resp.medicos
      this.hospitales = resp.hospitales

    })
  }

}
