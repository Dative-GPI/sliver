<template>
  <div class="w-100" :class="{ 'd-flex justify-center flex-column': dataCount == 1 }" :style="{minHeight}">
    <div v-for="(ds, dsIndex) in data" :key="dsIndex">
      <template v-if="series[dsIndex] != null">
        <v-row no-gutters justify="center" align="center" v-for="(dop, dopIndex) in ds.operands" :key="dopIndex"
          class="flex-nowrap" :style="{ height: solo ? undefined : '55px' }">
          <div v-if="!solo" :style="{ 'max-width': `${maxWidth}px` }">
            <div class="text-h6 text-truncate">{{ dop.label }}</div>
            <div class="text-truncate">{{
              [format(dop.data[0].timestampX), format(dop.data[0].closeTimestampX)].filter(t => !!t).join(" → ")
            }}
            </div>
          </div>
          <v-spacer v-if="!solo" />
          <div ref="data">
            <div class="d-flex align-center justify-center">
              <span class="text-h3" :style="{
                whiteSpace: 'nowrap', color: color(dop.data[0].valueY, series[dsIndex]),
                fontSize: solo ? `${clientWidth / formatNumber(dop.data[0].valueY, locale, series[dsIndex].decimalPlaces).length}px !important` : undefined,
                lineHeight: solo ? `${clientWidth / formatNumber(dop.data[0].valueY, locale, series[dsIndex].decimalPlaces).length}px !important` : undefined
              }">
                {{ formatNumber(dop.data[0].valueY, locale, series[dsIndex].decimalPlaces) }} {{
                  dop.unit ||
                    series[dsIndex].operationUnit
                }}
              </span>
              <v-icon :size="solo ? clientWidth * 0.75 / formatNumber(dop.data[0].valueY, locale, series[dsIndex].decimalPlaces).length : 26" class="ml-5" :color="color(dop.data[0].valueY, series[dsIndex])">
                {{ series[dsIndex].icon }}
              </v-icon>
            </div>
            <div class="text-truncate mt-3 text-center" v-if="solo">{{
              [format(dop.data[0].timestampX), format(dop.data[0].closeTimestampX)].filter(t => !!t).join(" → ")
            }}
            </div>
          </div>
        </v-row>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { Component, Vue, Prop } from "vue-property-decorator";
import Color from "color";

import { HeatRule } from "../../enums";
import { formatNumber } from "../../helpers";
import { DateTools } from "../../dates";

@Component({
  data: () => ({ formatNumber })
})
export default class DScoreCard extends Vue {
  @Prop({ required: false, default: "en-US" })
  locale!: string;

  @Prop({ required: false, default: "UTC" })
  timeOffset!: string;

  @Prop({ required: false, default: '400px' })
  minHeight!: string;

  @Prop({ required: false, default: 50 })
  resizeDebounce!: number;

  @Prop({ required: true })
  series!: Serie[];

  @Prop({ required: true })
  data!: { operands: { label: string, unit: string, data: { valueY: number, timestampX: number, closeTimestampX: number }[] }[] }[];

  resizeObserver: ResizeObserver | null = null;
  debounceResize: number | null = null;
  shortFormat = false;
  maxWidth = 450;
  clientWidth = 1000

  get dataCount() {
    return this.data.reduce((current, pv) => current + pv.operands.length, 0)
  }

  get solo() {
    return this.dataCount == 1;
  }

  // faut il le scopper à la série ?
  get minValue() {
    return Math.min(...this.data.flatMap(d => d.operands.flatMap(o => o.data.flatMap(od => od.valueY))))
  }

  get maxValue() {
    return Math.max(...this.data.flatMap(d => d.operands.flatMap(o => o.data.flatMap(od => od.valueY))))
  }

  get hasMultipleTimestamp() {
    return this.data.flatMap(d => d.operands.flatMap(o => o.data)).some(od => od.timestampX && od.closeTimestampX)
  }

  mounted() {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.debounceResize != null) {
        clearTimeout(this.debounceResize);
      }
      this.debounceResize = setTimeout(this.resize, this.resizeDebounce);
    });
    this.resizeObserver.observe(this.$el);
  }

  destroyed(): void {
    if (this.debounceResize != null) {
      clearTimeout(this.debounceResize);
    }

    this.resizeObserver!.disconnect();
  }

  color(value: number, serie: Serie) {
    let result = "";
    switch (serie.heatRule) {
      case HeatRule.None:
        break;
      case HeatRule.Gradient:
        const ratio = (value - this.minValue) / (this.maxValue - this.minValue)
        const color = Color(serie.minColor).mix(Color(serie.maxColor), ratio)
        result = color.hex()
        break;
      case HeatRule.Ranges:
        const heat = serie.heatRanges.find(r => r.endValue > value && r.startValue < value)
        if (heat != null) {
          result = Color(heat.color).alpha(heat.opacity).hex();
        }
        break;
    }
    return result;
  }

  resize() {
    this.shortFormat = this.hasMultipleTimestamp && this.$el.clientWidth < 600
    this.clientWidth = this.$el.clientWidth

    if (this.$refs.data && Array.isArray(this.$refs.data)) {
      let maxWidth = Math.max(...(this.$refs.data as unknown as HTMLElement[]).map(el => el.clientWidth))
      this.maxWidth = this.$el.clientWidth - maxWidth - 20
    }
  }

  format(time: number | null) {
    if (time) {
      if (this.shortFormat)
        return DateTools.formatShortEpoch(this.locale, this.timeOffset, time);
      else
        return DateTools.formatLongTimeEpoch(this.locale, this.timeOffset, time);
    }
  }
}

interface Serie {
  icon: string, iconSize: string,
  decimalPlaces: number, heatRule: number,
  minColor: string, maxColor: string,
  heatRanges: {
    startValue: number,
    endValue: number, color: string,
    opacity: number
  }[]
  operationUnit: string
}
</script>