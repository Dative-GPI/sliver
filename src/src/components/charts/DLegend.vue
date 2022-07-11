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

import { AMROOT, CHART, LEGEND } from "../../literals";
import { LayoutEnum, PositionEnum, SerieEnum } from "../../enums";
import { ISpritePointerEvent } from "@amcharts/amcharts5/.internal/core/render/Sprite";

@Component({})
export default class DLegend extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart | am5percent.PieChart | am5radar.RadarChart;

  @Prop({ required: false, default: true })
  enabled!: boolean;

  @Prop({ required: false, default: false })
  singleColumn!: boolean;

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

  upAndRunning = false;

  setLayout(): void {
    if (this.enabled) {
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
    if (this.enabled) {
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

  mounted(): void {
    if (this.enabled) {
      // Add to chart
      if (this.singleColumn) {
        this.legend = this.chart.children.push(am5.Legend.new(this.root, {
          layout: am5.GridLayout.new(this.root, { maxColumns: 1 })
        }));
      }
      else {
        this.legend = this.chart.children.push(am5.Legend.new(this.root, {}));
      }

      this.legend.itemContainers.template.events.on("pointerover", (event: ISpritePointerEvent) => {
        var itemContainer = event!.target;
        var eventSerie = itemContainer!.dataItem!.dataContext;
        if (this.chart! instanceof am5xy.XYChart) {
          this.chart!.series.each((serie: am5.Series) => {
            if (serie != eventSerie) {
              serie.set("opacity", 0.15);
            }
            if (serie instanceof am5xy.LineSeries) {
              if (serie == eventSerie) {
                serie.strokes.template.set("strokeWidth", 2);
              }
              else {
                if (serie.bullets.values.length) {
                  switch (serie.get("userData").serie) {
                    case SerieEnum.LineSerie: {
                      serie.bullets.clear();
                      serie.bullets.push(() => {
                        return am5.Bullet.new(this.root, {
                          sprite: am5.Circle.new(this.root, {
                            opacity: serie.get("opacity"),
                            fill: serie.get("fill"),
                            radius: serie.get("userData").bulletRadius
                          })
                        })
                      });
                      break;
                    }
                    case SerieEnum.ScatterPlotSerie: {
                      serie.bullets.clear();
                      serie.bullets.push(() => {
                        return am5.Bullet.new(this.root, {
                          sprite: am5.Circle.new(this.root, {
                            opacity: serie.get("opacity"),
                              fill: serie.get("fill")
                            },
                            serie.get("userData").circleTemplate)
                        });
                      });
                      break;
                    }
                    default: {
                      break;
                    }
                  }
                }
              }
            }
          });
        }
      });

      this.legend.itemContainers.template.events.on("pointerout", () => {
        if (!(this.chart! instanceof am5radar.RadarChart)) {
          this.chart!.series.each((serie: any) => {
            serie.set("opacity", 1);
            if (serie instanceof am5xy.LineSeries) {
              serie.strokes.template.set("strokeWidth", 1);
              if (serie.bullets.values.length) {
                switch (serie.get("userData").serie) {
                  case SerieEnum.LineSerie: {
                    serie.bullets.clear();
                    serie.bullets.push(() => {
                      return am5.Bullet.new(this.root, {
                        sprite: am5.Circle.new(this.root, {
                          opacity: serie.get("opacity"),
                          fill: serie.get("fill"),
                          radius: serie.get("userData").bulletRadius
                        })
                      })
                    });
                    break;
                  }
                  case SerieEnum.ScatterPlotSerie: {
                    serie.bullets.clear();
                    serie.bullets.push(() => {
                      return am5.Bullet.new(this.root, {
                        sprite: am5.Circle.new(this.root, {
                          opacity: serie.get("opacity"),
                            fill: serie.get("fill")
                          },
                          serie.get("userData").circleTemplate)
                      });
                    });
                    break;
                  }
                  default: {
                    break;
                  }
                }
              }
            }
          });
        }
      });

      if (!this.singleColumn) {
        this.setLayout();
      }
      this.setPosition();
    }

    this.upAndRunning = true;
  }

  destroyed(): void {
    if (this.enabled) {
      // Remove from chart
      this.chart!.children.removeValue(this.legend!);

      // Dispose
      this.legend!.dispose();
    }
  }
}
</script>