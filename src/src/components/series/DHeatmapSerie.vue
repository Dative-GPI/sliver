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
export default class DHeatmapSerie extends Vue {
  serieId: number = 0;

  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.DateAxis<am5xy.AxisRendererX> | am5xy.CategoryAxis<am5xy.AxisRendererX>;

  @InjectReactive(YAXIS)
  yAxis!: am5xy.CategoryAxis<am5xy.AxisRendererY>;

  @InjectReactive(CURSOR)
  cursor!: am5xy.XYCursor | null;

  @InjectReactive(LEGEND)
  legend!: am5.Legend | null;

  @Prop({ required: true })
  name!: string;

  @Watch("name")
  onNameChange = this.setName;

  @Prop({ required: false, default: false })
  snapToSeries!: boolean;

  @Prop({ required: false, default: "categoryX" })
  xField!: string;

  @Prop({ required: false, default: "closeTimestampX"})
  closeXField!: string;

  @Prop({ required: false, default: "categoryY" })
  yField!: string;

  @Prop({ required: false, default: "valueZ" })
  sizeField!: string;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{name}: {valueZ}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setShowTooltip;

  @Prop({ required: false, default: "" })
  legendLabelText!: string;

  @Watch("legendLabelText")
  onLegendLabelTextChange = this.setLegendLabelText;

  @Prop({ required: true })
  data!: unknown[];

  @Watch("data")
  onDataChange = this.setData;

  serie: am5xy.ColumnSeries | null = null;
  tooltip: am5.Tooltip | null = null;
  circleTemplate: am5.Template<am5.Circle> | null = null;

  upAndRunning = false;

  setName(): void {
    this.serie!.set("name", this.name);
    this.setLegendLabelText();
  }

  setShowTooltip(): void {
    if (this.showTooltip) {
      this.serie!.columns.template.setAll({
        tooltipY: am5.percent(50),
        tooltipX: am5.percent(50),
        tooltipText: this.tooltipText
      });
    }
    else {
      this.serie!.columns.template.setAll({
        tooltipText: undefined
      });      
    }
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
  }

  setHeatRules(): void {
    this.serie!.set("heatRules", [{
      target: this.serie!.columns.template,
      min: am5.color(0xfffb77),
      max: am5.color(0xfe131a),
      dataField: "value",
      key: "fill"
    }]);
  }

  setData(): void {
    if (this.xAxis instanceof am5xy.CategoryAxis) {
      // Add to axis
      this.xAxis.data.setAll(updateCategories(this.xAxis.data.values, this.data, this.xField, this.serieId, true, true));
    }
    if (this.yAxis instanceof am5xy.CategoryAxis) {
      // Add to axis
      this.yAxis.data.setAll(updateCategories(this.yAxis.data.values, this.data, this.yField, this.serieId, true, false));
    }
    this.serie!.data.setAll(this.data);
  }

  mounted(): void {
    this.serieId = Math.random();

    this.serie = this.chart.series.push(am5xy.ColumnSeries.new(this.root, {
      calculateAggregates: true,
      stroke: am5.color(0xffffff),
      clustered: false,
      name: this.name,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      openValueXField: this.xField,
      valueXField: this.closeXField,
      categoryXField: this.xField,
      categoryYField: this.yField,
      valueField: this.sizeField,
      userData: { serie: SerieEnum.HeatmapSerie }
    }));

    this.serie.columns.template.setAll({
      strokeOpacity: 1,
      strokeWidth: 2,
      width: am5.percent(100),
      height: am5.percent(100)
    });

    // Set updatable properties
    this.setName();
    this.setHeatRules();
    this.setShowTooltip();
    
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
      this.xAxis.data.setAll(updateCategories(this.xAxis.data.values, [], this.xField, this.serieId, true, true));
    }

    if (this.yAxis instanceof am5xy.CategoryAxis) {
      // Remove from axis
      this.yAxis.data.setAll(updateCategories(this.yAxis.data.values, [], this.yField, this.serieId, true, false));
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