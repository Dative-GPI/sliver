<template>
  <div class="w-100">
    <div v-for="(ds, dsIndex) in data" :key="dsIndex">
      <template v-if="series[dsIndex] != null">
        <div v-for="(dop, dopIndex) in ds.operands" :key="dopIndex" class="d-flex" :style="{ height: '35px', alignItems: 'center' }">
          <span class="text-h6 text-truncate" :style="{ width: '60%' }">
            {{ dop.label }}
          </span>
          <v-spacer />
          <span class="text-h4" :style="{ whiteSpace: 'nowrap' }">
            {{ formatNumber(dop.data[0].valueY, locale, series[dsIndex].decimalPlaces) }} {{ series[dsIndex].operationUnit }}
          </span>
          <v-icon :size="series[dsIndex].iconSize" class="ml-5">
            {{ series[dsIndex].icon }}
          </v-icon>
        </div>
      </template>
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
  series!: any[];

  @Prop({ required: true })
  data!: any[];
}
</script>