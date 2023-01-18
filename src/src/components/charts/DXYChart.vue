<template>
  <div
    ref="xychart"
    :id="chartId"
    :style="{ minHeight: minHeight }"
    style="width: 100%; height: 100%;"
  >
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { Component, ProvideReactive, Vue, Prop, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { LayoutEnum } from "../../enums";
import { AMROOT, CHART } from "../../literals";
import { ColorSets, GetColors } from "../../colors";
import { getLocale, getTimezone } from "../../helpers";

@Component({})
export default class DXYChart extends Vue {
  @ProvideReactive(AMROOT)
  root: am5.Root | null = null;

  @ProvideReactive(CHART)
  chart: am5xy.XYChart | null = null;

  @Prop({ required: true })
  chartId!: string;

  @Prop({ required: false, default: "en-US" })
  locale!: string;

  @Prop({ required: false, default: "UTC" })
  timeOffset!: string;

  @Prop({ required: false, default: 1500 })
  readyTimeout!: number;

  @Prop({ required: false, default: 250 })
  resizeDebounce!: number;

  @Prop({ required: false, default: '400px' })
  minHeight!: string;

  @Prop({ required: false, default: ColorSets.Default })
  colorSet!: ColorSets;

  @Watch("colorSet")
  onColorSetChange = this.setColors;

  @Prop({ required: false, default: LayoutEnum.Vertical })
  layout!: LayoutEnum;

  @Watch("layout")
  onLayoutChange = this.setLayout;

  @Prop({ required: false, default: "zoomX" })
  wheelX!: "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none" | undefined;

  @Watch("wheelX")
  onWheelXChange = this.setWheelX;

  @Prop({ required: false, default: "zoomX" })
  wheelY!: "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none" | undefined;

  @Watch("wheelY")
  onWheelYChange = this.setWheelY;

  resizeObserver: ResizeObserver | null = null;
  debounceResize: number | null = null;
  upAndRunning: boolean = false;

  setColors(): void {
    this.chart!.get("colors")!.set("colors", GetColors(this.colorSet));
  }

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

  setWheelX(): void {
    this.chart!.set("wheelX", this.wheelX);
  }

  setWheelY(): void {
    this.chart!.set("wheelY", this.wheelY);
  }

  resize(): void {
    this.root!.resize();
  }

  mounted(): void {
    // Create root
    this.root = am5.Root.new((this.$refs.xychart as HTMLElement), {
      tooltipContainerBounds: {
        top: 50,
        bottom: 50,
        left: 100,
        right: 100
      }
    });
    this.root.locale = getLocale(this.locale);
    this.root.timezone = getTimezone(this.timeOffset);
    this.root.autoResize = false;

    this.root.numberFormatter.setAll({
      numberFormat: "#,###.### a",
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
    this.chart = this.root.container.children.push(am5xy.XYChart.new(this.root, {
      maxTooltipDistance: 0
    }));

    this.setColors();
    this.setLayout();
    this.setWheelX();
    this.setWheelY();

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
    if (this.chart != null && !this.chart!.isDisposed()) {
      this.chart!.dispose();
    }
    if (this.root != null && !this.root!.isDisposed()) {
      this.root!.dispose();
    }
  }
}
</script>