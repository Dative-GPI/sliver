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
import { updateCategories, sortValues, textColor } from "../../helpers";
import { ColorSets, GetHashedColor } from "../../colors";
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

  @Prop({ required: false, default: ColorSets.Default })
  colorSet!: ColorSets;

  @Watch("colorSet")
  onColorSetChange = this.setColor;

  @Prop({ required: false, default: "" })
  colorSeed!: string;

  @Watch("colorSeed")
  onColorSeedChange = this.setColor;

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
    this.setColor();
  }

  setShowTooltip(): void {
    if (!this.showTooltip) {
      if (this.tooltip != null && !this.tooltip.isDisposed()) {
        this.tooltip!.dispose();
        this.serie!.columns.template.set("tooltip", undefined);
        this.serie!.columns.template.set("tooltipText", undefined);
        this.tooltip = null;
      }
    }
    else {
      this.tooltip = am5.Tooltip.new(this.root, {
        autoTextColor: false,
        labelText: this.tooltipText
      });
      this.tooltip.label.set("fill", textColor(this.serie!.get("fill")!.toCSSHex()));
      this.tooltip.get("background")!.set("fillOpacity", 0.50);
      
      this.serie!.columns.template.setAll({
        tooltip: this.tooltip,
        tooltipText: this.tooltipText,
        tooltipX: am5.percent(100),
        tooltipY: am5.percent(0)
      });
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

  setColor(): void {
    switch (this.colorSet) {
      case ColorSets.Hash: {
        this.serie!.set("fill", GetHashedColor(this.colorSeed, this.name));
        this.serie!.set("stroke", GetHashedColor(this.colorSeed, this.name));
        break;
      }
      default: {
        this.serie!.set("fill", this.chart!.get("colors")!.getIndex(this.chart!.series.indexOf(this.serie!)));
        this.serie!.set("stroke", this.chart!.get("colors")!.getIndex(this.chart!.series.indexOf(this.serie!)));
        break;
      }
    }
  }

  setData(): void {
    let sortedData = this.data.slice().sort((a: any, b: any) => {
      if (a[this.closeValueXField] < b[this.closeValueXField]) return -1;
      if (a[this.closeValueXField] > b[this.closeValueXField]) return 1;
      return 0;
    });
    this.yAxis.data.setAll(
      updateCategories(this.yAxis.data.values, sortedData, this.categoryYField, this.categoryCodeYField, this.openValueXField, this.valueXField, this.serieId, false)
    );
    this.yAxis.data.setAll(
      sortValues(this.yAxis.data.values)
    );
    this.serie!.data.setAll(sortedData);
    this.setShowTooltip();
  }

  mounted(): void {
    this.serieId = Math.random();
    
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

    // Set updatable properties
    this.setName();
    this.setSnapTooltip();

    this.setColumnsHeight();
    this.setColumnsOpacity();
    this.setTemplateWidth();

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
      updateCategories(this.yAxis.data.values, [], this.categoryYField, this.categoryCodeYField, this.valueXField, this.closeValueXField, this.serieId, false)
    );

    // Dispose
    if (this.tooltip != null && !this.tooltip!.isDisposed()) {
      this.tooltip!.dispose();
    }
    if (this.serie != null && !this.serie!.isDisposed()) {
      this.serie!.dispose();
    }
  }
}
</script>