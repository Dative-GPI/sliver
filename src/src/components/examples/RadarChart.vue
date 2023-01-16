<template>
  <div>
    <spinner
      :min-height="minHeight"
      :style="{ display: ready ? 'none': 'flex' }"
    />
    <d-radar-chart
      :chartId="Math.random().toString()"
      :min-height="minHeight"
      :locale="locale"
      :colorSet="colorSet"
      :layout="chartLayout"
      :style="{ display: ready ? 'flex': 'none' }"
      @ready="ready = true"
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
        <d-value-t-axis
          :min="axisMin"
          :max="axisMax"
          :ranges="ranges"
          :unit="unit"
        >
          <d-clock-hand
            :name="firstName"
            :colorIndex="firstColorIndex"
            :colorSet="colorSet"
            :colorSeed="colorSeed"
            :pinRadius="firstPinRadius"
            :bottomWidth="firstBottomWidth"
            :clockHandRadius="firstClockHandRadius"
            :handTooltipText="firstHandTooltipText"
            :handTooltipX="firstHandTooltipX"
            :value="firstValue"
          />
          <d-clock-hand
            v-if="secondClockHand"
            :name="secondName"
            :colorIndex="secondColorIndex"
            :colorSet="colorSet"
            :colorSeed="colorSeed"
            :pinRadius="secondPinRadius"
            :bottomWidth="secondBottomWidth"
            :clockHandRadius="secondClockHandRadius"
            :handTooltipText="secondHandTooltipText"
            :handTooltipX="secondHandTooltipX"
            :value="secondValue"
          />
        </d-value-t-axis>
      </d-legend>
    </d-radar-chart>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { LayoutEnum, PositionEnum } from "../../enums";
import { AxisRange } from "../../models";
import { ColorSets } from "../../colors";

import Spinner from "./Spinner.vue";

@Component({ components: { Spinner } })
export default class RadarChart extends Vue {
  @Prop({ required: true })
  minHeight!: string;

  @Prop({ required: true })
  locale!: string;

  @Prop({ required: true })
  colorSet!: ColorSets;

  @Prop({ required: true })
  colorSeed!: string;

  @Prop({ required: true })
  panX!: boolean;

  @Prop({ required: true })
  panY!: boolean;

  @Prop({ required: true })
  startAngle!: number;

  @Prop({ required: true })
  endAngle!: number;

  @Prop({ required: true })
  radius!: number;

  @Prop({ required: true })
  axisMin!: number;

  @Prop({ required: true })
  axisMax!: number;

  @Prop({ required: true })
  ranges!: AxisRange[] | undefined;

  @Prop({ required: true })
  unit!: string | undefined;

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
  firstName!: string;
  
  @Prop({ required: true })
  firstColorIndex!: number;
  
  @Prop({ required: true })
  firstPinRadius!: number;
  
  @Prop({ required: true })
  firstBottomWidth!: number;
  
  @Prop({ required: true })
  firstClockHandRadius!: number;
  
  @Prop({ required: true })
  firstHandTooltipText!: string;
  
  @Prop({ required: true })
  firstHandTooltipX!: number;

  @Prop({ required: true })
  firstValue!: number;

  @Prop({ required: true })
  secondClockHand!: boolean;

  @Prop({ required: false, default: "" })
  secondName!: string;
  
  @Prop({ required: false, default: 0 })
  secondColorIndex!: number;
  
  @Prop({ required: false, default: 0 })
  secondPinRadius!: number;
  
  @Prop({ required: false, default: 0 })
  secondBottomWidth!: number;
  
  @Prop({ required: false, default: 0 })
  secondClockHandRadius!: number;
  
  @Prop({ required: false, default: "" })
  secondHandTooltipText!: string;
  
  @Prop({ required: false, default: 0 })
  secondHandTooltipX!: number;

  @Prop({ required: false, default: 0 })
  secondValue!: number;

  ready: boolean = false;
}
</script>