<template>
  <div>
    <slot :getCsv="getCsv" :canPng="canPng" :getPng="getPng"> </slot>
    <a ref="link" :style="{ visibility: 'hidden' }" />
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";

import { AxisType, ChartData, ChartDataData, ChartDataOperand, ChartDataPlot, ChartDataSerie, ChartType, SerieType, TableData } from "../../models";
import { DateTools } from "../../dates";

@Component({})
export default class DExportData extends Vue {
  @Prop({ required: false, default: null })
  chartId!: string | null;

  @Prop({ required: false, default: "en-US" })
  locale!: string;

  @Prop({ required: false, default: "UTC" })
  timeOffset!: string;

  @Prop({ required: false, default: null })
  chartData!: ChartData | null;

  @Prop({ required: false, default: null })
  tableData!: TableData | null;

  @Prop({ required: false, default: "data" })
  prefix!: string;

  @Prop({ required: false, default: "Timestamp" })
  timestampHeader!: string;

  @Prop({ required: false, default: "Entity" })
  entityHeader!: string;

  getCsv(): void {
    let groupByHeaders = this.groupByHeaders();
    let headers: string[] = groupByHeaders.map(h => h.label);
    let rows: any[] = [];

    if (this.chartData != null) {
      switch (this.chartData.chartType) {
        case ChartType.XY: {
          this.chartData.plots.forEach((plot: ChartDataPlot) => {
            plot.series.forEach((serie: ChartDataSerie) => {
              if (![SerieType.ScatterPlot].includes(serie.serieType)) {
                serie.operands.forEach((operand: ChartDataOperand) => {
                  headers.push(operand.label);
                  operand.data.forEach((data: ChartDataData) => {
                    let row: string[] = this.findRow(groupByHeaders, rows, data);
                    if (row == null) {
                      row = groupByHeaders.map((h: { id: string, label: string, date: boolean }) => {
                        if ((data as any)[h.id] != null) {
                          if (h.date) {
                            return DateTools.formatShortEpoch(this.locale, this.timeOffset, (data as any)[h.id]);
                          }
                          return (data as any)[h.id].toString();
                        }
                        return "";
                      });
                      rows.push(row);
                    }
                    if (row.length < headers.length) {
                      row.push(...Array(headers.length - row.length).fill(""));
                    }
                    switch (plot.yAxisType) {
                      case AxisType.Value: {
                        if (data.valueY != null) {
                          row[row.length - 1] = data.valueY.toString();
                        }
                        break;
                      }
                      case AxisType.Category: {
                        if (data.categoryY != null) {
                          row[row.length - 1] = data.categoryY;
                        }
                        break;
                      }
                    }
                  });
                });
              }
            });
          });
          break;
        }
        case ChartType.Pie: {
          let slices: any[] = [];
          this.chartData.plots[0].series.forEach((serie: ChartDataSerie) => {
            serie.operands.forEach((operand: ChartDataOperand) => {
              slices = slices.concat(operand.data);
            });
          });
          while (slices[0] != null) {
            if (slices[0].subs != null && slices[0].subs.length > 0) {
              slices = slices.concat(slices[0].subs);
            }
            else {
              rows.push(groupByHeaders.map((h: { id: string, label: string }) => {
                return (slices[0] as any)[h.id] != null ? (slices[0] as any)[h.id].toString() : "";
              }));
            }
            slices.shift();
          }
          break;
        }
        case ChartType.Heatmap: {
          this.chartData.plots[0].series[0].operands.forEach((operand: ChartDataOperand) => {
            headers.push(operand.label);
            operand.data.forEach((data: ChartDataData) => {
              let row: string[] = this.findRow(groupByHeaders, rows, data);
              if (row == null) {
                row = groupByHeaders.map((h: { id: string, label: string, date: boolean }) => {
                  if ((data as any)[h.id] != null) {
                    if (h.date) {
                      return DateTools.formatShortEpoch(this.locale, this.timeOffset, (data as any)[h.id]);
                    }
                    return (data as any)[h.id].toString();
                  }
                  return "";
                });
                rows.push(row);
              }
              if (row.length < headers.length) {
                row.push(...Array(headers.length - row.length).fill(""));
              }
              row[headers.length - 1] = data.valueZ != null ? data.valueZ!.toString() : "";
            });
          });
          break;
        }
        case ChartType.Indicator:
        case ChartType.Radar:
        case ChartType.ScoreCard: {
          this.chartData.plots[0].series[0].operands.forEach((operand: ChartDataOperand) => {
            headers.push(operand.label);
            operand.data.forEach((data: ChartDataData) => {
              let row: string[] = this.findRow(groupByHeaders, rows, data);
              if (row == null) {
                row = groupByHeaders.map((h: { id: string, label: string, date: boolean }) => {
                  if ((data as any)[h.id] != null) {
                    if (h.date) {
                      return DateTools.formatShortEpoch(this.locale, this.timeOffset, (data as any)[h.id]);
                    }
                    return (data as any)[h.id].toString();
                  }
                  return "";
                });
                rows.push(row);
              }
              if (row.length < headers.length) {
                row.push(...Array(headers.length - row.length).fill(""));
              }
              if (data.valueY != null) {
                row[headers.length - 1] = data.valueY.toString();
              }
            });
          });
          break;
        }
      }
      rows.forEach((row: any) => {
        if (row.length < headers.length) {
          row.push(...Array(headers.length - row.length).fill(""));
        }
      });
      rows.sort((a: any[], b: any[]) => {
        if (a[0] != b[0]) {
          return a[0] - b[0];
        }
        if (groupByHeaders.length > 1) {
          return a[1] - b[1];
        }
        return 0;
      });
    }
    else if (this.tableData != null) {
      if (!this.tableData.aggregates) {
        headers.unshift(this.timestampHeader);
      }
      let entities = [...new Set(this.tableData.rows.map(r => r.entity))].length > 1
      if (entities) {
        headers.unshift(this.entityHeader);
      }
      rows = this.tableData.rows.map(r => {
        let values = [...r.values];
        if (this.tableData != null) {
          if (!this.tableData.aggregates) {
            values.unshift(DateTools.formatShortEpoch(this.locale, this.timeOffset, r.timestamp));
          }
        }
        if (entities) {
          values.unshift(r.entity);
        }
        return values
      });
    }

    let csv = this.processRow(headers);
    for (let i = 0; i < rows.length; i++) {
      csv += this.processRow(rows[i]);
    }

    (this.$refs.link as HTMLElement).setAttribute("href", URL.createObjectURL(new Blob([csv], { type: "text/csv;chartset=\"utf-8\";" })));
    (this.$refs.link as HTMLElement).setAttribute("download", `${this.prefix != "" ? this.prefix : "data"}.csv`);
    (this.$refs.link as HTMLElement).click();
  }

