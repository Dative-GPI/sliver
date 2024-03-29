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
import { setLineSerieBullets, textColor } from "../../helpers";
import { ColorSets, GetHashedColor } from "../../colors";
import { HeatRule, SerieEnum } from "../../enums";
import { ValueRange } from "../../models";

@Component({})
export default class DLineSerie extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.DateAxis<am5xy.AxisRendererX>;

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

  @Prop({ required: false, default: "timestampX" })
  dateXField!: string;

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

  @Prop({ required: false, default: "{name}: {valueY}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setShowTooltip;

  @Prop({ required: false, default: true })
  snapTooltip!: boolean;

  @Watch("snapTooltip")
  onSnapTooltipChange = this.setSnapTooltip;

  @Prop({ required: false, default: "" })
  legendLabelText!: string;

  @Watch("legendLabelText")
  onLegendLabelTextChange = this.setLegendLabelText;

  @Prop({ required: false, default: true })
  connect!: boolean;

  @Watch("connect")
  onConnectChange = this.setConnect;

  @Prop({ required: false, default: false })
  showBullets!: boolean;

  @Watch("showBullets")
  onShowBulletsChange = this.setBullets;

  @Prop({ required: false, default: 5 })
  bulletsRadius!: number;

  @Watch("bulletsRadius")
  onBulletsRadiusChange = this.setBullets;

  @Prop({ required: false, default: HeatRule.None })
  heatRule!: HeatRule;

  @Watch("heatRule")
  onHeatRuleChange = this.setHeatRule;

  @Prop({ required: false, default: "#ffff00" })
  minColor!: string;

  @Watch("minColor")
  onMinColorChange = this.setHeatRule;

  @Prop({ required: false, default: "#ff0000" })
  maxColor!: string;

  @Watch("maxColor")
  onMaxColorChange = this.setHeatRule;

  @Prop({ required: false, default: undefined })
  heatRanges!: ValueRange[] | undefined;

  @Watch("ranges")
  onHeatRangesChange = this.setHeatRule;

  @Prop({ required: false, default: "#ffff00" })
  fixedColor!: string;

  @Watch("fixedColor")
  onFixedColorChange = this.setHeatRule;

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
  data!: unknown[];

  @Watch("data")
  onDataChange = this.setData;

  serie: am5xy.LineSeries | null = null;
  color: am5.Color | null = null;
  tooltip: am5.Tooltip | null = null;
  bullets: am5.Bullet | null = null;

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
        this.serie!.set("tooltip", undefined);
        this.tooltip = null;
      }
    }
    else {
      this.tooltip = am5.Tooltip.new(this.root, {
        autoTextColor: false,
        labelText: this.tooltipText + this.unit,
        centerY: 25
      });
      this.tooltip.label.set("fill", textColor(this.serie!.get("fill")!.toCSSHex()));
      this.tooltip.get("background")!.set("fillOpacity", 0.5);
      
      this.serie!.set("tooltip", this.tooltip);
    }
  }

  setSnapTooltip(): void {
    this.serie!.set("snapTooltip", this.snapTooltip);
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
  }

  setConnect(): void {
    this.serie!.set("connect", this.connect);
  }

  setBullets(): void {
    let { bulletRadius, showBullets, ...userData } = this.serie!.get("userData");

    this.serie!.set("userData", {
      ...userData,
      bulletRadius: this.bulletsRadius,
      showBullets: this.showBullets
    });
    
    setLineSerieBullets(this.serie!);
  }

  setHeatRule(): void {
    this.serie!.strokes.template.set("strokeGradient", undefined);

    switch (this.heatRule) {
      case HeatRule.Gradient: {
        this.serie!.strokes.template.set("strokeGradient", am5.LinearGradient.new(this.root, {
          stops: [
            { color: am5.color(this.maxColor) },
            { color: am5.color(this.minColor) }
          ],
          target: this.chart!.plotContainer
        }));
        break;
      }
      case HeatRule.Fixed: {
        this.serie!.strokes.template.set("strokeGradient", am5.LinearGradient.new(this.root, {
          stops: [
            { color: am5.color(this.fixedColor) },
            { color: am5.color(this.fixedColor) }
          ],
          target: this.chart!.plotContainer
        }));
        break;
      }
    }

    this.setData();
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
    switch (this.heatRule) {
      case HeatRule.None:
      case HeatRule.Gradient:
      case HeatRule.Fixed: {
        this.serie!.data.setAll(this.data);
        break;
      }
      case HeatRule.Ranges: {
        if (this.heatRanges != null && this.heatRanges.length > 0) {
          this.serie!.strokes.template.set("templateField", "strokeSettings");

          let data = this.data.map((point: any) => {
            var color: am5.Color | null = null;
            for (let i = 0; i < this.heatRanges!.length; i++) {
              if (point[this.valueYField] >= this.heatRanges![i].startValue && point[this.valueYField] <= this.heatRanges![i].endValue) {
                color = am5.color(this.heatRanges![i].color);
              }
            }
            return {
              [this.valueYField]: point[this.valueYField],
              [this.dateXField]: point[this.dateXField],
              strokeSettings: color != null ? { stroke: color } : undefined
            }
          });
          this.serie!.data.setAll(data);
        }
        else {
          this.serie!.data.setAll(this.data);
        }
      }
    }
    this.setShowTooltip();
  }

  mounted(): void {
    // Add to chart
    this.serie = this.chart.series.push(am5xy.LineSeries.new(this.root, {
      calculateAggregates: true,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueXField: this.dateXField,
      valueYField: this.valueYField,
      userData: { serie: SerieEnum.LineSerie }
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
    this.setSnapTooltip();
    this.setConnect();
    this.setHeatRule();
    this.setBullets();

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