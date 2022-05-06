<template>
  <div>
    <spinner
      :min-height="minHeight"
      :style="{ display: ready ? 'none': 'flex' }"
    />
    <d-xy-chart
      :min-height="minHeight"
      :layout="chartLayout"
      @ready="ready = true"
      :style="{ display: ready ? 'flex': 'none' }"
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
          <d-value-x-axis
            :opposite="xAxisOpposite"
            :showTooltip="xAxisShowTooltip"
            :tooltipNumberFormat="xAxisTooltipNumberFormat"
          >
            <d-category-y-axis
              :opposite="yAxisOpposite"
              :showTooltip="yAxisShowTooltip"
              :labelsOversizedBehavior="yAxisLabelsOversizedBehavior"
              :labelsMaxWidth="yAxisLabelsMaxWidth"
              :labelsTooltipText="yAxisLabelsTooltipText"
            >
              <d-top-serie
                v-for="(serie, index) in data.series"
                :key="index"
                :name="serie.serie"
                :data="serie.data"
              />
            </d-category-y-axis>
          </d-value-x-axis>
        </d-xy-cursor>
      </d-legend>
    </d-xy-chart>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { LayoutEnum, PositionEnum } from "../../enums";

import Spinner from "./Spinner.vue";

@Component({ components: { Spinner } })
export default class BarsChart extends Vue {
  @Prop({ required: true })
  data!: any;

  @Prop({ required: true })
  minHeight!: string;

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
  yAxisOpposite!: boolean;

  @Prop({ required: true })
  yAxisShowTooltip!: boolean;

  @Prop({ required: true })
  yAxisLabelsOversizedBehavior!: "none" | "hide" | "fit" | "wrap" | "truncate";

  @Prop({ required: true })
  yAxisLabelsMaxWidth!: number;

  @Prop({ required: true })
  yAxisLabelsTooltipText!: string;

  ready: boolean = false;
}
</script>