<template>
  <div>
    <spinner
      :height="height"
      :style="{ display: ready ? 'none': 'flex' }"
    />
    <d-pie-chart
      :chartId="Math.random().toString()"
      :locale="locale"
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
        <d-pie-serie-extended>
          <template v-slot="{ clickedData }">
            <d-pie-slice
              v-for="(serie, index) in data.series"
              :key="index"
              :data="serie.data"
              :hideLabels="serie.hideLabels"
              :defaultHidden="serie.hideSerie"
              :clickedData="clickedData"
              :colorSet="colorSet"
              :colorSeed="colorSeed"
              :otherThreshold="otherThreshold"
            />
          </template>
        </d-pie-serie-extended>
      </d-legend>
    </d-pie-chart>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { LayoutEnum, PositionEnum } from "../../enums";
import { ColorSets } from "../../colors";

import Spinner from "./Spinner.vue";

@Component({ components: { Spinner } })
export default class PieChart extends Vue {
  @Prop({ required: true })
  data!: any;

  @Prop({ required: true })
  height!: string;

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
  otherLabel!: string;

  @Prop({ required: true })
  otherThreshold!: number;

  ready: boolean = false;
}
</script>