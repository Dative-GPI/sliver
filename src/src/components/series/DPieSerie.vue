<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";

import { AMROOT, CHART, LEGEND } from "../../literals";
import { SerieEnum } from "../../enums";

@Component({})
export default class DPieSerie extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5percent.PieChart;

  @InjectReactive(LEGEND)
  legend!: am5.Legend | null;

  @Prop({ required: true })
  name!: string;

  @Watch("name")
  onNameCHange = this.setName;

  @Prop({ required: false, default: "categoryX" })
  categoryField!: string;

  @Prop({ required: false, default: "valueY" })
  valueField!: string;

  @Prop({ required: false, default: false })
  alignLabels!: boolean;

  @Watch("alignLabels")
  onAlignLabelsChange = this.setAlignLabels;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{category}: {value} ({valuePercentTotal.formatNumber('0.00')}%)" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setTooltipText;

  @Prop({ required: false, default: "{category}" })
  legendLabelText!: string;

  @Watch("legendLabelText")
  onLegendLabelTextChange = this.setLegendLabelText;

  @Prop({ required: false, default: false })
  forceHiddenLabels!: boolean;

  @Watch("forceHiddenLabels")
  onForceHiddenLabelsChange = this.setForceHiddenLabels;

  @Prop({ required: false, default: "{category}" })
  textLabels!: string;

  @Watch("textLabels")
  onTextLabelsCHange = this.setTextLabels;

  @Prop({ required: false, default: "circular" })
  textTypeLabels!: "regular" | "circular" | "radial" | "aligned" | "adjusted" | undefined;

  @Watch("textTypeLabels")
  onTextTypeLabelsChange = this.setTextTypeLabels;

  @Prop({ required: false, default: false })
  breakDownSlices!: boolean;

  @Watch("breakDownSlices")
  onBreakDownSlicesChange = this.setBreakDownSlices;

  @Prop({ required: false, default: "subs" })
  breakDownSlicesSubname!: string;

  @Prop({ required: true })
  data!: any[];

  @Watch("data")
  onDataChange = this.setData;

  serie: am5percent.PieSeries | null = null;
  tooltip: am5.Tooltip | null = null;

  selected: any = null;

  upAndRunning = false;

  setName(): void {
    this.serie!.set("name", this.name);
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
  }

  setShowTooltip(): void {
    if (!this.showTooltip) {
      if (this.tooltip != null) {
        this.tooltip!.dispose();
        this.serie!.set("tooltip", undefined);
        this.tooltip = null;
      }
    }
    else {
      this.tooltip = am5.Tooltip.new(this.root, {});
      this.serie!.set("tooltip", this.tooltip);
      this.setTooltipText();
    }
  }

  setTooltipText(): void {
    if (this.tooltip != null) {
      this.tooltip!.set("labelText", this.tooltipText ? this.tooltipText : "{" + this.valueField + "}");
    }
  }

  setAlignLabels(): void {
    this.serie!.set("alignLabels", this.alignLabels);
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
  }

  setForceHiddenLabels(): void {
    this.serie!.labels.template.set("forceHidden", this.forceHiddenLabels);
  }

  setTextLabels(): void {
    this.serie!.labels.template.set("text", this.textLabels);
  }

  setTextTypeLabels(): void {
    this.serie!.labels.template.set("textType", this.textTypeLabels);
  }

  setBreakDownSlices(): void {
    if (this.breakDownSlices) {
      this.serie!.slices.template.events.on("click", this.handleBreakDownSlices);
    }
    else {
      this.serie!.slices.template.events.off("click", this.handleBreakDownSlices);
    }
  }

  handleBreakDownSlices(event: any) {
    if (event.target.dataItem.dataContext.id != null) {
      this.selected = event.target.dataItem.dataContext.id;
    } else {
      this.selected = undefined;
    }
    this.setData();
  }

  setData(): void {
    // Remove from legend
    if (this.legend) {
      this.serie!.dataItems.forEach((dataItem: any) => {
        this.legend!.data.removeValue(dataItem);
      });
    }
    if (this.breakDownSlices) {
      var chartData = [];
      for (var i = 0; i < this.data.length; i++) {
        if (this.selected === i) {
          for (var x = 0; x < this.data[i][this.breakDownSlicesSubname].length; x++) {
            chartData.push({
              [this.categoryField]: this.data[i][this.breakDownSlicesSubname][x][this.categoryField],
              [this.valueField]: this.data[i][this.breakDownSlicesSubname][x][this.valueField],
              color: this.serie!.get("colors")!.getIndex(this.data.length + x)!,
              sliceSettings: { active: true },
              pulled: true
            });
          }
        } else {
          chartData.push({
            [this.categoryField]: this.data[i][this.categoryField],
            [this.valueField]: this.data[i][this.valueField],
            color: this.serie!.get("colors")!.getIndex(i)!,
            id: i
          });
        }
      }
      this.serie!.data.setAll(chartData);
    }
    else {
      this.serie!.data.setAll(this.data);
    }
    // Add to legend
    if (this.legend != null) {
      this.legend.data.pushAll(this.serie!.dataItems);
    }
  }

  mounted(): void {
    // Add to chart
    this.serie = this.chart.series.push(am5percent.PieSeries.new(this.root, {
      categoryField: this.categoryField,
      valueField: this.valueField,
      fillField: "color",
      sequencedInterpolation: true,
      userData: { serie: SerieEnum.PieSerie }
    }));
    
    this.serie!.slices.template.set("templateField", "sliceSettings");

    this.setName();
    this.setShowTooltip();
    this.setAlignLabels();

    this.setForceHiddenLabels();
    this.setTextLabels();
    this.setTextTypeLabels();

    this.setBreakDownSlices();
    
    // Set data
    this.setData();

    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from chart
    this.chart.series.removeValue(this.serie!);

    // Remove event handler
    this.serie!.slices.template.events.off("click", this.handleBreakDownSlices);

    // Remove from legend
    if (this.legend) {
      this.serie!.dataItems.forEach((dataItem: any) => {
        this.legend!.data.removeValue(dataItem);
      });
    }

    // Dispose
    this.serie!.dispose();
  }
}
</script>