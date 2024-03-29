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
import { updateCategories, addSerie, removeSerie } from "../../helpers";
import { HeatRule, SerieEnum } from "../../enums";
import { ValueRange } from "../../models";

@Component({})
export default class DHeatmapSerie extends Vue {
  serieId: number = 0;

  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.DateAxis<am5xy.AxisRendererX> | am5xy.CategoryAxis<am5xy.AxisRendererX>;

  @InjectReactive(XAXISVALIDATED)
  xAxisValidated!: () => void | undefined;

  @InjectReactive(YAXIS)
  yAxis!: am5xy.CategoryAxis<am5xy.AxisRendererY>;

  @InjectReactive(YAXISVALIDATED)
  yAxisValidated!: () => void | undefined;

  @InjectReactive(CURSOR)
  cursor!: am5xy.XYCursor | null;

  @InjectReactive(LEGEND)
  legend!: am5.HeatLegend | null;

  @Watch("legend")
  onLegendChange = this.setLegend;

  @Prop({ required: true })
  name!: string;

  @Watch("name")
  onNameChange = this.setName;

  @Prop({ required: false, default: false })
  snapToSeries!: boolean;

  @Prop({ required: false, default: "categoryX" })
  xField!: string;

  @Prop({ required: false, default: "categoryCodeX" })
  codeXField!: string;

  @Prop({ required: false, default: "closeTimestampX"})
  closeXField!: string;

  @Prop({ required: false, default: "categoryY" })
  yField!: string;

  @Prop({ required: false, default: "categoryCodeY" })
  codeYField!: string;

  @Prop({ required: false, default: "valueZ" })
  sizeField!: string;

  @Prop({ required: false, default: "" })
  unit!: string;

  @Watch("unit")
  onUnitChange = this.setShowTooltip;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{name}: {dataItem.dataContext.valueZ}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setShowTooltip;

  @Prop({ required: false, default: HeatRule.Gradient })
  heatRule!: HeatRule;

  @Watch("heatRule")
  onHeatRuleChange = this.setHeatRule;

  @Prop({ required: false, default: "#ffff00" })
  minColor!: string;

  @Watch("minColor")
  onMinColorChange = this.setHeatRule;

  @Prop({ required: false, default: undefined })
  minValue!: number | undefined;

  @Watch("minValue")
  onMinValueChange = this.setLegend;

  @Prop({ required: false, default: "#ff0000" })
  maxColor!: string;

  @Watch("maxColor")
  onMaxColorChange = this.setHeatRule;

  @Prop({ required: false, default: undefined })
  maxValue!: number | undefined;

  @Watch("maxValue")
  onMaxValueChange = this.setLegend;

  @Prop({ required: false, default: undefined })
  heatRanges!: ValueRange[] | undefined;

  @Watch("ranges")
  onHeatRangesChange = this.setHeatRule;

  @Prop({ required: false, default: "#ffff00" })
  fixedColor!: string;

  @Watch("fixedColor")
  onFixedColorChange = this.setHeatRule;

  @Prop({ required: true })
  data!: unknown[];

  @Watch("data")
  onDataChange = this.setData;

  serie: am5xy.ColumnSeries | null = null;

  upAndRunning: boolean = false;

  getNumber(value: any): number | undefined {
    if (typeof(value) === "number") {
      return value;
    }
    if (isNaN(parseFloat(value))) {
      return undefined;
    }
    return parseFloat(value);
  }

  setName(): void {
    this.serie!.set("name", this.name);
  }

  setShowTooltip(): void {
    if (this.showTooltip) {
      this.serie!.columns.template.set("tooltipText", this.tooltipText + this.unit);
    }
    else {
      this.serie!.columns.template.set("tooltipText", undefined);    
    }
  }

