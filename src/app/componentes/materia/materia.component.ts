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
import { Materia } from 'src/app/interfaces/materia.interface';
import { Nivel } from 'src/app/interfaces/nivel.interface';
import { MateriasService } from 'src/app/services/materias.service';
import {
  IonGrid,
  IonRow,
  IonCard,
  IonCol,
  IonCardContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss'],
  standalone: true,
  imports: [IonCardContent, IonCol, IonCard, IonRow, IonGrid],
})
export class MateriaComponent implements OnChanges {
  @Input() areaSeleccionada: Area | null = null;
  @Input() nivelSeleccionado: Nivel | null = null;
  @Output() materiaSeleccionadaChange: EventEmitter<Materia> =
    new EventEmitter<Materia>();
  @Input() materiaSeleccionada: Materia | null = null;

  materias: Materia[] = [];

  constructor(private materiaService: MateriasService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['areaSeleccionada'] &&
      this.areaSeleccionada &&
      changes['nivelSeleccionado'] &&
      this.nivelSeleccionado
    ) {
      this.materiaService
        .obtenerMateriaPorAreaYNivel(
          this.areaSeleccionada.id,
          this.nivelSeleccionado.id
        )
        .subscribe((data) => (this.materias = data));
    }
  }

  seleccionarMateria(materia: Materia) {
    this.materiaSeleccionada = materia;
    this.materiaSeleccionadaChange.emit(this.materiaSeleccionada);
  }
}
