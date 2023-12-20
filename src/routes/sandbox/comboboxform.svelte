<script lang="ts" context="module">
  import { bottleSchema } from "$lib/BottlesDB";
  import { z } from "zod";

  const languages = [
    { label: "English", value: "en" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Chinese", value: "zh" },
  ] as const;

  type Language = (typeof languages)[number]["value"];

  export const crudSchema = bottleSchema.extend({
    Id: bottleSchema.shape.Id.optional(),
  });

  export const formSchema = z.object({
    vintage: z.coerce.number().min(1900).max(new Date().getFullYear()),
  });

  export type CrudSchema = typeof crudSchema;
  export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import * as Command from "$lib/components/ui/command";
  import * as Form from "$lib/components/ui/form";
  import * as Popover from "$lib/components/ui/popover";
  import { cn } from "$utils";
  import { Check, ChevronsUpDown } from "lucide-svelte";
  import { tick } from "svelte";
  import type { SuperValidated } from "sveltekit-superforms";
  export let form: SuperValidated<FormSchema> = $page.data.combobox;

  let open = false;

  const yearOptions = Array.from({ length: 100 }, (_, i) => ({
    label: String(new Date().getFullYear() - i),
    value: new Date().getFullYear() - i,
  }));

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<Form.Root
  {form}
  schema={formSchema}
  let:config
  method="POST"
  action="?/combobox"
  class="space-y-6"
>
  <Form.Field {config} name="vintage" let:setValue let:value>
    <Form.Item class="flex flex-col">
      <Form.Label>Vintage</Form.Label>
      <Popover.Root bind:open let:ids>
        <Popover.Trigger asChild let:builder>
          <Form.Control id={ids.trigger} let:attrs>
            <Button
              builders={[builder]}
              {...attrs}
              variant="outline"
              role="combobox"
              type="button"
              class={cn(
                "w-[200px] justify-between",
                !value && "text-muted-foreground"
              )}
            >
              {yearOptions.find((v) => v.value === value)?.label ??
                "Select year"}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </Form.Control>
        </Popover.Trigger>
        <Popover.Content class="w-[200px] p-0">
          <Command.Root>
            <Command.Input autofocus placeholder="Search year..." />
            <Command.Empty>No year found.</Command.Empty>
            <Command.List>
              <Command.Group>
                {#each yearOptions as year}
                  <Command.Item
                    value={year.label}
                    onSelect={() => {
                      console.log("on select firing");
                      setValue(year.value);
                      closeAndFocusTrigger(ids.trigger);
                    }}
                  >
                    <Check
                      class={cn(
                        "mr-2 h-4 w-4",
                        year.value !== value && "text-transparent"
                      )}
                    />
                    {year.label}
                  </Command.Item>
                {/each}
              </Command.Group>
            </Command.List>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
      <Form.Description>This is the bottle's vintage</Form.Description>
      <Form.Validation />
    </Form.Item>
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</Form.Root>
