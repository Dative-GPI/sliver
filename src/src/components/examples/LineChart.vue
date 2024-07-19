<template>
  <div>
    <spinner
      :height="height"
      :style="{ display: ready ? 'none': 'flex' }"
    />
    <d-xy-chart
      :chartId="Math.random().toString()"
      :locale="locale"
      :time-offset="timeOffset"
      :colorSet="colorSet"
      :layout="chartLayout"
      :height="height"
      :style="{ display: ready ? 'flex': 'none' }"
      @ready="ready = true"
    >
      <d-legend
        :enabled="legend"
        :layout="legendLayout"
        :position="legendPosition"
        :x="legendX"
        :centerX="legendCenterX"
        :y="legendY"
        :centerY="legendCenterY"
      >
        <d-xy-cursor
          :enabled="cursor"
          :behavior="cursorBehavior"
          :xVisible="cursorXVisible"
          :yVisible="cursorYVisible"
        >
          <d-value-y-axis
            :opposite="yAxisOpposite"
            :showTooltip="yAxisShowTooltip"
            :tooltipNumberFormat="yAxisTooltipNumberFormat"
            :ranges="yAxisRanges"
            :unit="yAxisUnit"
          >
            <d-date-x-axis
              :opposite="xAxisOpposite"
              :showTooltip="xAxisShowTooltip"
              :tooltipDateFormat="xAxisTooltipDateFormat"
              :scrollbar="scrollbar"
              :lines="xAxisLines"
              :ranges="xAxisRanges"
            >
              <d-line-serie
                v-for="(serie, index) in data.series"
                :key="index"
                :name="serie.label"
                :data="serie.data"
                :showBullets="serieShowBullets"
                :bulletsRadius="serieBulletsRadius"
                :heatRule="heatRule"
                :minColor="minColor"
                :maxColor="maxColor"
                :heatRanges="heatRanges"
                :colorSet="colorSet"
                :colorSeed="colorSeed"
              />
            </d-date-x-axis>
          </d-value-y-axis>
        </d-xy-cursor>
      </d-legend>
      <d-x-scrollbar
        v-if="scrollbar"
        :height="scrollbarHeight"
        :startGripVisible="scrollbarStartGripVisible"
        :endGripVisible="scrollbarEndGripVisible"
      />
    </d-xy-chart>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { HeatRule, LayoutEnum, PositionEnum } from "../../enums";
import { IconLine, TimeRange, ValueRange } from "../../models";
import { ColorSets } from "../../colors";

import Spinner from "./Spinner.vue";

@Component({ components: { Spinner } })
export default class LineChart extends Vue {
  @Prop({ required: true })
  data!: any;

  @Prop({ required: true })
  height!: string;

  @Prop({ required: true })
  locale!: string;

  @Prop({ required: true })
  timeOffset!: string;

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
  xAxisTooltipDateFormat!: string;

  @Prop({ required: true })
  xAxisLines!: IconLine[];

  @Prop({ required: true })
  xAxisRanges!: TimeRange[];

  @Prop({ required: true })
  yAxisOpposite!: boolean;

  @Prop({ required: true })
  yAxisShowTooltip!: boolean;

  @Prop({ required: true })
  yAxisTooltipNumberFormat!: string;

  @Prop({ required: true })
  yAxisRanges!: ValueRange[] | undefined;

  @Prop({ required: true })
  yAxisUnit!: string | undefined;

  @Prop({ required: true })
  serieShowBullets!: boolean;

  @Prop({ required: true })
  serieBulletsRadius!: number;

  @Prop({ required: true })
  heatRule!: HeatRule;

  @Prop({ required: true })
  minColor!: string;

  @Prop({ required: true })
  maxColor!: string;

  @Prop({ required: true })
  heatRanges!: ValueRange[] | undefined;
  
  ready: boolean = false;
}
</script>