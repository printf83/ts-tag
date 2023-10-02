import { html } from "./html.js";
import { attr } from "./interface.js";
import { tag } from "./tag.js";

export const isTag = <T extends tag>(obj: any): obj is T => {
	return typeof obj === "object" && !Array.isArray(obj) && "istag" in obj && obj["istag"] === true;
};

export const isHtml = <T extends html>(obj: any): obj is T => {
	return typeof obj === "object" && !Array.isArray(obj) && "ishtml" in obj && obj["ishtml"] === true;
};

export const isAttr = <T extends attr>(obj: any): obj is T => {
	return typeof obj === "object" && !Array.isArray(obj) && !("istag" in obj) && !("ishtml" in obj);
};

export const keyOfType = <T>(key: string | undefined, obj: T) => {
	type result = keyof typeof obj;
	return key as result;
};

const removeEmptyArray = <T>(arr: T[]): Exclude<T, undefined>[] => {
	return arr.filter(Boolean) as Exclude<T, undefined>[];
};

const manageClass = (value: string | undefined | (string | undefined)[]): string[] => {
	let result: string[] = [];
	let t: (string | undefined)[];
	let i: string[] = [];

	if (Array.isArray(value)) {
		t = value;
	} else {
		t = [value];
	}

	//remove null
	i = removeEmptyArray(t);

	//make sure every class not have whitespace
	if (i && i.length > 0) {
		for (let x = 0; x < i.length; x++) {
			let j = i[x];
			if (j) {
				let h: string[] = [];

				if (j.indexOf(" ") > -1) {
					h = j.split(" ");
					h = removeEmptyArray(h);

					if (h && h.length > 0) {
						for (let y = 0; y < h.length; y++) {
							if (h[y] !== undefined) {
								result.push(h[y]!);
							}
						}
					}
				} else {
					result.push(j);
				}
			}
		}
	}

	return result && result.length > 0 ? result : [];
};

export const addClassIntoElement = (elem: Element, value: string | undefined | (string | undefined)[]): Element => {
	try {
		let i = manageClass(value);
		if (i && i.length > 0) {
			elem.classList.add(...i);
		}
	} catch (error) {
		console.error(`Fail to add class ${value}`, error);
	}

	return elem;
};

export const camel2Dash = (value?: string): string => {
	if (value) {
		return value.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
	} else {
		return "";
	}
};
