<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue, Prop, ProvideReactive, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, XAXIS, XAXISVALIDATED } from "../../literals";
import { textColor, TimeRange } from "../../helpers";

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

  @Prop({ required: false, default: undefined })
  ranges!: TimeRange[] | undefined;

  @Watch("ranges", { deep: true })
  onRangesChange = this.setRanges;

  @ProvideReactive(XAXIS)
  axis: any = null;

  @ProvideReactive(XAXISVALIDATED)
  serieValidated: () => void = this.setRanges;

  @Prop({ required: false, default: () => [null, null] })
  selection!: (number | null)[];

  @Watch("selection")
  onSelectionChange(): void {
    if (this.selection.length !== 2 || (this.selection[0] == null && this.selection[1] == null)) {
      this.axis!.zoom(0, 1, 0);
    }
    else {
      let start = new Date(0);
      let end = new Date(0);
      start.setTime(this.selection[0]!);
      end.setTime(this.selection[1]!);
      this.axis!.zoomToDates(start, end);
    }
  }

  tooltip: am5.Tooltip | null = null;
  start: Date | null = null;
  end: Date | null = null;
  dataItems: am5.DataItem<am5xy.IDateAxisDataItem>[] = [];

  upAndRunning: boolean = false;

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

  setRanges(): void {
    // If there is no more ranges, remove all and return
    if (this.ranges == null || !this.ranges.length) {
      for (let i = 0; i < this.dataItems.length; i++) {
        this.dataItems[i].dispose();
      }
      this.dataItems = [];
      return;
    }

    // Get axis boundaries
    let gs = this.axis!.positionToDate(0);
    let ge = this.axis!.positionToDate(1);

    gs.setDate(gs.getDate() - gs.getDay() - 6);
    ge.setDate(ge.getDate() - ge.getDay() + 7);

    // Remove former ranges
    for (let i = 0; i < this.dataItems.length; i++) {
      this.dataItems[i].dispose();
    }
    this.dataItems = [];

    // Get first monday of boundaries at midnight
    let current = new Date(Date.UTC(gs.getFullYear(), gs.getMonth(), gs.getDate()));

    // Get timezone offset
    let offset = this.root!.timezone!.offsetUTC(new Date(Date.UTC(gs.getFullYear(), gs.getMonth(), gs.getDate())));

    while (current < ge) {
      am5.array.each(this.ranges!, (range : TimeRange) => {
        let start = new Date(current);

        start.setDate(start.getDate() + range.startDay);
        start.setHours(start.getHours() + range.startHour);
        start.setMinutes(start.getMinutes() + range.startMinute);

        let end = new Date(current);
        if (range.startDay > range.endDay) {
          end.setDate(end.getDate() + range.endDay + 7);
        }
        else {
          end.setDate(end.getDate() + range.endDay);
        }
        end.setHours(end.getHours() + range.endHour);
        end.setMinutes(end.getMinutes() + range.endMinute);

        // Create a range
        let axisRange = this.axis!.createAxisRange(this.axis!.makeDataItem({}));
        axisRange.set("value", start.getTime() + (offset * 60 * 1000));
        axisRange.set("endValue", end.getTime() + (offset * 60 * 1000));
        axisRange.get("grid")!.set("strokeOpacity", 0);

        axisRange.get("axisFill")!.setAll({
          visible: true,
          fillOpacity: range.opacity,
          fill: am5.color(range.color)
        });

        if (!(range.label == null || range.label === "" || /^\s*$/.test(range.label))) {
          axisRange.get("label")!.setAll({
            text: range.label,
            inside: true,
            centerY: 30,
            fill: textColor(range.color)
          });
        }

        this.dataItems.push(axisRange);
      });

      // Iterate
      current.setDate(current.getDate() + 7);
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

    // Apply zoom if needed
    this.onSelectionChange();

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