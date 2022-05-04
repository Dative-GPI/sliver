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
export default class DTopSerie extends Vue {
  serieId: number = 0;

  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.ValueAxis<am5xy.AxisRendererX>;

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

  @Prop({ required: false, default: true })
  snapToSeries!: boolean;

  @Prop({ required: false, default: "valueX" })
  valueXField!: string;

  @Prop({ required: false, default: "categoryY" })
  categoryYField!: string;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{name}: {valueX}" })
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

  upAndRunning = false;

  setName(): void {
    this.serie!.set("name", this.name);
    this.setLegendLabelText();
  }

  setShowTooltip(): void {
    if (this.showTooltip) {
      this.serie!.columns.template.setAll({
        tooltipY: am5.percent(0),
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

  setData(): void {
    // Add to axis
    this.yAxis.data.setAll(updateCategories(this.yAxis.data.values, this.data, this.categoryYField, this.serieId, true));
    this.serie!.data.setAll(this.data);
  }

  mounted(): void {
    this.serieId = Math.random();
    
    // Add to chart
    this.serie = this.chart.series.push(am5xy.ColumnSeries.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueXField: this.valueXField,
      categoryYField: this.categoryYField,
      sequencedInterpolation: true,
      userData: { serie: SerieEnum.ColumnSerie }
    }));

    // Set updatable properties
    this.setName();
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

    // Remove from axis
    this.yAxis.data.setAll(updateCategories(this.yAxis.data.values, [], this.categoryYField, this.serieId, true));

    // Remove from cursor
    if (this.cursor) {
      this.cursor.set("snapToSeries", removeSerie(this.cursor.get("snapToSeries")!, this.serie));
    }

    // Dispose
    this.serie!.dispose();
  }
}
</script>