  setHeatRule(): void {
    this.serie!.columns.template.adapters.remove("fill");
    this.serie!.set("heatRules", undefined);

    switch(this.heatRule) {
      case HeatRule.None: {
        break;
      }
      case HeatRule.Gradient: {
        let startColor = am5.color(this.minColor);
        let endColor = am5.color(this.maxColor);
        this.serie!.set("heatRules", [{
          target: this.serie!.columns.template,
          customFunction: (this.getNumber(this.minValue) != null || this.getNumber(this.maxValue) != null) ?
              (sprite: any, min, max, value) => {
              min = this.getNumber(this.minValue) != null ? this.getNumber(this.minValue)! : min;
              max = this.getNumber(this.maxValue) != null ? this.getNumber(this.maxValue)! : max;
              if (value >= max) {
                sprite.set("fill", am5.color(this.maxColor));
                return;
              }
              if (value <= min) {
                sprite.set("fill", am5.color(this.minColor));
                return;
              }
              let r = startColor.r +  ((value - min) / (max - min)) * (endColor.r - startColor.r);
              let g = startColor.g +  ((value - min) / (max - min)) * (endColor.g - startColor.g);
              let b = startColor.b +  ((value - min) / (max - min)) * (endColor.b - startColor.b);
              sprite.set("fill", am5.Color.fromRGB(r, g, b));
            } : undefined,
          min: am5.color(this.minColor),
          max: am5.color(this.maxColor),
          minValue: this.getNumber(this.minValue),
          maxValue: this.getNumber(this.maxValue),
          dataField: "value",
          key: "fill"
        }]);
        break;
      }
      case HeatRule.Ranges: {
        if (this.heatRanges != null && this.heatRanges.length > 0) {
          this.serie!.columns.template.adapters.add("fill", (value: any, target: any): am5.Color | undefined => {
            if (target.dataItem != null) {
              let heat = target.dataItem!.dataContext[this.sizeField];
              for (let i = 0; i < this.heatRanges!.length; i++) {
                if (heat >= this.heatRanges![i].startValue && heat <= this.heatRanges![i].endValue) {
                  return am5.color(this.heatRanges![i].color);
                }
              }
            }
            return value;
          });
        }
        break;
      }
      case HeatRule.Fixed: {
        this.serie!.set("heatRules", [{
          target: this.serie!.columns.template,
          min: am5.color(this.fixedColor),
          max: am5.color(this.fixedColor),
          dataField: "value",
          key: "fill"
        }]);
        break;
      }
    }

    this.setData();
  }

  setData(): void {
    if (this.xAxis instanceof am5xy.CategoryAxis) {
      // Add to axis
      this.xAxis.data.setAll(
        updateCategories(this.xAxis.data.values, this.data, this.xField, this.codeXField, null, this.yField, this.serieId, true)
      );
    }
    if (this.yAxis instanceof am5xy.CategoryAxis) {
      // Add to axis
      this.yAxis.data.setAll(
        updateCategories(this.yAxis.data.values, this.data, this.yField, this.codeYField, null, this.xField, this.serieId, true)
      );
    }
    this.serie!.data.setAll(this.data);
  }

  setLegend(): void {
    if ([HeatRule.Gradient].includes(this.heatRule) && this.legend != null) {
      if (this.getNumber(this.minValue) != null) {
        this.legend!.set("startValue", this.getNumber(this.minValue));
      }
      else if (this.legend!.get("startValue") == null || this.legend!.get("startValue")! > this.serie!.getPrivate("valueLow")!) {
        this.legend!.set("startValue", this.serie!.getPrivate("valueLow")!);
      }
      if (this.getNumber(this.maxValue) != null) {
        this.legend!.set("endValue", this.getNumber(this.maxValue));
      }
      else if (this.legend!.get("endValue") == null || this.legend!.get("endValue")! < this.serie!.getPrivate("valueHigh")!) {
        this.legend!.set("endValue", this.serie!.getPrivate("valueHigh")!);
      }
      this.legend!.show(75);
    }
  }

  mounted(): void {
    this.serieId = Math.random();

    this.serie = this.chart.series.push(am5xy.ColumnSeries.new(this.root, {
      name: this.name,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      openValueXField: this.xField,
      valueXField: this.closeXField,
      categoryXField: this.codeXField,
      categoryYField: this.codeYField,
      valueField: this.sizeField,
      stroke: am5.color("#ffffff"),
      clustered: false,
      calculateAggregates: true,
      userData: { serie: SerieEnum.HeatmapSerie }
    }));

    this.serie.columns.template.setAll({
      height: am5.percent(100),
      width: am5.percent(100),
      strokeOpacity: 0.1,
      strokeWidth: 2
    });

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
    this.setHeatRule();
    this.setShowTooltip();

    // Add to cursor
    if (this.cursor != null && this.snapToSeries) {
      this.cursor.set("snapToSeries", addSerie(this.cursor.get("snapToSeries")!, this.serie));
    }
    
    // Add to legend
    this.serie.events.once("datavalidated", this.setLegend);
    
    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from chart
    this.chart.series.removeValue(this.serie!);

    if (this.xAxis instanceof am5xy.CategoryAxis) {
      // Remove from axis
      this.xAxis.data.setAll(
        updateCategories(this.xAxis.data.values, [], this.xField, this.codeXField, null, this.yField, this.serieId, true)
      );
    }

    if (this.yAxis instanceof am5xy.CategoryAxis) {
      // Remove from axis
      this.yAxis.data.setAll(
        updateCategories(this.yAxis.data.values, [], this.yField, this.codeYField, null, this.xField, this.serieId, true)
      );
    }

    // Remove from cursor
    if (this.cursor) {
      this.cursor.set("snapToSeries", removeSerie(this.cursor.get("snapToSeries")!, this.serie));
    }

    // Dispose
    if (this.serie != null && !this.serie!.isDisposed()) {
      this.serie!.dispose();
    }
  }
}
</script>