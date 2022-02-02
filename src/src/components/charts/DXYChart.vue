<template>
  <div ref="xychart" :id="'xychart'" style="width: 100%; height: 100%;">
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, ProvideReactive, Vue, Prop, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { AMROOT, CHART } from "../../literals";

@Component({})
export default class DXYChart extends Vue {
  @ProvideReactive(AMROOT)
  root: am5.Root | null = null;

  @ProvideReactive(CHART)
  chart: am5xy.XYChart | null = null;

  @Prop({ required: false, default: "panX" })
  wheelX!: "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | undefined;

  @Watch("wheelX")
  onWheelXChange = this.setWheelX;

  @Prop({ required: false, default: "zoomX" })
  wheelY!: "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | undefined;

  @Watch("wheelY")
  onWheelYChange = this.setWheelY;

  upAndRunning = false;

  setWheelX(): void {
    this.chart!.set("wheelX", this.wheelX);
  }

  setWheelY(): void {
    this.chart!.set("wheelY", this.wheelY);
  }

  mounted(): void {
    // Create root
    this.root = am5.Root.new((this.$refs.xychart as HTMLElement));
    this.root.setThemes([ am5themes_Animated.new(this.root) ]);

    // Add chart to root
    this.chart = this.root.container.children.push(am5xy.XYChart.new(this.root, {
      layout: this.root.verticalLayout
    }));

    this.setWheelX();
    this.setWheelY();

    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove chart from root
    this.root!.container.children.removeValue(this.chart!);
    
    // Dispose
    this.chart!.dispose();
    this.root!.dispose();
  }
}
</script>