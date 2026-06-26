import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { 
  ImageCropperComponent, 
  ImageCroppedEvent, 
  LoadedImage 
} from 'ngx-image-cropper';

@Component({
  selector: 'app-cropper-modal',
  standalone: true, // Importante: Standalone true
  imports: [
    CommonModule, 
    IonicModule, 
    ImageCropperComponent // Importante: Importar el componente de la librería aquí
  ],
  template: `
    <ion-header>
      <ion-toolbar color="dark">
        <ion-buttons slot="start">
          <ion-button (click)="cancelar()">Cancelar</ion-button>
        </ion-buttons>
        <ion-title>Ajustar Foto</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="confirmar()" [strong]="true" color="primary">
            Listo
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-black">
      <div class="cropper-wrapper">
        <image-cropper
          [imageChangedEvent]="imageChangedEvent"
          [maintainAspectRatio]="true"
          [aspectRatio]="1 / 1"
          format="png"
          [resizeToWidth]="500"
          (imageCropped)="imageCropped($event)"
          (imageLoaded)="imageLoaded($event)"
          (cropperReady)="cropperReady()"
          (loadImageFailed)="loadImageFailed()"
          [backgroundColor]="'#000000'"
        ></image-cropper>
      </div>

      <div class="instructions">
        <p>Usá dos dedos para hacer zoom y arrastrá para acomodar.</p>
      </div>
    </ion-content>
  `,
  styles: [`
    /* Estilos para que el fondo sea negro y el editor se centre */
    .bg-black {
      --background: #000000;
    }

    .cropper-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80%; /* Ocupa gran parte de la pantalla */
      width: 100%;
      background-color: black;
    }

    .instructions {
      text-align: center;
      color: #aaaaaa;
      padding: 10px;
      font-size: 0.9rem;
    }
  `]
})
export class CropperModalComponent {
  // Recibimos el evento del input file desde el componente padre
  @Input() imageChangedEvent: any = '';

  croppedImage: any = '';
  blobImage: Blob | null | undefined;

  constructor(private modalCtrl: ModalController) {}

  // Se ejecuta cada vez que mueves el recorte
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl || event.base64;
    this.blobImage = event.blob; // Guardamos el Blob para enviarlo al backend
  }

  imageLoaded(image: LoadedImage) {
    // La imagen se cargó correctamente en el editor
    console.log('Imagen cargada');
  }

  cropperReady() {
    // El editor está listo
  }

  loadImageFailed() {
    // Hubo un error (ej. archivo corrupto)
    console.error('Error al cargar imagen');
    this.cancelar(); // Cerramos si falla
  }

  confirmar() {
    // Devolvemos los datos al padre (blob para subir, preview para mostrar)
    this.modalCtrl.dismiss({
      blob: this.blobImage,
      preview: this.croppedImage
    });
  }

  cancelar() {
    this.modalCtrl.dismiss(null);
  }
}