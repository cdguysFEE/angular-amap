import { Injectable, NgZone } from '@angular/core'
import { filter, take } from 'rxjs/internal/operators'
import { BehaviorSubject, Observable } from 'rxjs/index'
import { AMapTextComponent } from '../components/amap-text/amap-text.component'
import { AMapApiWrapperService } from './api-wrapper.service'

@Injectable()
export class AMapTextService {
    private texts: Map<AMapTextComponent, Observable<AMap.Text>> = new Map()
    constructor(
        private apiWarpper: AMapApiWrapperService,
        private ngZone: NgZone
    ) {
    }

    createText$(textComponent: AMapTextComponent) {
        const subject: BehaviorSubject<AMap.Text> = new BehaviorSubject(null)
        const option: AMap.TextOptions = {

        }

        this.apiWarpper.createText$(option).subscribe((aText) => {
            subject.next(aText)
        })
        const text$ = subject.pipe(filter(item => !!item), take(1))
        this.texts.set(textComponent, text$)

        return text$
    }

    setText(textComponent: AMapTextComponent) {
        const circle$ = this.texts.get(textComponent)
        if (circle$) {
            circle$.subscribe((aText: AMap.Text) => {
                this.ngZone.runOutsideAngular(() => {
                    aText.setText(textComponent.text)
                })
            })
        }
    }

    setPosition(textComponent: AMapTextComponent) {
        const circle$ = this.texts.get(textComponent)
        if (circle$) {
            circle$.subscribe((aText: AMap.Text) => {
                this.ngZone.runOutsideAngular(() => {
                    aText.setPosition([textComponent.longitude, textComponent.latitude])
                })
            })
        }
    }

    destroy(textComponent: AMapTextComponent) {
        const circle$ = this.texts.get(textComponent)
        if (circle$) {
            circle$.subscribe((aText: AMap.Text) => {
                this.ngZone.runOutsideAngular(() => {
                    aText.setMap(null)
                })
            })
            this.texts.delete(textComponent)
        }
    }
}
