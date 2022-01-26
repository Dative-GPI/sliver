<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue, Prop, ProvideReactive, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, XAXIS } from "../../literals";
import { textColor } from "../../helpers";

@Component({})
export default class DValueTAxis extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5radar.RadarChart;

  @Prop({ required: false, default: 0 })
  maxDeviation!: number;

  @Watch("maxDeviation")
  onMaxDeviationCHange = this.setMaxDeviation;

  @Prop({ required: false, default: true })
  strictMinMax!: boolean;

  @Watch("strictMinMax")
  onStrictMinMaxChange = this.setStrictMinMax;

  @Prop({ required: false, default: 0 })
  min!: number;

  @Watch("min")
  onMinChange = this.setMin;

  @Prop({ required: false, default: 180 })
  max!: number;

  @Watch("max")
  onMaxChange = this.setMax;

  @Prop({ required: false, default: -10 })
  radius!: number;

  @Watch("radius")
  onRadiusChange = this.setRadius;

  @Prop({ required: false, default: -30 })
  innerRadius!: number;

  @Watch("innerRadius")
  onInnerRadiusChange = this.setInnerRadius;

  @Prop({ required: false, default: 1 })
  strokeOpacity!: number;

  @Watch("strokeOpacity")
  onStrokeOpacityChange = this.setStrokeOpacity;

  @Prop({ required: false, default: 5 })
  strokeWidth!: number;

  @Watch("strokeWidth")
  onStrokeWidthChange = this.setStrokeWidth;

  @Prop({ required: false, default: true })
  gridForceHidden!: boolean;

  @Watch("gridForceHidden")
  onGridForceHiddenChange = this.setGridForceHidden;

  @Prop({ required: false, default: true })
  ticksVisible!: boolean;

  @Watch("ticksVisible")
  onChangeTicksVisible = this.setTicksVisible;

  @Prop({ required: false, default: 5 })
  ticksLength!: number;

  @Watch("ticksLength")
  onTicksLengthChange = this.setTicksLength;

  @Prop({ required: false, default: 1 })
  ticksStrokeOpacity!: number;

  @Watch("ticksStrokeOpacity")
  onTicksStrokeOpacityChange = this.setTicksStrokeOpacity;

  @Prop({ required: false, default: false })
  ticksInside!: boolean;

  @Watch("ticksInside")
  onTicksInsideChange = this.setTicksInside;

  @Prop({ required: false, default: false })
  labelsInside!: boolean;

  @Watch("labelsInside")
  onLabelsInsideChange = this.setLabelsInside;

  @Prop({ required: false, default: 5 })
  labelsRadius!: number;

  @Watch("labelsRadius")
  onLabelsRadiusChange = this.setLabelsRadius;

  @Prop({ required: false, default: undefined })
  ranges!: { lowBound: number; highBound: number; color: string; label: string; }[] | undefined;

  @Watch("ranges")
  onRangesChange = this.setRanges;

  @ProvideReactive(XAXIS)
  axis: am5xy.ValueAxis<am5radar.AxisRendererCircular> | any | null = null;

  upAndRunning = false;

  setMin(): void {
    let min = (this.ranges != null && this.ranges.length > 0) ?
      this.ranges.reduce((acc, cur) => Math.min(acc, cur.lowBound), this.ranges[0].lowBound) :
      this.min;

    this.axis!.set("min", min);
  }

  setMax(): void {
    let max = (this.ranges && this.ranges.length > 0) ?
      this.ranges.reduce((acc, cur) => Math.max(acc, cur.highBound), this.ranges[0].highBound) :
      this.max;

    this.axis!.set("max", max);
  }

  setMaxDeviation(): void {
    this.axis!.set("maxDeviation", this.maxDeviation);
  }

  setStrictMinMax(): void {
    this.axis!.set("strictMinMax", this.strictMinMax);
  }

  setRadius(): void {
    this.axis!.get("renderer").set("radius", this.radius);
  }

  setInnerRadius(): void {
    this.axis!.get("renderer").set("innerRadius", this.innerRadius);
  }

  setStrokeOpacity(): void {
    this.axis!.get("renderer").set("strokeOpacity", this.strokeOpacity);
  }

  setStrokeWidth(): void {
    this.axis!.get("renderer").set("strokeWidth", this.strokeWidth);
  }

  setGridForceHidden(): void {
    this.axis!.get("renderer").grid.template.set("forceHidden", this.gridForceHidden);
  }

  setTicksVisible(): void {
    this.axis!.get("renderer").ticks.template.set("visible", this.ticksVisible);
  }

  setTicksLength(): void {
    this.axis!.get("renderer").ticks.template.set("length", this.ticksLength);
  }

  setTicksStrokeOpacity(): void {
    this.axis!.get("renderer").ticks.template.set("strokeOpacity", this.ticksStrokeOpacity);
  }

  setTicksInside(): void {
    this.axis!.get("renderer").ticks.template.set("inside", this.ticksInside);
  }

  setLabelsRadius(): void {
    this.axis!.get("renderer").labels.template.set("radius", this.labelsRadius);
  }

  setLabelsInside(): void {
    this.axis!.get("renderer").labels.template.set("inside", this.labelsInside)
  }

  setRanges(): void {
    // Remove all DataItems except ClockHands
    for (let i = 0; i < this.axis!.axisRanges.values.length; i++) {
      let range = this.axis!.axisRanges.values[i];
      if (!range.get("bullet")) {
        this.axis!.axisRanges.removeValue(range!);
        range!.dispose();
        i--;
      }
    }
    
    if (this.ranges && this.ranges!.length > 0) {
      am5.array.each(this.ranges!, (range : { lowBound: number; highBound: number; color: string; label: string; }) => {
        let axisRange = this.axis!.createAxisRange(this.axis!.makeDataItem({}));

        axisRange.setAll({
          value: range.lowBound,
          endValue: range.highBound
        });

        axisRange.get("axisFill")!.setAll({
          fill: am5.color(range.color)
        });

        axisRange.get("label")!.setAll({
          text: range.label,
          inside: true,
          radius: 10,
          fill: textColor(range.color)
        });
      });
    }

    this.setMin();
    this.setMax();
  }
  
  mounted(): void {
    this.axis = this.chart.xAxes.push(am5xy.ValueAxis.new(this.root, {
      renderer: am5radar.AxisRendererCircular.new(this.root, {})
    }));

    this.setMaxDeviation();
    this.setStrictMinMax();

    this.setRadius();
    this.setInnerRadius();
    this.setStrokeOpacity();
    this.setStrokeWidth();
    
    this.setGridForceHidden();
    
    this.setTicksVisible();
    this.setTicksLength();
    this.setTicksStrokeOpacity();
    this.setTicksInside();

    this.setLabelsRadius();
    this.setLabelsInside();

    this.setRanges();

    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from chart
    this.chart.xAxes.removeValue(this.axis!);

    // Dispose
    this.axis!.dispose();
  }
}
</script>