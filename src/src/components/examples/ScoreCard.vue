<template>
  <d-score-card
    :locale="locale"
    :series="series"
    :height="height"
    :data="data"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class ScoreCard extends Vue {
  @Prop({ required: true })
  height!: string;

  @Prop({ required: true })
  locale!: string;

  @Prop({ required: true })
  series!: any[];

  @Prop({ required: true })
  data!: any[];
}
</script>