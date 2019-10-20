/// <reference types="@types/googlemaps" 
import * as Debug from 'debug';

const debug = Debug('custom-marker');
interface CustomMapOptions {
    map: google.maps.Map | null,
    element: HTMLElement,
    position: google.maps.LatLng;
}
export class CustomMarker extends google.maps.OverlayView {

    public element: HTMLElement;
    public position: google.maps.LatLng;
    public projection: google.maps.MapCanvasProjection;

    private mouseDownHandler: google.maps.MapsEventListener;
    private mouseUpHandler: google.maps.MapsEventListener;
    constructor (opts: CustomMapOptions) {
        super();

        this.position = opts.position;
        this.setMap(opts.map);
        this.element = opts.element;
        this.element.style.position = 'absolute';
        this.element.style.display = 'block';
        this.projection = this.getProjection();


        debug('custom marker');

        this.mouseDownHandler = google.maps.event.addDomListener(this.element, 'mousedown', (e) => {
            if (!this.isVisible) {
                return;
            }
            this.element.style.cursor = 'move';
            const map = this.getMap();            
            map.set('draggable', false);

        });

        this.mouseUpHandler = google.maps.event.addListener(this.getMap(), 'mouseup', (e) => {
            this.element.style.cursor = 'default';
            const map = this.getMap();            
            map.set('draggable', true);
            
        });

    }

    public onAdd() {
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.element);
    }

    public draw() {
        if (!(this.isVisible && this.position && this.getMap())) {
            return;
        }
        const point = this.projection.fromLatLngToDivPixel(this.position);
        // point.round(); // don't round. the layout engine is ok (better) with fractional/subpixel points
        this.element.style.transform = `translate(${point.x}px, ${point.y}px)`;
        debug('point', point);

        /*
        this.element.style.left = `${point.x}px`;
        this.element.style.top = `${point.y}px`;
        */

    }

    public onRemove() {
        if (!(this.element && this.element.parentNode)) {
            return;
        }
        this.element.parentNode.removeChild(this.element);

        google.maps.event.removeListener(this.mouseDownHandler);
        google.maps.event.removeListener(this.mouseUpHandler);
    }

    public get isVisible(){
        return this.element && (this.element.style.display === 'block');
    }

    public set isVisible(value) {
        debug('value', value);
        this.element.style.display = value ? 'block' : 'none';
        if (value) {
            // map may have moved since it was last visible.
            this.draw();
        }
    }
}