import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from '../core/services/olympic.service';
import { Observable, Subscription } from 'rxjs';
import Chart, { Colors, elements } from 'chart.js/auto';
import { Participation } from '../core/models/Participation';
import { Olympic } from '../core/models/Olympic';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  idCountry: string = "";
  nbrCountry: number = 0;
  nameCountry: string = "";
  medalsPerCountry: number = 0;
  athletePerCountry: number = 0;
  EntriesPerCountry: Participation[] = [];
  allYearsEntriesPerCountry: number[] = [];
  allMedalsEntriesPerCountry: number[] = [];
  nbrJOarray: number[][] = [];
  entriesPerCountry: number = 0;

  nbrJO: number[] = [];

  loaded: boolean;
  items: Olympic[] = [];
  country: string[] = [];

  olympicObservable: Subscription | undefined;

  constructor(private route: ActivatedRoute, private OlympicService: OlympicService) {
    this.loaded = false;
    this.route.queryParams.subscribe(params => {
      this.idCountry = params['country'];
    });
  }
  ngOnDestroy(): void {
    if (this.olympicObservable) {
      this.olympicObservable.unsubscribe();
    }
  }


  ngOnInit(): void {
    this.loadAllDatas();

  }

  getNbMedals(nbMedals: number[]) {
    if (nbMedals === undefined) {
      return;
    }
    const sumWithInitial = nbMedals.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );
    return sumWithInitial;
  }

  getNbAthletes(nbAthletes: number[]) {
    if (nbAthletes === undefined) {
      return;
    }
    const sumWithInitial = nbAthletes.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );
    return sumWithInitial;
  }

  loadAllDatas(): void {
    this.olympicObservable = this.OlympicService.getMedalsPerCountry(this.idCountry.toString())
      .subscribe(
        itemsMedals => {
          if (itemsMedals?.length) {
            this.nbrJOarray = itemsMedals;

            const barChart = new Chart("barCanvas2", {
              type: "line",
              data: {
                labels: itemsMedals[1],
                datasets: [{
                  label: "Nombre de médailles",
                  data: itemsMedals[0]
                }]
              },
            })
          }
        }
      );
  }
}

