import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  constructor(private http: HttpClient) { }

  private baseUrl: string = 'https://restcountries.com/v3.1';
  private _regiones: string[] = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
  //en javascript todo pasa por referencia, por eso pongo private

  get regiones() {
    return [...this._regiones];
    // se pone así para que no se pueda manipular _regiones
  }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    //recibe la region. Retorna un observable del tipo PaisSmall, es un array
    const url: string = `${this.baseUrl}/region/${region}?fields=name,cca3`
    return this.http.get<PaisSmall[]>(url);
  }
  
  getPaisPorCodigo( codigo: string ): Observable<Pais[] | null> {
    if (!codigo){
      return of(null)  
      //retornamos un nuevo observable mediante el of (de rxjs) que emite null
    }
    const url = `${ this.baseUrl }/alpha/${ codigo }`;
    return this.http.get<Pais[]>( url );  //retorna TODOS los campos del pais
  }

  getPaisPorCodigoSmall( codigo: string ): Observable<PaisSmall> {
    //por cada pais retorna su cca3 y su name (tipo PaisSmall)
    const url = `${ this.baseUrl }/alpha/${ codigo }?fields=cca3,name`;
    return this.http.get<PaisSmall>( url ); 
  }

  getPaisesPorCodigos( borders: string[] ): Observable<PaisSmall[]> {
  //Recibe un array, llamado borders, con todos los 
    if ( !borders ) {
      return of([]); //retornamos un nuevo observable  vacio.
    }
    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push( peticion );
    });
    //para que se ejecuten, podríamos poner peticiones[0].subscribe(), peticiones[1].subscribe()
    //mediante el operador combineLaster(rxjs) podemos disparar todas las peticiones
    //de manera simultanea
    return combineLatest( peticiones );
  }

}
