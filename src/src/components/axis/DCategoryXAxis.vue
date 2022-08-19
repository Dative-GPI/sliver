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

  @Prop({ required: false, default: "categoryCodeX" })
  categoryCodeField!: string;

  @Prop({ required: false, default: false })
  opposite!: boolean;

  @Watch("opposite")
  onOppositeChange = this.setOpposite;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{dataItem.dataContext.categoryX}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setTooltipText;

  @Prop({ required: false, default: "truncate" })
  labelsOversizedBehavior!: "none" | "hide" | "fit" | "wrap" | "truncate";

  @Watch("labelsOversizedBehavior")
  onLabelsOversizedBehaviorChange = this.setLabelsOversizedBehavior;

  @Prop({ required: false, default: "{dataItem.dataContext.categoryX}" })
  labelsTooltipText!: string;

  @Watch("labelsTooltipText")
  onLabelsToolTipTextChange = this.setLabelsTooltipText;

  @ProvideReactive(XAXIS)
  axis: any = null;

  tooltip: am5.Tooltip | null = null;

  upAndRunning: boolean = false;

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
      this.tooltip = am5.Tooltip.new(this.root, {
        labelText: this.tooltipText
      });
      this.axis!.set("tooltip", this.tooltip);
      if (this.cursor != null && hideCursor) {
        this.cursor!.lineX.set("visible", true);
        this.cursor!.set("xAxis", this.axis!);
      }
    }
  }

  setTooltipText(): void {
    if (this.tooltip != null) {
      this.tooltip.set("labelText", this.tooltipText);
    }
  }

  setLabelsOversizedBehavior(): void {
    this.axis!.get("renderer").labels.template.set("oversizedBehavior", this.labelsOversizedBehavior);
  }

  setLabelsTooltipText(): void {
    this.axis!.get("renderer").labels.template.set("tooltipText", this.labelsTooltipText);
  }

  mounted(): void {
    // Add to chart
    this.axis = this.chart.xAxes.push(am5xy.CategoryAxis.new(this.root, {
      renderer: am5xy.AxisRendererX.new(this.root, {}),
      categoryField: this.categoryCodeField
    }));

    // Add to cursor
    if (this.cursor) {
      this.cursor!.set("xAxis", this.axis);
    }
    
    this.axis!.get("renderer").labels.template.adapters.add("text", (text: string | undefined, target: any): string | undefined => {
      if (target.dataItem && target.dataItem.dataContext && target.dataItem.dataContext[this.categoryField]) {
        return target.dataItem.dataContext[this.categoryField];
      }
      return text;
    });

    this.setOpposite();
    this.setShowTooltip();
    this.setLabelsOversizedBehavior();
    this.setLabelsTooltipText();

    this.axis!.get("renderer").labels.template.set("textAlign", "center");

    this.axis!.get("renderer").labels.template.adapters.add("width", (width: any, target: any) =>  {
      let x0 = this.axis!.getDataItemCoordinateY(this.axis!.dataItems[0], "category", 0);
      let x1 = this.axis!.getDataItemCoordinateY(this.axis!.dataItems[0], "category", 1);
      target.set("maxWidth", x1 - x0)
      return x1 - x0;
    });

    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from cursor
    if (this.cursor) {
      this.cursor.set("xAxis", undefined);
    }

    // Remove from chart
    this.chart.xAxes.removeValue(this.axis!);

    // Dispose tooltip
    if (this.tooltip != null) {
      this.tooltip!.dispose();
    }
    
    // Dispose
    this.axis!.dispose();
  }
}
</script>