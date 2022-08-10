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
import { uuidv4 } from "../../helpers";
import { ISpritePointerEvent } from "@amcharts/amcharts5/.internal/core/render/Sprite";

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

  @Prop({ required: false, default: "categoryCodeX" })
  categoryCodeField!: string;

  @Prop({ required: false, default: "valueY" })
  valueField!: string;

  @Prop({ required: false, default: "subs" })
  subField!: string;

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

  @Prop({ required: false, default: "aligned" })
  textTypeLabels!: "regular" | "circular" | "radial" | "aligned" | "adjusted" | undefined;

  @Watch("textTypeLabels")
  onTextTypeLabelsChange = this.setTextTypeLabels;

  @Prop({ required: false, default: "Other" })
  otherLabel!: string;

  @Watch("otherLabel")
  onOtherLabelChange = this.subData;

  @Prop({ required: false, default: 1 })
  otherThreshold: number | undefined;

  @Watch("otherThreshold")
  onOtherThresholdChange = this.subData;

  @Prop({ required: true })
  data!: any[];

  @Watch("data")
  onDataChange = this.subData;

  serie: am5percent.PieSeries | null = null;
  tooltip: am5.Tooltip | null = null;

  subbedData: any[] = [];
  
  explodingSelectedId: string | null = null;
  explodingSelectedLabel: string | null = null;
  explodingSelectedValue: number | null = null;
  zoomSelectedId: string | null = null;
  selectedId: string | null = null;
  hiddenItems: string[] = [];

  upAndRunning: boolean = false;

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

  subData(): void {
    let sum = 0;
    this.subbedData = [];

    for (let i = 0; i < this.data.length; i++) {
      sum += this.data[i][this.valueField];
      let id = uuidv4();

      this.subbedData.push({
        id: id,
        parentId: undefined,
        exploding: (this.data[i][this.subField] != null && this.data[i][this.subField].length > 0),
        zooming: false,
        belowThreshold: false,
        sortValue: this.data[i][this.valueField],
        subSortValue: this.data[i][this.valueField],
        [this.categoryField]: this.data[i][this.categoryField],
        [this.valueField]: this.data[i][this.valueField],
        [this.subField]: (this.data[i][this.subField] != null && this.data[i][this.subField].length > 0) ? this.data[i][this.subField].map((s: any) => ({
          id: uuidv4(),
          parentId: id,
          belowThreshold: false,
          exploding: false,
          sortValue: this.data[i][this.valueField],
          subSortValue: s[this.valueField],
          [this.categoryField]: s[this.categoryField],
          [this.valueField]: s[this.valueField]
        })) : null
      });
    }

    if (this.otherThreshold != null) {
      let threshold = (sum / 100) * this.otherThreshold;

      for (let i = 0; i < this.subbedData.length; i++) {
        if (this.subbedData[i][this.valueField] <= threshold) {
          this.subbedData[i].belowThreshold = true;
        }
        if (this.subbedData[i][this.subField] != null) {
          for (let j = 0; j < this.subbedData[i][this.subField].length; j++) {
            if (this.subbedData[i][this.subField][j][this.valueField] <= threshold) {
              this.subbedData[i][this.subField][j].belowThreshold = true;
            }
          }
        }
      }
    }

    this.setData();
  }

  handleBreakDownSlices(event: any): void {
    let formerExplodingId = this.explodingSelectedId;
    let formerZoomingId = this.zoomSelectedId;
    
    let target = event.target.dataItem.dataContext;
    if (!target.zooming || target.id !== "1") {
      this.explodingSelectedId = target.exploding ? target.id : null;
      this.explodingSelectedLabel = target.exploding ? target[this.categoryField] : null;
      this.explodingSelectedValue = target.exploding ? target[this.valueField] : null;
    }
    this.zoomSelectedId = target.zooming ? target.id : null;
    this.selectedId = target.id;

    if (formerExplodingId != this.explodingSelectedId || formerZoomingId != this.zoomSelectedId) {
      this.setData();
    }
  }

  setData(): void {
    // Remove from legend
    if (this.legend) {
      this.serie!.dataItems.forEach((dataItem: any) => {
        this.legend!.data.removeValue(dataItem);
      });
    }

    let chartData: any[] = [];

    for (let i = 0; i < this.subbedData.length; i++) {
      if (this.explodingSelectedId === this.subbedData[i].id) {
        for (let j = 0; j < this.subbedData[i][this.subField].length; j++) {
          chartData.push({
            id: this.subbedData[i][this.subField][j].id,
            parentId: this.subbedData[i].id,
            exploding: false,
            zooming: false,
            belowThreshold: this.subbedData[i][this.subField][j].belowThreshold,
            sortValue: this.subbedData[i][this.subField][j].sortValue,
            subSortValue: this.subbedData[i][this.subField][j].subSortValue,
            [this.categoryField]: this.subbedData[i][this.subField][j][this.categoryField],
            [this.valueField]: this.subbedData[i][this.subField][j][this.valueField],
            color: this.serie!.get("colors")!.getIndex(this.subbedData.length + j)!,
            sliceSettings: { active: true },
            pulled: true
          });
        }
      }
      else {
        let pulled = (this.subbedData[i].belowThreshold && this.zoomSelectedId === "0") || (this.subbedData[i].id === this.selectedId);
        chartData.push({
          id: this.subbedData[i].id,
          parentId: undefined,
          exploding: this.subbedData[i].exploding,
          zooming: false,
          belowThreshold: this.subbedData[i].belowThreshold,
          sortValue: this.subbedData[i].sortValue,
          subSortValue: this.subbedData[i].subSortValue,
          [this.categoryField]: this.subbedData[i][this.categoryField],
          [this.valueField]: this.subbedData[i][this.valueField],
          color: this.serie!.get("colors")!.getIndex(i)!,
          sliceSettings: { active: pulled },
          pulled: pulled
        });
      }
    }

    if (this.zoomSelectedId !== "0") {
      let mainOther = {
        id: "0",
        parentId: undefined,
        exploding: false,
        zooming: true,
        belowThreshold: false,
        sortValue: -5,
        subSortValue: -5,
        [this.categoryField]: this.otherLabel,
        [this.valueField]: 0,
        color: this.serie!.get("colors")!.getIndex(chartData.length + 1)!
      }
      let mainPush = false;

      for (let i = chartData.length - 1; i >= 0; i--) {
        if (chartData[i].belowThreshold && chartData[i].parentId == null) {
          mainPush = true;
          mainOther[this.valueField] += chartData[i][this.valueField];
          chartData.splice(i, 1);
        }
      }
      if (mainPush) {
        chartData.push(mainOther);
      }
    }
    
    if (this.zoomSelectedId !== "1") {
      let subOther = {
        id: "1",
        parentId: this.explodingSelectedId,
        exploding: false,
        zooming: true,
        belowThreshold: false,
        sortValue: this.explodingSelectedValue,
        subSortValue: 0,
        [this.categoryField]: this.explodingSelectedLabel + " - " + this.otherLabel,
        [this.valueField]: 0,
        color: this.serie!.get("colors")!.getIndex(chartData.length + 2)!,
        sliceSettings: { active: true },
        pulled: true
      }
      let subPush = false;

      for (let i = chartData.length - 1; i >= 0; i--) {
        if (chartData[i].belowThreshold && chartData[i].parentId != null && chartData[i].parentId === this.explodingSelectedId) {
          subPush = true;
          subOther[this.valueField] += chartData[i][this.valueField];
          chartData.splice(i, 1);
        }
      }
      if (subPush && subOther[this.valueField]! > 0) {
        chartData.push(subOther);
      }
    }

    chartData.sort((a: any, b: any) => {
      if (b.sortValue === a.sortValue) {
        if (a.parentId === b.parentId) {
          return b.subSortValue - a.subSortValue;
        }
        if (a.id === "1") {
          return -1;
        }
        if (b.id === "1") {
          return 1;
        }
        return 0;
      }
      else {
        return b.sortValue - a.sortValue;
      }
    });

    this.serie!.data.setAll(chartData);

    // Add to legend
    if (this.legend != null) {
      this.serie!.dataItems.forEach((di: any) => {
        if (this.hiddenItems.includes(di.dataContext.id)) {
          di.hide();
        }
      });
      this.legend!.data.setAll(this.serie!.dataItems);
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
    
    this.serie!.slices.template.events.on("click", this.handleBreakDownSlices);
    this.serie!.slices.template.set("templateField", "sliceSettings");

    if (this.legend != null) {
      this.legend!.itemContainers.template.events.on("click", (ev: ISpritePointerEvent) => {
        var id = (ev.target!.dataItem!.dataContext as any).dataContext.id;
        if (this.hiddenItems.includes(id)) {
          this.hiddenItems = this.hiddenItems.filter(hi => hi !== id);
        }
        else {
          this.hiddenItems.push(id);
        }
        this.setData();
      });
    }

    this.setName();
    this.setShowTooltip();
    this.setAlignLabels();

    this.setForceHiddenLabels();
    this.setTextLabels();
    this.setTextTypeLabels();
    
    // Set data
    this.subData();

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