export class elementWithAbortController extends HTMLElement {
	constructor(public AbortController?: AbortController) {
		super();
	}
}
