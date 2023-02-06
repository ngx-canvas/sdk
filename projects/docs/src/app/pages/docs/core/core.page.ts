import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'core-page',
  styleUrls: ['./core.page.scss'],
  templateUrl: './core.page.html'
})

export class CorePage implements AfterViewInit {

  constructor(private http: HttpClient, private title: Title, private route: ActivatedRoute) { }

  public folders: FOLDER[] = [];

  private async load() {
    this.http.get('./assets/data.json').subscribe((data: any) => {
      this.folders = data.filter((o: any) => o.project === 'core')[0].folders;
    });
  }

  ngAfterViewInit(): void {
    this.load();

    this.title.setTitle('NGXCANVAS | CORE DOCS');

    this.route.params.subscribe((params: any) => {
      let id = ['docs', 'core'];
      if (params.section) id.push(params.section);
      if (params.subsection) id.push(params.subsection);
      let element = document.getElementById(id.join('-'));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    });

    const params: any = this.route.snapshot.params;
    let id = ['docs', 'core'];
    if (params.section) id.push(params.section);
    if (params.subsection) id.push(params.subsection);
    let element = document.getElementById(id.join('-'));
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

}

interface FOLDER {
  name: string;
  items: any[];
}