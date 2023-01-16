
import { InfoService } from '../../services/info.service';
import { Component, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import libro from '../../interfaces/test.interface';

import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-list-reg',
  templateUrl: './list-reg.page.html',
  styleUrls: ['./list-reg.page.scss'],
})
export class ListRegPage implements OnInit {

data:libro[] = [];
  loadingController: any;
  constructor(private infoService:InfoService, private alertController: AlertController, private router: Router,private authService: AuthService, ) { }

  ngOnInit(): void{
    this.getbook();


    }


    getbook(){
      this.infoService.getbook().subscribe(libro=> {
        console.log(libro.name);
        this.data = libro;

      }
      );
    }


    async deletebook(libro: libro) {
      const response = await this.infoService.deletebook(libro);
    

    }

  

    async logout() {
      await this.authService.logout();
      this.router.navigateByUrl('/', { replaceUrl: true });
    }





}
