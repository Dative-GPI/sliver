<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, LEGEND, XAXIS } from "../../literals";
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

  @Prop({ required: false, default: 0 })
  value!: number;

  @Watch("value")
  onValueChange = this.setValue;

  @Prop({ required: false, default: 0 })
  colorIndex!: number;

  @Watch("colorIndex")
  onColorIndexChange = this.setColorIndex;

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

  colorSet: am5.ColorSet | null = null;
  clockHand: am5radar.ClockHand | null = null;
  axisDataItem: any = null;

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

  setValue(): void {
    this.axisDataItem!.animate({
      key: "value",
      to: this.value,
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic)
    });
  }

  setColorIndex(): void {
    let color = this.colorSet!.getIndex(this.colorIndex);

    this.clockHand!.pin.set("fill", color);
    this.clockHand!.hand.set("fill", color);

    // Remove from legend
    if (this.legend) {
      this.legend.data.removeValue(this.axisDataItem);
    }
    this.axisDataItem!.set("fill", color);

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
    this.clockHand!.hand.set("tooltipText", this.handTooltipText);
  }

  setHandTooltipX(): void {
    this.clockHand!.hand.set("tooltipX", am5.percent(this.handTooltipX));
  }

  mounted(): void {
    this.colorSet = am5.ColorSet.new(this.root, {});

    this.clockHand = am5radar.ClockHand.new(this.root, {
      userData: { serie: SerieEnum.ClockHand }
    });

    // Add to axis
    this.axisDataItem = this.xAxis.makeDataItem({
      bullet: am5xy.AxisBullet.new(this.root, {
        sprite: this.clockHand
      })
    });

    this.setName();
    this.setColorIndex();
    this.setPinRadius();
    this.setBottomWidth();
    this.setClockHandRadius();
    this.setHandTooltipText();
    this.setHandTooltipX();

    this.xAxis.createAxisRange(this.axisDataItem);
    
    this.setValue();
    
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
    this.xAxis!.disposeDataItem(this.axisDataItem!);
    this.clockHand!.dispose();
    this.colorSet!.dispose();
  }
}
</script>