<template>
  <d-radar-chart
    :min-height="minHeight"
    :layout="chartLayout"
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
      >
        <d-clock-hand
          :value="firstValue"
          :colorIndex="firstClockHand.colorIndex"
          :name="firstClockHand.name"
        />
        <d-clock-hand
          v-if="secondClockHand"
          :value="secondValue"
          :colorIndex="secondClockHand.colorIndex"
          :name="secondClockHand.name"
        />
      </d-value-t-axis>
    </d-legend>
  </d-radar-chart>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { LayoutEnum, PositionEnum } from "../../enums";

@Component({})
export default class RadarChart extends Vue {
  @Prop({ required: true })
  minHeight!: string;

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
  ranges!: { lowBound: number; highBound: number; color: string; label: string; }[] | undefined;

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
  firstClockHand!: { colorIndex: number; name: string; }

  @Prop({ required: true })
  firstValue!: number;

  @Prop({ required: false, default: undefined })
  secondClockHand!: { colorIndex: number; name: string; } | undefined;

  @Prop({ required: false, default: 0 })
  secondValue!: number;
}
</script>