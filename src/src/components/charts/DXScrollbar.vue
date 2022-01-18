<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, InjectReactive, Prop, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART } from "../../literals";

@Component({})
export default class DXScrollbar extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @Prop({ required: false, default: 5 })
  height!: number;

  @Watch("height")
  onHeightChange = this.setHeight;

  @Prop({ required: false, default: true })
  startGripVisible!: boolean;

  @Watch("startGripVisible")
  onStartGripVisibleChange = this.setStartGripVisible;

  @Prop({ required: false, default: true })
  endGripVisible!: boolean;

  @Watch("endGripVisible")
  onEndGripVisibleChange = this.setEndGripVisible;

  scrollbar: am5xy.XYChartScrollbar | null = null;

  upAndRunning = false;

  setHeight(): void {
    this.scrollbar!.set("height", this.height);
  }

  setStartGripVisible(): void {
    this.scrollbar!.startGrip.set("visible", this.startGripVisible);
  }

  setEndGripVisible(): void {
    this.scrollbar!.endGrip.set("visible", this.endGripVisible);
  }

  mounted(): void {
    // Add to chart
    this.scrollbar = this.chart.set("scrollbarX", am5xy.XYChartScrollbar.new(this.root, {
      orientation: "horizontal"
    }));

    this.setHeight();
    this.setStartGripVisible();
    this.setEndGripVisible();

    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from chart
    this.chart!.set("scrollbarX", undefined);

    // Dispose
    this.scrollbar!.dispose();
  }
}
</script>