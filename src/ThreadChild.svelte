<script lang="ts">
  import type { Thread } from "./api";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { P } from "$lib/components/ui/typography";
  import { Button } from "$lib/components/ui/button";
  import { StarFilled } from "svelte-radix";

  export let onClickReply: any;
  export let onClickExpand: any;
  export let child: Thread;

  $: onExpand = onClickExpand(child);
  $: onReply = onClickReply(child);
</script>

<Card class="cursor-pointer border-2">
  <CardHeader>
    <CardTitle>{child.createdBy}</CardTitle>
    <CardDescription class="flex space-x-1">
      <span>{child.createdAt.toDateString()}</span>
      <span>&middot;</span>
      <span class="inline-flex items-center space-x-1">
        <span>{child.likes}</span>
        <span>
          <StarFilled />
        </span>
      </span>
    </CardDescription>
  </CardHeader>
  <CardContent>
    <P>{child.content}</P>
  </CardContent>
  <CardFooter class="flex-col space-y-4">
    {#if child.children}
      <Button class="w-full" variant="secondary" on:click={onExpand}>
        View whole thread
      </Button>
    {/if}
    <Button variant="default" class="w-full" on:click={onReply}>Reply</Button>
  </CardFooter>
</Card>
