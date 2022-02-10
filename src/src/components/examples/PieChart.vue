<template>
  <d-pie-chart
    :min-height="minHeight"
    :layout="chartLayout"
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
      <d-pie-serie
        v-for="(serie, index) in data.series"
        :key="index"
        :name="serie.serie"
        :data="serie.data"
        :breakDownSlices="breakDownSlices"
        :breakDownSlicesSubname="breakDownSlicesSubname"
      />
    </d-legend>
  </d-pie-chart>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { LayoutEnum, PositionEnum } from "../../enums";

@Component({})
export default class PieChart extends Vue {
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
  breakDownSlices!: boolean;

  @Prop({ required: true })
  breakDownSlicesSubname!: string;
}
</script>