/* --- PAGES --- */
import { CorePage } from './core/core.page';

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  {
    path: 'core',
    component: CorePage
  },
  {
    path: 'core/:section',
    component: CorePage
  },
  {
    path: 'core/:section/:subsection',
    component: CorePage
  },
  {
    path: '**',
    redirectTo: 'core'
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatRippleModule,
    MatButtonModule,
    MatSidenavModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CorePage
  ]
})

export class DocsPageModule { }
