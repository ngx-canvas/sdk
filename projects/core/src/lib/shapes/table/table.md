# Table
This will draw a table on the canvas!

## Usage
```ts
import { Table } from '@ngx-canvas/core';

const table = new Table({}: SHAPE);

table.apply();
```

### Inputs

| Property    | Type      | Default         | Required  | Description |
|-------------|-----------|-----------------|-----------|-------------|
| id          | string    | ObjectId()      | Optional  |             |
| rows        | Row[]     | []              | Optional  |             |
| fill        | Fill      | new Fill()      | Optional  |             |
| font        | Font      | new Font()      | Optional  |             |
| data        | any       | {}              | Optional  |             |
| type        | string    | 'rectangle'     | Optional  |             |
| name        | string    | ''              | Optional  |             |
| value       | string    | ''              | Optional  |             |
| header      | Row[]     | []              | Optional  |             |
| footer      | Row[]     | []              | Optional  |             |
| stroke      | Stroke    | new Stroke()    | Optional  |             |
| hidden      | boolean   | false           | Optional  |             |
| selected    | boolean   | false           | Optional  |             |
| dragging    | boolean   | false           | Optional  |             |
| position    | Position  | new Position()  | Optional  |             |
| conditions  | any[]     | []              | Optional  |             |
|-------------|-----------|-----------------|-----------|-------------|

### Outputs