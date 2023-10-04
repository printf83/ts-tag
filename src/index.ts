import { html } from "./html.js";
import { tag } from "./tag.js";
import { style, event, aria, data, attr, elem } from "./interface.js";
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

export { getNode, getHtml, appendChild, prependChild, removeElement, replaceWith, replaceChild };
export { mergeAttr, mergeClass, mergeObject, tagConstructor, tagConstructorNoElement, isAttr, isHtml, isTag };
export { style, event, aria, data, attr, elem, tag, html };
