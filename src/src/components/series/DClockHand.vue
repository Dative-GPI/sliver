<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";

import { AMROOT, CHART, LEGEND, XAXIS } from "../../literals";
import { ColorSets, GetHashedColor } from "../../colors";
import { SerieEnum } from "../../enums";

@Component({})
export default class DClockHand extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.ValueAxis<am5radar.AxisRendererCircular>;

  @InjectReactive(LEGEND)
  legend!: am5.Legend | null;

  @Prop({ required: true })
  name!: string;

  @Watch("name")
  onNameChange = this.setName;

  @Prop({ required: false, default: "" })
  unit!: string;

  @Watch("unit")
  onUnitChange = this.setHandTooltipText;

  @Prop({ required: false, default: 0 })
  colorIndex!: number;

  @Watch("colorIndex")
  onColorIndexChange = this.setColor;

  @Prop({ required: false, default: ColorSets.Default })
  colorSet!: ColorSets;

  @Watch("colorSet")
  onColorSetChange = this.setColor;

  @Prop({ required: false, default: "" })
  colorSeed!: string;

  @Watch("colorSeed")
  onColorSeedChange = this.setColor;

  @Prop({ required: false, default: 5 })
  pinRadius!: number;

  @Watch("pinRadius")
  onPinRadiusChange = this.setPinRadius;

  @Prop({ required: false, default: 10 })
  bottomWidth!: number;

  @Watch("bottomWidth")
  onBottomWidthChange = this.setBottomWidth;

  @Prop({ required: false, default: 95 })
  clockHandRadius!: number;

  @Watch("clockHandRadius")
  onClockHandRadiusChange = this.setClockHandRadius;

  @Prop({ required: false, default: "{name}: {value}" })
  handTooltipText!: string;

  @Watch("handTooltipText")
  onHandTooltipTextChange = this.setHandTooltipText;

  @Prop({ required: false, default: 95 })
  handTooltipX!: number;

  @Watch("handTooltipX")
  onHandTooltipXChange = this.setHandTooltipX;

  @Prop({ required: false, default: false })
  defaultHidden!: boolean;

  @Prop({ required: false, default: 0 })
  value!: number;

  @Watch("value")
  onValueChange = this.setValue;

  get color(): am5.Color {
    switch (this.colorSet) {
      case ColorSets.Hash: return GetHashedColor(this.colorSeed, this.name);
      default: return this.chart.get("colors")!.getIndex(this.colorIndex);
    }
  }

  clockHand: am5radar.ClockHand | null = null;
  axisDataItem: any = null;
  axisRange: any = null;

  upAndRunning: boolean = false;

  setName(): void {
    // Remove from legend
    if (this.legend != null) {
      this.legend.data.removeValue(this.axisDataItem!);
    }

    this.axisDataItem!.set("name", this.name);

    // Add to legend (otherwise the name is not updated)
    if (this.legend != null) {
      this.legend.data.push(this.axisDataItem!);
    }
  }

  setColor(): void {
    // Remove from legend
    if (this.legend) {
      this.legend.data.removeValue(this.axisDataItem);
    }

    this.clockHand!.pin.set("fill", this.color);
    this.clockHand!.hand.set("fill", this.color);
    this.axisDataItem!.set("fill", this.color);
    this.axisRange!.get("tick")!.set("stroke", this.color);

    // Add to legend (otherwise the color is not updated)
    if (this.legend != null) {
      this.legend.data.push(this.axisDataItem);
    }
  }

  setPinRadius(): void {
    this.clockHand!.set("pinRadius", this.pinRadius);
  }

  setBottomWidth(): void {
    this.clockHand!.set("bottomWidth", this.bottomWidth);
  }

  setClockHandRadius(): void {
    this.clockHand!.set("radius", am5.percent(this.clockHandRadius));
  }

  setHandTooltipText(): void {
    this.clockHand!.hand.set("tooltipText", this.handTooltipText + this.unit);
  }

  setHandTooltipX(): void {
    this.clockHand!.hand.set("tooltipX", am5.percent(this.handTooltipX));
  }

  setValue(): void {
    this.axisDataItem!.animate({
      key: "value",
      to: this.value,
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic)
    });
  }

  mounted(): void {
    this.clockHand = am5radar.ClockHand.new(this.root, {
      userData: { serie: SerieEnum.ClockHand }
    });

    // Add to axis
    this.axisDataItem = this.xAxis.makeDataItem({
      bullet: am5xy.AxisBullet.new(this.root, {
        sprite: this.clockHand
      })
    });
    this.axisRange = this.xAxis.createAxisRange(this.axisDataItem);
    this.axisRange.get("tick")!.set("strokeWidth", 2);

    this.setName();
    this.setColor();
    this.setPinRadius();
    this.setBottomWidth();
    this.setClockHandRadius();
    this.setHandTooltipText();
    this.setHandTooltipX();
    
    this.setValue();
    
    if (this.defaultHidden) {
      this.clockHand.hide();
      this.axisDataItem.hide();
    }
    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from legend
    if (this.legend) {
      this.legend.data.removeValue(this.axisDataItem);
    }

    // Remove from axis
    this.xAxis.axisRanges.removeValue(this.axisDataItem!);

    // Dispose
    if (this.axisDataItem != null && !this.axisDataItem!.isDisposed()) {
      this.xAxis!.disposeDataItem(this.axisDataItem!);
    }
    if (this.clockHand != null && !this.clockHand!.isDisposed()) {
      this.clockHand!.dispose();
    }
  }
}
</script>