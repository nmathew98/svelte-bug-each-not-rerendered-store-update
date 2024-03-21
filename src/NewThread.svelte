<script lang="ts">
	import {
		Card,
		CardHeader,
		CardContent,
		CardTitle,
		CardFooter,
	} from "$lib/components/ui/card";
	import { faker } from "@faker-js/faker";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Button } from "$lib/components/ui/button";
	import { upsertThread, type Thread } from "./api";

	export let dispatch: any;

	const name = faker.person.fullName();
	let content = "";

	const onSubmitNewThread = async () => {
		const newThread = await upsertThread({
			createdBy: name,
			content: content,
			likes: 0,
		});

		// Dispatch and create a new `Thread`
		dispatch(allThreads => [newThread, ...allThreads]);

		content = "";
	};

	const onKeyDown = event => {
		if (event.key !== "Enter" || !content) {
			return;
		}

		event.preventDefault();

		return onSubmitNewThread();
	};
</script>

<Card class="w-[42rem] border-2">
	<CardHeader>
		<CardTitle>{name}</CardTitle>
	</CardHeader>
	<CardContent>
		<Textarea
			bind:value={content}
			on:keydown={onKeyDown}
			placeholder="Share a thought...?" />
	</CardContent>
	<CardFooter>
		<Button on:click={onSubmitNewThread} disabled={!content} class="w-full">
			Submit
		</Button>
	</CardFooter>
</Card>
