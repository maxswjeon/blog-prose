export default class ResponseDTO {
	private _status = 200;
	private _headers: Record<string, string> = {};

	status(status: number) {
		this._status = status;
		return this;
	}

	header(key: string, value: string) {
		this._headers[key] = value;
		return this;
	}

	json(data: Record<string, unknown>) {
		return new Response(JSON.stringify(data), {
			status: this._status,
			headers: this._headers,
		});
	}

	text(data: string) {
		return new Response(data, {
			status: this._status,
			headers: this._headers,
		});
	}

	static status(status: number) {
		return new ResponseDTO().status(status);
	}

	static header(key: string, value: string) {
		return new ResponseDTO().header(key, value);
	}

	static json(data: Record<string, unknown>) {
		return new ResponseDTO().json(data);
	}

	static text(data: string) {
		return new ResponseDTO().text(data);
	}
}

export type ResponseWithData<T> = {
	result: true;
	data: T;
};
