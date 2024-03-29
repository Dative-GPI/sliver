<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue, Prop, ProvideReactive, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5xy from "@amcharts/amcharts5/xy";

import { HeatRule, LayoutEnum, PositionEnum } from "../../enums";
import { AMROOT, CHART, LEGEND } from "../../literals";
import { ValueRange } from "../../models";

@Component({})
export default class DHeatLegend extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart | am5percent.PieChart | am5radar.RadarChart;

  @Prop({ required: false, default: true })
  enabled!: boolean;

  @Watch("enabled")
  onEnabledChange = this.setEnabled;

  @Prop({ required: false, default: PositionEnum.Abscissa })
  position!: PositionEnum;

  @Watch("position")
  onPositionChange = this.setEnabled;

  @Prop({ required: false, default: LayoutEnum.Grid })
  layout!: LayoutEnum;

  @Watch("layout")
  onLayoutChange = this.setEnabled;

  @Prop({ required: false, default: 50 })
  x!: number;

  @Watch("x")
  onXChange = this.setEnabled;

  @Prop({ required: false, default: 50 })
  centerX!: number;

  @Watch("centerX")
  onCenterXChange = this.setEnabled;

  @Prop({ required: false, default: 50 })
  y!: number;

  @Watch("y")
  onYChange = this.setEnabled;

  @Prop({ required: false, default: 50 })
  centerY!: number;

  @Watch("centerY")
  onCenterYChange = this.setEnabled;

  @Prop({ required: false, default: HeatRule.Gradient })
  heatRule!: HeatRule;

  @Watch("heatRule")
  onHeatRuleChange = this.setEnabled;

  @Prop({ required: false, default: "#ffff00" })
  minColor!: string;

  @Watch("minColor")
  onMinColorChange = this.setEnabled;

  @Prop({ required: false, default: "#ff0000" })
  maxColor!: string;

  @Watch("maxColor")
  onMaxColorChange = this.setEnabled;

  @Prop({ required: false, default: undefined })
  heatRanges!: ValueRange[] | undefined;

  @Watch("ranges")
  onHeatRangesChange = this.setEnabled;

  @Prop({ required: false, default: "#ffff00" })
  fixedColor!: string;

  @Watch("fixedColor")
  onFixedColorChange = this.setEnabled;

  @ProvideReactive(LEGEND)
  legend: am5.HeatLegend | am5.Legend | null = null;

  upAndRunning: boolean = false;

  get orientation(): "vertical" | "horizontal" {
    switch(this.position) {
      case PositionEnum.Abscissa: return "vertical";
      case PositionEnum.Ordinate: return "horizontal";
    }
  }

  setEnabled(): void {
    if (this.legend != null) {
      // Remove from chart
      this.chart!.children.removeValue(this.legend!);

      // Dispose
      this.legend!.dispose();
      this.legend = null;
    }
    if (this.enabled) {
      switch (this.heatRule) {
        case HeatRule.Gradient: {
          this.legend = this.chart.children.push(am5.HeatLegend.new(this.root, {
            startColor: am5.color(this.minColor),
            endColor: am5.color(this.maxColor),
            orientation: this.orientation
          }));
          break;
        }
        case HeatRule.Ranges: {
          this.legend = this.chart.children.push(am5.Legend.new(this.root, {
            nameField: "name",
            fillField: "color",
            strokeField: "color",
          }));

          switch (this.position) {
            case PositionEnum.Abscissa: {
              this.legend!.set("x", undefined);
              this.legend!.set("y", am5.percent(this.y));
              this.legend!.set("centerX", undefined);
              this.legend!.set("centerY", am5.percent(this.centerY));
              break;
            }
            case PositionEnum.Ordinate: {
              this.legend!.set("x", am5.percent(this.x));
              this.legend!.set("y", undefined);
              this.legend!.set("centerX", am5.percent(this.centerX));
              this.legend!.set("centerY", undefined);
            }
          }
          switch (this.layout) {
            case LayoutEnum.Grid: {
              this.legend!.set("layout", this.root!.gridLayout);
              break;
            }
            case LayoutEnum.Horizontal: {
              this.legend!.set("layout", this.root!.horizontalLayout);
              break;
            }
            case LayoutEnum.Vertical: {
              this.legend!.set("layout", this.root!.verticalLayout);
              break;
            }
          }
          if (this.heatRanges != null) {
            this.legend.data.setAll(this.heatRanges!.map(r => ({
              name: r.label,
              color: am5.color(r.color)
            })));
          }
          break;
        }
        case HeatRule.Fixed: {
          this.legend = this.chart.children.push(am5.Legend.new(this.root, {
            nameField: "name",
            fillField: "color",
            strokeField: "color",
          }));

          switch (this.position) {
            case PositionEnum.Abscissa: {
              this.legend!.set("x", undefined);
              this.legend!.set("y", am5.percent(this.y));
              this.legend!.set("centerX", undefined);
              this.legend!.set("centerY", am5.percent(this.centerY));
              break;
            }
            case PositionEnum.Ordinate: {
              this.legend!.set("x", am5.percent(this.x));
              this.legend!.set("y", undefined);
              this.legend!.set("centerX", am5.percent(this.centerX));
              this.legend!.set("centerY", undefined);
            }

            this.legend.data.setAll([{
              name: "",
              color: am5.color(this.fixedColor)
            }]);
          }
          break;
        }
      }
    }
  }

  mounted(): void {
    this.setEnabled();

    this.upAndRunning = true;
  }

  destroyed(): void {
    if (this.legend != null) {
      // Remove from chart
      this.chart!.children.removeValue(this.legend!);

      // Dispose
      this.legend!.dispose();
    }
  }
}
</script>