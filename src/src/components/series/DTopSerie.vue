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
import { updateCategories, sortValues } from "../../helpers";
import { PositionEnum, SerieEnum } from "../../enums";

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

  @Prop({ required: false, default: "valueX" })
  valueXField!: string;

  @Prop({ required: false, default: "categoryY" })
  categoryYField!: string;

  @Prop({ required: false, default: "categoryCodeY" })
  categoryCodeYField!: string;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{dataItem.dataContext.categoryY}: {dataItem.dataContext.valueX}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setShowTooltip;

  @Prop({ required: false, default: "" })
  legendLabelText!: string;

  @Watch("legendLabelText")
  onLegendLabelTextChange = this.setLegendLabelText;

  @Prop({ required: false, default: 12 })
  columnsHeight!: number;

  @Watch("columnsHeight")
  onColumnsHeightChange = this.setColumnsHeight;

  @Prop({ required: false, default: 1 })
  columnsOpacity!: number;

  @Watch("columnsOpacity")
  onColumnsOpacityChange = this.setColumnsOpacity;

  @Prop({ required: false, default: undefined })
  templateWidth!: number | undefined;

  @Watch("templateWidth")
  onTemplateWidthChange = this.setTemplateWidth;

  @Prop({ required: false, default: 5 })
  templateCornerRadius!: number;

  @Watch("templateCornerRadius")
  onTemplateCornerRadiusChange = this.setTemplateCornerRadius;

  @Prop({ required: true })
  data!: unknown[];

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
  
  setSnapTooltip(): void {
    this.serie!.set("snapTooltip", true);
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
  }

  setColumnsHeight(): void {
    this.serie!.columns.template.set("height", this.columnsHeight);
  }

  setColumnsOpacity(): void {
    this.serie!.columns.template.set("opacity", this.columnsOpacity);
  }

  setTemplateWidth(): void {
    this.serie!.columns.template.set("width", this.templateWidth);
  }

  setTemplateCornerRadius(): void {
    this.serie!.columns.template.setAll({
      cornerRadiusTR: this.templateCornerRadius,
      cornerRadiusBR: this.templateCornerRadius
    });
  }

  setData(): void {
    let sortedData = this.data.slice().sort((a: any, b: any) => {
      if (a[this.valueXField] < b[this.valueXField]) return -1;
      if (a[this.valueXField] > b[this.valueXField]) return 1;
      return 0;
    });
    this.yAxis.data.setAll(
      updateCategories(this.yAxis.data.values, sortedData, this.categoryYField, this.categoryCodeYField, this.valueXField, this.serieId, false, PositionEnum.Abscissa)
    );
    this.yAxis.data.setAll(
      sortValues(this.yAxis.data.values)
    );
    this.serie!.data.setAll(sortedData);
  }

  mounted(): void {
    this.serieId = Math.random();
    
    // Add to chart
    this.serie = this.chart.series.push(am5xy.ColumnSeries.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueXField: this.valueXField,
      categoryYField: this.categoryCodeYField,
      sequencedInterpolation: true,
      userData: { serie: SerieEnum.ColumnSerie }
    }));

    this.serie.columns.template.setAll({
      tooltipX: am5.percent(100),
      tooltipY: am5.percent(0)
    });

    // Set updatable properties
    this.setName();
    this.setShowTooltip();
    this.setSnapTooltip();

    this.setColumnsHeight();
    this.setColumnsOpacity();
    this.setTemplateWidth();
    this.setTemplateCornerRadius();

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
    this.yAxis.data.setAll(
      updateCategories(this.yAxis.data.values, [], this.categoryYField, this.categoryCodeYField, this.valueXField, this.serieId, false, PositionEnum.Abscissa)
    );

    // Dispose
    this.serie!.dispose();
  }
}
</script>