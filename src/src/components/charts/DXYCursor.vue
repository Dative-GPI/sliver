<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, InjectReactive, Prop, ProvideReactive, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, XAXIS, YAXIS } from "../../literals";
import { ISpritePointerEvent } from "@amcharts/amcharts5/.internal/core/render/Sprite";

@Component({})
export default class DXYCursor extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.CategoryAxis<am5xy.AxisRendererX> | am5xy.DateAxis<am5xy.AxisRendererX> | am5xy.ValueAxis<am5xy.AxisRendererX>

  @InjectReactive(YAXIS)
  yAxis!: am5xy.CategoryAxis<am5xy.AxisRendererY> | am5xy.DateAxis<am5xy.AxisRendererY> | am5xy.ValueAxis<am5xy.AxisRendererY>

  @Prop({ required: false, default: true })
  enabled!: boolean;

  @Prop({ required: false, default: "zoomX" })
  behavior!: "zoomXY" | "zoomX" | "zoomY" | "selectX" | "selectY" | "selectXY" | undefined;

  @Watch("behavior")
  onBehaviorChange = this.setBehavior;

  @Prop({ required: false, default: true })
  xVisible!: boolean;

  @Watch("xVisible")
  onXVisibleChange = this.setXVisible;

  @Prop({ required: false, default: true })
  yVisible!: boolean;

  @Watch("yVisible")
  onYVisibleChange = this.setYVisible;

  @Prop({ required: false, default: () => [null, null] })
  selection!: (number | null)[];

  @ProvideReactive(CURSOR)
  cursor: am5xy.XYCursor | null = null;

  upAndRunning = false;

  setBehavior(): void {
    if (this.enabled) {
      this.cursor!.set("behavior", this.behavior);
    }
  }

  setXVisible(): void {
    if (this.enabled) {
      this.cursor!.lineX.set("visible", this.xVisible);
    }
  }

  setYVisible(): void {
    if (this.enabled) {
      this.cursor!.lineY.set("visible", this.yVisible);
    }
  }

  mounted(): void {
    if (this.enabled) {
      // Add to chart
      this.cursor = this.chart.set("cursor", am5xy.XYCursor.new(this.root, {
        snapToSeries: []
      }));

      this.setBehavior();
      this.setXVisible();
      this.setYVisible();

      this.cursor.events.on("selectended", (event: any): void => {
        if (this.chart.xAxes.values[0] as am5xy.DateAxis<am5xy.AxisRendererX> != null) {
          if (this.selection[0] != null && this.selection[1] != null) {
            let start = (this.selection[1] - this.selection[0]) * this.cursor!.getPrivate("downPositionX")! + this.selection[0];
            let end = (this.selection[1] - this.selection[0]) * this.cursor!.getPrivate("positionX")! + this.selection[0];
            this.$emit("update:selection", [start, end]);
          }
          else {
            let start = (this.chart.xAxes.values[0] as am5xy.DateAxis<am5xy.AxisRendererX>).positionToDate(this.cursor!.getPrivate("downPositionX")!).getTime();
            let end = (this.chart.xAxes.values[0] as am5xy.DateAxis<am5xy.AxisRendererX>).positionToDate(this.cursor!.getPrivate("positionX")!).getTime();
            this.$emit("update:selection", [start, end]);
          }
        }
      });
    }
    
    this.upAndRunning = true;
  }

  destroyed(): void {
    if (this.enabled) {
      // Remove from chart
      this.chart.set("cursor", undefined);

      // Dispose
      this.cursor!.dispose();
    }
  }
}
</script>