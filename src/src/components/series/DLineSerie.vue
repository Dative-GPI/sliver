<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, LEGEND, XAXIS, YAXIS } from "../../literals";
import { addSerie, removeSerie } from "../../helpers";

@Component({})
export default class DLineSerie extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.DateAxis<am5xy.AxisRendererX> | am5xy.ValueAxis<am5xy.AxisRendererX> | am5xy.CategoryAxis<am5xy.AxisRendererX>;

  @InjectReactive(YAXIS)
  yAxis!: am5xy.DateAxis<am5xy.AxisRendererY> | am5xy.ValueAxis<am5xy.AxisRendererY> | am5xy.CategoryAxis<am5xy.AxisRendererY>;

  @InjectReactive(CURSOR)
  cursor!: am5xy.XYCursor | null;

  @InjectReactive(LEGEND)
  legend!: am5.Legend | null;

  @Prop({ required: true })
  name!: string;

  @Watch("name")
  onNameChange = this.setName;

  @Prop({ required: false, default: "timestampX" })
  dateXField!: string;

  @Prop({ required: false, default: "valueY" })
  valueYField!: string;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setTooltipText;

  @Prop({ required: false, default: "" })
  legendLabelText!: string;

  @Watch("legendLabelText")
  onLegendLabelTextChange = this.setLegendLabelText;

  @Prop({ required: false, default: 3 })
  bulletRadius!: number;

  @Watch("bulletRadius")
  onBulletRadiusChange = this.setBulletRadius;

  @Prop({ required: true })
  data!: unknown[];

  @Watch("data")
  onDataChange = this.setData;

  serie: am5xy.LineSeries | null = null;
  tooltip: am5.Tooltip | null = null;

  upAndRunning = false;

  setName(): void {
    this.serie!.set("name", this.name);
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
  }

  setShowTooltip(): void {
    if (!this.showTooltip) {
      if (this.tooltip != null) {
        this.tooltip!.dispose();
        this.serie!.set("tooltip", undefined);
        this.tooltip = null;
      }
    }
    else {
      this.tooltip = am5.Tooltip.new(this.root, {});
      this.serie!.set("tooltip", this.tooltip);
      this.setTooltipText();
    }
  }

  setTooltipText(): void {
    if (this.tooltip != null) {
      this.tooltip!.set("labelText", this.tooltipText ? this.tooltipText : "{" + this.valueYField + "}");
    }
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
  }

  setBulletRadius(): void {
    this.serie!.bullets.clear();
    this.serie!.bullets.push(() => {
      return am5.Bullet.new(this.root, {
        sprite: am5.Circle.new(this.root, {
          radius: this.bulletRadius,
          fill: this.serie!.get("fill"),
        })
      });
    });
  }

  setData(): void {
    this.serie!.data.setAll(this.data);
  }

  mounted(): void {
    // Add to chart
    this.serie = this.chart.series.push(am5xy.LineSeries.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueXField: this.dateXField,
      valueYField: this.valueYField,
      sequencedInterpolation: true
    }));

    // Set updatable properties
    this.setName();
    this.setBulletRadius();
    this.setShowTooltip();

    // Add to cursor
    if (this.cursor != null) {
      this.cursor.set("snapToSeries", addSerie(this.cursor.get("snapToSeries")!, this.serie));
    }

    // Add to legend
    if (this.legend != null) {
      this.legend.data.push(this.serie);
    }
    
    // Set data
    this.setData();
    
    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from chart
    this.chart.series.removeValue(this.serie!);

    // Remove from legend
    if (this.legend) {
      this.legend.data.removeValue(this.serie);
    }

    // Remove from cursor
    if (this.cursor) {
      this.cursor.set("snapToSeries", removeSerie(this.cursor.get("snapToSeries")!, this.serie));
    }

    // Dispose
    this.serie!.dispose();
  }
}
</script>