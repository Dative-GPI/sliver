<template>
  <div style="width: 100%; position: relative"
    :style="{ minHeight: minHeight ? `${minHeight}px` : undefined, height: solo ? '100%' : undefined }">
    <div v-for="(ds, dsIndex) in data"
      :key="dsIndex"
      :class="{ centered: solo }">
      <template v-if="series[dsIndex] != null">
        <div v-for="(dop, dopIndex) in ds.operands"
          :key="dopIndex"
          :class="[solo ? '' : 'd-flex flex-nowrap items-center justify-center']"
          :style="{ height: solo ? undefined : '55px', width: solo ? clientWidth + 'px' : undefined }">
          <div v-if="!solo"
            :style="{ 'max-width': `${maxWidth}px` }">
            <div class="text-h6 text-truncate">{{ dop.label }}</div>
            <div class="text-truncate text-body-1">{{
              [format(dop.data[0].timestampX), format(dop.data[0].closeTimestampX)].filter(t => !!t).join(" → ")
            }}
            </div>
          </div>
          <v-spacer v-if="!solo" />
          <div ref="data">
            <div class="d-flex justify-center align-center">
              <span class="text-h3"
                :style="{
                  whiteSpace: 'nowrap', color: color(dop.data[0].valueY, series[dsIndex]),
                  fontSize: solo ? `${soloFontSize(dop.data[0].valueY, series[dsIndex].decimalPlaces, dop.unit || series[dsIndex].operationUnit)}px !important` : undefined,
                  lineHeight: solo ? `${soloFontSize(dop.data[0].valueY, series[dsIndex].decimalPlaces, dop.unit || series[dsIndex].operationUnit)}px !important` : undefined
                }">
                {{ formatNumber(dop.data[0].valueY, locale, series[dsIndex].decimalPlaces) }} {{
                  dop.unit ||
                    series[dsIndex].operationUnit
                }}
              </span>
              <v-icon :size="solo ? soloFontSize(dop.data[0].valueY, series[dsIndex].decimalPlaces, dop.unit || series[dsIndex].operationUnit) * 0.8 : 26"
                style="margin-left: max(1%, 8px)"
                :color="color(dop.data[0].valueY, series[dsIndex])">
                {{ series[dsIndex].icon }}
              </v-icon>
            </div>
            <div class="text-truncate text-center text-body-1" :class="{small: clientHeight < 80}"
              v-if="solo">{{
  [format(dop.data[0].timestampX), format(dop.data[0].closeTimestampX)].filter(t => !!t).join(" → ")
              }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import Color from "color";
import { Component, Vue, Prop } from "vue-property-decorator";

import { HeatRule } from "../../enums";
import { DateTools } from "../../dates";
import { formatNumber } from "../../helpers";
import { ScoreCardSerie } from "../../models";

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
  series!: ScoreCardSerie[];

  @Prop({ required: false, default: 1.5 })
  fontRatio!: number;

  @Prop({ required: true })
  data!: { operands: { label: string, unit: string, data: { valueY: number, timestampX: number, closeTimestampX: number }[] }[] }[];

  resizeObserver: ResizeObserver | null = null;
  debounceResize: number | null = null;
  shortFormat = false;
  maxWidth = 450;
  clientWidth = 0
  clientHeight = 0;

  get dataCount(): number {
    return this.data.reduce((current, pv) => current + pv.operands.length, 0)
  }

  get solo(): boolean {
    return this.dataCount == 1;
  }

  get minValue(): number {
    // Faut il le scopper à la série ?
    return Math.min(...this.data.flatMap(d => d.operands.flatMap(o => o.data.flatMap(od => od.valueY))))
  }

  get maxValue(): number {
    return Math.max(...this.data.flatMap(d => d.operands.flatMap(o => o.data.flatMap(od => od.valueY))))
  }

  get hasMultipleTimestamp(): boolean {
    return this.data.flatMap(d => d.operands.flatMap(o => o.data)).some(od => od.timestampX && od.closeTimestampX)
  }

  mounted(): void {
    console.log(this.data);
    
    this.resizeObserver = new ResizeObserver(() => {
      if (this.debounceResize != null) {
        clearTimeout(this.debounceResize);
      }
      this.debounceResize = setTimeout(this.resize, this.resizeDebounce);
    });
    this.resizeObserver.observe(this.$el);
    this.resize();
  }

  destroyed(): void {
    if (this.debounceResize != null) {
      clearTimeout(this.debounceResize);
    }

    this.resizeObserver!.disconnect();
  }

  color(value: number, serie: ScoreCardSerie): string {
    let result = "";
    let minValue = serie.minValue != null ? serie.minValue : this.minValue;
    let maxValue = serie.maxValue != null ? serie.maxValue : this.maxValue;

    switch (serie.heatRule) {
      case HeatRule.Gradient: {
        if (value >= maxValue) {
          result = serie.maxColor;
          break;
        }
        if (value <= minValue) {
          result = serie.minColor;
          break;
        }
        result = Color(serie.minColor).mix(Color(serie.maxColor), (value - minValue) / (maxValue - minValue)).hex();
        break;
      }
      case HeatRule.Ranges: {
        const heat = serie.heatRanges.find(r => r.endValue > value && r.startValue < value);
        if (heat != null) {
          result = Color(heat.color).alpha(heat.opacity).hex();
        }
        break;
      }
      case HeatRule.Fixed: {
        result = Color(serie.fixedColor).hex();
        break;
      }
    }
    return result;
  }

  resize(): void {
    this.shortFormat = this.hasMultipleTimestamp && this.$el.clientWidth < 600;
    this.clientWidth = this.$el.clientWidth;
    this.clientHeight = this.$el.clientHeight;

    if (this.$refs.data && Array.isArray(this.$refs.data)) {
      let maxWidth = Math.max(...(this.$refs.data as unknown as HTMLElement[]).map(el => el.clientWidth));
      this.maxWidth = this.$el.clientWidth - maxWidth - 20;
    }
  }

  format(time: number | null): string {
    if (time) {
      if (this.shortFormat)
        return DateTools.formatShortEpoch(this.locale, this.timeOffset, time);
      else
        return DateTools.formatLongTimeEpoch(this.locale, this.timeOffset, time);
    }
    return "";
  }

  soloFontSize(value: number, decimalPlaces: number, unit: string): number {

    let formattedNumber = [formatNumber(value, this.locale, decimalPlaces), unit].filter(el => el).join(" ");
    let maxCharacterWidth = Math.floor(this.clientWidth / (formattedNumber.length + 2) * Math.log10(formattedNumber.length * 2));
    let maxCharacterHeight = this.clientHeight - (this.clientHeight < 80 ? 12 : 20);

    return Math.max(Math.min(maxCharacterWidth, maxCharacterHeight), 1);
  }
}
</script>

<style scoped>
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.text-body-1.small {
  line-height: 0.7rem!important; 
  font-size: 0.6rem!important;
}
</style>