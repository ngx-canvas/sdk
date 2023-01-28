# Polyline
This will draw a polyline on the canvas!

## Usage
```ts
import { Polyline } from '@ngx-canvas/core';

const polyline = new Polyline({}: SHAPE);

polyline.apply();
```

### Inputs

| Property    | Type      | Default         | Required  | Description |
|-------------|-----------|-----------------|-----------|-------------|
| id          | string    | ObjectId()      | Optional  |             |
| fill        | Fill      | new Fill()      | Optional  |             |
| font        | Font      | new Font()      | Optional  |             |
| data        | any       | {}              | Optional  |             |
| type        | string    | 'rectangle'     | Optional  |             |
| name        | string    | ''              | Optional  |             |
| stroke      | Stroke    | new Stroke()    | Optional  |             |
| points      | Point[]   | []              | Optional  |             |
| hidden      | boolean   | false           | Optional  |             |
| selected    | boolean   | false           | Optional  |             |
| dragging    | boolean   | false           | Optional  |             |
| position    | Position  | new Position()  | Optional  |             |
| conditions  | any[]     | []              | Optional  |             |
|-------------|-----------|-----------------|-----------|-------------|

### Outputs