<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, ProvideReactive, Vue, Prop, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, YAXIS } from "../../literals";

@Component({})
export default class DCategoryYAxis extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(CURSOR)
  cursor!: am5xy.XYCursor | null;

  @Prop({ required: false, default: "categoryY" })
  categoryField!: string;

  @Prop({ required: false, default: "categoryCodeY" })
  categoryCodeField!: string;

  @Prop({ required: false, default: false })
  opposite!: boolean;

  @Watch("opposite")
  onOppositeChange = this.setOpposite;

  @Prop({ required: false, default: true })
  labelsVisible!: boolean;

  @Watch("labelsVisible")
  onLabelsVisibleChange = this.setLabelsVisible;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{categoryY}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setTooltipText;

  @Prop({ required: false, default: 0 })
  cellStartLocation!: number;

  @Watch("cellStartLocation")
  onCellStartLocationChange = this.setCellStartLocation;

  @Prop({ required: false, default: 1 })
  cellEndLocation!: number;

  @Watch("cellEndLocation")
  onCellEndLocationChange = this.setCellEndLocation;

  @Prop({ required: false, default: 15 })
  minGridDistance!: number;

  @Watch("minGridDistance")
  onMinGridDistanceChange = this.setMinGridDistance;

  @ProvideReactive(YAXIS)
  axis: any = null;

  tooltip: am5.Tooltip | null = null;

  upAndRunning: boolean = false;

  setOpposite(): void {
    this.axis!.get("renderer").set("opposite", this.opposite);
  }

  setLabelsVisible(): void {
    this.axis!.get("renderer").labels.template.set("visible", this.labelsVisible);
  }

  setShowTooltip(): void {
    if (!this.showTooltip) {
      if (this.tooltip != null && !this.tooltip.isDisposed()) {
        let hideCursor = false;
        if (this.cursor != null && this.cursor!.lineY.get("visible")) {
          this.cursor!.lineY.set("visible", false);
          this.cursor!.set("yAxis", undefined);
          hideCursor = true;
        }
        this.tooltip!.dispose();
        this.axis!.set("tooltip", undefined);
        this.tooltip = null;
        if (this.cursor != null && hideCursor) {
          this.cursor!.lineY.set("visible", true);
          this.cursor!.set("yAxis", this.axis!);
        }
      }
    }
    else {
      let hideCursor = false;
      if (this.cursor != null && this.cursor!.lineY.get("visible")) {
        this.cursor!.lineY.set("visible", false);
        this.cursor!.set("yAxis", undefined);
        hideCursor = true;
      }
      this.tooltip = am5.Tooltip.new(this.root, {});
      this.axis!.set("tooltip", this.tooltip);
      this.axis!.get("tooltip").label.adapters.add("text", (text: string | undefined, target: any): string | undefined => {
        if (target.dataItem && target.dataItem.dataContext) {
          return this.tooltipText
            .replace(`{${this.categoryField}}`, target.dataItem.dataContext[this.categoryField])
            .replace(`{${this.categoryCodeField}}`, target.dataItem.dataContext[this.categoryCodeField]);
        }
        return text;
      });

      if (this.cursor != null && hideCursor) {
        this.cursor!.lineY.set("visible", true);
        this.cursor!.set("yAxis", this.axis!);
      }
    }
  }

  setTooltipText(): void {
    if (this.tooltip != null) {
      this.axis!.get("tooltip")!.label.adapters.remove("text");
      this.axis!.get("tooltip")!.label.adapters.add("text", (text: string | undefined, target: any): string | undefined => {
        if (target.dataItem && target.dataItem.dataContext) {
          return this.tooltipText
            .replace(`{${this.categoryField}}`, target.dataItem.dataContext[this.categoryField])
            .replace(`{${this.categoryCodeField}}`, target.dataItem.dataContext[this.categoryCodeField]);
        }
        return text;
      });
    }
  }

  setCellStartLocation(): void {
    this.axis!.get("renderer").set("cellStartLocation", this.cellStartLocation);
  }

  setCellEndLocation(): void {
    this.axis!.get("renderer").set("cellEndLocation", this.cellEndLocation);
  }

  setMinGridDistance(): void {
    this.axis!.get("renderer").set("minGridDistance", this.minGridDistance);
  }

  mounted(): void {
    // Add to chart
    this.axis = this.chart.yAxes.push(am5xy.CategoryAxis.new(this.root, {
      renderer: am5xy.AxisRendererY.new(this.root, {}),
      categoryField: this.categoryCodeField
    }));

    // Add to cursor
    if (this.cursor) {
      this.cursor!.set("yAxis", this.axis);
    }
    
    this.axis!.get("renderer").labels.template.adapters.add("text", (text: string | undefined, target: any): string | undefined => {
      if (target.dataItem && target.dataItem.dataContext && target.dataItem.dataContext[this.categoryField]) {
        return target.dataItem.dataContext[this.categoryField];
      }
      return text;
    });

    this.setOpposite();
    this.setLabelsVisible();
    this.setShowTooltip();
    this.setCellStartLocation();
    this.setCellEndLocation();
    this.setMinGridDistance();

    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from cursor
    if (this.cursor) {
      this.cursor!.set("yAxis", undefined);
    }

    // Remove from chart
    this.chart.yAxes.removeValue(this.axis!);

    // Dispose tooltip
    if (this.tooltip != null) {
      this.tooltip!.dispose();
    }

    // Dispose
    this.axis!.dispose();
  }
}
</script>