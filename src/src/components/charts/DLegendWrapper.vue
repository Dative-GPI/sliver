<template>
  <wrapped-legend :key="key" v-bind="$props">
    <slot> </slot>
  </wrapped-legend>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import WrappedLegend from "./DLegend.vue";

@Component({
  components: { WrappedLegend }
})
export default class DLegendWrapper extends Vue {
  @Prop({ required: false, default: true })
  enabled!: boolean;

  @Prop({ required: false, default: 50 })
  x!: number;

  @Prop({ required: false, default: 50 })
  centerX!: number;

  @Watch("enabled")
  onEnabledChange() {
    this.key++;
  }

  key = 0;
}
</script>