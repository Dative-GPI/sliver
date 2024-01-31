<template>
  <div>
    <spinner
      :min-height="minHeight"
      :style="{ display: ready ? 'none': 'flex' }"
    />
    <d-xy-chart
      :chartId="Math.random().toString()"
      :min-height="minHeight"
      :layout="chartLayout"
      :locale="locale"
      :style="{ display: ready ? 'flex': 'none' }"
      @ready="ready = true"
    >
      <d-heat-legend
        :enabled="legend"
        :position="legendPosition"
        :heatRule="heatRule"
        :minColor="minColor"
        :maxColor="maxColor"
        :heatRanges="heatRanges"
      >
        <d-xy-cursor
          :enabled="cursor"
          :behavior="cursorBehavior"
          :xVisible="cursorXVisible"
          :yVisible="cursorYVisible"
        >
          <d-date-x-axis
            :opposite="xAxisOpposite"
            :showTooltip="xAxisShowTooltip"
            :tooltipDateFormat="xAxisTooltipDateFormat"
          >
            <d-category-y-axis
              :opposite="yAxisOpposite"
              :showTooltip="yAxisShowTooltip"
              :cellStartLocation="yAxisCellStartLocation"
              :cellEndLocation="yAxisCellEndLocation"
            >
              <d-heatmap-serie
                v-for="(serie, index) in data.series"
                :key="index"
                :name="serie.serie"
                :data="serie.data"
                :xField="'timestampX'"
                :yField="'categoryY'"
                :heatRule="heatRule"
                :minColor="minColor"
                :maxColor="maxColor"
                :minValue="minValue"
                :maxValue="maxValue"
                :heatRanges="heatRanges"
              />
            </d-category-y-axis>
          </d-date-x-axis>
        </d-xy-cursor>
      </d-heat-legend>
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
import { ValueRange } from "../../models";

import Spinner from "./Spinner.vue";

@Component({ components: { Spinner } })
export default class HeatmapChart extends Vue {
  @Prop({ required: true })
  data!: any;

  @Prop({ required: true })
  minHeight!: string;

  @Prop({ required: true })
  locale!: string;

  @Prop({ required: true })
  chartLayout!: LayoutEnum;

  @Prop({ required: true })
  legend!: boolean;

  @Prop({ required: true })
  legendPosition!: PositionEnum;

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
  yAxisOpposite!: boolean;

  @Prop({ required: true })
  yAxisShowTooltip!: boolean;

  @Prop({ required: true })
  yAxisTooltipNumberFormat!: string;

  @Prop({ required: true })
  yAxisCellStartLocation!: number;

  @Prop({ required: true })
  yAxisCellEndLocation!: number;

  @Prop({ required: true })
  heatRule!: HeatRule;

  @Prop({ required: true })
  minColor!: string;

  @Prop({ required: true })
  maxColor!: string;

  @Prop({ required: true })
  minValue!: number;

  @Prop({ required: true })
  maxValue!: number;

  @Prop({ required: true })
  heatRanges!: ValueRange[] | undefined;

  ready: boolean = false;
}
</script>