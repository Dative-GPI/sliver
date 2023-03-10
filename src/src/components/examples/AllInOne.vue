<template>
  <div
    ref="xychart"
    :id="'xychart'"
    :style="{ minHeight: '400px', width: '100%', height: '100%' }"
  />
</template>

<script lang="ts">
import _ from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { getLocale, getTimezone, textColor } from "../../helpers";
import { ISpritePointerEvent } from "@amcharts/amcharts5";
import { ValueRange } from "../../models";

@Component({})
export default class AllInOne extends Vue {
  root: any = null;
  chart: any = null;

  legend: any = null;
  legendDebug: number = 0;

  cursor: any = null;

  yAxis: any = null;
  yAxisTooltip: any = null;
  yAxisDebugLabel: number = 0;

  xAxis: any = null;
  xAxisTooltip: any = null;
  xAxisDataItems: any[] = [];

  scrollbar: any = null;

  series: any[] = [];
  seriesTooltips: any[] = [];
  seriesBullets: any[] = [];

  @Prop({ required: true })
  data!: any;

  @Prop({ required: false, default: () => [] })
  yAxisRanges!: ValueRange[];

  @Prop({ required: false, default: () => [] })
  heatRanges!: ValueRange[]

  debouncedResize = _.debounce(this.resize, 250);

  resize(): void {
    if (this.root != null) {
      this.root.resize();
    }
  }

