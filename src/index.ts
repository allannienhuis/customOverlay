/// <reference types="@types/googlemaps" 
interface CustomMapOptions {
    map: google.maps.Map | null,
    element: HTMLElement,
    position: google.maps.LatLng | null;
}
export class CustomMarker extends google.maps.OverlayView {

    public map: google.maps.Map | null;
    public element: HTMLElement;
    public position: google.maps.LatLng | null;
    public projection: google.maps.MapCanvasProjection;
    constructor (opts: CustomMapOptions) {
        super();

        this.position = opts.position;
        this.map = opts.map;
        this.setMap(this.map);
        this.element = opts.element;
        this.element.style.position = 'absolute';
        this.element.style.visibility = 'visible';
        this.projection = this.getProjection();


        console.log('custom marker');
    }

    public onAdd() {
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.element);
    }

    public draw() {
        if (!(this.map && this.position && this.element)) {
            return;
        }
        const point = this.projection.fromLatLngToDivPixel(this.position);
        // point.round(); // don't round. the layout engine is ok (better) with fractional/subpixel points
        this.element.style.transform = `translate(${point.x}px, ${point.y}px)`;
        console.log(point);

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
    }

    public hide() {
        if (!this.element) {
            return;
        }
        this.element.style.visibility = 'hidden';
    }
    public show() {

        if (!this.element) {
            return;
        }
        this.element.style.visibility = 'visible';
    }
    public get isVisible(){
        return !!(this.element && (this.element.style.visibility === 'visible'));
    }
}