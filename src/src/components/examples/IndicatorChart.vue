<template>
  <div>
    <spinner
      :min-height="minHeight"
      :style="{ display: ready ? 'none': 'flex' }"
    />
    <d-xy-chart
      :chartId="Math.random().toString()"
      :min-height="minHeight"
      :locale="locale"
      :colorSet="colorSet"
      :layout="chartLayout"
      :style="{ display: ready ? 'flex': 'none' }"
      @ready="ready = true"
    >
      <d-legend
        :enabled="legend"
        :singleColumn="true"
      >
        <d-xy-cursor
          :enabled="cursor"
          :behavior="cursorBehavior"
          :xVisible="false"
          :yVisible="false"
        >
          <d-value-x-axis
            :opposite="xAxisOpposite"
            :showGrid="false"
            :showLabels="true"
            :showTooltip="xAxisShowTooltip"
            :tooltipNumberFormat="xAxisTooltipNumberFormat"
            :min="xAxisMin"
            :max="xAxisMax"
            :strictMinMax="true"
            :ranges="xAxisRanges"
            :strokeOpacity="1"
            :strokeWidth="5"
            :unit="xAxisUnit"
          >
            <d-value-y-axis
              :opposite="yAxisOpposite"
              :showGrid="false"
              :showLabels="false"
              :showTooltip="false"
              :min="yAxisMin"
              :max="yAxisMax"
              :strictMinMax="true"
              :height="yAxisHeight"
              :ranges="yAxisRanges"
            >
              <d-progress-indicator
                v-for="(serie, index) in data.series"
                :key="index"
                :name="serie.serie"
                :colorIndex="index"
                :colorSet="colorSet"
                :colorSeed="colorSeed"
                :value="serie.data[0].valueX"
              />
            </d-value-y-axis>
          </d-value-x-axis>
        </d-xy-cursor>
      </d-legend>
    </d-xy-chart>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { LayoutEnum, PositionEnum } from "../../enums";
import { AxisRange } from "../../models";
import { ColorSets } from "../../colors";

import Spinner from "./Spinner.vue";

@Component({ components: { Spinner } })
export default class IndicatorChart extends Vue {
  @Prop({ required: true })
  data!: any;

  @Prop({ required: true })
  minHeight!: string;

  get numberMinHeight(): number {
    return parseFloat(this.minHeight.substring(0, this.minHeight.length - 2));
  }

  get yAxisHeight(): number {
    return this.numberMinHeight - (90 + 30 * this.data.series.length);
  }

  @Prop({ required: true })
  locale!: string;

  @Prop({ required: true })
  colorSet!: ColorSets;

  @Prop({ required: true })
  colorSeed!: string;

  @Prop({ required: true })
  chartLayout!: LayoutEnum;

  @Prop({ required: true })
  legend!: boolean;

  @Prop({ required: true })
  legendLayout!: LayoutEnum;

  @Prop({ required: true })
  legendPosition!: PositionEnum;

  @Prop({ required: true })
  legendX!: number;

  @Prop({ required: true })
  legendCenterX!: number;

  @Prop({ required: true })
  legendY!: number;

  @Prop({ required: true })
  legendCenterY!: number;

  @Prop({ required: true })
  cursor!: boolean;
  
  @Prop({ required: true })
  cursorBehavior!: "zoomXY" | "zoomX" | "zoomY" | "selectX" | "selectY" | "selectXY" | undefined;
  
  @Prop({ required: true })
  cursorXVisible!: boolean;
  
  @Prop({ required: true })
  cursorYVisible!: boolean;

  @Prop({ required:true })
  scrollbar!: boolean;

  @Prop({ required:true })
  scrollbarHeight!: number;

  @Prop({ required:true })
  scrollbarStartGripVisible!: boolean;

  @Prop({ required:true })
  scrollbarEndGripVisible!: boolean;

  @Prop({ required: true })
  xAxisOpposite!: boolean;

  @Prop({ required: true })
  xAxisShowTooltip!: boolean;

  @Prop({ required: true })
  xAxisTooltipNumberFormat!: string;

  @Prop({ required: true })
  xAxisMin!: number | undefined;

  @Prop({ required: true })
  xAxisMax!: number | undefined;

  @Prop({ required: true })
  xAxisRanges!: AxisRange[] | undefined;

  @Prop({ required: true })
  xAxisUnit!: string | undefined;

  @Prop({ required: true })
  yAxisOpposite!: boolean;

  @Prop({ required: true })
  yAxisShowTooltip!: boolean;

  @Prop({ required: true })
  yAxisTooltipNumberFormat!: string;

  @Prop({ required: true })
  yAxisMin!: number | undefined;

  @Prop({ required: true })
  yAxisMax!: number | undefined;

  @Prop({ required: true })
  yAxisRanges!: AxisRange[] | undefined;

  ready: boolean = false;
}
</script>