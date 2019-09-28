export class CustomMarker {
    public name: string;
    constructor (opts:any = {}) {

    this.name = opts.name || 'default name';
    console.log('custom marker');
    }

}