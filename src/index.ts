import { html, tag } from "./component/_index.js";
import { style, event, aria, data, attr, elem } from "./interface/_index.js";
import {
	mergeAttr,
	mergeClass,
	mergeObject,
	tagConstructor,
	tagConstructorNoElement,
	isAttr,
	isHtml,
	isTag,
} from "./util.js";

import { getNode, getHtml, appendChild, prependChild, removeElement, replaceWith, replaceChild } from "./build.js";

export const core = {
	getNode,
	getHtml,
	appendChild,
	prependChild,
	removeElement,
	replaceWith,
	replaceChild,
	mergeAttr,
	mergeClass,
	mergeObject,
	tagConstructor,
	tagConstructorNoElement,
	isAttr,
	isHtml,
	isTag,
};

export { style, event, aria, data, attr, elem, tag, html };
