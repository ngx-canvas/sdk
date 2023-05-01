/* --- MODULES --- */
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'

/* --- COMPONENTS --- */
import { AppComponent } from './app.component'

/* --- MATERIAL IO --- */
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatButtonModule } from '@angular/material/button'
import { MatRippleModule } from '@angular/material/core'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    MatIconModule,
    MatListModule,
    MatRippleModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatExpansionModule,
    MatButtonToggleModule,
    BrowserAnimationsModule
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }
