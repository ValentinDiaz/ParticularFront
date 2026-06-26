import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonList,
  IonButton,
  IonCardHeader,
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonRouterLink,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonSpinner,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from '@ionic/angular/standalone';

import { IonicModule, ModalController } from '@ionic/angular';
import { Profesor } from 'src/app/interfaces/profesor.interface';

@Component({
  selector: 'app-reclamar-profesor-modal',
  templateUrl: './reclamar-profesor-modal.component.html',
  styleUrls: ['./reclamar-profesor-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ReclamarProfesorModalComponent {
  @Input() profesor: Profesor | undefined;
  @Input() usuarioId!: number;

  constructor(private modalCtrl: ModalController) {}

  async confirmar() {
    await this.modalCtrl.dismiss({ reclamado: true }); // 🔧 Devolver objeto
  }

  async cancelar() {
    await this.modalCtrl.dismiss({ reclamado: false }); // 🔧 Devolver objeto
  }
}
