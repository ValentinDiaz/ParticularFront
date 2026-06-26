import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { addIcons } from 'ionicons';
import {
  add,
  arrowBackOutline,
  bagHandle,
  bagHandleOutline,
  bagHandleSharp,
  documentLockOutline,
  documentLockSharp,
  homeOutline,
  homeSharp,
  informationCircleOutline,
  informationCircleSharp,
  keyOutline,
  keySharp,
  locationOutline,
  locationSharp,
  logInSharp,
  logOutOutline,
  logOutSharp,
  personOutline,
  personSharp,
  remove,
  schoolOutline,
  schoolSharp,
  ticketOutline,
  trashOutline,
  searchOutline,
  chatbubblesOutline,
  chatbubblesSharp,
  starOutline,
  star,
  albumsOutline,
} from 'ionicons/icons';
import { Area } from 'src/app/interfaces/area.interface';
import { Nivel } from 'src/app/interfaces/nivel.interface';
import { MateriasService } from 'src/app/services/materias.service';
import { IonRow, IonCard, IonGrid, IonCol, IonCardContent, IonIcon, IonSpinner } from "@ionic/angular/standalone";

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonIcon, IonCardContent, IonCol, IonGrid, IonRow, IonCard],
})
export class AreaComponent implements OnChanges {
  @Output() areaSeleccionadaChanges : EventEmitter<Area> = new EventEmitter<Area>
  @Input() nivelSeleccionado: Nivel | null = null;
  areaSeleccionada : Area | null = null;
  loadingAreas: boolean = true;
 areas: Area[] = [];
  constructor(private materiaService: MateriasService) {
    this.addAllIcons();
  }
 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nivelSeleccionado'] && this.nivelSeleccionado) {
      this.materiaService
        .obtenerAreasPorNivel(this.nivelSeleccionado.id)
        .subscribe((data) => {
          this.areas = data;
          this.loadingAreas = false;
        });
    }
  }

  seleccionarArea(area:Area){
    this.areaSeleccionada= area;
    this.areaSeleccionadaChanges.emit(this.areaSeleccionada);
  }
   addAllIcons() {
        addIcons({
          albumsOutline,
          star,
          bagHandleOutline,
          bagHandle,
          bagHandleSharp,
          trashOutline,
          add,
          remove,
          arrowBackOutline,
          ticketOutline,
          locationOutline,
          homeOutline,
          homeSharp,
          informationCircleOutline,
          informationCircleSharp,
          documentLockOutline,
          documentLockSharp,
          logOutOutline,
          logOutSharp,
          personOutline,
          personSharp,
          locationSharp,
          keyOutline,
          keySharp,
          logInSharp,
          schoolOutline,
          schoolSharp,
          chatbubblesOutline,
          chatbubblesSharp,
          searchOutline,
          starOutline,
        });
      }

 
}
