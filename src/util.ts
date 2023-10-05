import { html, tag } from "./component/_index.js";
import { attr } from "./interface/_index.js";

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

const string2Array = (d: string | undefined | (string | undefined)[]) => {
	let result: undefined | (string | undefined)[];
	if (typeof d === "string") {
		result = d.split(" ");
	} else {
		result = d;
	}

	return result;
};

export const mergeClass = (
	target: string | undefined | (string | undefined)[],
	source: string | undefined | (string | undefined)[]
): string[] => {
	target = string2Array(target);
	source = string2Array(source);

	let result: string[] = [];

	if (target) {
		if (source) {
			result = removeEmptyArray([...target, ...source]);
		} else {
			result = removeEmptyArray(target);
		}
	} else {
		if (source) {
			result = removeEmptyArray(source);
		}
	}

	return result.filter((value, index) => result.indexOf(value) === index);
};

export const mergeObject = <T extends attr>(target?: T, source?: T): T | never => {
	if (target) {
		if (source) {
			let a_class = target.class;
			let b_class = source.class;
			let a_style = target.style;
			let b_style = source.style;
			let a_aria = target.aria;
			let b_aria = source.aria;
			let a_data = target.data;
			let b_data = source.data;
			let a_on = target.on;
			let b_on = source.on;

			let result = mergeAttr(target, source);

			result.class = mergeClass(a_class, b_class);
			result.style = mergeAttr(a_style, b_style);
			result.aria = mergeAttr(a_aria, b_aria);
			result.data = mergeAttr(a_data, b_data);
			result.on = mergeAttr(a_on, b_on);

			return result;
		} else {
			return target;
		}
	} else {
		if (source) {
			return source;
		} else {
			throw new Error("Please provide target or source");
		}
	}
};

export const mergeAttr = <T>(target: T | undefined, source: T | undefined): T => {
	return Object.assign({}, target, source);
};

export const tagConstructorNoElement = <T extends attr>(arg: any[]): T => {
	if (arg.length === 1) {
		return arg[0] as T;
	} else {
		return {} as T;
	}
};

export const tagConstructor = <T extends attr>(prop: string, arg: any[]): T => {
	if (arg.length === 1) {
		if (isAttr<T>(arg[0])) {
			return arg[0] as T;
		} else {
			return { [prop]: arg[0] } as T;
		}
	} else if (arg.length === 2) {
		return mergeObject<T>({ [prop]: arg[1] } as T, arg[0]);
	} else {
		return {} as T;
	}
};
