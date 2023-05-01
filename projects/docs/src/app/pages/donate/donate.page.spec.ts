import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DonatePage } from './donate.page'

describe('DonatePage', () => {
  let component: DonatePage
  let fixture: ComponentFixture<DonatePage>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonatePage]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DonatePage)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
