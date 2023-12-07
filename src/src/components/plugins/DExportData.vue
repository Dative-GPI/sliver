<template>
  <div>
    <slot :getCsv="getCsv" :canPng="canPng" :getPng="getPng"> </slot>
    <a ref="link" :style="{ visibility: 'hidden' }" />
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";

import { AxisType, ChartData, ChartDataData, ChartDataOperand, ChartDataPlot, ChartDataSerie, ChartType, DataTable, SerieType, TableData } from "../../models";
import { DateTools } from "../../dates";

interface Header {
  id: string;
  label: string;
  type: DataTable;
}

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
    let groupByHeaders = this.getHeaders();
    let headers: string[] = groupByHeaders.map(h => h.label);
    let rows: string[][] = [];

    if (this.chartData != null) {
      switch (this.chartData.chartType) {
        case ChartType.XY: {
          this.chartData.plots.forEach((plot: ChartDataPlot) => {
            plot.series.forEach((serie: ChartDataSerie) => {
              if (![SerieType.ScatterPlot].includes(serie.serieType)) {
                serie.operands.forEach((operand: ChartDataOperand) => {
                  headers.push(operand.label);
                  operand.data.forEach((data: ChartDataData) => {
                    let row = this.findRow(groupByHeaders, rows, data);
                    if (row == null) {
                      row = groupByHeaders.map((h: Header) => this.getData(h, data));
                      rows.push(row);
                    }
                    if (row.length < headers.length) {
                      row.push(...Array(headers.length - row.length).fill(""));
                    }
                    switch (plot.yAxisType) {
                      case AxisType.Value: {
                        if (data.valueY != null) {
                          row[row.length - 1] = this.formatString(data.valueY);
                        }
                        break;
                      }
                      case AxisType.Category: {
                        if (data.categoryY != null) {
                          row[row.length - 1] = this.formatString(data.categoryY);
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
              rows.push(groupByHeaders.map((h: Header) => this.formatString(slices[0][h.id])));
            }
            slices.shift();
          }
          break;
        }
        case ChartType.Heatmap: {
          this.chartData.plots[0].series[0].operands.forEach((operand: ChartDataOperand) => {
            headers.push(operand.label);
            operand.data.forEach((data: ChartDataData) => {
              let row = this.findRow(groupByHeaders, rows, data);
              if (row == null) {
                row = groupByHeaders.map((h: Header) => this.getData(h, data));
                rows.push(row);
              }
              if (row.length < headers.length) {
                row.push(...Array(headers.length - row.length).fill(""));
              }
              row[headers.length - 1] = this.formatString(data.valueZ);
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
              let row = this.findRow(groupByHeaders, rows, data);
              if (row == null) {
                row = groupByHeaders.map((h: Header) => this.getData(h, data));
                rows.push(row);
              }
              if (row.length < headers.length) {
                row.push(...Array(headers.length - row.length).fill(""));
              }
              if (data.valueY != null) {
                row[headers.length - 1] = this.formatString(data.valueY);
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
      const entities = [...new Set(this.tableData.rows.map(r => r.entity))].length > 1;
      if (entities) {
        headers.unshift(this.entityHeader);
      }
      rows = this.tableData.rows.map(row => {
        let values = row.values.map(this.formatString);

        if (!this.tableData!.aggregates) {
          values.unshift(DateTools.formatShortEpoch(this.locale, this.timeOffset, row.timestamp));
        }
        if (entities) {
          values.unshift(row.entity);
        }
        return values
      });
    }

    // Because Excel is too fucking dense to understand charset="utf-8" while it just fucking works in LibreOffice, OpenOffice, AssHatOffice...
    let csv = "\uFEFF" + this.processRow(headers) + rows.map(r => this.processRow(r)).join("");

    (this.$refs.link as HTMLElement).setAttribute("href", URL.createObjectURL(new Blob([csv], { type: "text/csv;chartset=\"utf-8\";" })));
    (this.$refs.link as HTMLElement).setAttribute("download", `${this.prefix}.csv`);
    (this.$refs.link as HTMLElement).click();
  }

  get canPng(): boolean {
    if (!this.chartData || [ChartType.None, ChartType.ScoreCard, ChartType.Table].includes(this.chartData.chartType)) {
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

  // Return all headers for the CSV file
  getHeaders(): Header[] {
    if (this.chartData != null) {
      switch (this.chartData.chartType) {
        case ChartType.XY: {
          switch (this.chartData.xAxisType) {
            case AxisType.Date: {
              return [
                { id: "timestampX", label: "StartTimeX", type: DataTable.Date },
                { id: "closeTimestampX", label: "EndTimeX", type: DataTable.Date }
              ];
            }
            case AxisType.Value: {
              return [
                { id: "selfValueX", label: "ValueX", type: DataTable.Number }
              ];
            }
            case AxisType.Category: {
              return [
                { id: "categoryX", label: "CategoryX", type: DataTable.String }
              ];
            }
          }
        }
        case ChartType.Pie: {
          return [
            { id: "categoryX", label: "Category", type: DataTable.String },
            { id: "valueY", label: "Value", type: DataTable.Number }
          ];
        }
        case ChartType.Heatmap: {
          switch (this.chartData.xAxisType) {
            case AxisType.Date: {
              return [
                { id: "timestampX", label: "StartTimeX", type: DataTable.Date },
                { id: "closeTimestampX", label: "EndTimeX", type: DataTable.Date },
                { id: "categoryY", label: "CategoryY", type: DataTable.String }
              ];
            }
            case AxisType.Category: {
              return [
                { id: "categoryX", label: "CategoryX", type: DataTable.String },
                { id: "categoryY", label: "CategoryY", type: DataTable.String }
              ];
            }
          }
        }
        case ChartType.Indicator:
        case ChartType.Radar:
        case ChartType.ScoreCard: {
          return [
            { id: "timestampX", label: "StartTime", type: DataTable.Date },
            { id: "closeTimestampX", label: "EndTime", type: DataTable.Date }
          ];
        }
      }
    }
    else if (this.tableData != null) {
      return this.tableData.headers.map(h => ({ id: h.label, label: h.label, type: h.dataTable }));
    }
    return [];
  }

  // Return the first row for wich all values correspond to those of the data
  findRow(headers: Header[], rows: string[][], data: ChartDataData): string[] | undefined {
    return rows.find(row => !headers.some((header, index) => (row[index] != this.getData(header, data))));
  }

  // Return the correct formatted value of a data based on header type
  getData(header: Header, data: any): string {
    if (data[header.id]) {
      switch (header.type) {
        case DataTable.Date: {
          return DateTools.formatShortEpoch(this.locale, this.timeOffset, data[header.id]);
        }
        default: {
          return this.formatString(data[header.id]);
        }
      }
    }
    return "";
  }

  formatString(value: string | number | undefined): string {
    if (value == null) {
      return "";
    }
    if (typeof value == "number") {
      // Excel's a cunt, considers that a non-breakable space is not a proper separator
      return value.toLocaleString(this.locale).replace(" ", " ");
    }
    let numberRegex = /[+-]?\d+(\.\d+)?/g;
    if (value.match(numberRegex) != null) {
      for (let match of value.match(numberRegex)!) {
        // Excel's a cunt, considers that a non-breakable space is not a proper separator
        value = value.replace(match, parseFloat(match)!.toLocaleString(this.locale).replace(" ", " "));
      }
    }
    return value;
  }

  processRow(row: string[]): string {
    return row.map(r => `"${r.replace(/"/g, '""')}"`).join(this.getSeparator()) + "\n";
  }

  getSeparator(): string {
    switch (this.locale) {
      case "en-GB":
      case "en-US":
      case "en-CA": {
        return ",";
      }
      default: {
        return ";";
      }
    }
  }
}
</script>