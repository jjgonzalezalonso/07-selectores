import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interfaces';
import { tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {
  constructor(private fb: FormBuilder, private paisesService: PaisesService) { }
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] | null= [];
  
  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(region => {
          //console.log(region)
          this.miFormulario.get('pais')?.reset(''); //borro el campo pais
          this.miFormulario.get('frontera')?.disable();
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
      });
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.fronteras=[];
          this.miFormulario.get('frontera')?.reset(''); //borro el campo pais
          this.miFormulario.get('frontera')?.enable();
        }),
        switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap(pais => this.paisesService.getPaisesPorCodigos(pais? pais[0]?.borders:[]))
      )
      .subscribe(paises => {
        console.log(paises);
        if (paises.length > 0){
            this.fronteras=paises;
        } else {
           this.fronteras=[];
        }
      })

  }

  // ngOnInit(): void {
  //       this.regiones= this.paisesService.regiones;
  //       this.miFormulario.get('region')?.valueChanges.subscribe(region => {
  //         console.log(region)
  //         this.miFormulario.get('pais')?.reset('');
  //         this.paisesService.getPaisesPorRegion(region)
  //           .subscribe(paises => {
  //               this.paises=paises.sort((a,b)=>{
  //                 if (a.name.common > b.name.common) return 1;
  //                 if (a.name.common < b.name.common) return -1;
  //                 return 0;
  //               })
  //               console.log(paises)})
  //       });
  // }

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  })

  guardar() {
    console.log(this.miFormulario.value);
  }
}
