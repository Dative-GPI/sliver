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

import { AMROOT, CHART, LEGEND, LEGEND_DEBUG } from "../../literals";
import { PositionEnum } from "../../enums";

@Component({})
export default class DHeatLegend extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart | am5percent.PieChart | am5radar.RadarChart;

  @Prop({ required: false, default: true })
  enabled!: boolean;

  @Watch("enabled")
  onEnabledChange = this.setEnabled;

  @Prop({ required: false, default: PositionEnum.Abscissa })
  position!: PositionEnum;

  @Prop({ required: false, default: "#ffff00" })
  minColor!: string;

  @Prop({ required: false, default: "#ff0000" })
  maxColor!: string;

  @ProvideReactive(LEGEND)
  legend: am5.HeatLegend | null = null;

  @ProvideReactive(LEGEND_DEBUG)
  legendDebug: number = 0;

  upAndRunning: boolean = false;

  get orientation(): "vertical" | "horizontal" {
    switch(this.position) {
      case PositionEnum.Abscissa: return "vertical";
      case PositionEnum.Ordinate: return "horizontal";
    }
  }

  setEnabled(): void {
    if (this.enabled) {
      // Add to chart
      this.legend = this.chart.children.push(am5.HeatLegend.new(this.root, {
        startColor: am5.color(this.minColor),
        endColor: am5.color(this.maxColor),
        orientation: this.orientation
      }));
    }
    else if (this.legend != null) {
      // Remove from chart
      this.chart!.children.removeValue(this.legend!);

      // Dispose
      this.legend!.dispose();
      this.legend = null;
    }
  }

  mounted(): void {
    if (this.enabled) {
      // Add to chart
      this.legend = this.chart.children.push(am5.HeatLegend.new(this.root, {
        startColor: am5.color(this.minColor),
        endColor: am5.color(this.maxColor),
        orientation: this.orientation
      }));
    }

    this.upAndRunning = true;
  }

  destroyed(): void {
    if (this.legend != null) {
      // Remove from chart
      this.chart!.children.removeValue(this.legend!);

      // Dispose
      this.legend!.dispose();
    }
  }
}
</script>