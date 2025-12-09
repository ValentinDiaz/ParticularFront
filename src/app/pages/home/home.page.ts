import { Component, OnInit, HostListener } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Platform, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonButtons,
    IonRouterLink,
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonButton,
    IonList,
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
    IonCardTitle,
    CommonModule,
    CommonModule,
    IonCardSubtitle,
    IonMenuButton,
  ],
})
export class HomePage implements OnInit {
  private backButtonSubscription: any;
  mejoresProfesores: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {

  }

  




  irABuscarProfesor() {
    this.router.navigate(['/buscar-profesor']);
  }

 
}
