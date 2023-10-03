import { attachAttr } from "./attr.js";
import { html } from "./html.js";
import { elem } from "./interface.js";
import { tag } from "./tag.js";
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

export { mergeAttr, mergeClass, mergeObject, tagConstructor, tagConstructorNoElement, isAttr, isHtml, isTag };

const htmlToElement = (strHTML: string) => {
	var template = document.createElement("div");
	strHTML = strHTML.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = strHTML;
	return template.firstChild;
};

const processElem = (opt: {
	item: elem;
	parent: tag;
	container: Element;
	stringBuilder?: (str: string) => elem | elem[];
}) => {
	if (opt.item !== null) {
		if (isTag(opt.item)) {
			let t = build({ container: opt.container, element: opt.item as tag });
			opt.container = t ? t : opt.container;
		} else if (isHtml(opt.item)) {
			let t = build({ container: opt.container, element: opt.item as html });
			opt.container = t ? t : opt.container;
		} else {
			//only pre is html
			let typeOfItem = typeof opt.item;
			let str: string = "";
			if (typeOfItem === "number") {
				str = opt.item.toString();
			} else if (typeOfItem === "string") {
				str = opt.item as string;
			} else {
				throw new Error(`Unsupported element type:${typeOfItem}`);
			}

			if (opt.parent.tag === "pre" || opt.parent.tag === "code") {
				opt.container.insertAdjacentText("beforeend", str);
			} else {
				if (opt.stringBuilder) {
					const m = opt.stringBuilder(str);
					if (typeof m === "string") {
						opt.container.appendChild(document.createTextNode(m));
					} else {
						if (Array.isArray(m)) {
							m.forEach((j) => {
								opt.container = processElem({
									item: j,
									parent: opt.parent,
									container: opt.container,
									stringBuilder: opt.stringBuilder,
								});
							});
						} else {
							opt.container = processElem({
								item: m,
								parent: opt.parent,
								container: opt.container,
								stringBuilder: opt.stringBuilder,
							});
						}
					}
				} else {
					opt.container.insertAdjacentText("beforeend", str);
				}
			}
		}
	}

	return opt.container;
};

const build = (opt: {
	element: elem | elem[];
	container: Element;
	append?: boolean;
	beforeElement?: Element | ChildNode;
	stringBuilder?: (str: string) => elem | elem[];
}): Element => {
	opt.append ??= true;

	if (opt.element) {
		opt.element = Array.isArray(opt.element) ? opt.element : [opt.element];

		if (opt.element.length > 0) {
			opt.element.forEach((e) => {
				if (e !== null) {
					if (isTag(e)) {
						let element = e.attr
							? attachAttr(document.createElement(e.tag), e.attr!)
							: document.createElement(e.tag);

						if (e.elem) {
							e.elem = Array.isArray(e.elem) ? e.elem : [e.elem];

							e.elem.forEach((i) => {
								element = processElem({
									item: i,
									parent: e,
									container: element,
									stringBuilder: opt.stringBuilder,
								});
							});
						}

						if (opt.append) {
							if (opt.beforeElement) {
								opt.container.insertBefore(element, opt.beforeElement);
							} else {
								opt.container.appendChild(element);
							}
						} else {
							if (opt.container.childElementCount > 0) {
								if (opt.beforeElement) {
									opt.container.insertBefore(element, opt.beforeElement);
									opt.beforeElement = element;
								} else {
									opt.container.insertBefore(element, opt.container.firstChild);
								}
							} else {
								opt.container.appendChild(element);
							}
						}
					} else if (isHtml(e)) {
						let generatedHtmlElement = htmlToElement(e.elem!);

						if (generatedHtmlElement) {
							if (opt.append) {
								if (opt.beforeElement) {
									opt.container.insertBefore(generatedHtmlElement, opt.beforeElement);
								} else {
									opt.container.appendChild(generatedHtmlElement);
								}
							} else {
								if (opt.container.childElementCount > 0) {
									if (opt.beforeElement) {
										opt.container.insertBefore(generatedHtmlElement, opt.beforeElement);
										opt.beforeElement = generatedHtmlElement;
									} else {
										opt.container.insertBefore(generatedHtmlElement, opt.container.firstChild);
									}
								} else {
									opt.container.appendChild(generatedHtmlElement);
								}
							}
						}
					}
				}
			});
		}
	}

	return opt.container;
};

export const getNode = (
	element: elem | elem[],
	stringBuilder?: (str: string) => elem | elem[]
): Element | Element[] | null => {
	let container = build({ container: document.createElement("div"), element: element, stringBuilder: stringBuilder });
	let childCount = container.childElementCount;
	if (childCount === 0) return null;
	if (childCount === 1) return container.firstChild as Element;
	return Array.from(container.childNodes).map((i) => i as Element);
};

export const getHtml = (element: elem | elem[], stringBuilder?: (str: string) => elem | elem[]): string => {
	let container = build({ container: document.createElement("div"), element: element, stringBuilder: stringBuilder });
	let result = container.innerHTML;
	removeElement(container);
	return result;
};

export const appendChild = (
	container: Element,
	element: elem | elem[],
	stringBuilder?: (str: string) => elem | elem[]
): Element => {
	container = build({ container: container, element: element, stringBuilder: stringBuilder });
	return container;
};

export const prependChild = (
	container: Element,
	element: elem | elem[],
	stringBuilder?: (str: string) => elem | elem[]
): Element => {
	container = build({ container: container, element: element, append: false, stringBuilder: stringBuilder });
	return container;
};

export const removeElement = (element: Element) => {
	if (element.nodeType !== 3) {
		const listOfElem = element.getElementsByClassName("bs-destroy-event");
		if (listOfElem && listOfElem.length > 0) {
			while (element.firstChild) {
				removeElement(element.firstChild as Element);
			}
		}
	}

	element.remove();
};

export const replaceWith = (
	elementToReplace: Element,
	element: elem | elem[],
	stringBuilder?: (str: string) => elem | elem[]
): Element | undefined => {
	let parent = elementToReplace.parentNode as Element;
	if (parent) {
		parent = build({
			container: parent,
			element: element,
			append: true,
			beforeElement: elementToReplace,
			stringBuilder: stringBuilder,
		});
		removeElement(elementToReplace);
		return parent;
	}
};

export const replaceChild = (
	container: Element,
	element: elem | elem[],
	stringBuilder?: (str: string) => elem | elem[]
): Element => {
	while (container.firstChild) {
		removeElement(container.firstChild as Element);
	}

	container = build({ container: container, element: element, stringBuilder: stringBuilder });
	return container;
};
