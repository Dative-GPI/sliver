<template>
  <div>
    <slot
      v-if="upAndRunning"
      :clickedData="clickedData"
    > </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, ProvideReactive, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import { ISpritePointerEvent } from "@amcharts/amcharts5/.internal/core/render/Sprite";

import { AMROOT, CHART, LEGEND, SERIE } from "../../literals";
import { SerieEnum } from "../../enums";

@Component({})
export default class DPieSerieExtended extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5percent.PieChart;

  @InjectReactive(LEGEND)
  legend!: am5.Legend | null;

  @ProvideReactive(SERIE)
  serie: am5percent.PieSeries | null = null;

  @Prop({ required: false, default: "categoryX" })
  categoryField!: string;

  @Prop({ required: false, default: "valueY" })
  valueField!: string;

  @Prop({ required: false, default: true })
  alignLabels!: boolean;

  @Watch("alignLabels")
  onAlignLabelsChange = this.setAlignLabels;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{dataItem.dataContext.categoryX}: {valuePercentTotal.formatNumber('0.00')}% - {dataItem.dataContext.valueY}{dataItem.dataContext.unit}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setShowTooltip;

  @Prop({ required: false, default: "{dataItem.dataContext.categoryX}" })
  legendLabelText!: string;

  @Watch("legendLabelText")
  onLegendLabelTextChange = this.setLegendLabelText;

  @Prop({ required: false, default: "truncate" })
  oversizedBehavior!: "none" | "hide" | "fit" | "wrap" | "truncate";

  @Watch("oversizedBehavior")
  onOversizedBehaviorChange = this.setOversizedBehavior;

  @Prop({ required: false, default: "{category}" })
  text!: string;

  @Watch("text")
  onTextChange = this.setText;

  @Prop({ required: false, default: "aligned" })
  textType!: "regular" | "circular" | "radial" | "aligned" | "adjusted";

  @Watch("textType")
  onTextTypeChange = this.setTextType;

  tooltip: am5.Tooltip | null = null;

  upAndRunning: boolean = false;
  clickedData: { key: number, id: string } | null = null;

  onClick(event: ISpritePointerEvent): void {
    let key = this.clickedData ? this.clickedData.key + 1 : 0;
    this.clickedData = { key, id: (event!.target!.dataItem!.dataContext as any).dataId };
  }

  setShowTooltip(): void {
    if (this.showTooltip) {
      this.serie!.slices.template.set("tooltipText", this.tooltipText);
    }
    else {
      this.serie!.slices.template.set("tooltipText", undefined);    
    }
  }

  setAlignLabels(): void {
    this.serie!.set("alignLabels", this.alignLabels);
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : "");
  }

  setOversizedBehavior(): void {
    this.serie!.labels.template.set("oversizedBehavior", this.oversizedBehavior);
  }

  setText(): void {
    this.serie!.labels.template.set("text", this.text);
  }

  setTextType(): void {
    this.serie!.labels.template.set("textType", this.textType);
  }

  mounted(): void {
    // Add to chart
    this.serie = this.chart.series.push(am5percent.PieSeries.new(this.root, {
      categoryField: this.categoryField,
      valueField: this.valueField,
      fillField: "color",
      userData: { serie: SerieEnum.PieSerie }
    }));

    this.serie.labels.template.set("templateField", "labelSettings");
    this.serie.ticks.template.set("templateField", "tickSettings");
    this.serie.slices.template.setAll({
      templateField: "sliceSettings",
      tooltipX: am5.percent(75),
      tooltipY: am5.percent(75)
    });
    this.serie.slices.template.events.on("click", this.onClick);

    this.setShowTooltip();
    this.setAlignLabels();

    this.setOversizedBehavior();
    this.setText();
    this.setTextType();

    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from legend
    if (this.legend) {
      this.serie!.dataItems.forEach((dataItem: any) => {
        this.legend!.data.removeValue(dataItem);
      });
    }

    // Remove from chart
    this.chart.series.removeValue(this.serie!);

    // Remove event handler
    this.serie!.slices.template.events.off("click", this.onClick);

    // Dispose
    this.serie!.dispose();
  }
}
</script>