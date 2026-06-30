import { red } from "@mui/material/colors"
import { ThemeRecord } from "./types"

const lightText = {
  primary: "rgb(17, 24, 39)",
  secondary: "#616161",
  disabled: "rgb(149, 156, 169)"
}

const darkText = {
  primary: "rgb(255,255,255)",
  secondary: "rgb(229, 231, 235)",
  disabled: "rgb(156, 163, 175)"
}

const themesConfig: ThemeRecord = {
  default_light: {
    palette: {
      mode: "light",
      text: lightText,
      primary: {
        light: "#60afe6",
        main: "#2080b4",
        dark: "#046297",
        // dark: "#FF0000",
        contrastText: "#FFFFFF"
      },
      secondary: {
        light: "#9cfbff",
        main: "#68C8D5",
        dark: "#2f97a4",
        contrastText: "#ffffff"
      },
      background: {
        paper: "#FFFFFF",
        default: "#DBDBDB"
      },
      error: red
    },
    shape: {
      borderRadius: 14
    },
  },

  default_dark: {
    palette: {
      mode: "dark",
      text: darkText,
      primary: {
        light: "#D2EFF2",
        main: "#68C8D5",
        dark: "#3AA7BA"
      },
      secondary: {
        light: "#CCD7E2",
        main: "#56789D",
        dark: "#2B486F",
        contrastText: "#FFFFFF"
      },
      background: {
        paper: "#2F3438",
        default: "#25292E"
      },
      error: red
    },
    shape: {
      borderRadius: 14
    },
  },

  greyYellow: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#d4c454',
        light: '#e6e3c8',
        dark: '#988207',
        contrastText: 'rgba(6,6,6,0.87)',
      },
      secondary: {
        main: '#ea2567',
      },
      background: {
        default: 'rgba(70,70,72,0.67)',
        paper: '#02161a',
      },
    }
  },

  greyGreen: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#1b737b',
        light: '#6bf6f9',
        dark: '#077171',
        contrastText: 'rgba(255,255,255,0.87)',
      },
      secondary: {
        main: '#2557ea',
      },
      background: {
        default: 'rgba(1,1,39,0.67)',
        paper: '#042123',
      },
      success: {
        main: '#16bf1d',
      },
    }
  },
  newLight: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#1b737b',
        light: '#6bf6f9',
        dark: '#077171',
        contrastText: 'rgba(255,255,255,0.87)',
      },
      secondary: {
        main: '#2557ea',
      },
      background: {
        default: 'rgba(1,1,39,0.67)',
        paper: '#042123',
      },
      success: {
        main: '#16bf1d',
      },
    }
  },
  lightGreen: {
    palette: {
      mode: 'light',
      primary: {
        main: '#1b737b',
        light: '#6bf6f9',
        dark: '#077171',
        contrastText: 'rgba(255,255,255,0.87)',
      },
      secondary: {
        main: '#049bb6',
      },
      background: {
        default: '#eceaea',
        paper: '#ffffff',
      },
      success: {
        main: '#16bf1d',
      },
      error: {
        main: '#f1483b',
      },
      info: {
        main: '#3a9def',
      },
    },
  },
  seaSide: {
    palette: {
      mode: 'light',
      primary: {
        main: '#26648e',
        light: '#6bf6f9',
        dark: '#077171',
        contrastText: 'rgba(255,255,255,0.87)',
      },
      secondary: {
        main: '#53d2dc',
      },
      background: {
        default: '#eceaea',
        paper: '#ffffff',
      },
      success: {
        main: '#16bf1d',
      },
      error: {
        main: '#f1483b',
      },
      info: {
        main: '#44ff88',
      },
      warning: {
        main: '#ffe3b3',
      },
    },
  },
  velvet: {
    palette: {
      mode: 'light',
      primary: {
        main: '#3b4479',
      },
      secondary: {
        main: '#964ec2',
      },
      background: {
        default: '#eceaea',
        paper: '#ffffff',
      },
      success: {
        main: '#16bf1d',
      },
      error: {
        main: '#f1483b',
      },
      info: {
        main: '#50409a',
      },
      warning: {
        main: '#ffe3b3',
      },
    },
  },
  cove: {
    palette: {
      mode: 'light',
      primary: {
        main: '#006bbb',
      },
      secondary: {
        main: '#30a0e0',
      },
      background: {
        default: '#ffe3b3',
        paper: '#ffc872',
      },
      success: {
        main: '#16bf1d',
      },
      error: {
        main: '#f1483b',
      },
      info: {
        main: '#50409a',
      },
      warning: {
        main: '#ff9800',
      },
    },
  },
  turtle: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#e5efc1',
      },
      secondary: {
        main: '#a2d5ab',
      },
      background: {
        default: '#1c1c1b',
        paper: '#393838',
      },
      success: {
        main: '#16bf1d',
      },
      error: {
        main: '#a82419',
      },
      info: {
        main: '#39aea9',
      },
      warning: {
        main: '#eca234',
      },
      divider: 'rgba(182,210,197,0.12)',
    },
  },
  periwinkle: {
    palette: {
      mode: 'light',
      primary: {
        main: '#9a9cea',
      },
      secondary: {
        main: '#a2b9ee',
      },
      success: {
        main: '#adeee2',
      },
      error: {
        main: '#a82419',
      },
      info: {
        main: '#39aea9',
      },
      warning: {
        main: '#eca234',
      },
      divider: 'rgba(182,210,197,0.12)',
    },
  },
  kiwi: {
    palette: {
      mode: 'light',
      primary: {
        main: '#028174',
      },
      secondary: {
        main: '#0ab68b',
      },
      success: {
        main: '#adeee2',
      },
      error: {
        main: '#a82419',
      },
      info: {
        main: '#92de8b',
      },
      warning: {
        main: '#ffe3b3',
      },
      divider: 'rgba(182,210,197,0.12)',
    },
  },
  scales: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#7339ab',
      },
      secondary: {
        main: '#625ad8',
      },
      success: {
        main: '#34ea70',
      },
      error: {
        main: '#a82419',
      },
      info: {
        main: '#88f4ff',
      },
      warning: {
        main: '#ffe3b3',
      },
      divider: 'rgba(182,210,197,0.12)',
      background: {
        default: '#100b25',
        paper: '#322337',
      },
    },
  },
  greyScale: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#5352ed',
      },
      secondary: {
        main: '#ff6b81',
      },
      success: {
        main: '#2ed573',
      },
      error: {
        main: '#ff4757',
      },
      info: {
        main: '#70a1ff',
      },
      warning: {
        main: '#ffe3b3',
      },
      divider: 'rgba(182,210,197,0.12)',
      background: {
        default: '#2f3542',
        paper: '#747d8c',
      },
      text: {
        primary: '#ffffff',
      },
    },
  },
  lightGrey: {
    palette: {
      mode: 'light',
      primary: {
        main: '#2f3542',
      },
      secondary: {
        main: '#747d8c',
      },
      success: {
        main: '#2ed573',
      },
      error: {
        main: '#ff4757',
      },
      info: {
        main: '#a4b0be',
      },
      warning: {
        main: '#ffe3b3',
      },
      divider: 'rgba(120,123,123,0.12)',
      background: {
        default: '#f1f2f6',
        paper: '#ffffff',
      }
    }
  },
  greyY: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#2f3542',
      },
      secondary: {
        main: '#eccc68',
      },
      success: {
        main: '#6cf7a5',
      },
      error: {
        main: '#ff4757',
      },
      info: {
        main: '#b3cfef',
      },
      warning: {
        main: '#ff9800',
      },
      divider: 'rgba(79,80,80,0.12)',
      background: {
        default: '#f7eae1',
        paper: '#777779',
      },
      text: {
        primary: '#ffffff',
      },
    },
  }


}

export default themesConfig
