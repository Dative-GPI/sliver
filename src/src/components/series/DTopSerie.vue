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
  openValueXField!: string;

  @Prop({ required: false, default: "closeValueX" })
  valueXField!: string;

  @Prop({ required: false, default: "selfValueX" })
  closeValueXField!: string;

  @Prop({ required: false, default: "categoryY" })
  categoryYField!: string;

  @Prop({ required: false, default: "categoryCodeY" })
  categoryCodeYField!: string;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{dataItem.dataContext.categoryY}: {dataItem.dataContext.selfValueX}" })
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

  @Prop({ required: true })
  data!: unknown[];

  @Watch("data")
  onDataChange = this.setData;

  serie: am5xy.ColumnSeries | null = null;
  tooltip: am5.Tooltip | null = null;

  upAndRunning: boolean = false;

  setName(): void {
    this.serie!.set("name", this.name);
    this.setLegendLabelText();
  }

  setShowTooltip(): void {
    console.log("Serie " + this.serieId + " setShowTooltip");
    if (!this.showTooltip) {

      console.log("Serie " + this.serieId + " showTooltip false");

      if (this.tooltip != null && !this.tooltip.isDisposed()) {
        this.tooltip!.dispose();
        this.serie!.columns.template.set("tooltip", undefined);
        this.serie!.columns.template.set("tooltipText", undefined);
        this.tooltip = null;

        console.log("Serie " + this.serieId + " tooltip disposed");
      }
    }
    else {
      console.log("Serie " + this.serieId + " showTooltip true");

      this.tooltip = am5.Tooltip.new(this.root, {
        autoTextColor: false,
        labelText: this.tooltipText
      });
      this.tooltip.label.set("fill", am5.color("#000000"));
      this.tooltip.get("background")!.set("fillOpacity", 0.25);
      console.log("Serie " + this.serieId + " tooltip created");
      
      this.serie!.columns.template.setAll({
        tooltip: this.tooltip,
        tooltipText: this.tooltipText,
        tooltipX: am5.percent(100),
        tooltipY: am5.percent(0)
      });
      console.log("Serie " + this.serieId + " tooltip set");
    }
  }
  
  setSnapTooltip(): void {
    this.serie!.set("snapTooltip", true);
    console.log("Serie " + this.serieId + " snapTooltip set");
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
    console.log("Serie " + this.serieId + " legendLabelText set");
  }

  setColumnsHeight(): void {
    this.serie!.columns.template.set("height", this.columnsHeight);
    console.log("Serie " + this.serieId + " columnsHeight set");
  }

  setColumnsOpacity(): void {
    this.serie!.columns.template.set("opacity", this.columnsOpacity);
    console.log("Serie " + this.serieId + " columnsOpacity set");
  }

  setTemplateWidth(): void {
    this.serie!.columns.template.set("width", this.templateWidth);
    console.log("Serie " + this.serieId + " templateWidth set");
  }

  setData(): void {
    let sortedData = this.data.slice().sort((a: any, b: any) => {
      if (a[this.closeValueXField] < b[this.closeValueXField]) return -1;
      if (a[this.closeValueXField] > b[this.closeValueXField]) return 1;
      return 0;
    });
    this.yAxis.data.setAll(
      updateCategories(this.yAxis.data.values, sortedData, this.categoryYField, this.categoryCodeYField, this.openValueXField, this.valueXField, this.serieId, false, PositionEnum.Abscissa)
    );
    this.yAxis.data.setAll(
      sortValues(this.yAxis.data.values)
    );
    this.serie!.data.setAll(sortedData);
    console.log("Serie " + this.serieId + " data set");
  }

  mounted(): void {
    this.serieId = Math.random();
    console.log("Mounting d-top-serie: " + this.serieId);
    
    // Add to chart
    this.serie = this.chart.series.push(am5xy.ColumnSeries.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      openValueXField: this.openValueXField,
      valueXField: this.valueXField,
      categoryYField: this.categoryCodeYField,
      sequencedInterpolation: true,
      userData: { serie: SerieEnum.ColumnSerie }
    }));
    console.log("Serie " + this.serieId + " added to chart");

    // Set updatable properties
    this.setName();
    this.setShowTooltip();
    this.setSnapTooltip();

    this.setColumnsHeight();
    this.setColumnsOpacity();
    this.setTemplateWidth();

    // Add to legend
    if (this.legend != null) {
      this.legend.data.push(this.serie);
      console.log("Serie " + this.serieId + " added to legend");
    }
    
    // Set data
    this.setData();
    
    this.upAndRunning = true;
    console.log("Serie " + this.serieId + " up and running");
  }

  destroyed(): void {
    console.log("Destroying d-top-serie: " + this.serieId);
    // Remove from chart
    this.chart.series.removeValue(this.serie!);
    console.log("Serie " + this.serieId + " removed from chart");

    // Remove from legend
    if (this.legend) {
      this.legend.data.removeValue(this.serie);
      console.log("Serie " + this.serieId + " removed from legend");
    }

    // Remove from axis
    this.yAxis.data.setAll(
      updateCategories(this.yAxis.data.values, [], this.categoryYField, this.categoryCodeYField, this.valueXField, this.closeValueXField, this.serieId, false, PositionEnum.Abscissa)
    );
    console.log("Serie " + this.serieId + " removed from axis");

    // Dispose
    if (this.tooltip != null && !this.tooltip!.isDisposed()) {
      this.tooltip!.dispose();
      console.log("Serie " + this.serieId + " tooltip disposed");
    }
    if (this.serie != null && !this.serie!.isDisposed()) {
      this.serie!.dispose();
      console.log("Serie " + this.serieId + " disposed");
    }
  }
}
</script>