import React from 'react';

export default function UploadFileHelper(event: React.ChangeEvent<HTMLInputElement>): Promise<string> {
	return new Promise((resolve, reject) => {
		if (event.target.files && event.target.files.length) {
			const reader = new window.FileReader();
			const allowedExtension = ['image/jpeg', 'image/png'];
			const file = event.target.files[0];

			if (!allowedExtension.includes(file.type)) {
				reject(new Error('Not allowed file extension. Allowed: .jpg, .jpeg, .png'));
			}

			if (file.size > 5e6) {
				reject(new Error('You image size can not exceed 5mb'));
			}

			reader.onloadend = () => {
				resolve(reader.result as string);
			};

			reader.readAsDataURL(file);
		}
	});
}
