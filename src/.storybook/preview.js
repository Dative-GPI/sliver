import Vue from 'vue';
import { Sliver } from "../src/index.ts";
import { MINIMAL_VIEWPORTS} from '@storybook/addon-viewport';

Vue.use(Sliver)

const customViewports = {
  _160px: {
    name: '160px',
    styles: {
      width: '160px',
      height: '568px',
    },
  },
  IphoneSE: {
    name: 'S | Iphone SE',
    styles: {
      width: '320px',
      height: '568px',
    },
  },
  IphoneSELandscape: {
    name: 'S | Iphone SE, paysage',
    styles: {
      width: '568px',
      height: '320px',
    },
  },
  IpadMini: {
    name: 'M | Ipad mini',
    styles: {
      width: '744px',
      height: '1133px',
    },
  },
  IpadMiniLandscape: {
    name: 'L | Ipad mini, paysage',
    styles: {
      width: '1133px',
      height: '744px',
    },
  },
  MacBookPeo: {
    name: 'L | MacBook Pro 14"',
    styles: {
      width: '1512px',
      height: '982px',
    },
  },
  Desktop1440: {
    name: 'L | Desktop 1440',
    styles: {
      width: '1440px',
      height: '1024px',
    },
  },
  Desktop1920: {
    name: 'L | Desktop 1920',
    styles: {
      width: '1920px',
      height: '1080px',
    },
  },
  _2560px: {
    name: '2560px',
    styles: {
      width: '2560px',
      height: '1080px',
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  paddings: {
    values: [
      { name: "S & M | 12px", value: '12px' },
      { name: "L | 24px", value: '24px' },
    ],
    default: "S & M | 12px",
  },
  viewport: {
    viewports: {
      ...customViewports,
      ...MINIMAL_VIEWPORTS,
    }
  },
};

// THIS is my decorator
export const decorators = [
  (story, context) => {
    const wrapped = story(context);
    return Vue.extend({
      components: { wrapped },
      template: `
        <div>
            <wrapped />
        </div>
      `
    });
  },
];