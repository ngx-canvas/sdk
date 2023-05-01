import { Title } from '@angular/platform-browser'
import { OnInit, Component, OnDestroy } from '@angular/core'

@Component({
  selector: 'donate-page',
  styleUrls: ['./donate.page.scss'],
  templateUrl: './donate.page.html'
})

export class DonatePage implements OnInit, OnDestroy {
  constructor (private readonly title: Title) { }

  ngOnInit (): void {
    this.title.setTitle('NGXCANVAS | DONATE')
  }

  ngOnDestroy (): void { }
}
