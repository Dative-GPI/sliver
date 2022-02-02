<template>
  <div ref="radarchart" :id="'radarchart'" style="width: 100%; height: 100%;">
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, ProvideReactive, Vue, Prop, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { AMROOT, CHART } from "../../literals";

@Component({})
export default class DRadarChart extends Vue {
  @ProvideReactive(AMROOT)
  root: am5.Root | null = null;

  @ProvideReactive(CHART)
  chart: am5radar.RadarChart | null = null;

  @Prop({ required: false, default: false })
  panX!: boolean;

  @Watch("panX")
  onPanXChange = this.setPanX;

  @Prop({ required: false, default: false })
  panY!: boolean;

  @Watch("panY")
  onPanYChange = this.setPanY;

  @Prop({ required: false, default: 180 })
  startAngle!: number;

  @Watch("startAngle")
  onStartAngleChange = this.setStartAngle;

  @Prop({ required: false, default: 360 })
  endAngle!: number;

  @Watch("endAngle")
  onEndAngleChange = this.setEndAngle;

  @Prop({ required: false, default: 70 })
  radius!: number;

  @Watch("radius")
  onRadiusChange = this.setRadius;

  upAndRunning = false;

  setPanX(): void {
    this.chart!.set("panX", this.panX);
  }

  setPanY(): void {
    this.chart!.set("panY", this.panY);
  }

  setStartAngle(): void {
    this.chart!.set("startAngle", this.startAngle);
  }

  setEndAngle(): void {
    this.chart!.set("endAngle", this.endAngle);
  }

  setRadius(): void {
    this.chart!.set("radius", am5.percent(this.radius));
  }

  mounted(): void {
    // Create root
    this.root = am5.Root.new((this.$refs.radarchart as HTMLElement));
    this.root.setThemes([ am5themes_Animated.new(this.root) ]);

    // Add chart to root
    this.chart = this.root.container.children.push(am5radar.RadarChart.new(this.root, {
      layout: this.root.verticalLayout
    }));

    this.setPanX();
    this.setPanY();
    this.setStartAngle();
    this.setEndAngle();
    this.setRadius();

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