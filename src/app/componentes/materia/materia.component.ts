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
  IonCardContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';


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
} from 'ionicons/icons';

@Component({
  selector: 'app-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonIcon, IonCardContent, IonCol, IonCard, IonRow, IonGrid],
})
export class MateriaComponent implements OnChanges {
  @Input() areaSeleccionada: Area | null = null;
  @Input() nivelSeleccionado: Nivel | null = null;
  @Output() materiaSeleccionadaChange: EventEmitter<Materia> =
    new EventEmitter<Materia>();
  @Input() materiaSeleccionada: Materia | null = null;
  loadingMaterias: boolean = true;

  materias: Materia[] = [];

  constructor(private materiaService: MateriasService) {
    this.addAllIcons();
  }

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
        .subscribe((data) => {
          this.materias = data;
          this.loadingMaterias = false;
        });
    }
  }

  seleccionarMateria(materia: Materia) {
    this.materiaSeleccionada = materia;
    this.materiaSeleccionadaChange.emit(this.materiaSeleccionada);
  }


    addAllIcons() {
      addIcons({
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
