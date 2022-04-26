<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue, Prop, ProvideReactive, Watch, Inject } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, XAXIS } from "../../literals";

@Component({})
export default class DDateXAxis extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(CURSOR)
  cursor!: am5xy.XYCursor | null;

  @Prop({ required: false, default: false })
  opposite!: boolean;

  @Watch("opposite")
  onOppositeChange = this.setOpposite;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "yyyy-MM-dd HH:mm:ss" })
  tooltipDateFormat!: string;

  @Watch("tooltipDateFormat")
  onTooltipDateFormatChange = this.setTooltipDateFormat;

  @Prop({ required: false, default: null })
  min!: number | null;

  @Watch("min")
  onMinChange = this.setMin;

  @Prop({ required: false, default: null })
  max!: number | null;

  @Watch("max")
  onMaxChange = this.setMax;

  @ProvideReactive(XAXIS)
  axis: any = null;

  tooltip: am5.Tooltip | null = null;

  upAndRunning = false;

  setOpposite(): void {
    this.axis!.get("renderer").set("opposite", this.opposite);
  }

  setShowTooltip(): void {
    if (!this.showTooltip) {
      if (this.tooltip != null && !this.tooltip.isDisposed()) {
        let hideCursor = false;
        if (this.cursor != null && this.cursor!.lineX.get("visible")) {
          this.cursor!.lineX.set("visible", false);
          this.cursor!.set("xAxis", undefined);
          hideCursor = true;
        }
        this.tooltip!.dispose();
        this.axis!.set("tooltip", undefined);
        this.tooltip = null;
        if (this.cursor != null && hideCursor) {
          this.cursor!.lineX.set("visible", true);
          this.cursor!.set("xAxis", this.axis!);
        }
      }
    }
    else {
      let hideCursor = false;
      if (this.cursor != null && this.cursor!.lineX.get("visible")) {
        this.cursor!.lineX.set("visible", false);
        this.cursor!.set("xAxis", undefined);
        hideCursor = true;
      }
      this.tooltip = am5.Tooltip.new(this.root, {});
      this.axis!.set("tooltip", this.tooltip);
      if (this.cursor != null && hideCursor) {
        this.cursor!.lineX.set("visible", true);
        this.cursor!.set("xAxis", this.axis!);
      }
    }
  }

  setTooltipDateFormat(): void {
    this.axis!.set("tooltipDateFormat", this.tooltipDateFormat);
  }

  setMin(): void {
    if (this.min != null) {
      this.axis!.set("min", this.min);
    }
    else {
      this.axis!.set("min", undefined);
    }
  }

  setMax(): void {
    if (this.max != null) {
      this.axis!.set("max", this.max);
    }
    else {
      this.axis!.set("max", undefined);
    }
  }

  mounted(): void {
    // Add to chart
    this.axis = this.chart.xAxes.push(am5xy.DateAxis.new(this.root, {
      renderer: am5xy.AxisRendererX.new(this.root, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9
      }),
      baseInterval: { timeUnit: "second", count: 1 },
      gridIntervals: [
        { timeUnit: "second", count: 1 },
        { timeUnit: "second", count: 2 },
        { timeUnit: "second", count: 15 },
        { timeUnit: "second", count: 30 },
        { timeUnit: "minute", count: 1 },
        { timeUnit: "minute", count: 2 },
        { timeUnit: "minute", count: 15 },
        { timeUnit: "minute", count: 30 },
        { timeUnit: "hour", count: 1 },
        { timeUnit: "hour", count: 4 },
        { timeUnit: "hour", count: 12 },
        { timeUnit: "day", count: 1 },
        { timeUnit: "day", count: 7 },
        { timeUnit: "month", count: 1 },
      ],
      
    }));

    // Add to cursor
    if (this.cursor) {
      this.cursor!.set("xAxis", this.axis);
    }

    this.setOpposite();
    this.setShowTooltip();
    this.setTooltipDateFormat();
    this.setMin();
    this.setMax();

    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from cursor
    if (this.cursor) {
      this.cursor.set("xAxis", undefined);
    }

    // Remove from chart
    this.chart.xAxes.removeValue(this.axis!);

    // Dispose
    this.axis!.dispose();
  }
}
</script>