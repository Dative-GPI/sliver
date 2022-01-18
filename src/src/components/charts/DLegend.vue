<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue, Prop, ProvideReactive, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, LEGEND } from "../../literals";

@Component({})
export default class DLegend extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart | am5percent.PieChart | am5radar.RadarChart;

  @Prop({ required: false, default: true })
  enabled!: boolean;

  @Prop({ required: false, default: 50 })
  x!: number;

  @Watch("x")
  onXChange = this.setX;

  @Prop({ required: false, default: 50 })
  centerX!: number;

  @Watch("centerX")
  onCenterXChange = this.setCenterX;

  @ProvideReactive(LEGEND)
  legend: am5.Legend | null = null;

  upAndRunning = false;

  setX(): void {
    if (this.enabled) {
      this.legend!.set("x", am5.percent(this.x));
    }
  }

  setCenterX(): void {
    if (this.enabled) {
      this.legend!.set("centerX", am5.percent(this.centerX));
    }
  }

  mounted(): void {
    if (this.enabled) {
      // Add to chart
      this.legend = this.chart.children.push(am5.Legend.new(this.root, {}));

      this.setX();
      this.setCenterX();
    }

    this.upAndRunning = true;
  }

  destroyed(): void {
    if (this.enabled) {
      // Remove from chart
      this.chart!.children.removeValue(this.legend!);

      // Dispose
      this.legend!.dispose();
    }
  }
}
</script>