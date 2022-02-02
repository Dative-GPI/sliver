<template>
  <div ref="piechart" :id="'piechart'" style="width: 100%; height: 100%;">
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, ProvideReactive, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { AMROOT, CHART } from "../../literals";

@Component({})
export default class DPieChart extends Vue {
  @ProvideReactive(AMROOT)
  root: am5.Root | null = null;

  @Prop({ required: false, default: true })
  vertical!: boolean;

  @Watch("vertical")
  onVerticalChange = this.setLayout;

  @ProvideReactive(CHART)
  chart: am5percent.PieChart | null = null;

  upAndRunning = false;

  setLayout(): void {
    this.chart!.set("layout", this.vertical ? this.root.verticalLayout : this.root.horizontalLayout);
  }

  mounted(): void {
    // Create root
    this.root = am5.Root.new((this.$refs.piechart as HTMLElement));
    this.root.setThemes([ am5themes_Animated.new(this.root) ]);

    // Add chart to root
    this.chart = this.root.container.children.push(am5percent.PieChart.new(this.root, {}));

    this.setLayout();

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