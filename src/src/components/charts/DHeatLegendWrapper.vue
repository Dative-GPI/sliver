<template>
  <wrapped-legend :key="key" v-bind="$props">
    <slot> </slot>
  </wrapped-legend>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import { HeatRule, PositionEnum } from "../../enums";
import { ValueRange } from "../../models";

import WrappedLegend from "./DHeatLegend.vue";

@Component({
  components: { WrappedLegend }
})
export default class DHeatLegendWrapper extends Vue {
  @Prop({ required: false, default: true })
  enabled!: boolean;

  @Prop({ required: false, default: PositionEnum.Abscissa })
  position!: PositionEnum;

  @Prop({ required: false, default: 50 })
  x!: number;

  @Prop({ required: false, default: 50 })
  centerX!: number;

  @Prop({ required: false, default: 50 })
  y!: number;

  @Prop({ required: false, default: 50 })
  centerY!: number;

  @Prop({ required: false, default: HeatRule.Gradient })
  heatRule!: HeatRule;

  @Prop({ required: false, default: "#ffff00" })
  minColor!: string;

  @Prop({ required: false, default: "#ff0000" })
  maxColor!: string;

  @Prop({ required: false, default: undefined })
  heatRanges!: ValueRange[] | undefined;

  @Watch("enabled")
  onEnabledChange() {
    this.key++;
  }

  key = 0;
}
</script>