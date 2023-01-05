import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import BaseService from './base.service';

export interface SignUpInterface {
	brandId?: number | undefined;
	spaceId?: string;
	companyId?: string | undefined;
	company?: { name: string; about?: string; image?: string; members?: number[] };
	phone: number;
	username: string;
	email: string;
	password: string;
	teamName?: string;
	firstname: string;
	lastname: string;
}

interface SignIn {
	username: string;
	password: string;
	inviteToTeamId?: string | number | undefined;
}

interface BaseResp {
	message: string;
	data: any;
	code: number;
	status: string;
}

export default class AuthService extends BaseService {
	baseEndpoint = 'auth';

	/**
	 * Sign up
	 * @param data
	 */
	async signUp(data: SignUpInterface): Promise<{ expiresIn: number; accessToken: string; userData: UserInterface }> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/sign-up`, data });
	}

	/**
	 * Log in user
	 * @param data
	 */
	async login(data: SignIn): Promise<{ accessToken?: string; expiresIn?: number }> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/login`, data });
	}

	/**
	 * Validate email
	 * @param data
	 */
	async validateEmail(data: { email: string; userId?: number | string | undefined }): Promise<{ valid: boolean }> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/validate-email`, data });
	}

	/**
	 * Verify OTP code
	 * @param {string} phone - User phone number
	 * @param {string} code - OTP code
	 * @returns Promise<{accessToken?: string | undefined}>
	 */
	async verifyCode(phone: string, code: string): Promise<{ accessToken?: string | undefined; hash?: string | undefined }> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/code-verify`, data: { phone, code } });
	}

	/**
	 * Sent OTP code
	 * @param {string} phone - User phone number
	 */
	async sendAuthCode(phone: string): Promise<{ data: string }> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/code-send`, data: { phone } });
	}

	/**
	 * Forgot password
	 * @param data
	 */
	async forgotPassword(data: { email: string }): Promise<BaseResp> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/forgot-password`, data });
	}

	/**
	 * Forgot password validate
	 * @param data
	 */
	async forgotPasswordValidate(data: { token: string }): Promise<BaseResp> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/forgot-password-validate`, data });
	}

	/**
	 * Forgot password confirm
	 * @param data
	 */
	async forgotPasswordConfirm(data: { token: string }): Promise<BaseResp> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/forgot-password-confirm`, data });
	}

	/**
	 * Validate username
	 * @param data
	 */
	async validateUsername(data: { username: string; userId?: number | string | undefined }): Promise<{ valid: boolean }> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/validate-username`, data });
	}

	/**
	 * Validate phone number
	 * @param data
	 */
	async validatePhone(data: { phone: string; userId?: number | string | undefined }): Promise<{ valid: boolean }> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/validate-phone`, data });
	}

	/**
	 * Check if already exist
	 * @param data
	 */
	async checkExist(data: { email?: string; username?: string }): Promise<{ exist: boolean }> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/check-exist`, data });
	}

	/**
	 * refresh token
	 */
	async refreshToken(): Promise<any> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/refresh-token` });
	}
}
