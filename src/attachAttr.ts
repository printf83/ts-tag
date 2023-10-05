import { attachFn, elementWithAbortController, attrWithHref, attr } from "./interface/_index.js";
import { addEvent, hasBuildAndDestroyEvent } from "./event.js";
import { addClassIntoElement, camel2Dash, keyOfType } from "./util.js";

const CONVERTHASHTOVOID = true;

const BOOLATTR = [
	"allowfullscreen",
	"allowpaymentrequest",
	"async",
	"autofocus",
	"autoplay",
	"checked",
	"indeterminate",
	"controls",
	"default",
	"defer",
	"disabled",
	"formnovalidate",
	"novalidate",
	"noValidate",
	"hidden",
	"ismap",
	"itemscope",
	"loop",
	"multiple",
	"muted",
	"nomodule",
	"open",
	"playsinline",
	"readOnly",
	"readonly",
	"required",
	"reversed",
	"sandbox",
	"selected",
	"truespeed",
];

const cleanupAttr: attachFn = (key, elem, attr) => {
	let changed = false;
	let k = keyOfType(key, attr);
	if (attr && typeof attr[k] !== "undefined" && attr[k] === null) {
		delete attr[k];
		changed = true;
	}

	return { attr, elem, changed };
};

const attachAria: attachFn = (key, elem, attr) => {
	let changed = false;
	if (key === "aria") {
		if (attr && typeof attr.aria !== "undefined") {
			let prop = Object.keys(attr.aria);
			if (prop && prop.length > 0) {
				for (let x = 0; x < prop.length; x++) {
					if (attr.aria[prop[x]!] !== undefined) {
						elem.setAttribute(`aria-${prop[x]}`, attr.aria[prop[x]!]!.toString());
					}
				}
			}

			changed = true;
		}
	}

	return { attr, elem, changed };
};

const attachBoolean: attachFn = (key, elem, attr) => {
	let changed = false;

	if (key) {
		if (BOOLATTR.indexOf(key) > -1) {
			let k = keyOfType(key, attr);

			if (attr && typeof attr[k] !== "undefined") {
				if (attr[k] === true) {
					if (key === "indeterminate") {
						(<HTMLInputElement>elem).indeterminate = true;
					} else {
						elem.setAttribute(key, key);
					}
				}

				changed = true;
			}
		}
	}

	return { attr, elem, changed };
};

const attachClass: attachFn = (key, elem, attr) => {
	let changed = false;
	if (key === "class") {
		if (attr && typeof attr.class !== "undefined") {
			elem = addClassIntoElement(elem, attr.class);

			changed = true;
		}
	}

	return { attr, elem, changed };
};

const attachData: attachFn = (key, elem, attr) => {
	let changed = false;
	if (key === "data") {
		if (attr && typeof attr.data !== "undefined") {
			let prop = Object.keys(attr.data);
			if (prop && prop.length > 0) {
				for (let x = 0; x < prop.length; x++) {
					if (attr.data[prop[x]!] !== undefined) {
						elem.setAttribute(`data-${prop[x]}`, attr.data[prop[x]!]!.toString());
					}
				}
			}

			changed = true;
		}
	}

	return { attr, elem, changed };
};

const attachEvent: attachFn = (key, elem, attr) => {
	let changed = false;
	if (key === "on") {
		if (attr && typeof attr.on !== "undefined") {
			let prop = Object.keys(attr.on);
			if (prop && prop.length > 0) {
				for (let x = 0; x < prop.length; x++) {
					if (typeof attr.on[prop[x]!] === "function") {
						addEvent(prop[x]!, elem as elementWithAbortController, attr.on[prop[x]!]!);
					}
				}
			}

			changed = true;
		}
	}

	return { attr, elem, changed };
};

const attachHref: attachFn = (key, elem, attr: attrWithHref) => {
	let changed = false;
	if (key === "href") {
		if (attr && typeof attr.href !== "undefined") {
			let i = Array.isArray(attr.href) ? attr.href.join(" ") : attr.href;

			if (CONVERTHASHTOVOID) {
				if (i === "#") {
					elem.setAttribute("rel", "nofollow");
					elem.setAttribute("href", "javascript:void(0);");
				} else {
					elem.setAttribute("href", i);
				}
			} else {
				elem.setAttribute("href", i);
			}

			changed = true;
		}
	}

	return { attr, elem, changed };
};

const attachStyle: attachFn = (key, elem, attr) => {
	let changed = false;
	if (key === "style") {
		if (attr && typeof attr.style !== "undefined") {
			let i = Object.keys(attr.style);

			if (i && i.length > 0) {
				for (let x = 0; x < i.length; x++) {
					let k = keyOfType(i[x], attr.style);

					if (attr.style[k]) {
						if (attr.style[k]!.indexOf(" !important") > -1) {
							(<HTMLElement>elem).style.setProperty(
								camel2Dash(i[x]),
								attr.style[k]!.replace(" !important", ""),
								"important"
							);
						} else {
							(<HTMLElement>elem).style.setProperty(camel2Dash(i[x]), attr.style[k]!);
						}
					}
				}
			}

			changed = true;
		}
	}

	return { attr, elem, changed };
};

const attachOther: attachFn = (key, elem, attr) => {
	let changed = false;

	if (key && attr && typeof attr !== "undefined") {
		let k = keyOfType(key, attr);
		let i = Array.isArray(attr[k]) ? attr[k] : attr[k];
		elem.setAttribute(key, i!.toString());
		changed = true;
	}

	return { attr, elem, changed };
};

const attrFn: attachFn[] = [
	cleanupAttr,
	attachBoolean,
	attachData,
	attachAria,
	attachEvent,
	attachStyle,
	attachClass,
	attachHref,
	attachOther,
];

export const attachAttr = (elem: Element, attr: attr): Element => {
	if (attr) {
		let d = Object.assign({}, attr);

		//add hasdestroy and hasbuild
		let { hasBuild, hasDestroy } = hasBuildAndDestroyEvent(d);
		if (hasBuild || hasDestroy) {
			if (d.class) {
				if (Array.isArray(d.class)) {
					if (hasBuild) d.class.push("bs-build-event");
					if (hasDestroy) d.class.push("bs-destroy-event");
				} else {
					let o = d.class.split(" ");
					if (hasBuild) o.push("bs-build-event");
					if (hasDestroy) o.push("bs-destroy-event");
					d.class = o.join(" ");
				}
			} else {
				d.class = [];
				if (hasBuild) d.class.push("bs-build-event");
				if (hasDestroy) d.class.push("bs-destroy-event");
			}
		}

		//convert to attribute
		let prop = Object.keys(d);
		if (prop) {
			let propLength = prop.length;
			let attrFnLength = attrFn.length;

			for (let x = 0; x < propLength; x++) {
				let handleByAttrFn = false;
				let k = keyOfType(prop[x], d);

				for (let y = 0; y < attrFnLength; y++) {
					if (typeof d[k] !== "undefined" && d[k] !== null) {
						if (y === attrFnLength - 1 && handleByAttrFn) {
							break;
						}

						let { elem: e, attr: a, changed: c } = attrFn[y]!(prop[x], elem, d);
						if (c) {
							handleByAttrFn = true;
							elem = e;
							d = a;
						}
					} else {
						break;
					}
				}
			}
		}
	}

	return elem;
};
