<template>
  <wrapped-legend :key="key" v-bind="$props">
    <slot> </slot>
  </wrapped-legend>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import { LayoutEnum, PositionEnum } from "../../enums";

import WrappedLegend from "./DIndicatorLegend.vue";

@Component({
  components: { WrappedLegend }
})
export default class DIndicatorLegendWrapper extends Vue {
  @Prop({ required: false, default: true })
  enabled!: boolean;

  @Prop({ required: false, default: LayoutEnum.Grid })
  layout!: LayoutEnum;

  @Prop({ required: false, default: PositionEnum.Ordinate })
  position!: PositionEnum;

  @Prop({ required: false, default: 50 })
  x!: number;

  @Prop({ required: false, default: 50 })
  centerX!: number;

  @Prop({ required: false, default: 50 })
  y!: number;

  @Prop({ required: false, default: 50 })
  centerY!: number;

  @Watch("enabled")
  onEnabledChange() {
    this.key++;
  }

  key = 0;
}
</script>