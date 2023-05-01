import { MatToolbar } from '@angular/material/toolbar'
import { Component, ViewChild, Renderer2, HostListener } from '@angular/core'

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

export class AppComponent {
  @ViewChild(MatToolbar, { static: true }) private readonly toolbar!: MatToolbar

  constructor (private readonly renderer: Renderer2) { }

  @HostListener('window:scroll', ['$event']) onscroll (event: any) {
    const toolbar: HTMLElement = this.toolbar._elementRef.nativeElement
    if (event.currentTarget.scrollY > 0) {
      this.renderer.addClass(toolbar, 'solid-bg')
    } else {
      this.renderer.removeClass(toolbar, 'solid-bg')
    }
  }
}
