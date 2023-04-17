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
import { updateCategories, addSerie, removeSerie, textColor } from "../../helpers";
import { ColorSets, GetHashedColor } from "../../colors";
import { SerieEnum } from "../../enums";

@Component({})
export default class DPlanningSerie extends Vue {
  serieId: number = 0;

  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.DateAxis<am5xy.AxisRendererX>;

  @InjectReactive(XAXISVALIDATED)
  xAxisValidated!: () => void | undefined;

  @InjectReactive(YAXIS)
  yAxis!: am5xy.CategoryAxis<am5xy.AxisRendererY>;

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

  @Prop({ required: false, default: false })
  snapToSeries!: boolean;

  @Prop({ required: false, default: "closeTimestampX" })
  openDateXField!: string;

  @Prop({ required: false, default: "timestampX" })
  closeDateXField!: string;

  @Prop({ required: false, default: "categoryY" })
  categoryYField!: string;

  @Prop({ required: false, default: "categoryCodeY" })
  categoryCodeYField!: string;

  @Prop({ required: false, default: "" })
  unit!: string;

  @Watch("unit")
  onUnitChange = this.setShowTooltip;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{name}: {dataItem.dataContext.categoryY}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setShowTooltip;

  @Prop({ required: false, default: "" })
  legendLabelText!: string;

  @Watch("legendLabelText")
  onLegendLabelTextChange = this.setLegendLabelText;

  @Prop({ required: false, default: false })
  showLabel!: boolean;

  @Watch("showLabel")
  onShowLabelChange = this.setBullet;

  @Prop({ required: false, default: "" })
  labelText!: string;

  @Watch("labelText")
  onLabelTextChange = this.setBullet;

  @Prop({ required: false, default: 50 })
  labelCenterX!: number;

  @Watch("labelCenterX")
  onLabelCenterXChange = this.setBullet;

  @Prop({ required: false, default: 50 })
  labelCenterY!: number;

  @Watch("labelCenterY")
  onLabelCenterYChange = this.setBullet;

  @Prop({ required: false, default: 16 })
  labelFontSize!: number;

  @Watch("labelFontSize")
  onLabelFontSizeChange = this.setBullet;

  @Prop({ required: false, default: 12 })
  columnsHeight!: number;

  @Watch("columnsHeight")
  onColumnsHeightChange = this.setColumnsHeight;

  @Prop({ required: false, default: 1 })
  columnsOpacity!: number;

  @Watch("columnsOpacity")
  onColumnsOpacityChange = this.setColumnsOpacity;

  @Prop({ required: false, default: undefined })
  templateWidth!: number | undefined;

  @Watch("templateWidth")
  onTemplateWidthChange = this.setTemplateWidth;

  @Prop({ required: false, default: 5 })
  templateCornerRadius!: number;

  @Watch("templateCornerRadius")
  onTemplateCornerRadiusChange = this.setTemplateCornerRadius;

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

  tooltip: am5.Tooltip | null = null;
  serie: am5xy.ColumnSeries | null = null;

  upAndRunning = false;

  setName(): void {
    this.serie!.set("name", this.name);
    this.setLegendLabelText();
    this.setColor();
  }

  setShowTooltip(): void {
    if (!this.showTooltip) {
      if (this.tooltip != null && !this.tooltip.isDisposed()) {
        this.tooltip!.dispose();
        this.serie!.columns.template.set("tooltip", undefined);
        this.serie!.columns.template.set("tooltipText", undefined);
        this.tooltip = null;
      }
    }
    else {
      this.tooltip = am5.Tooltip.new(this.root, {
        autoTextColor: false
      });
      this.tooltip.label.set("fill", textColor(this.serie!.get("fill")!.toCSSHex()));
      this.tooltip.get("background")!.set("fillOpacity", 0.50);
      
      this.serie!.columns.template.setAll({
        tooltip: this.tooltip,
        tooltipText: this.tooltipText + this.unit,
        tooltipY: am5.percent(0)
      });
    }
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
  }

  setBullet(): void {
    if (this.showLabel) {
      this.serie!.bullets.push(() => {
        return am5.Bullet.new(this.root, {
          sprite: am5.Label.new(this.root, {
            text: this.labelText ? this.labelText : "{" + this.categoryYField + "}",
            fill: this.root.interfaceColors.get("alternativeText"),
            centerX: am5.percent(this.labelCenterX),
            centerY: am5.percent(this.labelCenterY),
            fontSize: this.labelFontSize,
            populateText: true
          })
        });
      });
    }
  }

  setColumnsHeight(): void {
    this.serie!.columns.template.set("height", this.columnsHeight);
  }

  setColumnsOpacity(): void {
    this.serie!.columns.template.set("opacity", this.columnsOpacity);
  }

  setTemplateWidth(): void {
    this.serie!.columns.template.set("width", this.templateWidth);
  }

  setTemplateCornerRadius(): void {
    this.serie!.columns.template.setAll({
      cornerRadiusTL: this.templateCornerRadius,
      cornerRadiusTR: this.templateCornerRadius,
      cornerRadiusBL: this.templateCornerRadius,
      cornerRadiusBR: this.templateCornerRadius
    });
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
    this.yAxis.data.setAll(
      updateCategories(this.yAxis.data.values, this.data, this.categoryYField, this.categoryCodeYField, null, this.openDateXField, this.serieId, true)
    );
    this.serie!.data.setAll(this.data);
    this.setShowTooltip();
  }

  mounted(): void {
    this.serieId = Math.random();

    this.serie = this.chart.series.push(am5xy.ColumnSeries.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      openValueXField: this.openDateXField,
      valueXField: this.closeDateXField,
      categoryYField: this.categoryCodeYField,
      userData: { serie: SerieEnum.PlanningSerie }
    }));

    this.serie.events.on("datavalidated", () => {
      if (this.xAxisValidated != null) {
        this.xAxisValidated();
      }
      if (this.yAxisValidated != null) {
        this.yAxisValidated();
      }
    });

    this.setName();
    this.setBullet();
    this.setColumnsHeight();
    this.setColumnsOpacity();
    this.setTemplateWidth();
    this.setTemplateCornerRadius();

    // Add to legend
    if (this.legend != null) {
      this.legend.data.push(this.serie);
    }

    // Add to cursor
    if (this.cursor != null && this.snapToSeries) {
      this.cursor.set("snapToSeries", addSerie(this.cursor.get("snapToSeries")!, this.serie));
    }
    
    // Set data
    this.setData();
    
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

    // Remove from axis
    this.yAxis.data.setAll(
      updateCategories(this.yAxis.data.values, [], this.categoryYField,  this.categoryCodeYField, null, this.openDateXField, this.serieId, true)
    );

    // Remove from cursor
    if (this.cursor) {
      this.cursor.set("snapToSeries", removeSerie(this.cursor.get("snapToSeries")!, this.serie));
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