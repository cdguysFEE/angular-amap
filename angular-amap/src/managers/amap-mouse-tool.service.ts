import { Injectable } from '@angular/core'
import { AMapApiWrapperService } from './api-wrapper.service'
import { AMapMouseToolComponent } from '../components/amap-mouse-tool/mouse-tool.component'
import { BehaviorSubject, Observable, Observer } from 'rxjs/index'
import { filter, take } from 'rxjs/internal/operators'

@Injectable()
export class AMapMouseToolService {
    private tools: Map<AMapMouseToolComponent, Observable<AMap.MouseTool>> = new Map()
    constructor(
        private apiWrapper: AMapApiWrapperService
    ) {
    }

    createMouseTool(mouseToolComponent: AMapMouseToolComponent) {
        const subject = new BehaviorSubject(null)
        this.apiWrapper.createMouseTool$().subscribe((mouseTool) => {
            subject.next(mouseTool)
        })

        const mouseTool$ = subject.pipe(filter(item => !!item), take(1))
        this.tools.set(mouseToolComponent, mouseTool$)

        return mouseTool$
    }

    createEvent$<T>(eventName: string, mouseToolComponent: AMapMouseToolComponent) {
        return Observable.create((observer: Observer<T>) => {
            const handler = (e) => {
                observer.next(e)
            }
            let cachedEditor: AMap.MouseTool = null
            this.tools.get(mouseToolComponent)
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

    destroy(mouseToolComponent: AMapMouseToolComponent) {
        const tool$ = this.tools.get(mouseToolComponent)
        if (tool$) {
            tool$.subscribe((aTool) => {
                aTool.close()
            })
            this.tools.delete(mouseToolComponent)
        }
    }
}
