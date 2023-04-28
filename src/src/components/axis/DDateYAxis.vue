<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { Component, InjectReactive, Vue, Prop, ProvideReactive, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, YAXIS, YAXISVALIDATED } from "../../literals";
import { Days, IconLine, TimeRange } from "../../models";
import { isEmptyString, textColor } from "../../helpers";

@Component({})
export default class DDateYAxis extends Vue {
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

  @Prop({ required: false, default: false })
  scrollbar!: boolean;

  @Watch("scrollbar")
  onScrollbarChange = this.setLines;

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

  @Prop({ required: false, default: null })
  maxZoomFactor!: number | null;

  @Watch("maxZoomFactor")
  onMaxZoomFactorChange = this.setMaxZoomFactor;

  @Prop({ required: false, default: undefined })
  lines!: IconLine[] | undefined;

  @Watch("lines", { deep: true })
  onLinesChange = this.setLines;

  @Prop({ required: false, default: undefined })
  ranges!: TimeRange[] | undefined;

  @Watch("ranges", { deep: true })
  onRangesChange = this.setRanges;

  @ProvideReactive(YAXIS)
  axis: any = null;

  @ProvideReactive(YAXISVALIDATED)
  serieValidated: () => void = _.debounce(() => { this.setLines(); this.setRanges(); }, 500);

  tooltip: am5.Tooltip | null = null;
  lineItems: am5.DataItem<am5xy.IDateAxisDataItem>[] = [];
  rangeItems: am5.DataItem<am5xy.IDateAxisDataItem>[] = [];

  upAndRunning: boolean = false;

  setOpposite(): void {
    this.axis!.get("renderer").set("opposite", this.opposite);
  }

  setShowTooltip(): void {
    if (!this.showTooltip) {
      if (this.tooltip != null && !this.tooltip.isDisposed()) {
        let hideCursor = false;
        if (this.cursor != null && this.cursor!.lineY.get("visible")) {
          this.cursor!.lineY.set("visible", false);
          this.cursor!.set("yAxis", undefined);
          hideCursor = true;
        }
        this.tooltip!.dispose();
        this.axis!.set("tooltip", undefined);
        this.tooltip = null;
        if (this.cursor != null && hideCursor) {
          this.cursor!.lineY.set("visible", true);
          this.cursor!.set("yAxis", this.axis!);
        }
      }
    }
    else {
      let hideCursor = false;
      if (this.cursor != null && this.cursor!.lineY.get("visible")) {
        this.cursor!.lineY.set("visible", false);
        this.cursor!.set("yAxis", undefined);
        hideCursor = true;
      }
      this.tooltip = am5.Tooltip.new(this.root, {});
      this.axis!.set("tooltip", this.tooltip);
      if (this.cursor != null && hideCursor) {
        this.cursor!.lineY.set("visible", true);
        this.cursor!.set("yAxis", this.axis!);
      }
    }
  }

  setTooltipDateFormat(): void {
    this.axis!.set("tooltipDateFormat", this.tooltipDateFormat);
  }

  setMin(): void {
    this.axis!.set("min", this.min);
  }

  setMax(): void {
    this.axis!.set("max", this.max);
  }

  setMaxZoomFactor(): void {
    this.axis!.set("maxZoomFactor", this.maxZoomFactor);
  }

  setLines(): void {
    // Remove former lines
    for (let lineItem of this.lineItems) {
      this.axis!.axisRanges!.removeValue(lineItem);
      lineItem.dispose();
    }
    this.lineItems = [];

    if (this.lines == null || this.lines.length < 1) {
      return;
    }

    for (let line of this.lines) {
      // Create a line
      let axisRange = this.axis!.createAxisRange(this.axis!.makeDataItem({
        above: true,
        value: line.value
      }));
      if (axisRange.get("grid") != null) {
        axisRange.get("grid")!.setAll({
          strokeDasharray: [5, 3, 1, 3],
          strokeOpacity: 1,
          strokeWidth: 1,
          stroke: am5.color(line.color)
        });
      }
      if (!isEmptyString(line.icon)) {
        axisRange.get("label")!.setAll({
          html: `
            <div class="${this.scrollbar ? "dy-line-container-large" : "dy-line-container-small"}">
              <i class="material-icons dy-line-icon" style="color: ${line.color};">
                ${line.icon}
              </i>
              <div class="dy-line-tooltip" style="background-color: ${line.color}7A; color: ${textColor(line.color)};">
                ${line.tooltip.map(s => `<span>${s}</span>`).join("")}
              </div>
            </div>`
        });
      }
      this.lineItems.push(axisRange);
    }
  }

