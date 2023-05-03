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

import { AMROOT, CHART, CURSOR, XAXIS, XAXISVALIDATED } from "../../literals";
import { isEmptyString } from "../../helpers";
import { ValueRange } from "../../models";

@Component({})
export default class DValueXAxis extends Vue {
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
  logarithmic!: boolean;

  @Watch("logarithmic")
  onLogarithmicChange = this.setLogarithmic;

  @Prop({ required: false, default: true })
  showGrid!: boolean;

  @Watch("showGrid")
  onShowGridChange = this.setShowGrid;

  @Prop({ required: false, default: true })
  showLabels!: boolean;

  @Watch("showLabels")
  onShowLabelsChange = this.setShowLabels;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: undefined })
  min!: number | undefined;

  @Watch("min")
  onMinChange = this.setMin;

  @Prop({ required: false, default: undefined })
  max!: number | undefined;

  @Watch("max")
  onMaxChange = this.setMax;

  @Prop({ required: false, default: false })
  strictMinMax!: boolean;

  @Watch("strictMinMax")
  onStrictMinMaxChange = this.setStrictMinMax;

  @Prop({ required: false, default: undefined })
  ranges!: ValueRange[] | undefined;

  @Watch("ranges")
  onRangesChange = this.setRanges;

  @Prop({ required: false, default: 0 })
  strokeOpacity!: number;

  @Watch("strokeOpacity")
  onStrokeOpacityChange = this.setStrokeOpacity;

  @Prop({ required: false, default: 1 })
  strokeWidth!: number;

  @Watch("strokeWidth")
  onStrokeWidthChange = this.setStrokeWidth;

  @Prop({ required: false, default: undefined })
  unit!: string | undefined;

  @Watch("unit")
  onUnitChange = this.setUnit;

  @ProvideReactive(XAXIS)
  axis: any = null;

  @ProvideReactive(XAXISVALIDATED)
  serieValidated: () => void = _.debounce(this.setRanges, 500);

  tooltip: am5.Tooltip | null = null;
  rangeItems: am5.DataItem<am5xy.IValueAxisDataItem>[] = [];

  upAndRunning: boolean = false;

  setOpposite(): void {
    this.axis!.get("renderer").set("opposite", this.opposite);
  }

  setLogarithmic(): void {
    this.axis!.set("logarithmic", this.logarithmic);
    if (this.logarithmic) {
      this.axis!.set("treatZeroAs", 0.0000001);
    }
    else {
      this.axis!.set("treatZeroAs", 0);
    }
  }

  setShowGrid(): void {
    this.axis!.get("renderer").grid.template.set("visible", this.showGrid);
  }

  setShowLabels(): void {
    this.axis!.get("renderer").labels.template.set("visible", this.showLabels);
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

  setMin(): void {
    if (this.logarithmic && this.min === 0) {
      this.axis!.set("min", 0.0000001);
    }
    else {
      this.axis!.set("min", this.min);
    }
  }

  setMax(): void {
    if (this.logarithmic && this.max === 0) {
      this.axis!.set("max", 0.0000001);
    }
    else {
      this.axis!.set("max", this.max);
    }
  }

  setStrictMinMax(): void {
    this.axis!.set("strictMinMax", this.strictMinMax);
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

    for (let range of this.ranges) {
      let axisRange = this.axis!.createAxisRange(this.axis!.makeDataItem({
        value: range.startValue,
        endValue: range.endValue
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
          centerY: 23 + this.strokeWidth,
          fill: am5.color(range.color)
        });
      }
      this.rangeItems.push(axisRange);
    }
  }

  setStrokeOpacity(): void {
    this.axis!.get("renderer").set("strokeOpacity", this.strokeOpacity);
  }

  setStrokeWidth(): void {
    this.axis!.get("renderer").set("strokeWidth", this.strokeWidth);
  }

  setUnit(): void {
    if (this.unit != null) {
      if (this.tooltip != null) {
        this.tooltip.label.adapters.remove("text");
        this.tooltip.label.adapters.add("text", (value?: string) => {
          if (this.unit != null) {
            return value + this.unit;
          }
          return value;
        });
      }
      this.axis.get("renderer").labels.template.adapters.remove("text");
      this.axis.get("renderer").labels.template.adapters.add("text", (value?: string) => {
        if (value != null && !isNaN(parseInt(value))) {
          return value + this.unit;
        }
        return value;
      });
    }
  }

  mounted(): void {
    // Add to chart
    this.axis = this.chart.xAxes.push(am5xy.ValueAxis.new(this.root, {
      renderer: am5xy.AxisRendererX.new(this.root, {}),
      numberFormatter: am5.NumberFormatter.new(this.root, {
        numberFormat: "#.# a"
      })
    }));

    // Add to cursor
    if (this.cursor) {
      this.cursor!.set("xAxis", this.axis);
    }

    this.setOpposite();
    this.setLogarithmic();
    this.setShowGrid();
    this.setShowLabels();
    this.setShowTooltip();
    this.setMin();
    this.setMax();
    this.setStrictMinMax();
    this.setStrokeOpacity();
    this.setStrokeWidth();
    this.setUnit();

    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from cursor
    if (this.cursor) {
      this.cursor!.set("xAxis", undefined);
    }

    // Remove from chart
    this.chart.xAxes.removeValue(this.axis!);

    // Dispose
    this.axis!.dispose();
  }
}
</script>