  mounted(): void {
    // Chart
    {
      this.root = am5.Root.new((this.$refs.xychart as HTMLElement), {
      tooltipContainerBounds: {
        top: 50,
        bottom: 50,
        left: 100,
        right: 100
      }
    });
      this.root.locale = getLocale("en-us");
      this.root.timezone = getTimezone("UTC");
      this.root.numberFormatter.setAll({
        numberFormat: "#,###.### a",
        smallNumberThreshold: 0.001
      });
      this.root.autoResize = false;

      this.chart = this.root.container.children.push(am5xy.XYChart.new(this.root, {
        maxTooltipDistance: 0,
        layout: this.root.verticalLayout,
        wheelX: "zoomX",
        wheelY: "zoomX"
      }));
    }
    // Legend
    {
      this.legend = this.chart.children.push(am5.Legend.new(this.root, {
        layout: this.root.gridLayout,
        x: 50,
        centerX: 50,
        y: undefined,
        centerY: undefined
      }));
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
              else if (serie.bullets.values.length) {
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
              }
            }
          });
        }
      });
      this.legend.itemContainers.template.events.on("pointerout", () => {
        this.chart!.series.each((serie: any) => {
          serie.set("opacity", 1);
          if (serie instanceof am5xy.LineSeries) {
            serie.strokes.template.set("strokeWidth", 1);
            if (serie.bullets.values.length) {
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
            }
          }
        });
        this.legendDebug++;
      });
    }
    // Cursor
    {
      this.cursor = this.chart.set("cursor", am5xy.XYCursor.new(this.root, {
        snapToSeries: [],
        behavior: "zoomX"
      }));
      this.cursor.lineX.set("visible", true);
      this.cursor.lineY.set("visible", true);
    }
    // YAxis
    {
      this.yAxis = this.chart.yAxes.push(am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {
          opposite: false,
        }),
        logarithmic: false,
        min: undefined,
        max: undefined,
        strictMinMax: true,
        height: am5.percent(100)
      }));
      this.yAxis.get("renderer").grid.template.set("visible", true);
      this.yAxis.get("renderer").labels.template.set("visible", true);
      this.yAxisTooltip = am5.Tooltip.new(this.root, {});
      this.yAxis.set("tooltip", this.yAxisTooltip);
      this.cursor.set("yAxis", this.yAxis);

      am5.array.each(this.yAxisRanges, (range : ValueRange) => {
        let axisRange = this.yAxis.createAxisRange(this.yAxis.makeDataItem({
          above: true
        }));
        if (!(range.label == null || range.label === "" || /^\s*$/.test(range.label))) {
          axisRange.get("label")!.setAll({
            text: range.label,
            inside: true,
            centerX: 0,
            fill: am5.color("#000000")
          });
        }
        axisRange.get("axisFill")!.setAll({
          visible: true,
          fillOpacity: range.opacity,
          fill: am5.color(range.color)
        });
        axisRange.setAll({
          value: range.startValue,
          endValue: range.endValue
        });
      });
    }
    // XAxis
    {
      this.xAxis = this.chart.xAxes.push(am5xy.DateAxis.new(this.root, {
        renderer: am5xy.AxisRendererX.new(this.root, {
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
          opposite: false
        }),
        baseInterval: { timeUnit: "second", count: 1 },
        gridIntervals: [
          { timeUnit: "second", count: 1 },
          { timeUnit: "second", count: 2 },
          { timeUnit: "second", count: 15 },
          { timeUnit: "second", count: 30 },
          { timeUnit: "minute", count: 1 },
          { timeUnit: "minute", count: 2 },
          { timeUnit: "minute", count: 15 },
          { timeUnit: "minute", count: 30 },
          { timeUnit: "hour", count: 1 },
          { timeUnit: "hour", count: 4 },
          { timeUnit: "hour", count: 12 },
          { timeUnit: "day", count: 1 },
          { timeUnit: "day", count: 7 },
          { timeUnit: "month", count: 1 },
        ],
        min: undefined,
        max: undefined,
        tooltipDateFormat: "yyyy-MM-dd HH:mm:ss"
      }));
      this.xAxisTooltip = am5.Tooltip.new(this.root, {});
      this.xAxis.set("tooltip", this.xAxisTooltip);
      this.cursor.set("xAxis", this.xAxis);
    }
    // Scrollbar
    {
      this.scrollbar = this.chart.set("scrollbarX", am5xy.XYChartScrollbar.new(this.root, {
        orientation: "horizontal",
        height: 5
      }));
      this.scrollbar.startGrip.setAll({
        visible: true,
        width: 10,
        height: 20,
        icon: undefined
      });
      this.scrollbar.endGrip.setAll({
        visible: true,
        width: 10,
        height: 20,
        icon: undefined
      });
    }
    // Series
    for (let i = 0; i < this.data.series.length; +i++) {
      this.series.push(this.chart.series.push(am5xy.LineSeries.new(this.root, {
        calculateAggregates: true,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueXField: "timestampX",
        valueYField: "valueY",
        name: (this.data.series[i] as any).name,
        legendLabelText: "",
        snapTooltip: true,
        connect: true,
      })));
      this.series[this.series.length - 1].strokes.template.set("strokeGradient", undefined);
      this.series[this.series.length - 1].strokes.template.set("templateField", "strokeSettings");
      let data = (this.data.series[i] as any).data.map((point: any) => {
        var color: am5.Color | null = null;
        for (let i = 0; i < this.heatRanges!.length; i++) {
          if (point.valueY >= this.heatRanges![i].startValue && point.valueY <= this.heatRanges![i].endValue) {
            color = am5.color(this.heatRanges![i].color);
          }
        }
        return {
          valueY: point.valueY,
          timestampX: point.timestampX,
          strokeSettings: color != null ? { stroke: color } : undefined
        }
      });
      this.series[this.series.length - 1].data.setAll(data);
      // this.series[this.series.length - 1].data.setAll(this.data.series[i].data);

      this.legend.data.push(this.series[this.series.length - 1]);
      this.seriesTooltips.push(am5.Tooltip.new(this.root, {
        autoTextColor: false,
        labelText: "{name}: {valueY}",
        centerY: 25
      }));
      this.seriesTooltips[this.seriesTooltips.length - 1].label.set("fill", textColor(this.series[this.series.length - 1].get("fill")!.toCSSHex()));
      this.seriesTooltips[this.seriesTooltips.length - 1].get("background")!.set("fillOpacity", 0.50);
      this.series[this.series.length - 1].set("tooltip", this.seriesTooltips[this.seriesTooltips.length - 1]);
    }

    const resizeObserver = new ResizeObserver(this.debouncedResize);
    resizeObserver.observe(this.$el);
  }
}
</script>