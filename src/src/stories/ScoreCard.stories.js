import ScoreCard from '../components/examples/ScoreCard.vue';

export default {
  title: 'Example/ScoreCard',
  component: ScoreCard
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ScoreCard },
  template:
    `<score-card
      :locale="locale"
      :minHeight="minHeight"
      :series="series"
    />`,
});

const makeScoreCardSerie = (labels, icon, iconSize, decimalPlaces, valueMin, valueMax) => {
  let operands = labels.map(l => ({
    label: l,
    data: [{ valueY: Math.random() * (valueMax - valueMin) + valueMin }]
  }));
  return {
    operands, icon, iconSize, decimalPlaces
  }
}

export const Default = Template.bind({});
Default.args = {
  series: [
    { ...makeScoreCardSerie(["Line 1", "Line 2", "Line 3"], "mdi-pen", 24, 2, 50, 100 ) }
  ],
  minHeight: '400px',
  locale: "fr-FR"
};