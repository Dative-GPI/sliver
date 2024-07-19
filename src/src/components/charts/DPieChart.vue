<template>
  <div
    ref="piechart"
    :id="chartId"
    :style="{ width: '100%', height: height }"
  >
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, ProvideReactive, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";

import { AMROOT, CHART } from "../../literals";
import { LayoutEnum } from "../../enums";
import { getLocale } from "../../helpers";
import { ChartType } from "../../models";

@Component({})
export default class DPieChart extends Vue {
  @ProvideReactive(AMROOT)
  root: am5.Root | null = null;

  @ProvideReactive(CHART)
  chart: am5percent.PieChart | null = null;

  @Prop({ required: true })
  chartId!: string;
  
  @Prop({ required: false, default: "en-US" })
  locale!: string;

  @Prop({ required: false, default: 1500 })
  readyTimeout!: number;

  @Prop({ required: false, default: 250 })
  resizeDebounce!: number;

  @Prop({ required: false, default: '100vh' })
  height!: string;

  @Prop({ required: false, default: LayoutEnum.Vertical })
  layout!: LayoutEnum;

  @Watch("layout")
  onLayoutChange = this.setLayout;

  resizeObserver: ResizeObserver | null = null;
  debounceResize: number | null = null;
  upAndRunning: boolean = false;

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

  resize(): void {
    this.root!.resize();
    const radius = Math.min(this.root!.width(), this.root!.height()) / 3;

    this.chart!.series.each((serie: am5percent.PieSeries) => {
      serie.set("radius", radius);
      serie.labels.template.set("maxWidth", (this.root!.width() - (2 * radius)) / 2);
    });
  }

  mounted(): void {
    // Create root
    this.root = am5.Root.new((this.$refs.piechart as HTMLElement), {
      tooltipContainerBounds: {
        top: 50,
        bottom: 0,
        left: 50,
        right: 0
      }
    });
    this.root.locale = getLocale(this.locale);
    this.root.autoResize = false;

    this.root.numberFormatter.setAll({
      numberFormat: "#,###.### a",
      smallNumberThreshold: 0.01
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
        this.resize();
      }, this.readyTimeout);
    }
    this.root.events.on("frameended", chartReady);

    // Add chart to root
    this.chart = this.root.container.children.push(am5percent.PieChart.new(this.root, {
      userData: { chartType: ChartType.Pie }
    }));

    this.setLayout();

    this.resizeObserver = new ResizeObserver(() => {
      if (this.debounceResize != null) {
        clearTimeout(this.debounceResize);
      }
      this.debounceResize = setTimeout(this.resize, this.resizeDebounce);
    });
    this.resizeObserver.observe(this.$el);

    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove resize observer
    if (this.debounceResize != null) {
      clearTimeout(this.debounceResize);
    }
    this.resizeObserver!.disconnect();
    
    // Remove chart from root
    this.root!.container.children.removeValue(this.chart!);
    
    // Dispose
    this.chart!.dispose();
    this.root!.dispose();
  }
}
</script>