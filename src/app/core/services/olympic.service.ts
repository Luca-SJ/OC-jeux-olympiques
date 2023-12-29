import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);
  items: Olympic[] = [];
  country: string[] = [];
  nbrJO: number[] = [];
  olympicObservable: any;

  constructor(private http: HttpClient) { }

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getCountrys() {
    return this.olympics$.asObservable()
      .pipe(
        map(items => {
          if (items.length > 0) {
            return items.map((item: { country: string; }) => item.country);
          } else {
            return undefined;
          }
        })
      )
  }

  getMedalsPerCountry(countryName?: String) {
    return this.olympics$.asObservable()
      .pipe(
        map(items => {
          if (items.length > 0) {
            if (countryName !== undefined) {
              items = items.filter(
                i => i.country.toString() === countryName
              )
            }


            const participations = items.map((item: { participations: Participation[]; }) => item.participations);
            let nbrMedailles: number[] = [];
            let nbrAthlete: number[] = [];
            const nbrJOarray: number[] = [];
            const mapYear = new Map();


            participations.forEach((participation: { medalsCount: number;athleteCount: number; }[]) => {
              const medailles = participation.map((item: { medalsCount: number; }) => item.medalsCount);
              const athlete = participation.map((item: { athleteCount: number; }) => item.athleteCount);

              const sumWithInitial = medailles.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              );
              
              if (countryName !== undefined) {
                nbrMedailles = nbrMedailles.concat(medailles);
                nbrAthlete = nbrAthlete.concat(athlete);
              } else {
                nbrMedailles.push(sumWithInitial);
              }

              
            });

            participations.forEach((participation: { year: number; }[]) => {
              const jo = participation.map((item: { year: number; }) => item.year);

              jo.forEach(element => {
                nbrJOarray.push(element);
              });

              this.nbrJO = [...new Set(nbrJOarray)];

            });

            return [nbrMedailles, this.nbrJO, nbrAthlete];
          } else {
            return undefined;
          }
        })
      )
  }
}
