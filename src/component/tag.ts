import { elem, attr } from "../interface/_index.js";
import { isAttr } from "../util.js";

export class tag {
	public istag = true;

	public tag: string = "div";
	public elem?: elem | elem[];
	public attr?: attr;

	constructor();
	constructor(tag: string);
	constructor(tag: string, attr: attr);
	constructor(tag: string, elem: elem | elem[]);
	constructor(tag: string, attr: attr, elem: elem | elem[]);
	constructor(...arg: any[]) {
		if (arg) {
			if (arg.length === 1) {
				this.tag = arg[0];
			} else if (arg.length === 2) {
				this.tag = arg[0];

				if (isAttr(arg[1])) {
					this.elem = arg[1].elem;

					delete arg[1].elem;
					this.attr = arg[1];
				} else {
					this.elem = arg[1];
				}
			} else if (arg.length === 3) {
				delete arg[1].elem;

				this.tag = arg[0];
				this.attr = arg[1];
				this.elem = arg[2];
			} else {
				this.tag = "div";
			}
		} else {
			this.tag = "div";
		}
	}
}
