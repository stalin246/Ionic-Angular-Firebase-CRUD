import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc, collection, addDoc, collectionData, deleteDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import Info from '../interfaces/infor.interface';
import libro from '../interfaces/test.interface';
import { Photo } from '@capacitor/camera';
import { updateDoc } from 'firebase/firestore';


@Injectable({

providedIn: 'root'
})
export class InfoService {
  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage) {}

addInfo (info: Info, cameraFile: Photo ) {
    const user = this.auth.currentUser;
		const path = `uploads/${user.uid}/image.webp`;

		const storageRef = ref(this.storage, path);
    console.log(storageRef.name);
    try{

    uploadString(storageRef, cameraFile.base64String, 'base64');
    const image =  getDownloadURL(storageRef);
    const userInfoRef = collection(this.firestore, `info`);

    return addDoc(userInfoRef, info, );

  } catch (e) {
    return null;
  }





  }
  addbook (libro: libro){
    const bookref= collection(this.firestore,"libro")
    return addDoc(bookref, libro);
    
  }

  
  getbook(): Observable<any> {

    const user = this.auth.currentUser;
    const bookref = collection(this.firestore, `libro`);
    return collectionData(bookref, { idField: 'id' }) as Observable<Info[]>;
  
  
    }

  deletebook(libro: libro) {
      const bookref = doc(this.firestore, `libro/${libro.id}`);
      return deleteDoc(bookref);
  }

  updatebook(id: string, libro: any) {
    const libroRef = doc(this.firestore, `info/${id}`);
    return updateDoc(libroRef, libro);
  
  
  }
  
  
  idInfo(libro: libro) {
    const libroRef = doc(this.firestore, `libro/${libro.id}`);
    
    return libroRef;
  }


  
  // getbookfire(libro: libro) { 
  //   let idbook = libro.id;
  //   this.firestore= this.firestore.doc
  // }

}













