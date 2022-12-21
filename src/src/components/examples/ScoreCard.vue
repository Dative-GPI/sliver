<template>
  <d-score-card
    :locale="locale"
    :minHeight="minHeight"
    :series="series"
    :data="data"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class ScoreCard extends Vue {
  @Prop({ required: true })
  minHeight!: string;

  @Prop({ required: true })
  locale!: string;

  @Prop({ required: true })
  series!: any[];

  @Prop({ required: true })
  data!: any[];
}
</script>