export interface RelipayConfig {
  colorTheme: string;
  customScrollbars: boolean;
  layout: {
    style: string,
    width: 'fullwidth' | 'boxed',
    navbar: {
      hidden: boolean,
    },
    header: {
      background: string,
      hidden: boolean,
    },
    news: {
      background: string,
      hidden: boolean,
    },
    footer: {
      background: string,
      hidden: boolean,
    },
    sidepanel: {
      hidden: boolean,
    },
    content: {
      hidden: boolean,
    },
    slider: {
      hidden: boolean,
    },
  };
}
