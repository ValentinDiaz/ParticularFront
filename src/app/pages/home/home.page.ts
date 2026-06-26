import { Component, OnInit, HostListener,ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
  IonSpinner, IonFooter, IonGrid, IonRow, IonCol, IonText, IonItemDivider } from '@ionic/angular/standalone';
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
  star,
  ticketOutline,
  trashOutline,
  searchOutline,
  chatbubblesOutline,
  chatbubblesSharp,
  starOutline,
  closeCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  trophy,
  arrowForward,
  bookOutline,
  cashOutline,
  logoInstagram,
  logoFacebook,
  logoWhatsapp,
  mailOutline
} from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Platform, AlertController } from '@ionic/angular';
import { ProfesoresService } from 'src/app/services/profesores.service';
import { Profesor } from 'src/app/interfaces/profesor.interface';
import { Materia } from 'src/app/interfaces/materia.interface';
import { MateriasService } from 'src/app/services/materias.service';
import { ProfesoresComponent } from 'src/app/componentes/profesores/profesores.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonItemDivider, IonText, IonCol, IonRow, IonGrid, IonFooter, 
    IonSpinner,
    IonIcon,
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
    ProfesoresComponent,
  ],
})
export class HomePage implements OnInit {
  materiasDestacadas: Materia[] = [];
  mejoresProfesores: Profesor[] = [];
  profesoresMateria: Profesor[] = [];
  materiaSeleccionada: Materia | null = null;
  loadingMaterias: boolean = true;
  loadingProfesores: boolean = true;
    currentSlide = 0;
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;
  @ViewChild('leftArrow') leftArrow!: ElementRef;
  @ViewChild('rightArrow') rightArrow!: ElementRef;
  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform,
    private alertCtrl: AlertController,
    private profesoresService: ProfesoresService,
    private materiaService: MateriasService
  ) {
    this.addAllIcons();
  }

  ngOnInit(): void {
    this.profesoresService.getRankingProfesores().subscribe((profesores) => {
      this.mejoresProfesores = profesores;
      this.loadingProfesores = false;
    });

    this.materiaService.obtenerMateriasDestacadas().subscribe((materias) => {
      this.materiasDestacadas = materias;
      this.loadingMaterias = false;
    });
  }

  obtenerNombresMaterias(profesor: Profesor): string {
    return profesor.materias?.map((m) => m.nombre).join(', ') ?? '';
  }

  irABuscarProfesor() {
    this.router.navigate(['/buscar-profesor']);
  }

  addAllIcons() {
    addIcons({
      closeCircleOutline,
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
       chevronBackOutline,
    chevronForwardOutline,
    trophy,
    bookOutline,
    arrowForward,
    cashOutline,
    logoInstagram, 
      logoFacebook, 
      logoWhatsapp, 
      mailOutline
    });
  }

  cerrarSeccionProfesores() {
    this.materiaSeleccionada = null;

    // Scroll de vuelta a las materias
    setTimeout(() => {
      const elemento = document.querySelector('.seccion-materias');
      elemento?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  verProfesoresMateria(materia: any) {
    if(this.materiaSeleccionada == materia ){
      this.cerrarSeccionProfesores();
      return;
    }
    this.materiaSeleccionada = materia;
    // Scroll suave a la sección de profesores
    setTimeout(() => {
      const elemento = document.querySelector('.seccion-profesores-materia');
      elemento?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  seleccionarProfesor(profesor: Profesor) {
    this.router.navigate(['/perfil-profesor', profesor.id]);

  }

    ngAfterViewInit() {
    this.updateArrowsState();
    this.carouselContainer.nativeElement.addEventListener('scroll', () => {
      this.updateArrowsState();
      this.updateCurrentSlide();
    });
  }

  scrollCarousel(direction: 'left' | 'right') {
    const container = this.carouselContainer.nativeElement;
    const cardWidth = 280 + 24; // ancho de card + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollToSlide(index: number) {
    const container = this.carouselContainer.nativeElement;
    const cardWidth = 280 + 24;
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
  }

  updateArrowsState() {
    const container = this.carouselContainer.nativeElement;
    const isAtStart = container.scrollLeft <= 0;
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

    // Deshabilitar flechas según posición
    if (this.leftArrow) {
      this.leftArrow.nativeElement.disabled = isAtStart;
    }
    if (this.rightArrow) {
      this.rightArrow.nativeElement.disabled = isAtEnd;
    }
  }

  updateCurrentSlide() {
    const container = this.carouselContainer.nativeElement;
    const cardWidth = 280 + 24;
    this.currentSlide = Math.round(container.scrollLeft / cardWidth);
  }
}
