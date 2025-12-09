import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Area } from 'src/app/interfaces/area.interface';
import { Nivel } from 'src/app/interfaces/nivel.interface';
import { MateriasService } from 'src/app/services/materias.service';
import { IonRow, IonCard, IonGrid, IonCol, IonCardContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  standalone: true,
  imports: [IonCardContent, IonCol, IonGrid, IonRow, IonCard],
})
export class AreaComponent implements OnChanges {
  @Output() areaSeleccionadaChanges : EventEmitter<Area> = new EventEmitter<Area>
  @Input() nivelSeleccionado: Nivel | null = null;
  areaSeleccionada : Area | null = null;

  constructor(private materiaService: MateriasService) {}
  areas: Area[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nivelSeleccionado'] && this.nivelSeleccionado) {
      this.materiaService
        .obtenerAreasPorNivel(this.nivelSeleccionado.id)
        .subscribe((data) => (this.areas = data));
    }
  }

  seleccionarArea(area:Area){
    this.areaSeleccionada= area;
    this.areaSeleccionadaChanges.emit(this.areaSeleccionada);
  }
  

 
}
