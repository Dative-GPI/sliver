<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, LEGEND, XAXIS, YAXIS } from "../../literals";
import { addSerie, getLineIntersection, removeSerie } from "../../helpers";

@Component({})
export default class DRangeSerie extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.DateAxis<am5xy.AxisRendererX>;

  @InjectReactive(YAXIS)
  yAxis!: am5xy.ValueAxis<am5xy.AxisRendererY>;

  @InjectReactive(CURSOR)
  cursor!: am5xy.XYCursor | null;

  @InjectReactive(LEGEND)
  legend!: am5.Legend | null;

  @Prop({ required: true })
  name!: string;

  @Watch("name")
  onNameChange = this.setName;

  @Prop({ required: true })
  subNames!: string[];

  @Watch("subNames")
  onSubNamesChange = this.setSubNames;

  @Prop({ required: false, default: false })
  snapToSeries!: boolean;

  @Prop({ required: false, default: "timestampX" })
  dateXField!: string;

  @Prop({ required: false, default: "valueY" })
  valueYField!: string;

  @Prop({ required: false, default: "closeValueY" })
  closeValueYField!: string;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{name}: {valueY}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setTooltipText;

  @Prop({ required: false, default: "{name}: {valueY} ➝ {openValueY}" })
  subTooltipText!: string;

  @Watch("subTooltipText")
  onSubTooltipTextChange = this.setSubTooltipText;

  @Prop({ required: false, default: true })
  snapTooltip!: boolean;

  @Watch("snapTooltip")
  onSnapTooltipChange = this.setSnapTooltip;

  @Prop({ required: false, default: "" })
  legendLabelText!: string;

  @Watch("legendLabelText")
  onLegendLabelTextChange = this.setLegendLabelText;

  @Prop({ required: true })
  data!: any[];

  @Watch("data")
  onDataChange = this.setData;

  @Prop({ required: true })
  subDatas!: any[][];

  @Watch("subDatas")
  onSubDatasChange = this.setSubDatas;

  serie: am5xy.LineSeries | null = null;
  tooltip: am5.Tooltip | null = null;
  subSeries: am5xy.LineSeries[] = [];
  subTooltips: am5.Tooltip[] = [];

  upAndRunning = false;

  setName(): void {
    this.serie!.set("name", this.name);
    this.setLegendLabelText();
  }

  setSubNames(): void {
    for (let i = 0; i < this.subNames.length; i++) {
      if (this.subSeries[i] != null) {
        this.subSeries[i].set("name", this.subNames[i]);
      }
    }
    this.setLegendLabelText();
  }

  setShowTooltip(): void {
    if (!this.showTooltip) {
      if (this.tooltip != null) {
        this.tooltip!.dispose();
        this.serie!.set("tooltip", undefined);
        this.tooltip = null;
      }
      for (let i = 0; i < this.subTooltips.length; i++) {
        this.subTooltips[i].dispose();
        if (this.subSeries[i] != null) {
          this.subSeries[i].set("tooltip", undefined);
        }
      }
      this.subTooltips = [];
    }
    else {
      this.tooltip = am5.Tooltip.new(this.root, {});
      this.serie!.set("tooltip", this.tooltip);
      for (let i = 0; i < this.subSeries.length; i++) {
        this.subTooltips.push(am5.Tooltip.new(this.root, {}));
        this.subSeries[i].set("tooltip", this.subTooltips[i]);
      }
      this.setTooltipText();
      this.setSubTooltipText();
    }
  }

  setTooltipText(): void { 
    if (this.tooltip != null) {
      this.tooltip!.set("labelText", this.tooltipText);
    }
  }

  setSubTooltipText(): void {
    for (let i = 0; i < this.subTooltips.length; i++) {
      this.subTooltips[i].set("labelText", this.subTooltipText);
    }
  }

  setSnapTooltip(): void {
    this.serie!.set("snapTooltip", this.snapTooltip);
    for (let i = 0; i < this.subSeries.length; i++) {
      this.subSeries[i].set("snapTooltip", this.snapTooltip);
    }
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
    for (let i = 0; i < this.subSeries.length; i++) {
      let subName = this.subNames[i] ? this.subNames[i] : "";
      this.subSeries[i].set("legendLabelText", this.legendLabelText ? this.legendLabelText : subName);
    }
  }

  setData(): void {
    this.serie!.data.setAll(this.data);
  }

  getClosedSubData(subData: any[]): any[] {
    return subData.map((sd, i) => ({ ...sd, [this.closeValueYField]: this.data[i][this.valueYField] }));
  }

  setSubDatas(): void {
    for (let i = 0; i < this.subSeries.length; i++) {
      if (this.subDatas[i] != null) {
        this.subSeries[i].data.setAll(this.getClosedSubData(this.subDatas[i]));
      }
    }
  }

  mounted(): void {
    // Add to chart
    this.serie = this.chart.series.push(am5xy.LineSeries.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueXField: this.dateXField,
      valueYField: this.valueYField,
      sequencedInterpolation: true
    }));

    for (let i = 0; i < this.subNames.length; i++) {
      this.subSeries.push(this.chart.series.push(am5xy.LineSeries.new(this.root, {
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueXField: this.dateXField,
        openValueYField: this.closeValueYField,
        valueYField: this.valueYField,
        sequencedInterpolation: true
      })));

      this.subSeries[i].fills.template.setAll({
        fillOpacity: 0.5,
        visible: true
      });
    }

    // Set updatable properties
    this.setName();
    this.setSubNames();
    this.setShowTooltip();
    this.setSnapTooltip();

    // Add to cursor
    if (this.cursor != null && this.snapToSeries) {
      this.cursor.set("snapToSeries", addSerie(this.cursor.get("snapToSeries")!, this.serie));
      for (let i = 0; i < this.subSeries.length; i++) {
        this.cursor.set("snapToSeries", addSerie(this.cursor.get("snapToSeries")!, this.subSeries[i]));
      }
    }

    // Add to legend
    if (this.legend != null) {
      this.legend.data.push(this.serie);
      this.legend.data.pushAll(this.subSeries);
    }
    
    // Set data
    this.setData();
    this.setSubDatas();

    for (let i = 0; i < this.subSeries.length; i++) {
      let j: any = 0;
      let baseInterval: any = this.xAxis.get("baseInterval");
      let baseDuration: any = this.xAxis.baseDuration() / 2;
      let rangeDataItem: any = null;

      am5.array.each(this.subSeries[i].dataItems, (serieDataItem: any) => {
        let subSerieDataItem: any = this.serie!.dataItems[j];

        let seriePreviousDataItem: any = null;
        let subSeriePreviousDataItem: any = null;

        if (j > 0) {
          seriePreviousDataItem = this.subSeries[i]!.dataItems[j - 1];
          subSeriePreviousDataItem = this.serie!.dataItems[j - 1];
        }

        let startTime: any = (am5.time.round(new Date(serieDataItem!.get("valueX")) as any, baseInterval.timeUnit as any, baseInterval.count as any) as any).getTime();

        // intersections
        if (seriePreviousDataItem != null && subSeriePreviousDataItem != null) {
          let x0: any = (am5.time.round(new Date(seriePreviousDataItem!.get("valueX")) as any, baseInterval.timeUnit as any, baseInterval.count as any) as any).getTime() + baseDuration;
          let y01: any = seriePreviousDataItem!.get("valueY");
          let y02: any = subSeriePreviousDataItem!.get("valueY");

          let x1: any = startTime + baseDuration;
          let y11: any = serieDataItem!.get("valueY");
          let y12: any = subSerieDataItem!.get("valueY");

          let intersection: any = getLineIntersection({ x: x0, y: y01 }, { x: x1, y: y11 }, { x: x0, y: y02 }, { x: x1, y: y12 });

          startTime = Math.round(intersection.x);
        }
        if (subSerieDataItem!.get("valueY") > serieDataItem!.get("valueY")) {
          if (!rangeDataItem) {
            rangeDataItem = this.xAxis.makeDataItem({});
            let range: any = this.subSeries[i]!.createAxisRange(rangeDataItem);
            rangeDataItem!.set("value", startTime);
            range!.fills!.template!.setAll({
              fill: this.serie!.get("fill"),
              fillOpacity: this.serie!.fills.template.get("fillOpacity"),
              visible: true
            });
            range!.strokes!.template!.setAll({
              stroke: this.subSeries[i]!.get("stroke"),
              strokeWidth: 1
            });
            rangeDataItem!.set("closeValueY", subSerieDataItem!.get("valueY"));
          }
        }
        else {
          if (rangeDataItem != null) {
            rangeDataItem!.set("endValue", startTime);
            rangeDataItem = undefined;
          }
        }
        if (j == this.serie!.dataItems.length - 1) {
          if (rangeDataItem != null) {
            rangeDataItem!.set("endValue", serieDataItem.get("valueX") + baseDuration);
            rangeDataItem = undefined;
          }
        }
        j++;
      });
    }
    
    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from chart
    this.chart.series.removeValue(this.serie!);
    for (let i = 0; i < this.subSeries.length; i++) {
      this.chart.series.removeValue(this.subSeries[i]);
    }

    // Remove from legend
    if (this.legend) {
      this.legend.data.removeValue(this.serie);
      for (let i = 0; i < this.subSeries.length; i++) {
        this.legend.data.removeValue(this.subSeries[i]);
      }
    }

    // Remove from cursor
    if (this.cursor) {
      this.cursor.set("snapToSeries", removeSerie(this.cursor.get("snapToSeries")!, this.serie));
      for (let i = 0; i < this.subSeries.length; i++) {
        this.cursor.set("snapToSeries", removeSerie(this.cursor.get("snapToSeries")!, this.subSeries[i]));
      }
    }

    // Dispose
    this.serie!.dispose();
    for (let i = 0; i < this.subSeries.length; i++) {
      this.subSeries[i].dispose();
    }
  }
}
</script>