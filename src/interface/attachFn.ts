import { attr } from "./attr.js";

export type attachFn = (
	key: string | undefined,
	elem: Element,
	attr: attr
) => {
	elem: Element;
	attr: attr;
	changed: boolean;
};
