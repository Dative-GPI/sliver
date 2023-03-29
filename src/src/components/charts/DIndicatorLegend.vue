<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue, Prop, ProvideReactive, Watch } from "vue-property-decorator";

import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5 from "@amcharts/amcharts5";

import { CHART, LEGEND, LEGENDROOT } from "../../literals";
import { LayoutEnum, PositionEnum, SerieEnum } from "../../enums";
import { ChartType } from "../../models";

@Component({})
export default class DLegend extends Vue {
  @InjectReactive(LEGENDROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5xy.XYChart;

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
      // Add to container
      this.legend = this.root.container.children.push(am5.Legend.new(this.root, {}));

      this.legend.itemContainers.template.events.on("click", (event: am5.ISpritePointerEvent) => {
        switch (this.chart!.get("userData").chartType) {
          case ChartType.Indicator: {
            var eventClockHand = event!.target!.dataItem!.dataContext! as am5.DataItem<am5xy.IValueAxisDataItem>;
            if (eventClockHand.isHidden()) {
              eventClockHand.get("bullet")!.get("sprite")!.show();
            }
            return;
          }
        }
      });

      this.legend.itemContainers.template.events.on("dblclick", (event: am5.ISpritePointerEvent) => {
        switch (this.chart!.get("userData").chartType) {
          case ChartType.Indicator: {
            var eventIndicator = event!.target!.dataItem!.dataContext! as am5.DataItem<am5xy.IValueAxisDataItem>;
            eventIndicator.show();
            for (let xAxis of this.chart!.xAxes) {
              for (let axisRange of xAxis.axisRanges) {
                if (axisRange === eventIndicator) {
                  continue;
                }
                if (axisRange.get("bullet") != null) {
                  if (axisRange.get("bullet")!.get("sprite") != null) {
                    if (axisRange.get("bullet")!.get("sprite")!.get("userData") != null) {
                      if (axisRange.get("bullet")!.get("sprite")!.get("userData")!.serie === SerieEnum.ProgressIndicator) {
                        axisRange.hide();
                      }
                    }
                  }
                }
              }
            }
            return;
          }
        }
      });

      this.legend.itemContainers.template.events.on("pointerover", (event: am5.ISpritePointerEvent) => {
        switch (this.chart!.get("userData").chartType) {
          case ChartType.Indicator: {
            var eventIndicator = event!.target!.dataItem!.dataContext! as am5.DataItem<am5xy.IValueAxisDataItem>;
            if (eventIndicator.isHidden()) {
              return;
            }
            for (let xAxis of this.chart!.xAxes) {
              for (let axisRange of xAxis.axisRanges) {
                if (axisRange === eventIndicator) {
                  continue;
                }
                if (axisRange.get("bullet") != null) {
                  if (axisRange.get("bullet")!.get("sprite") != null) {
                    if (axisRange.get("bullet")!.get("sprite")!.get("userData") != null) {
                      if (axisRange.get("bullet")!.get("sprite")!.get("userData")!.serie === SerieEnum.ProgressIndicator) {
                        axisRange.get("bullet")!.get("sprite")!.set("opacity", 0);
                      }
                    }
                  }
                }
              }
            }
            return;
          }
        }
      });

      this.legend.itemContainers.template.events.on("pointerout", () => {
        switch ((this.chart!as any).get("userData").chartType) {
          case ChartType.Indicator: {
            for (let xAxis of this.chart!.xAxes) {
              for (let axisRange of xAxis.axisRanges) {
                if (axisRange.get("bullet") != null) {
                  if (axisRange.get("bullet")!.get("sprite") != null) {
                    if (axisRange.get("bullet")!.get("sprite")!.get("userData") != null) {
                      if (axisRange.get("bullet")!.get("sprite")!.get("userData")!.serie === SerieEnum.ProgressIndicator) {
                        axisRange.get("bullet")!.get("sprite")!.set("opacity", 1);
                      }
                    }
                  }
                }
              }
            }
            return;
          }
        }
      });

      this.setLayout();
      this.setPosition();
    }
    else if (!this.enabled && this.legend != null) {
      // Remove from container
      this.root.container.children.removeValue(this.legend!);

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
      // Remove from container
      this.root.container.children.removeValue(this.legend!);

      // Dispose
      this.legend!.dispose();
    }
  }
}
</script>