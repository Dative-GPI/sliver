<template>
  <wrapped-cursor :key="key" v-bind="$props">
    <slot> </slot>
  </wrapped-cursor>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import WrappedCursor from "./DXYCursor.vue";

@Component({
  components: { WrappedCursor }
})
export default class DXYCursorWrapper extends Vue {
  @Prop({ required: false, default: true })
  enabled!: boolean;

  @Prop({ required: false, default: "zoomX" })
  behavior!: "zoomXY" | "zoomX" | "zoomY" | "selectX" | "selectY" | "selectXY" | undefined;

  @Prop({ required: false, default: true })
  xVisible!: boolean;

  @Prop({ required: false, default: true })
  yVisible!: boolean;

  @Watch("enabled")
  onEnabledChange() {
    this.key++;
  }

  key = 0;
}
</script>