import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonCol,
  IonGrid,
  IonTitle,
  IonRow,
  IonCard,
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
import { star } from 'ionicons/icons';
import { Nivel } from 'src/app/interfaces/nivel.interface';
import { MateriasService } from 'src/app/services/materias.service';
import { IaChatComponent } from "../ia-chat/ia-chat.component";

@Component({
  selector: 'app-niveles',
  templateUrl: './niveles.component.html',
  styleUrls: ['./niveles.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonIcon,
    IonCardContent,
    IonCard,
    IonRow,
    IonTitle,
    IonGrid,
    IonCol,
    IonHeader,
    IonToolbar,
    IonContent, IaChatComponent],
})
export class NivelesComponent implements OnInit {
  @Output() nivelSeleccionadoChange: EventEmitter<Nivel> = new EventEmitter<Nivel>();
  @Input() nivelSeleccionado: Nivel | null = null;
  niveles: Nivel[] = [];
  loadingNiveles: boolean = true;


  constructor(private materiaService: MateriasService) {
    this.addAllIcons();
  }

  ngOnInit() {
    this.materiaService
      .obtenerNivles()
      .subscribe((data) => {
        this.niveles = data;
        this.loadingNiveles = false;
      });
  }

  seleccionarNivel(nivel: Nivel) {
    this.nivelSeleccionado = nivel;
    this.nivelSeleccionadoChange.emit(this.nivelSeleccionado);
  }

  addAllIcons() {
      addIcons({
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
