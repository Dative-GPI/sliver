<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, InjectReactive, Prop, ProvideReactive, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import { AMROOT, CHART, CURSOR, XAXIS, YAXIS } from "../../literals";

@Component({})
export default class DXYCursor extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

  @InjectReactive(XAXIS)
  xAxis!: am5xy.CategoryAxis<am5xy.AxisRendererX> | am5xy.DateAxis<am5xy.AxisRendererX> | am5xy.ValueAxis<am5xy.AxisRendererX>

  @InjectReactive(YAXIS)
  yAxis!: am5xy.CategoryAxis<am5xy.AxisRendererY> | am5xy.DateAxis<am5xy.AxisRendererY> | am5xy.ValueAxis<am5xy.AxisRendererY>

  @Prop({ required: false, default: true })
  enabled!: boolean;

  @Prop({ required: false, default: "zoomX" })
  behavior!: "zoomXY" | "zoomX" | "zoomY" | "selectX" | "selectY" | "selectXY" | "none" | undefined;

  @Watch("behavior")
  onBehaviorChange = this.setBehavior;

  @Prop({ required: false, default: false })
  sharedZoom!: boolean;

  @Watch("sharedZoom")
  onSharedZoomChange = this.setSharedZoom;

  @Prop({ required: false, default: true })
  xVisible!: boolean;

  @Watch("xVisible")
  onXVisibleChange = this.setXVisible;

  @Prop({ required: false, default: true })
  yVisible!: boolean;

  @Watch("yVisible")
  onYVisibleChange = this.setYVisible;

  @ProvideReactive(CURSOR)
  cursor: am5xy.XYCursor | null = null;

  visibleBullets: am5.Bullet[] = [];

  upAndRunning = false;

  setBehavior(): void {
    if (this.enabled) {
      this.cursor!.set("behavior", this.behavior);
    }
  }

  setSharedZoom(): void {
    this.cursor!.events.off("selectended");

    if (this.sharedZoom) {
      this.cursor!.events.on("selectended", (): void => {
        if (this.chart.xAxes.values[0] as am5xy.DateAxis<am5xy.AxisRendererX> != null) {
            let start = (this.chart.xAxes.values[0] as am5xy.DateAxis<am5xy.AxisRendererX>).positionToDate(this.cursor!.getPrivate("downPositionX")!).getTime();
            let end = (this.chart.xAxes.values[0] as am5xy.DateAxis<am5xy.AxisRendererX>).positionToDate(this.cursor!.getPrivate("positionX")!).getTime();
            this.$emit("update:selection", [start, end]);
            this.cursor!.selection.hide();
        }
      });
    }
  }

  setXVisible(): void {
    if (this.enabled) {
      this.cursor!.lineX.set("visible", this.xVisible);
    }
  }

  setYVisible(): void {
    if (this.enabled) {
      this.cursor!.lineY.set("visible", this.yVisible);
    }
  }

  mounted(): void {
    if (this.enabled) {
      // Add to chart
      this.cursor = this.chart.set("cursor", am5xy.XYCursor.new(this.root, {
        snapToSeries: []
      }));

      this.cursor.events.on("cursormoved", () => {
        for (let bullet of this.visibleBullets) {
          bullet.get("sprite").set("opacity", 0);
        }
        this.visibleBullets = [];
        this.chart.series.each(serie => {
          if (serie instanceof am5xy.LineSeries)
            if (serie!.get("userData")!.showTooltipBullet) {
              if (serie!.get("tooltip") != null) {
                if (serie!.get("tooltip")!.isVisible()) {
                  if (serie!.get("tooltip")!.dataItem != null) {
                    if (serie!.get("tooltip")!.dataItem!.bullets != null) {
                      if (serie!.get("tooltip")!.dataItem!.bullets!.length > 0) {
                        let tooltipBullet = serie!.get("tooltip")!.dataItem!.bullets!.find(bullet => {
                          if (bullet != null) {
                            if (bullet!.get("userData") != null) {
                              return bullet!.get("userData")!.tooltipBullet != null ? bullet!.get("userData")!.tooltipBullet : false;
                            }
                          }
                          return false;
                        });
                        if (tooltipBullet != null) {
                          tooltipBullet.get("sprite")!.set("opacity", serie!.get("opacity"));
                          this.visibleBullets.push(tooltipBullet);
                        }
                      }
                    }
                  }
                }
              }
            }
        });
      });

      this.setBehavior();
      this.setSharedZoom();
      this.setXVisible();
      this.setYVisible();
    }
    
    this.upAndRunning = true;
  }

  destroyed(): void {
    if (this.enabled) {
      // Remove from chart
      this.chart.set("cursor", undefined);

      // Dispose
      this.cursor!.dispose();
    }
  }
}
</script>