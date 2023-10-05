import { elementWithAbortController, attr } from "./interface/_index.js";

const detachEvent = (elem: Element | elementWithAbortController) => {
	if ("AbortController" in elem) {
		const AbortController = (elem as elementWithAbortController).AbortController;
		if (AbortController) {
			console.info(`Deattach all event from $1`, elem);
			AbortController.abort();

			elem.AbortController = undefined;
			delete elem.AbortController;
		}
	}
};

export const addEvent = (name: string, elem: string | Element | elementWithAbortController, fn: EventListener) => {
	if (typeof elem === "string") {
		let e = document.querySelectorAll(elem);
		if (e) {
			e.forEach((i) => {
				addEvent(name, i, fn);
			});
		}
	} else {
		//create detachEventListener db
		if ("AbortController" in elem) {
			if (typeof elem.AbortController === "undefined") {
				elem.AbortController = new AbortController();
				elem.classList.add("bs-destroy-event");
			}

			//add event to element
			//using signal to remove listerner
			if (name === "build" || name === "destroy") {
				elem.addEventListener(name, fn, {
					signal: elem.AbortController.signal,
					once: true,
				});
			} else {
				elem.addEventListener(name, fn, {
					signal: elem.AbortController.signal,
				});
			}
		} else {
			(elem as elementWithAbortController).AbortController = new AbortController();
			elem.classList.add("bs-destroy-event");

			//add event to element
			//using signal to remove listerner
			if (name === "build" || name === "destroy") {
				elem.addEventListener(name, fn, {
					signal: (elem as elementWithAbortController).AbortController!.signal,
					once: true,
				});
			} else {
				elem.addEventListener(name, fn, {
					signal: (elem as elementWithAbortController).AbortController!.signal,
				});
			}
		}

		console.info(`Attach ${name} event to $1`, elem);
	}
};

export const removeEvent = (elem: string | Element | elementWithAbortController) => {
	if (typeof elem === "string") {
		let e = document.querySelectorAll(elem);
		if (e) {
			e.forEach((i) => {
				removeEvent(i);
			});
		}
	} else {
		if (elem) {
			let c = elem?.childNodes;

			//remove event from child
			if (c?.length > 0) {
				let d = Array.from(c).map((i) => i as elementWithAbortController);

				d.forEach((e) => {
					removeEvent(e);
				});
			}

			//detach event from elem
			detachEvent(elem);
		}
	}
};

export const hasBuildAndDestroyEvent = (attr: attr) => {
	let hasBuild = false;
	let hasDestroy = false;

	if (attr && typeof attr.on !== "undefined") {
		let prop = Object.keys(attr.on);
		if (prop && prop.length > 0) {
			hasDestroy = true;
			if (prop.indexOf("build") > -1) {
				hasBuild = true;
			}
		}
	}

	return { hasBuild, hasDestroy };
};
