export enum ChartType {
  None = 0,
  XY = 1,
  Pie = 2,
  Heatmap = 3,
  Slider = 4,
  Gauge = 5,
  ScoreCard = 6,
  Table = 7
}

export enum AxisType {
  None     = 0,
  Date     = 1,
  Value    = 2,
  Category = 3
}

export enum SerieType {
  None        = 0,
  Lines       = 1,
  Area        = 2,
  Range       = 3,
  Histogram   = 4,
  Operation   = 5,
  Planning    = 6,
  ScatterPlot = 7,
  Top         = 8,
  Bars        = 9,
  StackedBars = 10,
  Pie         = 11,
  Heatmap     = 12,
  Slider      = 13,
  Gauge       = 14,
  ScoreCard   = 15,
  Table       = 16
}

export interface ChartData {
  chartType: ChartType;
  xAxisType: AxisType;
  plots: ChartDataPlot[];
};

export interface ChartDataPlot {
  yAxisType: AxisType;
  series: ChartDataSerie[];
}

export interface ChartDataSerie {
  serieType: SerieType;
  operands: ChartDataOperand[];
}

export interface ChartDataOperand {
  label: string;
  data: ChartDataData[];
  subOperands: ChartDataOperand[];
}

export interface ChartDataData {
  categoryX?: string;
  categoryY?: string;
  valueX?: number;
  closeValueX?: number;
  selfValueX?: number;
  valueY?: number;
  valueZ?: number;
  timestampX?: number;
  closeTimestampX?: number;
  subs?: ChartDataSub[];
}

export interface ChartDataSub {
  categoryX?: string;
  valueY?: number;  
}

export enum DataTable {
  None   = 0,
  Number = 1,
  String = 2
}

export interface TableData {
  headers: { label: string, dataTable: DataTable }[];
  rows: TableDataRow[];
}

export interface TableDataRow {
  timestamp: number;
  entity: string;
  values: string[];
}