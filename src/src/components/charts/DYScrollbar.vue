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
export default class DYScrollbar extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @Prop({ required: false, default: true })
  enabled!: boolean;

  @Watch("enabled")
  onEnabledChange = this.setEnabled;

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

  upAndRunning: boolean = false;

  setHeight(): void {
    if (this.scrollbar != null) {
      this.scrollbar!.set("height", this.height);
    }
  }

  setStartGripVisible(): void {
    if (this.scrollbar != null) {
      this.scrollbar!.startGrip.set("visible", this.startGripVisible);
    }
  }

  setEndGripVisible(): void {
    if (this.scrollbar != null) {
      this.scrollbar!.endGrip.set("visible", this.endGripVisible);
    }
  }

  setEnabled(): void {
    if (this.enabled) {
      // Add to chart
      this.scrollbar = this.chart.set("scrollbarY", am5xy.XYChartScrollbar.new(this.root, {
        orientation: "vertical"
      }));

      this.setHeight();
      this.setStartGripVisible();
      this.setEndGripVisible();
    }
    else if (this.scrollbar != null) {
      // Remove from chart
      this.chart!.set("scrollbarY", undefined);

      // Dispose
      this.scrollbar!.dispose();
      this.scrollbar = null;
    }
  }

  mounted(): void {
    if (this.enabled) {
      // Add to chart
      this.scrollbar = this.chart.set("scrollbarY", am5xy.XYChartScrollbar.new(this.root, {
        orientation: "vertical"
      }));
      
      this.scrollbar.startGrip.set("width", 10);
      this.scrollbar.startGrip.set("height", 20);
      this.scrollbar.startGrip.set("icon", undefined);
      
      this.scrollbar.endGrip.set("width", 10);
      this.scrollbar.endGrip.set("height", 20);
      this.scrollbar.endGrip.set("icon", undefined);

      this.setHeight();
      this.setStartGripVisible();
      this.setEndGripVisible();
    }

    this.upAndRunning = true;
  }

  destroyed(): void {
    if (this.scrollbar != null) {
      // Remove from chart
      this.chart!.set("scrollbarY", undefined);

      // Dispose
      this.scrollbar!.dispose();
    }
  }
}
</script>