<template>
  <div>
    <spinner
      :height="height"
      :style="{ display: ready ? 'none': 'flex' }"
    />
    <d-xy-chart
      :chartId="Math.random().toString()"
      :layout="chartLayout"
      :locale="locale"
      :height="height"
      :style="{ display: ready ? 'flex': 'none' }"
      @ready="ready = true"
    >
      <d-heat-legend
        :enabled="legend"
        :position="legendPosition"
        :minColor="minColor"
        :maxColor="maxColor"
      >
        <d-xy-cursor
          :enabled="cursor"
          :behavior="cursorBehavior"
          :xVisible="cursorXVisible"
          :yVisible="cursorYVisible"
        >
          <d-category-x-axis
            :opposite="xAxisOpposite"
            :showTooltip="xAxisShowTooltip"
            :labelsOversizedBehavior="xAxisLabelsOversizedBehavior"
            :labelsMaxWidth="xAxisLabelsMaxWidth"
            :labelsTooltipText="xAxisLabelsTooltipText"
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
                :xField="'categoryX'"
                :yField="'categoryY'"
                :minColor="minColor"
                :maxColor="maxColor"
              />
            </d-category-y-axis>
          </d-category-x-axis>
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

import { LayoutEnum, PositionEnum } from "../../enums";

import Spinner from "./Spinner.vue";

@Component({ components: { Spinner } })
export default class HeatmapChart extends Vue {
  @Prop({ required: true })
  data!: any;

  @Prop({ required: true })
  height!: string;

  @Prop({ required: true })
  locale!: string;

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
  xAxisLabelsOversizedBehavior!: "none" | "hide" | "fit" | "wrap" | "truncate";

  @Prop({ required: true })
  xAxisLabelsMaxWidth!: number;

  @Prop({ required: true })
  xAxisLabelsTooltipText!: string;

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
  minColor!: string;

  @Prop({ required: true })
  maxColor!: string;

  ready: boolean = false;
}
</script>