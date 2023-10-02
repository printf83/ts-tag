export class html {
	public ishtml = true;
	public elem?: string;

	constructor();
	constructor(elem: string);
	constructor(...arg: any[]) {
		if (arg) {
			if (Array.isArray(arg)) {
				this.elem = arg.join("");
			} else {
				this.elem = arg;
			}
		} else {
			this.elem = "";
		}
	}
}
