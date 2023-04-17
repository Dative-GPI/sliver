<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, LEGEND, XAXIS, XAXISVALIDATED, YAXIS, YAXISVALIDATED } from "../../literals";
import { textColor, updateCategories } from "../../helpers";
import { ColorSets, GetHashedColor } from "../../colors";
import { SerieEnum } from "../../enums";

@Component({})
export default class DStackedColumnSerie extends Vue {
  serieId: number = 0;

  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.CategoryAxis<am5xy.AxisRendererX>;

  @InjectReactive(XAXISVALIDATED)
  xAxisValidated!: () => void | undefined;

  @InjectReactive(YAXIS)
  yAxis!: am5xy.ValueAxis<am5xy.AxisRendererY>;

  @InjectReactive(YAXISVALIDATED)
  yAxisValidated!: () => void | undefined;

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

  @Prop({ required: false, default: "" })
  unit!: string;

  @Watch("unit")
  onUnitChange = this.setShowTooltip;

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

  @Prop({ required: false, default: ColorSets.Default })
  colorSet!: ColorSets;

  @Watch("colorSet")
  onColorSetChange = this.setColor;

  @Prop({ required: false, default: "" })
  colorSeed!: string;

  @Watch("colorSeed")
  onColorSeedChange = this.setColor;
  
  @Prop({ required: false, default: false })
  defaultHidden!: boolean;

  @Prop({ required: true })
  data!: any[];

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
        labelText: this.tooltipText + this.unit
      });
      this.tooltip.label.set("fill", textColor(this.serie!.get("fill")!.toCSSHex()));
      this.tooltip.get("background")!.set("fillOpacity", 0.50);
      
      this.serie!.columns.template.setAll({
        tooltip: this.tooltip,
        tooltipText: this.tooltipText + this.unit,
        tooltipY: am5.percent(0)
      });
    }
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
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
    this.xAxis.data.setAll(
      updateCategories(this.xAxis.data.values, this.data, this.categoryXField, this.categoryCodeXField, null, this.valueYField, this.serieId, true)
    );
    this.serie!.data.setAll(this.data);
    this.setShowTooltip();
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

    this.serie.events.on("datavalidated", () => {
      if (this.xAxisValidated != null) {
        this.xAxisValidated();
      }
      if (this.yAxisValidated != null) {
        this.yAxisValidated();
      }
    });

    // Set updatable properties
    this.setName();
    this.setData();

    // Add to legend
    if (this.legend != null) {
      this.legend.data.push(this.serie);
    }
    
    if (this.defaultHidden) {
      this.serie.hide();
    }
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
      updateCategories(this.xAxis.data.values, [], this.categoryXField, this.categoryCodeXField, null, this.valueYField, this.serieId, true)
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