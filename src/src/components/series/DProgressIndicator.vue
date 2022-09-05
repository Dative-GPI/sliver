<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, LEGEND, XAXIS } from "../../literals";


@Component({})
export default class DProgressIndicator extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.ValueAxis<am5xy.AxisRendererX>;

  @InjectReactive(XAXIS)
  yAxis!: am5xy.ValueAxis<am5xy.AxisRendererY>;

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

  progressIndicator: any = null;

  upAndRunning: boolean = false;

  setName(): void {
    // Remove from legend
    if (this.legend != null) {
      this.legend.data.removeValue(this.progressIndicator!);
    }

    this.progressIndicator!.set("name", this.name);

    // Add to legend (otherwise the name is not updated)
    if (this.legend != null) {
      this.legend.data.push(this.progressIndicator!);
    }
  }

  setValue(): void {
    this.progressIndicator!.animate({
      key: "value",
      to: this.value,
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic)
    });
  }

  setColorIndex(): void {
    // Remove from legend
    if (this.legend != null) {
      this.legend.data.removeValue(this.progressIndicator!);
    }

    let color = this.chart!.get("colors")!.getIndex(this.colorIndex);

    this.progressIndicator!.set("fill", color);
    this.progressIndicator!.get("bullet").get("sprite").set("fill", color);

    // Add to legend (otherwise the name is not updated)
    if (this.legend != null) {
      this.legend.data.push(this.progressIndicator!);
    }
  }

  mounted(): void {
    // Add to axis
    this.progressIndicator = this.xAxis.makeDataItem({
      bullet: am5xy.AxisBullet.new(this.root, {
        sprite: am5.Graphics.new(this.root, {
          tooltipY: 0,
          tooltipText: "{name}: [bold]{value}[/]",
          tooltip: am5.Tooltip.new(this.root, {
            getFillFromSprite: true,
            getStrokeFromSprite: true,
            autoTextColor: false
          }),
          centerY: 85,
          centerX: am5.p50,
          svgPath: "M40.8 20.4C40.8 9.1 31.7 0 20.4 0C9.1 0 0 9.1 0 20.4C0 31.7 20.4 52.8 20.4 52.8C20.4 52.8 40.8 31.7 40.8 20.4Z"
        })
      })
    });

    this.setName();
    this.setColorIndex();

    this.xAxis.createAxisRange(this.progressIndicator);

    this.setValue();
    
    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from legend
    if (this.legend) {
      this.legend.data.removeValue(this.progressIndicator);
    }

    // Remove from axis
    this.xAxis.axisRanges.removeValue(this.progressIndicator!);

    // Dispose
    if (this.progressIndicator != null && !this.progressIndicator!.isDisposed()) {
      this.xAxis!.disposeDataItem(this.progressIndicator!);
    }
  }
}
</script>