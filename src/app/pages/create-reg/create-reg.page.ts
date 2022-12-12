
import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, NumericValueAccessor } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AvatarService } from '../../services/avatar.service';
import { Storage} from '@angular/fire/storage';
import {Geolocation} from '@capacitor/geolocation';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InfoService } from '../../services/info.service';
import { doc, docData, Firestore, updateDoc, setDoc, collection } from '@angular/fire/firestore';
import Info from '../../interfaces/infor.interface';


@Component({
	selector: 'app-create',
	templateUrl: 'create-reg.page.html',
	styleUrls: ['create-reg.page.scss']
})
export class CreateRegPage implements OnInit {

  public formulario: FormGroup;
	profile = null;
  lat :any;
  lng :any;
  infor:Info[];
  user = this.auth.currentUser;
  date = new Date();
  image :any;


  ngOnInit() {

    }

	constructor(
		private avatarService: AvatarService,
		private authService: AuthService,
		private router: Router,
		private loadingController: LoadingController,
    private firestore: Firestore,
    private auth: Auth,
    private infoService: InfoService,
    private FormBuilder: FormBuilder,
    private storage: Storage,
		private alertController: AlertController
	) {
		this.avatarService.getUserProfile().subscribe((data) => {
		this.profile = data;
		});

    this.formulario = new FormGroup({
        name: new FormControl(),
        lastname: new FormControl(),
        cedula: new FormControl(),
        number: new FormControl(),
        lat: new FormControl( {value: this.lat, disabled: true}),
        lng: new FormControl( {value: this.lng, disabled: true}),
        user: new FormControl({value: this.user.email, disabled: true}),
        date: new FormControl({value: this.date, disabled: true}),
        image : new FormControl(),
        //image: new FormControl()
      });
	}

	async changeImage() {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: false,
			resultType: CameraResultType.Base64,
			source: CameraSource.Prompt // Camera, Photos or Prompt!
		});

		if (image) {
			const loading = await this.loadingController.create();
			await loading.present();

			const result = await this.avatarService.uploadImage(image);
			loading.dismiss();

			if (!result) {
				const alert = await this.alertController.create({
					header: 'Upload failed',
					message: 'There was a problem uploading your avatar.',
					buttons: ['OK']
				});
				await alert.present();
			}
		}
	}

  getUserProfile() {
		const user = this.auth.currentUser;
		const userDocRef = doc(this.firestore, `${user.uid}`);
		return docData(userDocRef, { idField: 'id' });

	}
  async onSubmit() {
    const loading = await this.loadingController.create();
    const user = this.auth.currentUser;
    const coordinates = await Geolocation.getCurrentPosition();

    const image = await Camera.getPhoto({
			quality: 90,
			allowEditing:true,
			resultType: CameraResultType.Base64,
			source: CameraSource.Prompt // Camera, Photos or Prompt!
		});
    if (image) {
			const loading = await this.loadingController.create();
			await loading.present();

				const result = await this.avatarService.uploadImage(image);
			loading.dismiss();

			if (!result) {
				const alert = await this.alertController.create({
					header: 'Upload failed',
					message: 'There was a problem uploading your avatar.',
					buttons: ['OK']
				});
				await alert.present();
			}
		}

      this.formulario.value.user =  user.email;
      this.formulario.value.date = this.date.getDate() + "/" + (this.date.getMonth() +1) + "/" + this.date.getFullYear();
      this.formulario.value.lat = this.lat;
      this.formulario.value.lng = this.lng;
      const {formulario} = this.formulario.value;
      try{
        if(this.formulario.value.name== "" || this.formulario.value.lastname == "" || this.formulario.value.cedula== ""||this.formulario.value.number== "" ) {
        const alert = await this.alertController.create({
          header: 'Alerta',
          message: 'Debe ingresar todos los parametros para continuar',
          buttons: ['OK']
        });
      }
        else{
       await this.infoService.addInfo(this.formulario.value, image ).then(() => {

        console.log('Informacion agregada');

        loading.dismiss().then(() => {
          this.formulario.reset();
          this.formulario.value.lat ='';
          this.formulario.value.lng ='';

        });
        this.router.navigate (['/list-reg']);
        });
      }
      } catch (error) {

        console.error(error);
      }

    }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.lat = coordinates.coords.latitude;
    this.lng = coordinates.coords.longitude;
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `coord/collection${user.uid}`);
    await setDoc(userDocRef, {
      lat: this.lat,
      lng: this.lng
    });


  }

	async logout() {
		await this.authService.logout();
		this.router.navigateByUrl('/', { replaceUrl: true });
	}


}


