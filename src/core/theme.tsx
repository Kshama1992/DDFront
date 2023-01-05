import React from 'react';

import { ThemeProvider, Theme, StyledEngineProvider, createTheme } from '@mui/material/styles';

import { blue, red } from '@mui/material/colors';

declare module '@mui/styles/defaultTheme' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {}
}

declare module '@mui/styles/defaultTheme' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {}
}

declare module '@mui/styles/defaultTheme' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {}
}

declare module '@mui/styles/defaultTheme' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {}
}

declare module '@mui/styles/defaultTheme' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {}
}

declare module '@mui/styles/defaultTheme' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {}
}

const theme = createTheme({
	palette: {
		primary: blue,
		secondary: red,
	},
	typography: {
		fontFamily: '"Lato", sans-serif',
		fontSize: 16,
		fontWeightBold: 500,
		fontWeightRegular: 300,
		fontWeightMedium: 500,
		h1: {
			fontSize: 55,
			lineHeight: '60px',
			fontWeight: 500,
			letterSpacing: 0.6,
			color: '#fff',
			textTransform: 'capitalize',
		},
		h2: {
			fontSize: 30,
			lineHeight: '45px',
			fontWeight: 500,
			letterSpacing: 0.4,
			textTransform: 'uppercase',
			color: '#333',
		},
		subtitle1: {
			fontSize: 20,
			lineHeight: 1.6,
			fontWeight: 500,
			letterSpacing: 0.4,
			textTransform: 'capitalize',
			color: '#2d2d2d',
		},
		body2: {
			color: '#333',
		},
		body1: {
			color: '#333',
		},
		caption: {
			fontSize: 15,
			lineHeight: 1.65,
			fontWeight: 300,
			letterSpacing: 0.4,
			color: '#aaa',
			fontFamily: '"Hind", sans-serif',
		},
		button: {
			fontSize: 14,
			lineHeight: '20px',
			textTransform: 'uppercase',
			fontWeight: 400,
			letterSpacing: '0.4px',
		},
	},
	shadows: [
		'none',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
		'0 0 6px 0 rgba(0, 0, 0, 0.2)',
	],
	components: {
		MuiCardActions: {
			styleOverrides: {
				root: {
					padding: '20px 30px',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 20,
				},
				outlined: {
					padding: '11px 24px',
					textTransform: 'none',
				},
			},
		},
		MuiCardContent: {
			styleOverrides: {
				root: {
					padding: 0,
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					'& .MuiSvgIcon-root': {
						color: blue['500'],
					},
					'& .MuiFilledInput-underline:before,& .MuiFilledInput-underline:after': {
						display: 'none',
					},
				},
			},
		},
		MuiFilledInput: {
			styleOverrides: {
				root: {
					borderRadius: '20px !important',
					'& .MuiInputAdornment-root': {
						marginTop: '0 !important',
					},
				},
				input: {
					padding: '17px 12px 17px',
				},
			},
		},

		MuiFormControl: {
			styleOverrides: {
				root: {
					marginTop: 15,
					'& fieldset': {
						top: 0,
					},
					'& legend': {
						display: 'none',
					},
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					// paddingLeft: 15,
					// paddingTop: 15,
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					marginLeft: 0,
					paddingLeft: 0,
					marginTop: -13,
				},
				outlined: {
					paddingLeft: 0,
					marginLeft: -15,
					marginTop: -7,
				},
			},
		},
		MuiAutocomplete: {
			styleOverrides: {
				inputRoot: {
					marginTop: 2,
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					marginTop: 2,
				},
			},
		},
	},
});

export default function DropDeskTheme({ children }: { children: any }) {
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</StyledEngineProvider>
	);
}
