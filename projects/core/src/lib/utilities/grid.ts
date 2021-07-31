export class Grid {

    public id: string = 'page-grid';
    public width: number = 10;
    public height: number = 10;
    public hidden: boolean = true;

    constructor(args?: GRID) {
        if (typeof (args) != 'undefined' && args != null) {
            if (typeof (args.id) != 'undefined' && args.id != null) {
                this.id = args.id;
            }
            if (typeof (args.width) != 'undefined' && args.width != null) {
                this.width = args.width;
            }
            if (typeof (args.height) != 'undefined' && args.height != null) {
                this.height = args.height;
            }
            if (typeof (args.hidden) != 'undefined' && args.hidden != null) {
                this.hidden = args.hidden;
            }
        }
    }

}

interface GRID {
    id?: string;
    width?: number;
    index?: string;
    height?: number;
    hidden?: boolean;
}