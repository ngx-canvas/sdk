import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  {
    path: 'docs',
    loadChildren: async () => await import('./pages/docs/docs.module').then(m => m.DocsPageModule)
  },
  {
    path: 'donate',
    loadChildren: async () => await import('./pages/donate/donate.module').then(m => m.DonatePageModule)
  },
  {
    path: '**',
    redirectTo: 'docs'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
