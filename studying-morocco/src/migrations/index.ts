import * as migration_20261026_133610_initial from './20261026_133610_initial';

export const migrations = [
  {
    up: migration_20261026_133610_initial.up,
    down: migration_20261026_133610_initial.down,
    name: '20261026_133610_initial'
  },
];
