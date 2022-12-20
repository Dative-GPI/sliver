<template>
  <div class="w-100">
    <div v-for="(s, sIndex) in series" :key="sIndex">
      <div v-for="(o, oIndex) in s.operands" :key="oIndex" no-gutters :style="{ height: '35px', display: 'flex', alignItems: 'center' }">
        <span v-if="s.operands.length > 1" class="text-h6 text-truncate" :style="{ width: '60%' }">
          {{ o.label }}
        </span>
        <v-spacer v-if="s.operands.length > 1" />
        <span class="text-h4" :style="{ whiteSpace: 'nowrap' }">
          {{ formatNumber(o.data[0].valueY, s.decimalPlaces) }} {{ s.operationUnit }}
        </span>
        <v-icon :size="s.iconSize" :style="{ marginLeft: '20px' }">
          {{ s.icon }}
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { Component,Vue, Prop } from "vue-property-decorator";

import { formatNumber } from "../../helpers";

@Component({
  data: () => ({ formatNumber })
})
export default class DScoreCard extends Vue {
  @Prop({ required: false, default: "en-US" })
  locale!: string;

  @Prop({ required: false, default: '400px' })
  minHeight!: string;

  @Prop({ required: true })
  series!: unknown[];
}
</script>