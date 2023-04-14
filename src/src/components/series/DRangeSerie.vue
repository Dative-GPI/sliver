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
import { getLineIntersection, removeSerie, setRangeSerieBullets, textColor } from "../../helpers";
import { ColorSets, GetHashedColor } from "../../colors";
import { SerieEnum } from "../../enums";

@Component({})
export default class DRangeSerie extends Vue {
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

  @Prop({ required: true })
  subNames!: string[];

  @Watch("subNames")
  onSubNamesChange = this.setSubNames;

  @Prop({ required: false, default: "timestampX" })
  dateXField!: string;

  @Prop({ required: false, default: "valueY" })
  valueYField!: string;

  @Prop({ required: false, default: "closeValueY" })
  closeValueYField!: string;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{name}: {valueY}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setShowTooltip;

  @Prop({ required: false, default: "{name}: {valueY}" })
  subTooltipText!: string;

  @Watch("subTooltipText")
  onSubTooltipTextChange = this.setShowTooltip;

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

  @Prop({ required: false, default: true })
  showTooltipBullet!: boolean;

  @Watch("showTooltipBullet")
  onShowTooltipBulletChange = this.setBullets;

  @Prop({ required: false, default: 5 })
  bulletsRadius!: number;

  @Watch("bulletsRadius")
  onBulletsRadiusChange = this.setBullets;

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
  data!: any[];

  @Watch("data")
  onDataChange = this.setData;

  @Prop({ required: true })
  subDatas!: any[][];

  @Watch("subDatas")
  onSubDatasChange = this.setSubDatas;

  serie: am5xy.LineSeries | null = null;
  tooltip: am5.Tooltip | null = null;
  subSeries: am5xy.LineSeries[] = [];
  subTooltips: am5.Tooltip[] = [];

  upAndRunning: boolean = false;

  setName(): void {
    this.serie!.set("name", this.name);
    this.setLegendLabelText();
    this.setColor();
  }

  setSubNames(): void {
    for (let i = 0; i < this.subNames.length; i++) {
      if (this.subSeries[i] != null) {
        this.subSeries[i].set("name", this.subNames[i]);
      }
    }
    this.setLegendLabelText();
  }

  setShowTooltip(): void {
    if (!this.showTooltip) {
      if (this.tooltip != null && !this.tooltip.isDisposed()) {
        this.tooltip!.dispose();
        this.serie!.set("tooltip", undefined);
        this.tooltip = null;
      }
      for (let i = 0; i < this.subTooltips.length; i++) {
        this.subTooltips[i].dispose();
        if (this.subSeries[i] != null) {
          this.subSeries[i].set("tooltip", undefined);
        }
      }
      this.subTooltips = [];
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

      for (let i = 0; i < this.subSeries.length; i++) {
        this.subTooltips.push(am5.Tooltip.new(this.root, {
          autoTextColor: false,
          labelText: this.subTooltipText,
          centerY: 25
        }));
        this.tooltip.label.set("fill", textColor(this.subSeries[i]!.get("fill")!.toCSSHex()));
        this.tooltip.get("background")!.set("fillOpacity", 0.50);

        this.subSeries[i].set("tooltip", this.subTooltips[i]);
      }
    }
  }

  setSnapTooltip(): void {
    this.serie!.set("snapTooltip", this.snapTooltip);
    for (let i = 0; i < this.subSeries.length; i++) {
      this.subSeries[i].set("snapTooltip", this.snapTooltip);
    }
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
    for (let i = 0; i < this.subSeries.length; i++) {
      let subName = this.subNames[i] ? this.subNames[i] : "";
      this.subSeries[i].set("legendLabelText", this.legendLabelText ? this.legendLabelText : subName);
    }
  }

  setConnect(): void {
    this.serie!.set("connect", this.connect);
  }

  setBullets(): void {
    let { bulletRadius, showBullets, showTooltipBullet, ...userData } = this.serie!.get("userData");

    this.serie!.set("userData", {
      ...userData,
      bulletRadius: this.bulletsRadius,
      showBullets: this.showBullets,
      showTooltipBullet: this.showTooltipBullet
    });
    
    setRangeSerieBullets(this.serie!);
  }

  setColor(): void {
    switch (this.colorSet) {
      case ColorSets.Hash: {
        this.serie!.set("fill", GetHashedColor(this.colorSeed, this.name));
        this.serie!.set("stroke", GetHashedColor(this.colorSeed, this.name));

        for (let i = 0; i < this.subSeries.length; i++) {
          if (this.subDatas[i] != null) {
            this.subSeries[i].set("fill", GetHashedColor(this.colorSeed, this.subNames[i]));
            this.subSeries[i].set("stroke", GetHashedColor(this.colorSeed, this.subNames[i]));
          }
        }
        break;
      }
      default: {
        this.serie!.set("fill", this.chart!.get("colors")!.getIndex(this.chart!.series.indexOf(this.serie!)));
        this.serie!.set("stroke", this.chart!.get("colors")!.getIndex(this.chart!.series.indexOf(this.serie!)));

        for (let i = 0; i < this.subSeries.length; i++) {
          if (this.subDatas[i] != null) {
            this.subSeries[i].set("fill", this.chart!.get("colors")!.getIndex(this.chart!.series.indexOf(this.subSeries[i])));
            this.subSeries[i].set("stroke", this.chart!.get("colors")!.getIndex(this.chart!.series.indexOf(this.subSeries[i])));
          }
        }
        break;
      }
    }
  }

  setData(): void {
    this.serie!.data.setAll(this.data);
    this.setShowTooltip();
  }

  getClosedSubData(subData: any[]): any[] {
    return subData.map((sd, i) => ({ ...sd, [this.closeValueYField]: this.data[i][this.valueYField] }));
  }

