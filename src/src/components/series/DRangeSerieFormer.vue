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
import { SerieEnum } from "../../enums";

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
  closeName!: string;

  @Watch("closeName")
  onCloseNameChange = this.setName;

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

  @Prop({ required: false, default: "{name}: {valueY} ➝ {openValueY}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setTooltipText;

  @Prop({ required: false, default: true })
  snapTooltip!: boolean;

  @Watch("snapTooltip")
  onSnapTooltipChange = this.setSnapTooltip;

  @Prop({ required: false, default: "" })
  legendLabelText!: string;

  @Watch("legendLabelText")
  onLegendLabelTextChange = this.setLegendLabelText;

  @Prop({ required: true })
  data!: unknown[];

  @Watch("data")
  onDataChange = this.setData;

  serie: am5xy.LineSeries | null = null;
  closeSerie: am5xy.LineSeries | null = null;
  tooltip: am5.Tooltip | null = null;
  closeTooltip: am5.Tooltip | null = null;

  upAndRunning = false;

  setName(): void {
    this.serie!.set("name", this.name);
    this.closeSerie!.set("name", this.closeName);
    this.setLegendLabelText();
  }

  setShowTooltip(): void {
    if (!this.showTooltip) {
      if (this.tooltip != null) {
        this.tooltip!.dispose();
        this.serie!.set("tooltip", undefined);
        this.tooltip = null;
      }
      if (this.closeTooltip != null) {
        this.closeTooltip.dispose();
        this.closeSerie!.set("tooltip", undefined);
        this.closeTooltip = null;
      }
    }
    else {
      this.tooltip = am5.Tooltip.new(this.root, {});
      this.serie!.set("tooltip", this.tooltip);
      this.closeTooltip = am5.Tooltip.new(this.root, {});
      this.closeSerie!.set("tooltip", this.closeTooltip);
      this.setTooltipText();
    }
  }

  setTooltipText(): void { 
    if (this.tooltip != null) {
      this.tooltip!.set("labelText", this.tooltipText);
      this.closeTooltip!.set("labelText", this.tooltipText);
    }
  }

  setSnapTooltip(): void {
    this.serie!.set("snapTooltip", this.snapTooltip);
    this.closeSerie!.set("snapTooltip", this.snapTooltip);
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
    this.closeSerie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.closeName);
  }

  setData(): void {
    this.serie!.data.setAll(this.data);
    this.closeSerie!.data.setAll(this.data);
  }

  mounted(): void {
    this.chart!.get("colors")!.set("step", 5);

    // Add to chart
    this.serie = this.chart.series.push(am5xy.LineSeries.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueXField: this.dateXField,
      openValueYField: this.closeValueYField,
      valueYField: this.valueYField,
      sequencedInterpolation: true,
      userData: { serie: SerieEnum.LineSerie }
    }));

    this.serie.fills.template.setAll({
      fillOpacity: 0.5,
      visible: true
    });

    this.serie.set("userData", {
      ...this.serie.get("userData"),
      series: "LineSerie"
    });

    this.closeSerie = this.chart.series.push(am5xy.LineSeries.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueXField: this.dateXField,
      openValueYField: this.valueYField,
      valueYField: this.closeValueYField,
      sequencedInterpolation: true,
      userData: { serie: SerieEnum.LineSerie }
    }));

    this.closeSerie.set("userData", {
      ...this.closeSerie.get("userData"),
      series: "LineSerie"
    });

    // Set updatable properties
    this.setName();
    this.setShowTooltip();
    this.setSnapTooltip();

    // Add to cursor
    if (this.cursor != null && this.snapToSeries) {
      this.cursor.set("snapToSeries", addSerie(this.cursor.get("snapToSeries")!, this.serie));
      this.cursor.set("snapToSeries", addSerie(this.cursor.get("snapToSeries")!, this.closeSerie));
    }

    // Add to legend
    if (this.legend != null) {
      this.legend.data.push(this.serie);
      this.legend.data.push(this.closeSerie);
    }
    
    // Set data
    this.setData();

    let i: any = 0;
    let baseInterval: any = this.xAxis.get("baseInterval");
    let baseDuration: any = this.xAxis.baseDuration() / 2;
    let rangeDataItem: any = null;

    am5.array.each(this.serie.dataItems, (serieDataItem: any) => {
      var seriePreviousDataItem: any = null;
      var closeSeriePreviousDataItem: any = null;

      var closeSerieDataItem: any = this.closeSerie!.dataItems[i];

      if (i > 0) {
        seriePreviousDataItem = this.serie!.dataItems[i - 1];
        closeSeriePreviousDataItem = this.closeSerie!.dataItems[i - 1];
      }

      var startTime: any = (am5.time.round(new Date(serieDataItem!.get("valueX")) as any, baseInterval.timeUnit as any, baseInterval.count as any) as any).getTime();

      // intersections
      if (seriePreviousDataItem != null && closeSeriePreviousDataItem != null) {
        var x0: any = (am5.time.round(new Date(seriePreviousDataItem!.get("valueX")) as any, baseInterval.timeUnit as any, baseInterval.count as any) as any).getTime() + baseDuration;
        var y01: any = seriePreviousDataItem!.get("valueY");
        var y02: any = closeSeriePreviousDataItem!.get("valueY");

        var x1: any = startTime + baseDuration;
        var y11: any = serieDataItem!.get("valueY");
        var y12: any = closeSerieDataItem!.get("valueY");

        var intersection: any = getLineIntersection({ x: x0, y: y01 }, { x: x1, y: y11 }, { x: x0, y: y02 }, { x: x1, y: y12 });

        startTime = Math.round(intersection.x);
      }
      if (closeSerieDataItem!.get("valueY") > serieDataItem!.get("valueY")) {
        if (!rangeDataItem) {
          rangeDataItem = this.xAxis.makeDataItem({});
          var range: any = this.serie!.createAxisRange(rangeDataItem);
          rangeDataItem!.set("value", startTime);
          range!.fills!.template!.setAll({
            fill: this.closeSerie!.get("fill"),
            fillOpacity: 0.6,
            visible: true
          });
          range!.strokes!.template!.setAll({
            stroke: this.serie!.get("stroke"),
            strokeWidth: 1
          });
        }
      }
      else {
        if (rangeDataItem != null) {
          rangeDataItem!.set("endValue", startTime);
          rangeDataItem = undefined;
        }
      }
      if (i == this.serie!.dataItems.length - 1) {
        if (rangeDataItem != null) {
          rangeDataItem!.set("endValue", serieDataItem.get("valueX") + baseDuration);
          rangeDataItem = undefined;
        }
      }
      i++;
    });
    
    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from chart
    this.chart.series.removeValue(this.serie!);
    this.chart.series.removeValue(this.closeSerie!);

    // Remove from legend
    if (this.legend) {
      this.legend.data.removeValue(this.serie);
      this.legend.data.removeValue(this.closeSerie);
    }

    // Remove from cursor
    if (this.cursor) {
      this.cursor.set("snapToSeries", removeSerie(this.cursor.get("snapToSeries")!, this.serie));
    }

    // Dispose
    this.serie!.dispose();
    this.closeSerie!.dispose();
  }
}
</script>