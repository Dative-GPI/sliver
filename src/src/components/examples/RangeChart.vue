<template>
  <div>
    <spinner
      :min-height="minHeight"
      :style="{ display: ready ? 'none': 'flex' }"
    />
    <d-xy-chart
      :min-height="minHeight"
      :layout="chartLayout"
      :locale="locale"
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
          <d-date-x-axis
            :opposite="xAxisOpposite"
            :showTooltip="xAxisShowTooltip"
            :tooltipDateFormat="xAxisTooltipDateFormat"
          >
            <d-value-y-axis
              :opposite="yAxisOpposite"
              :showTooltip="yAxisShowTooltip"
              :tooltipNumberFormat="yAxisTooltipNumberFormat"
              :ranges="yAxisRanges"
              :unit="yAxisUnit"
            >
              <d-range-serie
                :name="serie.serie"
                :data="serie.data"
                :subNames="subSeries.map(ss => ss.serie)"
                :subDatas="subSeries.map(ss => ss.data)"
                :showTooltip="serieShowTooltip"
                :tooltipText="serieTooltipText"
                :subTooltipText="serieSubTooltipText"
              />
            </d-value-y-axis>
          </d-date-x-axis>
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

import { LayoutEnum, PositionEnum } from "../../enums";
import { AxisRange } from "../../helpers";

import Spinner from "./Spinner.vue";

@Component({ components: { Spinner } })
export default class RangeChart extends Vue {
  @Prop({ required: true })
  serie!: any;

  @Prop({ required: true })
  subSeries!: any[];

  @Prop({ required: true })
  minHeight!: string;

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
  xAxisTooltipDateFormat!: string;

  @Prop({ required: true })
  yAxisOpposite!: boolean;

  @Prop({ required: true })
  yAxisShowTooltip!: boolean;

  @Prop({ required: true })
  yAxisTooltipNumberFormat!: string;

  @Prop({ required: true })
  yAxisRanges!: AxisRange[] | undefined;

  @Prop({ required: true })
  yAxisUnit!: string | undefined;

  @Prop({ required: true })
  serieShowTooltip!: boolean;

  @Prop({ required: true })
  serieTooltipText!: string;

  @Prop({ required: true })
  serieSubTooltipText!: string;
  
  ready: boolean = false;
}
</script>