import React from 'react';
// / <reference types="react-scripts" />

declare module 'react-phone-number-input' {
	export type NumberFormat = 'NATIONAL' | 'National' | 'INTERNATIONAL' | 'International';

	export function formatPhoneNumber(value?: string): string;
	export function formatPhoneNumber(value: string, format?: NumberFormat): string;

	export function formatPhoneNumberIntl(value?: string): string;

	export function isValidPhoneNumber(value?: string): boolean;

	export type FlagsMap = { [countryCode: string]: React.Component<object, object> };

	export interface CountrySelectComponentProps {
		className?: string;
		disabled?: boolean;
		name?: string;
		onBlur?: () => void;
		onChange?: (value: string) => void;
		onFocus?: () => void;
		options: Array<{ value?: string; label: string; icon: React.Component<any> }>;
		tabIndex?: number | string;
		value?: string;
	}

	export interface InputComponentProps {
		// Required props
		onChange: (value: string) => void;
		value: string;

		// Optional props
		onFocus?: () => void;
		onBlur?: () => void;
		country?: string;
		metadata?: object;
	}

	export interface PhoneInputProps {
		// Required props
		onChange: (value: string) => void;
		value: string;

		// Optional props
		autoComplete?: string;
		className?: string;
		country?: string;
		countries?: string[];
		countryOptions?: string[];
		countrySelectComponent?: any;
		countrySelectTabIndex?: number;
		disabled?: boolean;
		displayInitialValueAsLocalNumber?: boolean;
		error?: string;
		ext?: React.ReactElement;
		flagComponent?: React.Component<{ country: string; flagsPath: string; flags: FlagsMap }, object>;
		flags?: FlagsMap;
		flagsPath?: string;
		getInputClassName?: (params: { disable?: boolean; invalid?: boolean }) => string;
		id?: string | number;
		inputComponent?: any;
		international?: boolean;
		internationalIcon?: React.Component<object, object>;
		inputClassName?: string;
		labels?: { [key: string]: string };
		limitMaxLength?: boolean;
		metadata?: object;
		placeholder?: string;
		onCountryChange?: (countryCode?: string) => void;
		showCountrySelect?: boolean;
		style?: React.CSSProperties;
	}

	export default class PhoneInput extends React.Component<PhoneInputProps, object> {}
}

// / <reference types="react">
declare module 'react-phone-input-2' {
	export type NumberFormat = 'NATIONAL' | 'National' | 'INTERNATIONAL' | 'International';

	export function formatPhoneNumber(value?: string): string;
	export function formatPhoneNumber(value: string, format?: NumberFormat): string;

	export function formatPhoneNumberIntl(value?: string): string;

	export function isValidPhoneNumber(value?: string): boolean;

	export interface FlagsMap {
		[countryCode: string]: React.Component<object, object>;
	}

	export interface CountrySelectComponentProps {
		className?: string;
		disabled?: boolean;
		name?: string;
		onBlur?: () => void;
		onChange?: (value: string) => void;
		onFocus?: () => void;
		options?: { value?: string; label: string; icon: React.Component }[];
		tabIndex?: number | string;
		value?: string;
	}

	export interface InputComponentProps {
		// Required props
		onChange: (value: string) => void;
		value: string;

		// Optional props
		onFocus?: () => void;
		onBlur?: () => void;
		country?: string;
		metadata?: object;
	}

	export interface PhoneInputProps {
		// Required props
		onChange: (value: string, data: any, event: any) => void;
		value?: string;

		// Optional props
		autoComplete?: string;
		className?: string;
		containerClass?: string;
		country?: string;
		countries?: string[];
		countryOptions?: string[];
		countrySelectComponent?: React.Component<CountrySelectComponentProps, object>;
		defaultCountry?: string;
		countrySelectTabIndex?: number;
		enableSearch?: boolean;
		disabled?: boolean;
		displayInitialValueAsLocalNumber?: boolean;
		error?: string;
		ext?: React.ReactElement<string | number>;
		flagComponent?: React.Component<{ country: string; flagsPath: string; flags: FlagsMap }, object>;
		flags?: FlagsMap;
		flagsPath?: string;
		getInputClassName?: (params: { disable?: boolean; invalid?: boolean }) => string;
		id?: string | number;
		inputComponent?: React.Component<InputComponentProps, object>;
		international?: boolean;
		internationalIcon?: React.Component<object, object>;
		inputClassName?: string;
		labels?: { [key: string]: string };
		limitMaxLength?: boolean;
		metadata?: object;
		placeholder?: string;
		onCountryChange?: (countryCode?: string) => void;
		onKeyDown?: (event: React.KeyboardEvent<object>) => void;
		showCountrySelect?: boolean;
		style?: React.CSSProperties;
		disableAreaCodes?: boolean;
	}

	export default class PhoneInput extends React.Component<PhoneInputProps, object> {}
}

declare module '*.svg' {
	const content: string;
	export default content;
}

declare module 'react-anchor-link-smooth-scroll';

declare module 'react-email-editor';