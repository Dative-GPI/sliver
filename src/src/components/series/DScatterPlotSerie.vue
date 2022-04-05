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
import { updateCategories, addSerie, removeSerie } from "../../helpers";
import { SerieEnum } from "../../enums";

@Component({})
export default class DScatterPlotSerie extends Vue {
  serieId: number = 0;

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

  @Prop({ required: false, default: true })
  snapToSeries!: boolean;

  @Prop({ required: false, default: "valueX" })
  xField!: string;

  @Prop({ required: false, default: "valueY" })
  yField!: string;

  @Prop({ required: false, default: "valueZ" })
  sizeField!: string;

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

  @Prop({ required: false, default: 5 })
  bulletRadius!: number;

  @Watch("bulletRadius")
  onBulletRadiusChange = this.setBulletRadius;

  @Prop({ required: false, default: 5 })
  heatRulesMin!: number;

  @Watch("heatRulesMin")
  onHeatRulesMinChange = this.setHeatRules;

  @Prop({ required: false, default: 15 })
  heatRulesMax!: number;

  @Watch("heatRulesMax")
  onHeatRulesMaxChange = this.setHeatRules;

  @Prop({ required: true })
  data!: unknown[];

  @Watch("data")
  onDataChange = this.setData;

  serie: am5xy.LineSeries | null = null;
  tooltip: am5.Tooltip | null = null;

  upAndRunning = false;

  setName(): void {
    this.serie!.set("name", this.name);
    this.setLegendLabelText();
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
      this.tooltip!.set("labelText", this.tooltipText ? this.tooltipText : `{name}`);
    }
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
  }

  setBulletRadius(): void {
    this.serie!.bullets.clear();

    this.serie!.set("userData", {
      ...this.serie!.get("userData"),
      circleTemplate: am5.Template.new<am5.Circle>({ radius: this.bulletRadius })
    });

    this.serie!.bullets.push(() => {
      return am5.Bullet.new(this.root, {
        sprite: am5.Circle.new(this.root, { fill: this.serie!.get("fill") }, this.serie!.get("userData").circleTemplate)
      });
    });
    
    this.setHeatRules();
  }

  setHeatRules(): void {
    this.serie!.set("heatRules", [{
      target: this.serie!.get("userData").circleTemplate,
      min: this.heatRulesMin,
      max: this.heatRulesMax,
      dataField: "value",
      key: "radius"
    }]);
  }

  setData(): void {
    if (this.xAxis instanceof am5xy.CategoryAxis) {
      // Add to axis
      this.xAxis.data.setAll(updateCategories(this.xAxis.data.values, this.data, this.xField, this.serieId));
    }
    if (this.yAxis instanceof am5xy.CategoryAxis) {
      // Add to axis
      this.yAxis.data.setAll(updateCategories(this.yAxis.data.values, this.data, this.yField, this.serieId));
    }
    this.serie!.data.setAll(this.data);
  }

  mounted(): void {
    this.serieId = Math.random();

    this.serie = this.chart.series.push(am5xy.LineSeries.new(this.root, {
      name: this.name,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      categoryXField: this.xField,
      valueXField: this.xField,
      categoryYField: this.yField,
      valueYField: this.yField,
      valueField: this.sizeField,
      calculateAggregates: true,
      sequencedInterpolation: true,
      userData: { serie: SerieEnum.ScatterPlotSerie }
    }));
    this.serie.strokes.template.set("strokeOpacity", 0);

    // Set updatable properties
    this.setName();
    this.setShowTooltip();
    this.setBulletRadius();
    
    // Add to legend
    if (this.legend != null) {
      this.legend.data.push(this.serie);
    }

    // Add to cursor
    if (this.cursor != null && this.snapToSeries) {
      this.cursor.set("snapToSeries", addSerie(this.cursor.get("snapToSeries")!, this.serie));
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

    if (this.xAxis instanceof am5xy.CategoryAxis) {
      // Remove from axis
      this.xAxis.data.setAll(updateCategories(this.xAxis.data.values, [], this.xField, this.serieId));
    }

    if (this.xAxis instanceof am5xy.CategoryAxis) {
      // Remove from axis
      this.xAxis.data.setAll(updateCategories(this.xAxis.data.values, [], this.yField, this.serieId));
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