import { Injectable, NgZone } from '@angular/core'
import { AMapApiWrapperService } from './api-wrapper.service'
import { AMapCircleComponent } from '../components/amap-circle/amap-circle.component'
import { BehaviorSubject, Observable, Observer } from 'rxjs/index'
import { filter, switchMap, take, tap } from 'rxjs/internal/operators'

@Injectable()
export class AMapCircleEditorService {
    private editors: Map<AMapCircleComponent, Observable<AMap.CircleEditor>> = new Map()

    constructor(
        private apiWrapper: AMapApiWrapperService,
        private ngZone: NgZone
    ) {
    }

    createCircleEditor(circleComponent: AMapCircleComponent) {
        const cacheEditor$ = this.editors.get(circleComponent)
        if (cacheEditor$) {
            return cacheEditor$.pipe(tap((editor) => {
                this.ngZone.runOutsideAngular(() => {
                    editor.open()
                })
            }))
        }
        const circle$ = circleComponent.circle$

        if (!circle$) {
            console.error('[Circle] circle not found')
        }
        const subject: BehaviorSubject<AMap.CircleEditor> = new BehaviorSubject(null)
        circle$.pipe(switchMap((aCircle) => {
            return this.apiWrapper.createCircleEditor$(aCircle)
        })).subscribe((circleEditor) => {
            this.ngZone.runOutsideAngular(() => {
                circleEditor.open()
            })
            subject.next(circleEditor)
        })

        const editor$ = subject.pipe(filter(item => !!item), take(1))
        this.editors.set(circleComponent, editor$)

        return editor$
    }

    closeCircleEditor(circleComponent: AMapCircleComponent) {
        const editor$ = this.editors.get(circleComponent)
        editor$.subscribe(editor => {
            this.ngZone.runOutsideAngular(() => {
                editor.close()
            })
        })
    }

    createEvent$<T>(eventName: string, circleComponent: AMapCircleComponent) {
        return Observable.create((observer: Observer<T>) => {
            const handler = (e) => {
                observer.next(e)
            }
            let cachedEditor: AMap.CircleEditor = null
            this.editors.get(circleComponent)
                .subscribe((editor) => {
                    cachedEditor = editor
                    editor.on(eventName, handler)
                })

            return () => {
                if (cachedEditor) {
                    cachedEditor.off(eventName, handler)
                }
            }
        })
    }

    destroy(circleComponent: AMapCircleComponent) {
        const editor$ = this.editors.get(circleComponent)
        if (editor$) {
            editor$.subscribe((aEditor) => {
                aEditor.close()
            })
            this.editors.delete(circleComponent)
        }
    }
}
