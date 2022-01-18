<template>
  <d-pie-chart>
    <d-legend
      :enabled="legend"
      :x="legendX"
      :centerX="legendCenterX"
    >
      <d-pie-serie
        v-for="(serie, index) in data.series"
        :key="index"
        :name="serie.serie"
        :data="serie.data"
      />
    </d-legend>
  </d-pie-chart>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class PieChart extends Vue {
  @Prop({ required: true })
  data!: any;

  @Prop({ required: true })
  legend!: boolean;

  @Prop({ required: true })
  legendX!: number;

  @Prop({ required: true })
  legendCenterX!: number;
}
</script>