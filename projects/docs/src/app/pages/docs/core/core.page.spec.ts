import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CorePage } from './core.page'

describe('CorePage', () => {
  let component: CorePage
  let fixture: ComponentFixture<CorePage>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CorePage]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CorePage)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
