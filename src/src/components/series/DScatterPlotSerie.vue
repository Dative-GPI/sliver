<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, LEGEND, LEGEND_DEBUG, XAXIS, YAXIS } from "../../literals";
import { updateCategories, addSerie, removeSerie, textColor, setScatterPlotSerieBullets } from "../../helpers";
import { ColorSets, GetHashedColor } from "../../colors";
import { SerieEnum } from "../../enums";

@Component({})
export default class DScatterPlotSerie extends Vue {
  serieId: number = 0;

  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.ValueAxis<am5xy.AxisRendererX> | am5xy.CategoryAxis<am5xy.AxisRendererX>;

  @InjectReactive(YAXIS)
  yAxis!: am5xy.ValueAxis<am5xy.AxisRendererY> | am5xy.CategoryAxis<am5xy.AxisRendererY>;

  @InjectReactive(CURSOR)
  cursor!: am5xy.XYCursor | null;

  @InjectReactive(LEGEND)
  legend!: am5.Legend | null;

  @InjectReactive(LEGEND_DEBUG)
  legendDebug!: number;

  @Watch("legendDebug")
  onLegendDebugChange = this.setBullets;

  @Prop({ required: true })
  name!: string;

  @Watch("name")
  onNameChange = this.setName;

  @Prop({ required: false, default: false })
  snapToSeries!: boolean;

  @Prop({ required: false, default: "valueX" })
  xField!: string;

  @Prop({ required: false, default: "categoryCodeX" })
  codeXField!: string;

  @Prop({ required: false, default: "valueY" })
  yField!: string;

  @Prop({ required: false, default: "categoryCodeY" })
  codeYField!: string;

  @Prop({ required: false, default: "valueZ" })
  zField!: string;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setBullets;

  @Prop({ required: false, default: "{name}: {dataItem.dataContext.valueZ}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setBullets;

  @Prop({ required: false, default: "" })
  legendLabelText!: string;

  @Watch("legendLabelText")
  onLegendLabelTextChange = this.setLegendLabelText;

  @Prop({ required: false, default: 5 })
  bulletRadius!: number;

  @Watch("bulletRadius")
  onBulletRadiusChange = this.setBullets;

  @Prop({ required: false, default: 5 })
  heatRulesMin!: number;

  @Watch("heatRulesMin")
  onHeatRulesMinChange = this.setHeatRules;

  @Prop({ required: false, default: 15 })
  heatRulesMax!: number;

  @Watch("heatRulesMax")
  onHeatRulesMaxChange = this.setHeatRules;

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

  serie: am5xy.LineSeries | null = null;

  upAndRunning: boolean = false;

  setName(): void {
    this.serie!.set("name", this.name);
    this.setLegendLabelText();
    this.setColor();
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
  }

  setBullets(): void {
    let { circleTemplate, showTooltip, tooltip, tooltipText, ...userData } = this.serie!.get("userData");

    this.serie!.set("userData", {
      ...userData,
      circleTemplate: am5.Template.new<am5.Circle>({ radius: this.bulletRadius }),
      showTooltip: this.showTooltip,
      tooltipText: this.tooltipText
    });
    
    setScatterPlotSerieBullets(this.serie!, this.root);
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

  mounted(): void {
    this.serieId = Math.random();

    this.serie = this.chart.series.push(am5xy.LineSeries.new(this.root, {
      name: this.name,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      categoryXField: this.codeXField,
      valueXField: this.xField,
      categoryYField: this.codeYField,
      valueYField: this.yField,
      valueField: this.zField,
      calculateAggregates: true,
      sequencedInterpolation: true,
      userData: { serie: SerieEnum.ScatterPlotSerie }
    }));
    this.serie.strokes.template.set("strokeOpacity", 0);

    // Set updatable properties
    this.setName();
    this.setBullets();
    
    // Set data
    this.setData();
    
    // Add to legend
    if (this.legend != null) {
      this.legend.data.push(this.serie);
    }

    // Add to cursor
    if (this.cursor != null && this.snapToSeries) {
      this.cursor.set("snapToSeries", addSerie(this.cursor.get("snapToSeries")!, this.serie));
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