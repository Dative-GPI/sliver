import ScoreCard from '../components/examples/ScoreCard.vue';

export default {
  title: 'Example/ScoreCard',
  component: ScoreCard
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ScoreCard },
  template:
    `
    <div :style="containerStyle">
      <score-card
        :locale="locale"
        :minHeight="minHeight"
        :series="chart.series"
        :data="chart.data"
      />
    </div>`,
});

const makeScoreCardChart = (labels, icon, iconSize, decimalPlaces, heatRule, valueMin, valueMax, close) => {
  let operands = labels.map(l => ({
    label: l,
    data: [{ valueY: Math.random() * (valueMax - valueMin) + valueMin, timestampX: 1672833487703, ...(close ? {closeTimestampX: 1672834487903} : {}) }]
  }));
  return {
    data: [{ operands }],
    series: [{
      icon, iconSize, decimalPlaces, heatRule,
      minColor: "#FF0000",
      maxColor: "#00FF00",
      heatRanges: [
        {
          startValue: 50,
          endValue: 75,
          color: "#00FF00",
          opacity: 1,
        },
        {
          startValue: 80,
          endValue: 200,
          color: "#FF0000",
          opacity: 0.5,
        }
      ]
    }]
  }
}

export const HeatMinMax = Template.bind({});
HeatMinMax.args = {
  chart: makeScoreCardChart(["Line 1", "Line 2", "Line 3"], "mdi-pen", 24, 2, 1, 50, 100),
  minHeight: 0,
  locale: "fr-FR",
  containerStyle: "height: 100px; overflow-y: auto; overflow-x: hidden;"
};


export const HeatRanges = Template.bind({});
HeatRanges.args = {
  chart: makeScoreCardChart(["Line 1", "Line 2", "Line 3"], "mdi-pen", 24, 2, 2, 50, 200, true),
  minHeight: 400,
  locale: "fr-FR",
  containerStyle: ""
};


export const NoHeat = Template.bind({});
NoHeat.args = {
  chart: makeScoreCardChart(["Line 1", "Line 2", "Line 3"], "mdi-pen", 24, 2, 0, 50, 100),
  minHeight: 400,
  locale: "fr-FR",
  containerStyle: ""
};

export const SingleValue = Template.bind({});
SingleValue.args = {
  chart: makeScoreCardChart(["Line 1"], "mdi-pen", 24, 2, 2, 50, 100, true),
  minHeight: 400,
  locale: "fr-FR",
  containerStyle: ""
};

export const SingleValueConstrainted = Template.bind({});
SingleValueConstrainted.args = {
  chart: makeScoreCardChart(["Line 1"], "mdi-pen", 24, 2, 2, 50, 100, true),
  minHeight: 0,
  locale: "fr-FR",
  containerStyle: "height: 40px; width: 150px;"
};