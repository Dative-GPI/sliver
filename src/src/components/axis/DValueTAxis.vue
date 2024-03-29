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
import { isEmptyString } from "../../helpers";
import { ValueRange } from "../../models";

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
  ranges!: ValueRange[] | undefined;

  @Watch("ranges")
  onRangesChange = this.setRanges;

  @Prop({ required: false, default: undefined })
  unit!: string | undefined;

  @ProvideReactive(XAXIS)
  axis: any = null;

  rangeItems: am5.DataItem<am5xy.IValueAxisDataItem>[] = [];

  upAndRunning: boolean = false;

  setMin(): void {
    this.axis!.set("min", this.min);
  }

  setMax(): void {
    this.axis!.set("max", this.max);
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
      axisRange.get("tick").set("strokeOpacity", 0);
      axisRange.get("axisFill").setAll({
        visible: true,
        fillOpacity: range.opacity,
        fill: am5.color(range.color)
      });
      if (!isEmptyString(range.label)) {
        axisRange.get("label").setAll({
          text: range.label,
          inside: true,
          radius: 10,
          fill: am5.color(range.color)
        });
      }
      this.rangeItems.push(axisRange);
    }
  }

  setUnit(): void {
    if (this.unit != null) {
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
    this.axis = this.chart.xAxes.push(am5xy.ValueAxis.new(this.root, {
      renderer: am5radar.AxisRendererCircular.new(this.root, {}),
      numberFormatter: am5.NumberFormatter.new(this.root, {
        numberFormat: "#.# a"
      })
    }));

    this.setMin();
    this.setMax();
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
    this.setUnit();

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