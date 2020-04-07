import { data } from '../data';

export class AlignmentTool {
    
    constructor() {};

    private swap(a, b) {
        let tmp = data[a];
        data[a] = data[b];
        data[b] = tmp;
    };
    
    public async tops() {
        let top: number;
        data.filter(item => item.selected).map(item => {
            if (top == null) {
                top = item.position.top;
            } else {
                item.position.y = top;
            };
        });
    };
    
    public async lefts() {
        let left: number;
        data.filter(item => item.selected).map(item => {
            if (left == null) {
                left = item.position.left;
            } else {
                item.position.x = left;
            };
        });
    };
    
    public async rights() {
        let right: number;
        data.filter(item => item.selected).map(item => {
            if (right == null) {
                right = item.position.right;
            } else {
                item.position.x = right - item.position.width;
            };
        });
    };
    
    public async bottoms() {
        let bottom: number;
        data.filter(item => item.selected).map(item => {
            if (bottom == null) {
                bottom = item.position.bottom;
            } else {
                item.position.y = bottom - item.position.height;
            };
        });
    };

    public async centers() {
        let center: any;
        data.filter(item => item.selected).map(item => {
            if (center == null) {
                center = item.position.center;
            } else {
                item.position.x = center.x - (item.position.width / 2);
                item.position.y = center.y - (item.position.height / 2);
            };
        });
    };

    public async sendtoback() {
        for (let i = 0; i < data.length; i++) {
            if (data[i].selected) {
                this.swap(i, 0);
            };
        };
    };

    public async sendbackward() {
        for (let i = 0; i < data.length; i++) {
            if (data[i].selected && i > 0) {
                this.swap(i - 1, i);
            };
        };
    };

    public async bringtofront() {
        for (let i = 0; i < data.length; i++) {
            if (data[i].selected) {
                this.swap(i, data.length - 1);
            };
        };
    };

    public async bringforward() {
        for (let i = 0; i < data.length; i++) {
            if (data[i].selected && i < data.length - 1) {
                this.swap(i, i + 1);
            };
        };
    };

    public async verticalcenters() {
        let center: number;
        data.filter(item => item.selected).map(item => {
            if (center == null) {
                center = item.position.center.y;
            } else {
                item.position.y = center - (item.position.height / 2);
            };
        });
    };

    public async horizontalcenters() {
        let center: number;
        data.filter(item => item.selected).map(item => {
            if (center == null) {
                center = item.position.center.x;
            } else {
                item.position.x = center - (item.position.width / 2);
            };
        });
    };

}