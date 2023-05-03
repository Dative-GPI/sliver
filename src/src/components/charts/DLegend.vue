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

import { setLineSerieBullets, setRangeSerieBullets, setScatterPlotSerieBullets, setStepLineSerieBullets } from "../../helpers";
import { LayoutEnum, PositionEnum, SerieEnum } from "../../enums";
import { AMROOT, CHART, LEGEND } from "../../literals";
import { ChartType } from "../../models";

@Component({})
export default class DLegend extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart | am5percent.PieChart | am5radar.RadarChart;

  @Prop({ required: false, default: true })
  enabled!: boolean;

  @Watch("enabled")
  onEnabledChange = this.setEnabled;

  @Prop({ required: false, default: LayoutEnum.Grid })
  layout!: LayoutEnum;

  @Watch("layout")
  onLayoutChange = this.setLayout;

  @Prop({ required: false, default: PositionEnum.Ordinate })
  position!: PositionEnum;

  @Watch("position")
  onPositionChange = this.setPosition;

  @Prop({ required: false, default: 50 })
  x!: number;

  @Watch("x")
  onXChange = this.setPosition;

  @Prop({ required: false, default: 50 })
  centerX!: number;

  @Watch("centerX")
  onCenterXChange = this.setPosition;

  @Prop({ required: false, default: 50 })
  y!: number;

  @Watch("y")
  onYChange = this.setPosition;

  @Prop({ required: false, default: 50 })
  centerY!: number;

  @Watch("centerY")
  onCenterYChange = this.setPosition;

  @ProvideReactive(LEGEND)
  legend: am5.Legend | null = null;

  upAndRunning: boolean = false;

  setLayout(): void {
    if (this.legend != null) {
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
    }
  }

  setPosition(): void {
    if (this.legend != null) {
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
    }
  }

  setEnabled(): void {
    if (this.enabled && this.legend == null) {
      // Add to chart
      this.legend = this.chart.children.push(am5.Legend.new(this.root, {}));

      this.legend.itemContainers.template.events.on("click", (event: am5.ISpritePointerEvent) => {
        switch ((this.chart! as any).get("userData").chartType) {
          case ChartType.Radar: {
            var eventClockHand = event!.target!.dataItem!.dataContext! as am5.DataItem<am5xy.IValueAxisDataItem>;
            if (eventClockHand.isHidden()) {
              eventClockHand.get("bullet")!.get("sprite")!.show();
            }
            return;
          }
          case ChartType.XY: {
            var eventSerie = event!.target!.dataItem!.dataContext as am5.Series;
            if (eventSerie.isHidden()) {
              switch (eventSerie.get("userData").serie) {
                case SerieEnum.LineSerie: {
                  setLineSerieBullets(eventSerie);
                  break;
                }
                // case SerieEnum.RangeSerie: {
                //   setRangeSerieBullets(eventSerie);
                //   break;
                // }
                case SerieEnum.ScatterPlotSerie: {
                  setScatterPlotSerieBullets(eventSerie, this.root);
                  break;
                }
                case SerieEnum.StepLineSerie: {
                  setStepLineSerieBullets(eventSerie);
                  break;
                }
              }
            }
            return;
          }
        }
      });

      this.legend.itemContainers.template.events.on("dblclick", (event: am5.ISpritePointerEvent) => {
        switch ((this.chart! as any).get("userData").chartType) {
          case ChartType.Radar: {
            const eventClockHand = event!.target!.dataItem!.dataContext! as am5.DataItem<am5xy.IValueAxisDataItem>;
            eventClockHand.show();
            let allHidden = true;
            (this.chart! as am5radar.RadarChart).xAxes.each((axis: am5xy.Axis<am5xy.AxisRenderer>) => {
              axis.axisRanges.each((range: am5.DataItem<am5xy.IAxisDataItem>) => {
                if (range != eventClockHand && range.get("bullet") != null) {
                  if (range.get("bullet")!.get("sprite") != null) {
                    if (range.get("bullet")!.get("sprite")!.get("userData") != null) {
                      if (range.get("bullet")!.get("sprite")!.get("userData")!.serie === SerieEnum.ClockHand) {
                        if (!range.isHidden()) {
                          allHidden = false;
                        }
                      }
                    }
                  }
                }
              });
            });
            (this.chart! as am5radar.RadarChart).xAxes.each((axis: am5xy.Axis<am5xy.AxisRenderer>) => {
              axis.axisRanges.each((range: am5.DataItem<am5xy.IAxisDataItem>) => {
                if (range != eventClockHand && range.get("bullet") != null) {
                  if (range.get("bullet")!.get("sprite") != null) {
                    if (range.get("bullet")!.get("sprite")!.get("userData") != null) {
                      if (range.get("bullet")!.get("sprite")!.get("userData")!.serie === SerieEnum.ClockHand) {
                        if (allHidden) {
                          range.show();
                        }
                        else {
                          range.hide();
                        }
                      }
                    }
                  }
                }
              });
            });
            return;
          }
          case ChartType.XY: {
            const eventSerie = event!.target!.dataItem!.dataContext as am5.Series;
            eventSerie.show();
            let allHidden = true;
            this.chart!.series.each((serie: am5.Series) => {
              if (serie != eventSerie && !serie.isHidden()) {
                allHidden = false;
              }
            });
            this.chart!.series.each((serie: am5.Series) => {
              if (allHidden) {
                serie.show();
              }
              else if (serie != eventSerie && !serie.isHidden()) {
                serie.hide();
              }
            });
            return;
          }
        }
      });

      this.legend.itemContainers.template.events.on("pointerover", (event: am5.ISpritePointerEvent) => {
        switch ((this.chart! as any).get("userData").chartType) {
          case ChartType.Radar: {
            var eventClockHand = event!.target!.dataItem!.dataContext! as am5.DataItem<am5xy.IValueAxisDataItem>;
            if (eventClockHand.isHidden()) {
              return;
            }
            for (let xAxis of (this.chart! as am5radar.RadarChart).xAxes) {
              for (let axisRange of xAxis.axisRanges) {
                if (axisRange === eventClockHand) {
                  continue;
                }
                if (axisRange.get("bullet") != null) {
                  if (axisRange.get("bullet")!.get("sprite") != null) {
                    if (axisRange.get("bullet")!.get("sprite")!.get("userData") != null) {
                      if (axisRange.get("bullet")!.get("sprite")!.get("userData")!.serie === SerieEnum.ClockHand) {
                        axisRange.get("bullet")!.get("sprite")!.set("opacity", 0);
                      }
                    }
                  }
                }
              }
            }
            return;
          }
          case ChartType.XY: {
            var eventSerie = (event!.target!.dataItem!.dataContext as am5.Series);
            if (eventSerie.isHidden()) {
              return;
            }
            this.chart!.series.each((serie: am5.Series) => {
              if (serie != eventSerie) {
                serie.set("opacity", 0);
                switch (serie.get("userData").serie) {
                  case SerieEnum.LineSerie: {
                    setLineSerieBullets(serie);
                    break;
                  }
                  // case SerieEnum.RangeSerie: {
                  //   setRangeSerieBullets(serie);
                  //   break;
                  // }
                  case SerieEnum.ScatterPlotSerie: {
                    setScatterPlotSerieBullets(serie, this.root);
                    break;
                  }
                  case SerieEnum.StepLineSerie: {
                    setStepLineSerieBullets(serie);
                    break;
                  }
                }
              }
            });
            return;
          }
        }
      });

      this.legend.itemContainers.template.events.on("pointerout", (event: am5.ISpritePointerEvent) => {
        switch ((this.chart! as any).get("userData").chartType) {
          case ChartType.Radar: {
            for (let xAxis of (this.chart! as am5radar.RadarChart).xAxes) {
              for (let axisRange of xAxis.axisRanges) {
                if (axisRange.get("bullet") != null) {
                  if (axisRange.get("bullet")!.get("sprite") != null) {
                    if (axisRange.get("bullet")!.get("sprite")!.get("userData") != null) {
                      if (axisRange.get("bullet")!.get("sprite")!.get("userData")!.serie === SerieEnum.ClockHand) {
                        axisRange.get("bullet")!.get("sprite")!.set("opacity", 1);
                      }
                    }
                  }
                }
              }
            }
            return;
          }
          case ChartType.XY: {
            var eventSerie = event!.target!.dataItem!.dataContext as am5.Series;
            this.chart!.series.each((serie: am5.Series) => {
              if (serie != eventSerie) {
                serie.set("opacity", 1);
                switch (serie.get("userData").serie) {
                  case SerieEnum.LineSerie: {
                    setLineSerieBullets(serie);
                    break;
                  }
                  // case SerieEnum.RangeSerie: {
                  //   setRangeSerieBullets(serie);
                  //   break;
                  // }
                  case SerieEnum.ScatterPlotSerie: {
                    setScatterPlotSerieBullets(serie, this.root);
                    break;
                  }
                  case SerieEnum.StepLineSerie: {
                    setStepLineSerieBullets(serie);
                    break;
                  }
                }
              }
            });
            return;
          }
        }
      });

      this.setLayout();
      this.setPosition();
    }
    else if (!this.enabled && this.legend != null) {
      // Remove from chart
      this.chart!.children.removeValue(this.legend!);

      // Dispose
      this.legend!.dispose();
      this.legend = null;
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