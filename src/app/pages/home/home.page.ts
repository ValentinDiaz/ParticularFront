import { Component, OnInit } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
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
  ],
})
export class HomePage implements OnInit {
  mejoresProfesores: any;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  irABuscarProfesor() {
    this.router.navigate(['/buscar-profesor']);
  }

  onLogout() {
    this.authService.logOut().subscribe(() => {
      this.router.navigate(['/login']); // redirigir a login
    });
  }
}
