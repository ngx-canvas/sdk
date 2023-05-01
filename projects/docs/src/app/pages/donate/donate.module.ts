/* --- PAGES --- */
import { DonatePage } from './donate.page'

/* --- MODULES --- */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  {
    path: '',
    component: DonatePage
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DonatePage
  ]
})

export class DonatePageModule { }
