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
import { updateCategories } from "../../helpers";
import { PositionEnum, SerieEnum } from "../../enums";

@Component({})
export default class DStackedColumnSerie extends Vue {
  serieId: number = 0;

  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.CategoryAxis<am5xy.AxisRendererX>;

  @InjectReactive(YAXIS)
  yAxis!: am5xy.ValueAxis<am5xy.AxisRendererY>;

  @InjectReactive(CURSOR)
  cursor!: am5xy.XYCursor | null;

  @InjectReactive(LEGEND)
  legend!: am5.Legend | null;

  @Prop({ required: true })
  name!: string;

  @Watch("name")
  onNameChange = this.setName;

  @Prop({ required: false, default: "categoryX" })
  categoryXField!: string;

  @Prop({ required: false, default: "categoryCodeX" })
  categoryCodeXField!: string;

  @Prop({ required: false, default: "valueY" })
  valueYField!: string;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{name}: {dataItem.dataContext.valueY}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setShowTooltip;

  @Prop({ required: false, default: "" })
  legendLabelText!: string;

  @Watch("legendLabelText")
  onLegendLabelTextChange = this.setLegendLabelText;

  @Prop({ required: true })
  data!: any[];

  @Watch("data")
  onDataChange = this.setData;

  serie: am5xy.ColumnSeries | null = null;

  upAndRunning: boolean = false;

  setName(): void {
    this.serie!.set("name", this.name);
    this.setLegendLabelText();
  }

  setShowTooltip(): void {
    if (this.showTooltip) {
      this.serie!.columns.template.set("tooltipText", this.tooltipText);
    }
    else {
      this.serie!.columns.template.set("tooltipText", undefined);    
    }
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
  }

  setData(): void {
    this.xAxis.data.setAll(
      updateCategories(this.xAxis.data.values, this.data, this.categoryXField, this.categoryCodeXField, null, this.valueYField, this.serieId, true, PositionEnum.Abscissa)
    );
    this.serie!.data.setAll(this.data);
  }

  mounted(): void {
    this.serieId = Math.random();

    // Add to chart
    this.serie = this.chart.series.push(am5xy.ColumnSeries.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      stacked: true,
      categoryXField: this.categoryCodeXField,
      valueYField: this.valueYField,
      sequencedInterpolation: true,
      userData: { serie: SerieEnum.StackedColumnSerie }
    }));

    this.serie.columns.template.setAll({
      tooltipY: am5.percent(0)
    });

    // Set updatable properties
    this.setName();
    this.setShowTooltip();

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

    // Remove from axis
    this.xAxis.data.setAll(
      updateCategories(this.xAxis.data.values, [], this.categoryXField, this.categoryCodeXField, null, this.valueYField, this.serieId, true, PositionEnum.Abscissa)
    );

    // Dispose
    this.serie!.dispose();
  }
}
</script>