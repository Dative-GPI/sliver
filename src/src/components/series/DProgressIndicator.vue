<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, LEGEND, XAXIS, XAXISVALIDATED, YAXIS, YAXISVALIDATED } from "../../literals";
import { ColorSets, GetHashedColor } from "../../colors";
import { textColor } from "../../helpers";
import { SerieEnum } from "../../enums";


@Component({})
export default class DProgressIndicator extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.ValueAxis<am5xy.AxisRendererX>;

  @InjectReactive(XAXISVALIDATED)
  xAxisValidated!: () => void | undefined;

  @InjectReactive(YAXIS)
  yAxis!: am5xy.ValueAxis<am5xy.AxisRendererY>;

  @InjectReactive(YAXISVALIDATED)
  yAxisValidated!: () => void | undefined;

  @InjectReactive(LEGEND)
  legend!: am5.Legend | null;

  @Prop({ required: true })
  name!: string;

  @Watch("name")
  onNameChange = this.setName;

  @Prop({ required: false, default: "" })
  unit!: string;

  @Watch("unit")
  onUnitChange = this.setTooltipText;

  @Prop({ required: false, default: "{name}: [bold]{value}[/]" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setTooltipText;

  @Prop({ required: false, default: 0 })
  colorIndex!: number;

  @Watch("colorIndex")
  onColorIndexChange = this.setColor;

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

  @Prop({ required: false, default: 0 })
  value!: number;

  @Watch("value")
  onValueChange = this.setValue;

  get color(): am5.Color {
    switch (this.colorSet) {
      case ColorSets.Hash: return GetHashedColor(this.colorSeed, this.name);
      default: return this.chart!.get("colors")!.getIndex(this.colorIndex);
    }
  }

  progressIndicator: am5.Graphics | null = null;
  axisDataItem: any = null;
  tooltip: am5.Tooltip | null = null;

  upAndRunning: boolean = false;

  setName(): void {
    // Remove from legend
    if (this.legend != null) {
      this.legend.data.removeValue(this.axisDataItem!);
    }

    this.axisDataItem!.set("name", this.name);

    // Add to legend (otherwise the name is not updated)
    if (this.legend != null) {
      this.legend.data.push(this.axisDataItem!);
    }
  }

  setTooltipText(): void {
    this.progressIndicator!.set("tooltipText", this.tooltipText + this.unit);
  }

  setColor(): void {
    // Remove from legend
    if (this.legend != null) {
      this.legend.data.removeValue(this.axisDataItem!);
    }

    this.axisDataItem!.set("fill", this.color);
    this.axisDataItem!.get("bullet").get("sprite").set("fill", this.color);
    this.tooltip!.label.set("fill", textColor(this.color.toCSSHex()));
    this.tooltip!.get("background")!.set("fill", this.color);

    // Add to legend (otherwise the name is not updated)
    if (this.legend != null) {
      this.legend.data.push(this.axisDataItem!);
    }
  }

  setValue(): void {
    this.axisDataItem!.animate({
      key: "value",
      to: this.value,
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic)
    });
  }

  mounted(): void {
    this.tooltip = am5.Tooltip.new(this.root, {
      autoTextColor: false
    });

    this.progressIndicator = am5.Graphics.new(this.root, {
      tooltip: this.tooltip!,
      tooltipY: 0,
      centerY: 80,
      centerX: am5.p50,
      svgPath: "M40.8 20.4C40.8 9.1 31.7 0 20.4 0C9.1 0 0 9.1 0 20.4C0 31.7 20.4 52.8 20.4 52.8C20.4 52.8 40.8 31.7 40.8 20.4Z",
      userData: { serie: SerieEnum.ProgressIndicator }
    });

    // Add to axis
    this.axisDataItem = this.xAxis.makeDataItem({
      bullet: am5xy.AxisBullet.new(this.root, {
        sprite: this.progressIndicator
      })
    });

    this.setName();
    this.setTooltipText();
    this.setColor();

    this.xAxis.createAxisRange(this.axisDataItem);
    
    this.setValue();

    if (this.xAxisValidated != null) {
      this.xAxisValidated();
    }
    if (this.yAxisValidated != null) {
      this.yAxisValidated();
    }
    
    if (this.defaultHidden) {
      this.progressIndicator.hide();
      this.axisDataItem.hide();
    }
    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from legend
    if (this.legend) {
      this.legend.data.removeValue(this.progressIndicator);
    }

    // Remove from axis
    this.xAxis.axisRanges.removeValue(this.axisDataItem!);

    // Dispose
    if(this.tooltip != null && !this.tooltip!.isDisposed()) {
      this.tooltip!.dispose();
    }
    if (this.progressIndicator != null && !this.progressIndicator!.isDisposed()) {
      this.xAxis!.disposeDataItem(this.axisDataItem!);
    }
  }
}
</script>