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
import { updateCategories, addSerie, removeSerie, AxisRange } from "../../helpers";
import { HeatmapRule, PositionEnum, SerieEnum } from "../../enums";

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

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{name}: {dataItem.dataContext.valueZ}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setShowTooltip;

  @Prop({ required: false, default: HeatmapRule.Gradient })
  rule!: HeatmapRule;

  @Watch("rule")
  onRuleChange = this.setHeatRules;

  @Prop({ required: false, default: "#ffff00" })
  minColor!: string;

  @Watch("minColor")
  onMinColorChange = this.setHeatRules;

  @Prop({ required: false, default: "#ff0000" })
  maxColor!: string;

  @Watch("maxColor")
  onMaxColorChange = this.setHeatRules;

  @Prop({ required: false, default: undefined })
  ranges!: AxisRange[] | undefined;

  @Watch("ranges")
  onRangesChange = this.setHeatRules;

  @Prop({ required: true })
  data!: unknown[];

  @Watch("data")
  onDataChange = this.setData;

  serie: am5xy.ColumnSeries | null = null;

  upAndRunning: boolean = false;

  setName(): void {
    this.serie!.set("name", this.name);
  }

  setShowTooltip(): void {
    if (this.showTooltip) {
      this.serie!.columns.template.set("tooltipText", this.tooltipText);
    }
    else {
      this.serie!.columns.template.set("tooltipText", undefined);    
    }
  }

  setHeatRules(): void {
    this.serie!.columns.template.adapters.remove("fill");
    this.serie!.set("heatRules", undefined);

    switch(this.rule) {
      case HeatmapRule.Gradient: {
        this.serie!.set("heatRules", [{
          target: this.serie!.columns.template,
          min: am5.color(this.minColor),
          max: am5.color(this.maxColor),
          dataField: "value",
          key: "fill"
        }]);
        break;
      }
      case HeatmapRule.Ranges: {
        if (this.ranges != null && this.ranges.length > 0) {
          this.serie!.columns.template.adapters.add("fill", (value: any, target: any): am5.Color | undefined => {
            if (target.dataItem != null) {
              let value = target.dataItem!.dataContext[this.sizeField];
              for (let i = 0; i < this.ranges!.length; i++) {
                if (value >= this.ranges![i].startValue && value < this.ranges![i].endValue) {
                  return am5.color(this.ranges![i].color);
                }
              }
            }
            return value;
          });
        }
        break;
      }
    }

    this.setData();
  }

  setData(): void {
    if (this.xAxis instanceof am5xy.CategoryAxis) {
      // Add to axis
      this.xAxis.data.setAll(
        updateCategories(this.xAxis.data.values, this.data, this.xField, this.codeXField, null, this.yField, this.serieId, true, PositionEnum.Abscissa)
      );
    }
    if (this.yAxis instanceof am5xy.CategoryAxis) {
      // Add to axis
      this.yAxis.data.setAll(
        updateCategories(this.yAxis.data.values, this.data, this.yField, this.codeYField, null, this.xField, this.serieId, true, PositionEnum.Ordinate)
      );
    }
    this.serie!.data.setAll(this.data);
  }

  setLegend(): void {
    if (this.legend != null && this.rule === HeatmapRule.Gradient) {
      if (this.legend!.get("startValue") == null || this.legend!.get("startValue")! > this.serie!.getPrivate("valueLow")!) {
        this.legend!.set("startValue", this.serie!.getPrivate("valueLow")!);
      }
      if (this.legend!.get("endValue") == null || this.legend!.get("endValue")! < this.serie!.getPrivate("valueHigh")!) {
        this.legend!.set("endValue", this.serie!.getPrivate("valueHigh")!);
      }
    }
  }

  mounted(): void {
    this.serieId = Math.random();

    this.serie = this.chart.series.push(am5xy.ColumnSeries.new(this.root, {
      calculateAggregates: true,
      stroke: am5.color("#ffffff"),
      clustered: false,
      name: this.name,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      openValueXField: this.xField,
      valueXField: this.closeXField,
      categoryXField: this.codeXField,
      categoryYField: this.codeYField,
      valueField: this.sizeField,
      userData: { serie: SerieEnum.HeatmapSerie }
    }));

    this.serie.columns.template.setAll({
      height: am5.percent(100),
      width: am5.percent(100),
      strokeOpacity: 0.1,
      strokeWidth: 2
    });

    // Set updatable properties
    this.setName();
    this.setHeatRules();
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
        updateCategories(this.xAxis.data.values, [], this.xField, this.codeXField, null, this.yField, this.serieId, true, PositionEnum.Abscissa)
      );
    }

    if (this.yAxis instanceof am5xy.CategoryAxis) {
      // Remove from axis
      this.yAxis.data.setAll(
        updateCategories(this.yAxis.data.values, [], this.yField, this.codeYField, null, this.xField, this.serieId, true, PositionEnum.Ordinate)
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