  get canPng(): boolean {
    if (this.chartData == null) {
      return false;
    }
    if ([ChartType.None, ChartType.ScoreCard, ChartType.Table].includes(this.chartData.chartType)) {
      return false;
    }
    return true;
  }

  getPng(): void {
    if (this.chartId != null && this.chartId != "") {
      let canvases: NodeListOf<HTMLCanvasElement> = document.querySelectorAll("#" + this.chartId + " canvas");
      if (canvases.length > 0) {
        let merge = document.createElement("canvas");
        merge.width = canvases[0]!.width;
        merge.height = canvases[0]!.height;
        canvases.forEach((c: HTMLCanvasElement) => merge.getContext("2d")!.drawImage(c!, 0, 0));
        (this.$refs.link as HTMLElement).setAttribute("href", merge.toDataURL());
        (this.$refs.link as HTMLElement).setAttribute("download", `${this.prefix != "" ? this.prefix : "data"}.png`);
        (this.$refs.link as HTMLElement).click();
      }
    }
  }

  groupByHeaders(): { id: string, label: string, date: boolean }[] {
    if (this.chartData != null) {
      switch (this.chartData.chartType) {
        case ChartType.XY: {
          switch (this.chartData.xAxisType) {
            case AxisType.Date: {
              return [
                { id: "timestampX", label: "StartTimeX", date: true },
                { id: "closeTimestampX", label: "EndTimeX", date: true }
              ];
            }
            case AxisType.Value: {
              return [
                { id: "selfValueX", label: "ValueX", date: false }
              ];
            }
            case AxisType.Category: {
              return [
                { id: "categoryX", label: "CategoryX", date: false }
              ];
            }
          }
        }
        case ChartType.Pie: {
          return [
            { id: "categoryX", label: "Category", date: false },
            { id: "valueY", label: "Value", date: false }
          ];
        }
        case ChartType.Heatmap: {
          switch (this.chartData.xAxisType) {
            case AxisType.Date: {
              return [
                { id: "timestampX", label: "StartTimeX", date: true },
                { id: "closeTimestampX", label: "EndTimeX", date: true },
                { id: "categoryY", label: "CategoryY", date: false }
              ];
            }
            case AxisType.Category: {
              return [
                { id: "categoryX", label: "CategoryX", date: false },
                { id: "categoryY", label: "CategoryY", date: false }
              ];
            }
          }
        }
        case ChartType.Indicator:
        case ChartType.Radar:
        case ChartType.ScoreCard: {
          return [
            { id: "timestampX", label: "StartTime", date: true },
            { id: "closeTimestampX", label: "EndTime", date: true }
          ];
        }
      }
    }
    else if (this.tableData != null) {
      return this.tableData.headers.map(h => ({ id: h.label, label: h.label, date: false }));
    }
    return [];
  }

  findRow(groupByHeaders: { id: string, label: string, date: boolean }[], rows: any[], data: ChartDataData): any | null {
    return rows.find((r: any) => !groupByHeaders.some((h, i: number) => {
      if (h.date) {
        return r[i] != ((data as any)[h.id] != null ? DateTools.formatShortEpoch(this.locale, this.timeOffset, (data as any)[h.id]) : "");
      }
      return r[i] != ((data as any)[h.id] != null ? (data as any)[h.id] : "");
    }));
  }

  processRow(row: string[]): string {
    var line = '';
    for (let i = 0; i < row.length; i++) {
      var result = row[i].replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) {
        result = `"${result}"`;
      }
      if (i > 0) {
        line += ',';
      }
      line += result;
    }
    return line + '\n';
  }
}
</script>