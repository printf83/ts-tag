import { html, tag } from "./component/_index.js";
import {
	style as _style,
	event as _event,
	aria as _aria,
	data as _data,
	attr as _attr,
	elem as _elem,
} from "./interface/_index.js";
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
import { addEvent, removeEvent, hasBuildAndDestroyEvent } from "./event.js";
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
	addEvent,
	removeEvent,
	hasBuildAndDestroyEvent,
};

export namespace I {
	export type style = _style;
	export type event = _event;
	export type aria = _aria;
	export type data = _data;
	export type attr = _attr;
	export type elem = _elem;
}

export const I = {
	tag,
	html,
};
