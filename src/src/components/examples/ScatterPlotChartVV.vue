<template>
  <d-xy-chart>
    <d-legend
      :enabled="legend"
      :x="legendX"
      :centerX="legendCenterX"
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
          :tooltipNumberFormat="XAxisTooltipNumberFormat"
        >
          <d-value-y-axis
            :opposite="yAxisOpposite"
            :showTooltip="yAxisShowTooltip"
            :tooltipNumberFormat="yAxisTooltipNumberFormat"
          >
            <d-scatter-plot-serie
              v-for="(serie, index) in data.series"
              :key="index"
              :name="serie.serie"
              :data="serie.data"
            />
          </d-value-y-axis>
        </d-value-x-axis>
      </d-xy-cursor>
    </d-legend>
    <d-x-scrollbar
      v-if="scrollbar"
      :height="scrollbarHeight"
      :startGripVisible="scrollbarStartGripVisible"
      :endGripVisible="scrollbarEndGripVisible"
    />
  </d-xy-chart>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class ScatterPlotChart extends Vue {
  @Prop({ required: true })
  data!: any;

  @Prop({ required: true })
  minHeight!: string;

  @Prop({ required: true })
  vertical!: boolean;

  @Prop({ required: true })
  legend!: boolean;

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
  yAxisTooltipNumberFormat!: string;
}
</script>