<template>
  <div
    ref="piechart"
    :id="'piechart'"
    :style="{ minHeight: minHeight }"
    style="width: 100%; height: 100%;"
  >
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, ProvideReactive, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { AMROOT, CHART } from "../../literals";
import { LayoutEnum } from "../../enums";
import { getLocale } from "../../helpers";

@Component({})
export default class DPieChart extends Vue {
  @ProvideReactive(AMROOT)
  root: am5.Root | null = null;

  @ProvideReactive(CHART)
  chart: am5percent.PieChart | null = null;

  @Prop({ required: false, default: "en-US" })
  locale!: string;

  @Prop({ required: false, default: 1500 })
  readyTimeout!: number;

  @Prop({ required: false, default: '400px' })
  minHeight!: string;

  @Prop({ required: false, default: LayoutEnum.Vertical })
  layout!: LayoutEnum;

  @Watch("layout")
  onLayoutChange = this.setLayout;

  upAndRunning = false;

  setLayout(): void {
    switch(this.layout) {
      case LayoutEnum.Grid: {
        this.chart!.set("layout", this.root!.gridLayout);
        break;
      }
      case LayoutEnum.Horizontal: {
        this.chart!.set("layout", this.root!.horizontalLayout);
        break;
      }
      case LayoutEnum.Vertical: {
        this.chart!.set("layout", this.root!.verticalLayout);
        break;
      }
    }
  }

  mounted(): void {
    // Create root
    this.root = am5.Root.new((this.$refs.piechart as HTMLElement));
    this.root.setThemes([ am5themes_Animated.new(this.root) ]);
    this.root.locale = getLocale(this.locale);

    this.root.numberFormatter.setAll({
      numberFormat: "#,###.###### a",
      smallNumberThreshold: 0.001
    });

    // Warn the parent when the chart is ready
    let timeout: number | undefined = undefined;
    let chartReady = () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        this.root!.events.off("frameended", chartReady);
        this.$emit("ready");
      }, this.readyTimeout);
    }
    this.root.events.on("frameended", chartReady);

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