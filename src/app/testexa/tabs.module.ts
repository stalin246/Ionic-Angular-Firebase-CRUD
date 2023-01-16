import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsPageRoutingModule } from './tabs-routing.module';

import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['create-reg']);

import { TabsPage } from './tabs.page';
import { CreateRegPageModule } from '../pages/create-reg/create-reg.module';
import { ToastrModule } from 'ngx-toastr';
const routes: Routes =[{


  path: '',
  component: TabsPage,
  children:[
    {
      path: 'create-reg',
      loadChildren: () => import('../pages/create-reg/create-reg.module').then((m) => m.CreateRegPageModule),
		...canActivate(redirectUnauthorizedToLogin)

    },
    {
    path: 'list-reg',
    loadChildren: () => import('../pages/list-reg/list-reg.module').then( (m) => m.ListRegPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  }
  ]

}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    ToastrModule.forRoot()
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}


