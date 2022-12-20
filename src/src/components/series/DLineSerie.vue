<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, LEGEND, XAXIS, XAXISVALIDATED, YAXIS } from "../../literals";
import { HeatRule, SerieEnum } from "../../enums";
import { textColor } from "../../helpers";
import { AxisRange } from "../../models";

@Component({})
export default class DLineSerie extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.DateAxis<am5xy.AxisRendererX>;

  @InjectReactive(XAXISVALIDATED)
  xAxisValidated!: () => void;

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

  @Prop({ required: false, default: "timestampX" })
  dateXField!: string;

  @Prop({ required: false, default: "valueY" })
  valueYField!: string;

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
  onShowBulletsChange = this.setShowBullets;

  @Prop({ required: false, default: 5 })
  bulletsRadius!: number;

  @Watch("bulletsRadius")
  onBulletsRadiusChange = this.setShowBullets;

  @Prop({ required: false, default: HeatRule.Gradient })
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
  heatRanges!: AxisRange[] | undefined;

  @Watch("ranges")
  onHeatRangesChange = this.setHeatRule;

  @Prop({ required: true })
  data!: unknown[];

  @Watch("data")
  onDataChange = this.setData;

  serie: am5xy.LineSeries | null = null;
  tooltip: am5.Tooltip | null = null;
  bullets: am5.Bullet | null = null;

  upAndRunning: boolean = false;

  setName(): void {
    this.serie!.set("name", this.name);
    this.setLegendLabelText();
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
        labelText: this.tooltipText,
        centerY: 25
      });
      this.tooltip.label.set("fill", textColor(this.serie!.get("fill")!.toCSSHex()));
      this.tooltip.get("background")!.set("fillOpacity", 0.50);
      
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

  setShowBullets(): void {
    this.serie!.bullets.clear();

    if (this.showBullets) {
      this.serie!.set("userData", {
        ...this.serie!.get("userData"),
        bulletRadius: this.bulletsRadius
      });
      this.serie!.bullets.push((root: am5.Root): am5.Bullet => {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: this.bulletsRadius,
            fill: this.serie!.get("fill")
          })
        });
      });
    }
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
    }

    this.setData();
  }

  setData(): void {
    switch (this.heatRule) {
      case HeatRule.Gradient: {
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

    this.serie.events.on("datavalidated", this.xAxisValidated);

    // Set updatable properties
    this.setName();
    this.setSnapTooltip();
    this.setConnect();
    this.setShowBullets();
    this.setHeatRule();

    // Add to legend
    if (this.legend != null) {
      this.legend.data.push(this.serie);
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