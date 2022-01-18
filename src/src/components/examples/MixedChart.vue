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
        <d-date-x-axis
          :opposite="xAxisOpposite"
          :showTooltip="xAxisShowTooltip"
          :tooltipDateFormat="xAxisTooltipDateFormat"
        >
          <d-value-y-axis
            :opposite="yAxisOpposite"
            :showTooltip="yAxisShowTooltip"
            :tooltipNumberFormat="yAxisTooltipNumberFormat"
          >
            <d-line-serie
              v-for="(serie, index) in data.series"
              :key="index"
              :name="serie.serie"
              :data="serie.data"
            />
          </d-value-y-axis>
          <d-category-y-axis
            :opposite="yAxisBisOpposite"
            :showTooltip="yAxisBisShowTooltip"
          >
            <d-planning-serie
              v-for="(serie, index) in dataBis.series"
              :key="index"
              :name="serie.serie"
              :data="serie.data"
              :bulletRadius="0"
              :columnsHeight="20"
              :columnsOpacity="0.6"
              :showTooltip="false"
              :showLabel="true"
            />
          </d-category-y-axis>
          <d-category-y-axis
            :opposite="yAxisBisOpposite"
            :labelsVisible="false"
            :showTooltip="false"
          >
            <d-planning-serie
              v-for="(serie, index) in dataTiers.series"
              :key="index"
              :name="serie.serie"
              :data="serie.data"
              :bulletRadius="7"
            />
          </d-category-y-axis>
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
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class LineChart extends Vue {
  @Prop({ required: true })
  data!: any;

  @Prop({ required: true })
  dataBis!: any;

  @Prop({ required: true })
  dataTiers!: any;

  @Prop({ required: true })
  legend!: boolean;

  @Prop({ required: true })
  legendX!: number;

  @Prop({ required: true })
  legendCenterX!: number;

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
  yAxisBisOpposite!: boolean;

  @Prop({ required: true })
  yAxisBisShowTooltip!: boolean;
}
</script>