  setRanges(): void {
    // Remove former ranges
    for (let rangeItem of this.rangeItems) {
      this.axis!.axisRanges!.removeValue(rangeItem);
      rangeItem.dispose();
    }
    this.rangeItems = [];

    if (this.ranges == null || this.ranges.length < 1) {
      return;
    }
    
    // Map all days ranges
    let mappedRanges = this.ranges
      .filter(r => r.startDay === Days.AllDays)
      .map((r: TimeRange): TimeRange[] =>
        Object.values(Days).filter((d: string | Days) => typeof(d) === "number" && d !== Days.AllDays)
          .map((d: string | Days): TimeRange => {
            let endDay = (r.startHour * 60 + r.startMinute) > (r.endHour * 60 + r.endMinute) ? ((d as Days) + 1)%7 : (d as Days);
            return { ...r, startDay: d as Days, endDay };
          })
      )
      .reduce((acc: TimeRange[], val: TimeRange[]): TimeRange[] => acc.concat(val), [])
      .concat(this.ranges.filter(r => r.startDay !== Days.AllDays && r.endDay !== Days.AllDays));

    // Get first monday of boundaries at midnight
    let startEpoch = this.axis!.positionToDate(0).getTime() - ((this.axis!.positionToDate(0).getTime() - 345600000) % 604800000);

    // Get last monday of boundaries at midnight
    let endEpoch = this.axis!.positionToDate(1).getTime() + 604800000 - ((this.axis!.positionToDate(1).getTime() + 259200000) % 604800000);

    while (startEpoch < endEpoch) {
      for (let range of mappedRanges) {
        let start = startEpoch + (range.startDay * 86400000) + (range.startHour * 3600000) + (range.startMinute * 60000);

        let end = startEpoch + (range.endDay * 86400000) + (range.endHour * 3600000) + (range.endMinute * 60000);
        if (range.startDay > range.endDay) {
          end += 604800000;
        }

        // Create a range
        let axisRange = this.axis!.createAxisRange(this.axis!.makeDataItem({
          value: start,
          endValue: end
        }));

        axisRange.get("grid").set("strokeOpacity", 0);
        axisRange.get("axisFill").setAll({
          visible: true,
          fillOpacity: range.opacity,
          fill: am5.color(range.color)
        });
        if (!isEmptyString(range.label)) {
          axisRange.get("label").setAll({
            text: range.label,
            inside: true,
            centerY: 23,
            fill: am5.color(range.color)
          });
        }
        this.rangeItems.push(axisRange);
      }

      // Iterate
      startEpoch += 604800000;
    }
  }

  mounted(): void {
    // Add to chart
    this.axis = this.chart.yAxes.push(am5xy.DateAxis.new(this.root, {
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
        { timeUnit: "month", count: 1 }
      ]
    }));

    // Add to cursor
    if (this.cursor != null) {
      this.cursor!.set("yAxis", this.axis);
    }

    this.setOpposite();
    this.setShowTooltip();
    this.setTooltipDateFormat();
    this.setMin();
    this.setMax();
    this.setMaxZoomFactor();

    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from cursor
    if (this.cursor) {
      this.cursor!.set("yAxis", undefined);
    }

    // Remove from chart
    this.chart.yAxes.removeValue(this.axis!);

    // Dispose
    this.axis!.dispose();
  }
}
</script>

<style>
.am5-html-container > div:has(.dy-line-container-large) {
  overflow: visible !important;
  right: 30px !important;
}

.am5-html-container > div:has(.dy-line-container-small) {
  overflow: visible !important;
  right: -8px !important;
}

.dy-line-container-large,
.dy-line-container-small {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
}

.dy-line-icon {
  font-size: 20px !important;
  user-select: none;
}

.dy-line-tooltip {
  position: absolute;
  top: 23px;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 4px;
}

.dy-line-icon:hover + .dy-line-tooltip {
  display: flex;
}

.dy-line-tooltip > * {
  white-space:nowrap;
}
</style>