import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc, collection, addDoc, collectionData, deleteDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import Info from '../interfaces/infor.interface';

import { Photo } from '@capacitor/camera';


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

  getInfo(): Observable<any> {

  const user = this.auth.currentUser;
  const userInfoRef = collection(this.firestore, `info`);
  return collectionData(userInfoRef, { idField: 'id' }) as Observable<Info[]>;


  }


  deleteInfo(info: Info) {
      const placeinfoRef = doc(this.firestore, `info/${info.id}`);
      return deleteDoc(placeinfoRef);
  }



}













