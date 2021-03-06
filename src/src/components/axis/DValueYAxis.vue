<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue, Prop, ProvideReactive, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, YAXIS } from "../../literals";
import { AxisRange } from "../../helpers";

@Component({})
export default class DValueYAxis extends Vue {
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

  @Prop({ required: false, default: "#" })
  tooltipNumberFormat!: string;

  @Watch("tooltipNumberFormat")
  onTooltipNumberFormatChange = this.setTooltipNumberFormat;

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

  @Prop({ required: false, default: () => am5.percent(100) })
  height!: number | am5.Percent | undefined;

  @Watch("height")
  onHeightChange = this.setHeight;

  @Prop({ required: false, default: undefined })
  ranges!: AxisRange[] | undefined;

  @Watch("ranges")
  onRangesChange = this.setRanges;

  @ProvideReactive(YAXIS)
  axis: any = null;

  tooltip: am5.Tooltip | null = null;

  upAndRunning = false;

  setOpposite(): void {
    this.axis!.get("renderer").set("opposite", this.opposite);
  }

  setLogarithmic(): void {
    this.axis!.set("logarithmic", this.logarithmic);
    if (this.logarithmic) {
      this.axis!.set("treatZeroAs", 0.0000001);
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

  setTooltipNumberFormat(): void {
    this.axis!.set("tooltipNumberFormat", this.tooltipNumberFormat);
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

  setHeight(): void {
    this.axis!.set("height", this.height);
  }
  
  setRanges(): void {
    for (let i = this.axis!.axisRanges.values.length - 1; i >= 0; i--) {
      let range = this.axis!.axisRanges.values[i];
      this.axis!.axisRanges.removeValue(range!);
      range!.dispose();
    }
    
    if (this.ranges && this.ranges!.length > 0) {
      am5.array.each(this.ranges!, (range : AxisRange) => {
        let axisRange = this.axis!.createAxisRange(this.axis!.makeDataItem({}));

        axisRange.get("axisFill")!.setAll({
          visible: true,
          fillOpacity: range.opacity,
          fill: am5.color(range.color)
        });

        // TODO : Pourquoi ça marche avec les axes T et X et pas Y ?
        // if (!(range.label == null || range.label === "" || /^\s*$/.test(range.label))) {
        //   axisRange.get("label")!.setAll({
        //     text: range.label,
        //     inside: true,
        //     centerX: 0,
        //     radius: 10,
        //     fill: textColor(range.color)
        //   });
        // }

        axisRange.setAll({
          value: range.startValue,
          endValue: range.endValue
        });
      });
    }
  }

  mounted(): void {
    // Add to chart
    this.axis = this.chart.yAxes.push(am5xy.ValueAxis.new(this.root, {
      renderer: am5xy.AxisRendererY.new(this.root, {}),
      numberFormat: "#a"
    }));

    // Add to cursor
    if (this.cursor) {
      this.cursor!.set("yAxis", this.axis);
    }

    this.setOpposite();
    this.setLogarithmic();
    this.setShowGrid();
    this.setShowLabels();
    this.setShowTooltip();
    this.setTooltipNumberFormat();
    this.setMin();
    this.setMax();
    this.setStrictMinMax();
    this.setHeight();
    this.setRanges();

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