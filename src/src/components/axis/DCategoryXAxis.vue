<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, ProvideReactive, Vue, Prop, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, XAXIS } from "../../literals";

@Component({})
export default class DCategoryXAxis extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(CURSOR)
  cursor!: am5xy.XYCursor | null;

  @Prop({ required: false, default: "categoryX" })
  categoryField!: string;

  @Prop({ required: false, default: false })
  opposite!: boolean;

  @Watch("opposite")
  onOppositeChange = this.setOpposite;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @ProvideReactive(XAXIS)
  axis: any = null;

  tooltip: am5.Tooltip | null = null;

  upAndRunning = false;

  setOpposite(): void {
    this.axis!.get("renderer").set("opposite", this.opposite);
  }

  setShowTooltip(): void {
    if (!this.showTooltip) {
      if (this.tooltip != null && !this.tooltip.isDisposed()) {
        let hideCursor = false;
        if (this.cursor != null && this.cursor!.lineX.get("visible")) {
          this.cursor!.lineX.set("visible", false);
          this.cursor!.set("xAxis", undefined);
          hideCursor = true;
        }
        this.tooltip!.dispose();
        this.axis!.set("tooltip", undefined);
        this.tooltip = null;
        if (this.cursor != null && hideCursor) {
          this.cursor!.lineX.set("visible", true);
          this.cursor!.set("xAxis", this.axis!);
        }
      }
    }
    else {
      let hideCursor = false;
      if (this.cursor != null && this.cursor!.lineX.get("visible")) {
        this.cursor!.lineX.set("visible", false);
        this.cursor!.set("xAxis", undefined);
        hideCursor = true;
      }
      this.tooltip = am5.Tooltip.new(this.root, {});
      this.axis!.set("tooltip", this.tooltip);
      if (this.cursor != null && hideCursor) {
        this.cursor!.lineX.set("visible", true);
        this.cursor!.set("xAxis", this.axis!);
      }
    }
  }

  mounted(): void {
    // Add to chart
    this.axis = this.chart.xAxes.push(am5xy.CategoryAxis.new(this.root, {
      renderer: am5xy.AxisRendererX.new(this.root, {}),
      categoryField: this.categoryField
    }));

    // Add to cursor
    if (this.cursor) {
      this.cursor!.set("xAxis", this.axis);
    }

    this.setOpposite();
    this.setShowTooltip();

    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from cursor
    if (this.cursor) {
      this.cursor.set("xAxis", undefined);
    }

    // Remove from chart
    this.chart.xAxes.removeValue(this.axis!);

    // Dispose
    this.axis!.dispose();
  }
}
</script>