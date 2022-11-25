import AllInOne from '../components/examples/AllInOne.vue';

export default {
  title: 'Example/AllInOne',
  component: AllInOne,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AllInOne },
  template:
    `<all-in-one
      :data="data"
      :yAxisRanges="yAxisRanges"
      :heatRanges="heatRanges"
    />`,
});

const makeLineSerie = (name, tZero, vZero, elapsedTime, rangeValue, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    data.push({
      timestampX: tZero,
      valueY: vZero
    });

    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;

    tZero += elapsedTime;
    vZero += (Math.random() * rangeValue * plusOrMinus);
  }

  return {
    serie: name,
    data: data
  };
}

export const Default = Template.bind({});
Default.args = {
  data: {
    series: [
      { ...makeLineSerie("Line 1", 1660860000000 + 86400000, 0, 2.16e+7, 2, 50 ) },
      { ...makeLineSerie("Line 2", 1660860000000 + 86400000, 0, 2.16e+7, 2, 50 ) },
      { ...makeLineSerie("Line 3", 1660860000000 + 86400000, 0, 2.16e+7, 2, 50 ) }
    ]
  },
  yAxisRanges: [
    { startValue: -3,   endValue: 0,  opacity: 0.2, color: "#ff0000", label: "Bad" },
    { startValue: 0,   endValue: 3,  opacity: 0.2, color: "#00ff00", label: "Good" },
  ],
  heatRanges: [
    { startValue: -1500,   endValue: -3,  opacity: 1, color: "#0000ff", label: "Out of scope" },
    { startValue: -3,   endValue: 0,  opacity: 1, color: "#ff0000", label: "Bad" },
    { startValue: 0,   endValue: 3,  opacity: 1, color: "#00ff00", label: "Good" },
    { startValue: 3,   endValue: 1500,  opacity: 1, color: "#0000ff", label: "Out of scope" },
  ]
};