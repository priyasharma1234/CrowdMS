import moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';


export var CustConfg: Partial<BsDatepickerConfig> = {
  containerClass: 'theme-green',
  isAnimated: true,
  adaptivePosition: true,
  // selectWeek: true,
  dateInputFormat: 'DD/MM/YYYY',
  showPreviousMonth: false,
  rangeInputFormat: 'D-MMM-YYYY',
  showWeekNumbers: false,
  ranges: [
    {
      value: [new Date(), new Date()],
      label: 'Today',
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 1)),
        new Date(new Date().setDate(new Date().getDate() - 1)),
      ],
      label: 'Yesterday',
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 7)),
        new Date(),
      ],
      label: 'Last 7 Days',
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 30)),
        new Date(),
      ],
      label: 'Last 30 Days',
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 90)),
        new Date(),
      ],
      label: 'Last 90 Days',
    },
    // {
    //   value: [new Date(new Date().setDate(1)), new Date()],
    //   label: 'This Month',
    // },
    // {
    //   value: [
    //     new Date(
    //       new Date(new Date().setDate(1)).setMonth(new Date().getMonth() - 1)
    //     ),
    //     new Date(
    //       new Date(new Date().setDate(0)).setMonth(new Date().getMonth() - 1)
    //     ),
    //   ],
    //   label: 'Previous Month',
    // },

    {
      value: [
        moment(new Date()).subtract(6, 'months').toDate(),
        new Date(),
      ],
      label: 'Last 6 months',
    },
  ],
};

export var CustConfg2: Partial<BsDatepickerConfig> = {
  containerClass: 'theme-green',
  isAnimated: true,
  adaptivePosition: true,
  selectWeek: true,
  dateInputFormat: 'D-MMM-YYYY',
  //rangeInputFormat: 'D-MMM-YYYY',
  showWeekNumbers: false,
  ranges: [
    {
      value: [new Date(), new Date()],
      label: 'Today',
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 1)),
        new Date(new Date().setDate(new Date().getDate() - 1)),
      ],
      label: 'Yesterday',
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 7)),
        new Date(),
      ],
      label: 'Last 7 Days',
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 30)),
        new Date(),
      ],
      label: 'Last 30 Days',
    },
    {
      value: [new Date(new Date().setDate(1)), new Date()],
      label: 'This Month',
    },
    {
      value: [
        new Date(
          new Date(new Date().setDate(1)).setMonth(new Date().getMonth() - 1)
        ),
        new Date(
          new Date(new Date().setDate(0)).setMonth(new Date().getMonth() - 1)
        ),
      ],
      label: 'Previous Month',
    },
  ],
};

export function getDatepickerConfig(configData: Partial<BsDatepickerConfig>): BsDatepickerConfig {

  return Object.assign(new BsDatepickerConfig(), configData ?? {
    containerClass: 'theme-green',
    isAnimated: true,
    adaptivePosition: true,

    // selectWeek: true,
    // dateInputFormat: 'YYYY-MM-DD',
    showPreviousMonth: true,
    rangeInputFormat: 'D-MMM-YYYY',
    showWeekNumbers: false,
    ranges: [
      {
        value: [new Date(), new Date()],
        label: 'Today',
      },
      {
        value: [
          new Date(new Date().setDate(new Date().getDate() - 1)),
          new Date(new Date().setDate(new Date().getDate() - 1)),
        ],
        label: 'Yesterday',
      },
      {
        value: [
          new Date(new Date().setDate(new Date().getDate() - 7)),
          new Date(),
        ],
        label: 'Last 7 Days',
      },
      {
        value: [
          new Date(new Date().setDate(new Date().getDate() - 30)),
          new Date(),
        ],
        label: 'Last 30 Days',
      },
      {
        value: [new Date(new Date().setDate(1)), new Date()],
        label: 'This Month',
      },
      {
        value: [
          new Date(
            new Date(new Date().setDate(1)).setMonth(new Date().getMonth() - 1)
          ),
          new Date(
            new Date(new Date().setDate(0)).setMonth(new Date().getMonth() - 1)
          ),
        ],
        label: 'Previous Month',
      },
    ],
  });
}
