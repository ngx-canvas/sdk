/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* --- COMPONENTS --- */
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule
    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {}