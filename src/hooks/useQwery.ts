import { derived, get, writable } from "svelte/store";

export const useQwery = ({ initialValue }: any): any => {
	const qwery = writable<any | null>(null);

	const rerender = () =>
		qweryPromise.then(result => {
			if (!result) {
				return;
			}

			qwery.set(result);
		});

	const computeInitialValue = async () => {
		if (typeof initialValue === "object") {
			return initialValue;
		}

		return await initialValue();
	};

	const create = async () => ({
		crdt: {
			data: await computeInitialValue(),
			dispatch(f) {
				this.data = f(this.data);

				rerender();

				return this.data;
			},
			versions: [],
		},
	});

	const assign = async (value: ReturnType<typeof create>) => {
		const awaitedQwery = await value;

		if (!awaitedQwery) {
			return;
		}

		qwery.set(awaitedQwery);

		return awaitedQwery;
	};

	const qweryPromise = assign(create());

	let value;
	const dispatch = new Proxy(noOpFunction, {
		apply: (noOpFunction, _thisArg, args) => {
			value ??= get(qwery);

			if (!value?.crdt.dispatch) {
				return noOpFunction();
			}

			const result = value.crdt.dispatch(...args);

			return result;
		},
	});

	return {
		data: derived(
			qwery,
			$qwery =>
				$qwery?.crdt.data ??
				(typeof initialValue !== "function" ? initialValue : null),
		),
		dispatch,
		versions: derived(qwery, $qwery => $qwery?.crdt.versions),
	};
};

const noOpFunction = () => {};
