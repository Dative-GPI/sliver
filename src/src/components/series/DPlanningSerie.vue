<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, LEGEND, XAXIS, YAXIS } from "../../literals";
import { updateCategories, addSerie, removeSerie } from "../../helpers";

@Component({})
export default class DPlanningSerie extends Vue {
  serieId: number = 0;

  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.DateAxis<am5xy.AxisRendererX> | am5xy.ValueAxis<am5xy.AxisRendererX> | am5xy.CategoryAxis<am5xy.AxisRendererX>;

  @InjectReactive(YAXIS)
  yAxis!: am5xy.DateAxis<am5xy.AxisRendererY> | am5xy.ValueAxis<am5xy.AxisRendererY> | am5xy.CategoryAxis<am5xy.AxisRendererY>;

  @InjectReactive(CURSOR)
  cursor!: am5xy.XYCursor | null;

  @InjectReactive(LEGEND)
  legend!: am5.Legend | null;

  @Prop({ required: true })
  name!: string;

  @Watch("name")
  onNameChange = this.setName;

  @Prop({ required: false, default: "timestampX" })
  openDateXField!: string;

  @Prop({ required: false, default: "closeTimestamp" })
  closeDateXField!: string;

  @Prop({ required: false, default: "categoryY" })
  categoryYField!: string;

  @Prop({ required: false, default: 2 })
  columnsHeight!: number;

  @Watch("columnsHeight")
  onColumnsHeightChange = this.setColumnsHeight;

  @Prop({ required: false, default: 1 })
  columnsOpacity!: number;

  @Watch("columnsOpacity")
  onColumnsOpacityChange = this.setColumnsOpacity;

  @Prop({ required: false, default: 3 })
  bulletRadius!: number;

  @Watch("bulletRadius")
  onBulletRadiusChange = this.setBullet;

  @Prop({ required: false, default: 1 })
  bulletOpacity!: number;

  @Watch("bulletRadius")
  onBulletOpacityChange = this.setBullet;

  @Prop({ required: false, default: true })
  showTooltip!: boolean;

  @Watch("showTooltip")
  onShowTooltipChange = this.setShowTooltip;

  @Prop({ required: false, default: "{name}: {categoryY}" })
  tooltipText!: string;

  @Watch("tooltipText")
  onTooltipTextChange = this.setTooltipText;

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

  @Prop({ required: true })
  data!: unknown[];

  @Watch("data")
  onDataChange = this.setData;

  serie: am5xy.ColumnSeries | null = null;
  tooltip: am5.Tooltip | null = null;

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
      this.tooltip!.set("labelText", this.tooltipText);
    }
  }

  setLegendLabelText(): void {
    this.serie!.set("legendLabelText", this.legendLabelText ? this.legendLabelText : this.name);
  }

  setBullet(): void {
    this.serie!.bullets.clear();
    this.serie!.bullets.push(() => {
      return am5.Bullet.new(this.root, {
        sprite: am5.Circle.new(this.root, {
          opacity: this.bulletOpacity,
          radius: this.bulletRadius,
          fill: this.serie!.get("fill"),
        }),
        locationX: 0
      });
    });
    this.serie!.bullets.push(() => {
      return am5.Bullet.new(this.root, {
        sprite: am5.Circle.new(this.root, {
          opacity: this.bulletOpacity,
          radius: this.bulletRadius,
          fill: this.serie!.get("fill"),
        }),
        locationX: 1
      });
    });

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

  setData(): void {
    // Add to axis
    this.yAxis.data.setAll(updateCategories(this.yAxis.data.values, this.data, this.categoryYField, this.serieId));
    this.serie!.data.setAll(this.data);
  }

  mounted(): void {
    this.serieId = Math.random();

    this.serie = this.chart.series.push(am5xy.ColumnSeries.new(this.root, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      openValueXField: this.openDateXField,
      valueXField: this.closeDateXField,
      categoryYField: this.categoryYField,
      sequencedInterpolation: true
    }));

    this.setName();
    this.setShowTooltip();
    
    this.setBullet();
    this.setColumnsHeight();
    this.setColumnsOpacity();

    // Add to legend
    if (this.legend != null) {
      this.legend.data.push(this.serie);
    }

    // Add to cursor
    if (this.cursor != null) {
      this.cursor.set("snapToSeries", addSerie(this.cursor.get("snapToSeries")!, this.serie));
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

    // Remove from axis
    this.xAxis.data.setAll(updateCategories(this.xAxis.data.values, [], this.categoryYField, this.serieId));

    // Remove from cursor
    if (this.cursor) {
      this.cursor.set("snapToSeries", removeSerie(this.cursor.get("snapToSeries")!, this.serie));
    }

    // Dispose
    this.serie!.dispose();
  }
}
</script>