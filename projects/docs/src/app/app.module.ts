import { NgModule, isDevMode } from '@angular/core'

/* --- MODULES --- */
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
import { MatToolbarModule } from '@angular/material/toolbar'
import { ServiceWorkerModule } from '@angular/service-worker'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

/* --- COMPONENTS --- */
import { AppComponent } from './app.component'

@NgModule({
  imports: [
    BrowserModule,
    MatToolbarModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent
  ]
})

export class AppModule { }
