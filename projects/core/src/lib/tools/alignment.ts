import { data } from '../data';
import { Point } from '../utilities/point';

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
                let diff = item.position.y - top;
                let point = new Point({
                    'x': item.position.center.x,
                    'y': item.position.center.y - diff
                });
                item.move(point);
            };
        });
    };
    
    public async lefts() {
        let left: number;
        data.filter(item => item.selected).map(item => {
            if (left == null) {
                left = item.position.left;
            } else {
                let diff = item.position.x - left;
                let point = new Point({
                    'x': item.position.center.x - diff,
                    'y': item.position.center.y
                });
                item.move(point);
            };
        });
    };
    
    public async rights() {
        let right: number;
        data.filter(item => item.selected).map(item => {
            if (right == null) {
                right = item.position.right;
            } else {
                let diff = item.position.x - right;
                let point = new Point({
                    'x': item.position.center.x - diff  - item.position.width,
                    'y': item.position.center.y
                });
                item.move(point);
            };
        });
    };
    
    public async bottoms() {
        let bottom: number;
        data.filter(item => item.selected).map(item => {
            if (bottom == null) {
                bottom = item.position.bottom;
            } else {
                let diff = item.position.x - bottom;
                let point = new Point({
                    'x': item.position.center.x,
                    'y': item.position.center.y - diff  - item.position.height
                });
                item.move(point);
            };
        });
    };

    public async centers() {
        let center: any;
        data.filter(item => item.selected).map(item => {
            if (center == null) {
                center = item.position.center;
            } else {
                let diff = {
                    'x': item.position.center.x - center.x,
                    'y': item.position.center.y - center.y
                };
                let point = new Point({
                    'x': item.position.center.x - diff.x,
                    'y': item.position.center.y - diff.y
                });
                item.move(point);
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
                let diff = item.position.y - center;
                let point = new Point({
                    'x': item.position.center.x,
                    'y': item.position.center.y - diff  - (item.position.height / 2)
                });
                item.move(point);
            };
        });
    };

    public async horizontalcenters() {
        let center: number;
        data.filter(item => item.selected).map(item => {
            if (center == null) {
                center = item.position.center.x;
            } else {
                let diff = item.position.y - center;
                let point = new Point({
                    'x': item.position.center.x - diff  - (item.position.width / 2),
                    'y': item.position.center.y
                });
                item.move(point);
            };
        });
    };

}