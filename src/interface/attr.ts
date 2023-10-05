import { aria } from "./aria.js";
import { data } from "./data.js";
import { elem } from "./elem.js";
import { event } from "./event.js";
import { style } from "./style.js";

export interface attr {
	id?: string;
	class?: string | (string | undefined)[];
	accesskey?: string;
	contenteditable?: "true";
	dir?: string;
	draggable?: string;
	lang?: string;
	spellcheck?: string;
	tabindex?: string | number;
	title?: string;
	translate?: string;

	hidden?: boolean;
	itemscope?: boolean;
	nomodule?: boolean;
	playsinline?: boolean;
	truespeed?: boolean;

	role?: string;

	width?: string | number;
	height?: string | number;

	data?: data;
	aria?: aria;
	on?: event;
	style?: style;
	elem?: elem | elem[];
}

export interface attrWithHref extends attr {
	href?: string;
}
