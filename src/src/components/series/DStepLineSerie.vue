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
import { textColor } from "../../helpers";
import { SerieEnum } from "../../enums";
import { ColorSets, GetHashedColor } from "../../colors";

@Component({})
export default class DStepLineSerie extends Vue {
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

  setColor(): void {
    if ([ColorSets.Hash].includes(this.colorSet)) {
      this.serie!.set("fill", GetHashedColor(this.colorSeed, this.name));
      this.serie!.set("stroke", GetHashedColor(this.colorSeed, this.name));
    }
    else {
      this.serie!.set("fill", this.chart!.get("colors")!.get("colors")![this.chart!.series.indexOf(this.serie!)])
      this.serie!.set("stroke", this.chart!.get("colors")!.get("colors")![this.chart!.series.indexOf(this.serie!)])
    }
  }

  setData(): void {
    this.serie!.data.setAll(this.data);
  }

  mounted(): void {
    // Add to chart
    this.serie = this.chart.series.push(am5xy.StepLineSeries.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueXField: this.dateXField,
      valueYField: this.valueYField,
      sequencedInterpolation: true,
      userData: { serie: SerieEnum.StepLineSerie }
    }));

    this.serie.events.on("datavalidated", this.xAxisValidated);

    // Set updatable properties
    this.setName();
    this.setShowTooltip();
    this.setSnapTooltip();
    this.setConnect();
    this.setShowBullets();

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