  setSubDatas(): void {
    for (let i = 0; i < this.subSeries.length; i++) {
      if (this.subDatas[i] != null) {
        this.subSeries[i].data.setAll(this.getClosedSubData(this.subDatas[i]));
      }
    }
    this.setShowTooltip();
  }

  mounted(): void {
    // Add to chart
    this.serie = this.chart.series.push(am5xy.LineSeries.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      valueXField: this.dateXField,
      valueYField: this.valueYField,
      userData: { serie: SerieEnum.RangeSerie }
    }));

    this.serie.events.on("datavalidated", () => {
      if (this.xAxisValidated != null) {
        this.xAxisValidated();
      }
      if (this.yAxisValidated != null) {
        this.yAxisValidated();
      }
    });

    for (let i = 0; i < this.subNames.length; i++) {
      this.subSeries.push(this.chart.series.push(am5xy.LineSeries.new(this.root, {
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueXField: this.dateXField,
        openValueYField: this.closeValueYField,
        valueYField: this.valueYField,
        userData: { serie: SerieEnum.RangeSerie }
      })));

      this.subSeries[i].fills.template.setAll({
        fillOpacity: 0.5,
        visible: true
      });
    }

    // Set updatable properties
    this.setName();
    this.setSubNames();
    this.setSnapTooltip();
    this.setConnect();
    this.setData();
    this.setSubDatas();

    // Add to legend
    if (this.legend != null) {
      this.legend.data.push(this.serie);
      this.legend.data.pushAll(this.subSeries);
    }

    for (let i = 0; i < this.subSeries.length; i++) {
      let j: any = 0;
      let baseInterval: any = this.xAxis.get("baseInterval");
      let baseDuration: any = this.xAxis.baseDuration() / 2;
      let rangeDataItem: any = null;

      am5.array.each(this.subSeries[i].dataItems, (serieDataItem: any) => {
        let subSerieDataItem: any = this.serie!.dataItems[j];

        let seriePreviousDataItem: any = null;
        let subSeriePreviousDataItem: any = null;

        if (j > 0) {
          seriePreviousDataItem = this.subSeries[i]!.dataItems[j - 1];
          subSeriePreviousDataItem = this.serie!.dataItems[j - 1];
        }

        let startTime: any = (am5.time.round(new Date(serieDataItem!.get("valueX")) as any, baseInterval.timeUnit as any, baseInterval.count as any) as any).getTime();

        // intersections
        if (seriePreviousDataItem != null && subSeriePreviousDataItem != null) {
          let x0: any = (am5.time.round(new Date(seriePreviousDataItem!.get("valueX")) as any, baseInterval.timeUnit as any, baseInterval.count as any) as any).getTime() + baseDuration;
          let y01: any = seriePreviousDataItem!.get("valueY");
          let y02: any = subSeriePreviousDataItem!.get("valueY");

          let x1: any = startTime + baseDuration;
          let y11: any = serieDataItem!.get("valueY");
          let y12: any = subSerieDataItem!.get("valueY");

          let intersection: any = getLineIntersection({ x: x0, y: y01 }, { x: x1, y: y11 }, { x: x0, y: y02 }, { x: x1, y: y12 });

          startTime = Math.round(intersection.x);
        }
        if (!rangeDataItem) {
          rangeDataItem = this.xAxis.makeDataItem({});
          let range: any = this.subSeries[i]!.createAxisRange(rangeDataItem);
          rangeDataItem!.set("value", startTime);
          range!.fills!.template!.setAll({
            fill: this.serie!.get("fill"),
            fillOpacity: this.serie!.fills.template.get("fillOpacity"),
            visible: true
          });
          range!.strokes!.template!.setAll({
            stroke: this.subSeries[i]!.get("stroke"),
            strokeWidth: 1
          });
          rangeDataItem!.set("closeValueY", subSerieDataItem!.get("valueY"));
        }
        if (rangeDataItem != null) {
          rangeDataItem!.set("endValue", startTime);
          rangeDataItem = undefined;
        }
        if (j == this.serie!.dataItems.length - 1) {
          if (rangeDataItem != null) {
            rangeDataItem!.set("endValue", serieDataItem.get("valueX") + baseDuration);
            rangeDataItem = undefined;
          }
        }
        j++;
      });
    }
    
    if (this.defaultHidden) {
      this.serie.hide();
      for (let subSerie of this.subSeries) {
        subSerie.hide();
      }
    }
    this.upAndRunning = true;
  }

  destroyed(): void {
    // Remove from chart
    this.chart.series.removeValue(this.serie!);
    for (let i = 0; i < this.subSeries.length; i++) {
      this.chart.series.removeValue(this.subSeries[i]);
    }

    // Remove from legend
    if (this.legend) {
      this.legend.data.removeValue(this.serie);
      for (let i = 0; i < this.subSeries.length; i++) {
        this.legend.data.removeValue(this.subSeries[i]);
      }
    }

    // Dispose
    if (this.tooltip != null && !this.tooltip!.isDisposed()) {
      this.tooltip.dispose();
    }
    for (let i = 0; i < this.subTooltips.length; i++) {
      if (this.subTooltips[i] != null && !this.subTooltips[i]!.isDisposed()) {
        this.subTooltips[i].dispose();
      }
    }
    if (this.serie != null && !this.serie!.isDisposed()) {
      this.serie!.dispose();
    }
    for (let i = 0; i < this.subSeries.length; i++) {
      if (this.subSeries[i] != null && !this.subSeries[i]!.isDisposed()) {
        this.subSeries[i].dispose();
      }
    }
  }
}
</script>