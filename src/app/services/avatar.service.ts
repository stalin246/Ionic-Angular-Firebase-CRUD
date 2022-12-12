import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';


@Injectable({
	providedIn: 'root'
})
export class AvatarService {
	constructor(private auth: Auth, private firestore: Firestore, private storage: Storage) {}

	getUserProfile() {
		const user = this.auth.currentUser;
		const userDocRef = doc(this.firestore, `users/${user.uid}`);
		return docData(userDocRef, { idField: 'id' });
	}

	async uploadImage(cameraFile: Photo) {
		const user = this.auth.currentUser;
		const path = `uploads/${user.uid}/profile.webp`;
		const storageRef = ref(this.storage, path);

		try {
			await uploadString(storageRef, cameraFile.base64String, 'base64');

			const imageUrl = await getDownloadURL(storageRef);

			const userDocRef = doc(this.firestore, `users/${user.uid}`);
			await setDoc(userDocRef, {
				imageUrl
			});
			return true;
		} catch (e) {
			return null;
		}
	}
	async uploadImagel(cameraFile: Photo) {
		const user = this.auth.currentUser;
		
		const path = `casas/${user.uid}/profile.webp`;
		const storageRefl = ref(this.storage, path);
	
		try {
			await uploadString(storageRefl, cameraFile.base64String, 'base64');

			const image = await getDownloadURL(storageRefl);
			console.log(image);
			
			const userDocRef = doc(this.firestore, `info/${doc.name}`);
			console.log(userDocRef);
			await setDoc(userDocRef, {
				image
			});
			return true;
		} catch (e) {
			return null;
		}
	}



}
