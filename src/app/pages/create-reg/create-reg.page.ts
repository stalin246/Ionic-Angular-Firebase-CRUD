
import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, LoadingController} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AvatarService } from '../../services/avatar.service';

import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InfoService } from '../../services/info.service';
import { ActivatedRoute } from '@angular/router';

import { doc, docData, Firestore} from '@angular/fire/firestore';
import Info from '../../interfaces/infor.interface';
import libro from '../../interfaces/test.interface';



@Component({
	selector: 'app-create',
	templateUrl: 'create-reg.page.html',
	styleUrls: ['create-reg.page.scss']
})
export class CreateRegPage implements OnInit {

  public formulario: FormGroup;
  bookform: FormGroup;

	profile = null;
  infor:Info[];
  libro:libro[];
  user = this.auth.currentUser;
  date = new Date();
  image :any;
  id: string | null;
  text = 'add';

  ngOnInit() {
      this.updatelibro();
    }

	constructor(
		private avatarService: AvatarService,
		private authService: AuthService,
		private router: Router,
		private loadingController: LoadingController,
    private firestore: Firestore,
    private auth: Auth,
    private infoService: InfoService,
  
    private aRoute: ActivatedRoute,

		private alertController: AlertController
	) {

      this.bookform = new FormGroup({
        titulo: new FormControl(),
        descripcion: new FormControl(),
        autor: new FormControl(),
        precio: new FormControl(),

      });
      this.id = this.aRoute.snapshot.paramMap.get('id');
      console.log(this.id)

	}


  getUserProfile() {
		const user = this.auth.currentUser;
		const userDocRef = doc(this.firestore, `${user.uid}`);
		return docData(userDocRef, { idField: 'id' });
	}

  async enviar(){

    // console.log(this.bookform.value)
    // const response = await this.infoService.addbook(this.bookform.value);
    // this.enviar();
    

    // console.log(response);
    if (this.formulario.invalid) { 
      return; 
    } 
   
    if (this.id == null) { 
      this.enviar(); 
      alert('Registro agregado correctamente'); 
    }else { 
      
      
    }
  
  }
  



	async logout() {
		await this.authService.logout();
		this.router.navigateByUrl('/', { replaceUrl: true });
	}
  editarbook(){
    this.infoService.updatebook(this.id, this.bookform.value).then(() => {
      alert('Registro actualizado correctamente');
      this.router.navigate(['/list-reg']);
    });
  }
  updatelibro(){
    if(this.id !== null){
      this.text = 'Actualizar';
      this.infoService.getbook().subscribe(libro =>{
        this.libro = libro;
        this.libro.forEach(element => {
          console.log(this.id);
          if(element.id == this.id){
            this.bookform.setValue({
              materia: element.titulo,
              docente: element.descripcion,
              aula: element.autor,
              horas: element.precio,
           
              
            })
          }
       

        });
        
      });
    }
  }
 

}
