<script lang="ts">
import FormSkeleInput from './FormSkeleInput.svelte';
  import { page } from "$app/stores";
  import * as Form from "$components/ui/form/";
  import * as Popover from "$components/ui/popover";
  import { bottleSchema } from "$lib/BottlesDB";
  import { Button } from "$lib/components/ui/button";
  import { buttonVariants } from "$lib/components/ui/button/";
  import { Calendar } from "$lib/components/ui/calendar/";
  import { cn } from "$lib/utils";
  import * as FormCommand from "$lib/components/ui/command/";
  import {
    CalendarDate,
    getLocalTimeZone,
    parseDate,
    today,
  } from "@internationalized/date";
  import { Command, createState, defaultFilter } from "cmdk-sv";
  import { CalendarIcon, Check, ChevronsUpDown } from "lucide-svelte";
  import { tick } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import type { SuperValidated } from "sveltekit-superforms";
  import { superForm } from "sveltekit-superforms/client";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

  const crudSchema = bottleSchema.extend({
    Id: bottleSchema.shape.Id.optional(),
  });
  type CrudSchema = typeof crudSchema;
  // Formatter for "MM/DD/YYYY"
  const df = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  export let data: SuperValidated<CrudSchema>;
  // 	export let formData: SuperForm<CrudSchema>;
  export let bottles: Zod.infer<typeof bottleSchema>[];

  const formData = superForm(data, {
    validators: crudSchema,
    resetForm: true,
    onUpdated({ form }) {
      resetFormHelper(form);
    },
  });

  function resetFormHelper(form: Readonly<SuperValidated<CrudSchema>>) {
    if (form.valid) {
      placeholder = today(getLocalTimeZone());
      placeholder2 = today(getLocalTimeZone());
    }
  }

  const { form: theForm, delayed, message } = formData;
  let open = false;
  let placeholder: CalendarDate = today(getLocalTimeZone());
  let placeholder2: CalendarDate = today(getLocalTimeZone());
  let placeholder3: string = "Search year...";
  $: value1 = $theForm?.Purchased ? parseDate($theForm.Purchased) : undefined;
  $: value2 = $theForm?.Consumed ? parseDate($theForm.Consumed) : undefined;
  $: value3 = $theForm?.Vintage ? $theForm.Vintage : undefined;

  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    label: String(new Date().getFullYear() - i),
    value: new Date().getFullYear() - i,
  }));
  //yearOptions.reverse();

  let search = "";
  let filteredYearOptions = [
    {
      value: "",
      score: 0,
    },
  ];

  //first setup
  yearOptions.forEach((year) => {
    filteredYearOptions.push({
      value: year.value.toString(),
      score: customYearFilter(year.value.toString(), search),
    });
  });
  filteredYearOptions.sort((a, b) => b.score - a.score);

  $: {
    filteredYearOptions.splice(0, filteredYearOptions.length);
    yearOptions.forEach((year) => {
      const newEntry = {
        value: year.value.toString(),
        score: customYearFilter(year.value.toString(), search),
      };
      filteredYearOptions = [...filteredYearOptions, newEntry];
    });
    filteredYearOptions.sort((a, b) => b.score - a.score);
  }

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }

  function normalizeScore(score: number, maxPossibleScore: number): number {
    let normScore = score / maxPossibleScore;
    if (normScore > 0.01) {
      return normScore;
    } else {
      return 0;
    }
  }

  function customYearFilter(yearIn: string, query: string) {
    let queryNum = Number(query);
    let score = 0;
    let year = Number(yearIn);
    // Exact match
    if (query === year.toString()) {
      score += 100;
    }
    // Partial match
    else if (year.toString().startsWith(query)) {
      score += 50 * (query.length / year.toString().length);
    }
    // Recency bias
    score += 10 / Math.max(Math.abs(year - queryNum), 1);

    // Assuming a maximum possible score (adjust based on your scoring logic)
    const maxPossibleScore = 100 + 50 + 10; // Example: max score for exact match and recent year
    return Math.min(normalizeScore(score, maxPossibleScore), 1);
  }
  type fntyp = typeof customYearFilter;
  function printVariable(object: any) {
    console.log(object);
  }
  let custFilter: Writable<fntyp> = writable(customYearFilter);

  function debounce<T>(func: (...args: any[]) => T, wait: number) {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, wait);
    };
  }

  const defFilter = defaultFilter;
  const state = createState();

  $: console.log($state);
</script>

<!-- Start Form Header-->
<div class="container h-full mx-auto flex justify-center">
  <div class="px-4 text-center flex flex-col items-center space-y-2">
    <h1 class="h1">Wine Tracker!!!!</h1>
    {#if $message}
      <h3 class:invalid={$page.status >= 400}>{$message}</h3>
    {/if}
    <h3>Bottles</h3>
    <div class="grid grid-cols-2 w-full gap-7">
      <div class="bottles">
        {#each bottles as bottle}
          <a href="/bottles/{bottle.Id}">{bottle.Name}</a>
        {/each}
        {#if $theForm.Id}
          <form action="/bottles">
            <button>Create new</button>
          </form>
        {/if}
      </div>
      <div class="flex text-start">
        {#if $page.data.debug}<SuperDebug data={$theForm} collapsible />{/if}
      </div>
    </div>
    <h2>{!$theForm.Id ? "Create" : "Update"} user</h2>

    <!-- End Header, Start Form-->

    <div class="flex items-center justify-between">
      <Form.Root
        form={formData}
        controlled={true}
        schema={crudSchema}
        class="space-y-2"
        let:config
        debug={true}
        let:enhance
        asChild
      >
        <form method="POST" use:enhance>
          <input type="hidden" name="Id" bind:value={$theForm.Id} />
          <div class="grid grid-cols-2 gap-3">
            <div>
              <Form.Item>
                <Form.Field {config} name="Name">
                  <div class="flex">
                    <Form.Label class="p-0.5">Wine Name</Form.Label>
                    <Form.Validation class="ml-8" />
                  </div>
                  <Form.Input />
                  <Form.Description
                    >The name of this wine bottle.</Form.Description
                  >
                </Form.Field>
              </Form.Item>
              <Form.Item>
                <Form.Field {config} name="Producer">
                  <div class="flex">
                    <Form.Label class="p-0.5">Producer</Form.Label>
                    <Form.Validation class="ml-8" />
                  </div>
                  <Form.Input />

                  <Form.Description
                    >The producer of this wine bottle.</Form.Description
                  >
                </Form.Field>
              </Form.Item>
              <Form.Field {config} name="Vintage" let:setValue let:value>
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
                            !value3 && "text-muted-foreground"
                          )}
                        >
                          {value3 ?? placeholder3}
                          <ChevronsUpDown
                            class="ml-2 h-4 w-4 shrink-0 opacity-50"
                          />
                        </Button>
                      </Form.Control>
                    </Popover.Trigger>

                    <Popover.Content class="w-[200px] p-0">
                      <Command.Root shouldFilter={false}>
                        <!-- <CustomCmdInput {handleUpdateState} {stateStore} filterFn = {customYearFilter} autofocus placeholder="Search year..."/> -->
                        <Command.Input
                          class="input"
                          bind:value={search}
                          autofocus
                          placeholder="2020"
                        />
                        <FormCommand.Empty>No year found.</FormCommand.Empty>
                        <FormCommand.List>
                          <FormCommand.Group>
                            {#each filteredYearOptions as year}
                              <FormCommand.Item
                                value={year.value}
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
                                {year.value}
                              </FormCommand.Item>
                            {/each}
                          </FormCommand.Group>
                        </FormCommand.List>
                      </Command.Root>
                    </Popover.Content>
                  </Popover.Root>
                  <Form.Description
                    >This is the bottle's vintage</Form.Description
                  >
                  <Form.Validation />
                </Form.Item>
              </Form.Field>
              <!-- <Form.Field {config} name="Vintage">
				<Form.Item>
					<Form.Label>Vintage</Form.Label>
					<Form.Select>
						<Form.SelectTrigger placeholder="Select vintage" />
                    <Form.SelectContent>
                      {#each yearOptions as { value, label }}
                        <Form.SelectItem {value} {label}>
                          {label}
                        </Form.SelectItem>
                      {/each}
                    </Form.SelectContent>
                  </Form.Select>
                  <Form.Description>Select Vintage Year</Form.Description>
                  <Form.Validation />
                </Form.Item>
              </Form.Field> -->
              <!-- <Form.Item>
                <Form.Field {config} name="Vintage">
                  <div class="flex">
                    <Form.Label class="p-0.5">Vintage</Form.Label>
                    <Form.Validation class="ml-8" />
                  </div>
                  <FormSelectYear selected={{ value: 2020, label: "2020" }} />
                  <Form.Description
                    >The vintage of this wine bottle.</Form.Description
                  >
                </Form.Field>
              </Form.Item> -->
            </div>
            <div>
              <Form.Item>
                <Form.Field {config} name="Purchased">
                  <Form.Label>Purchased Date</Form.Label>
				  <FormSkeleInput />
                  <!-- <input
                    use:actions.input
                    class="input"
                    title="Purchased (date)"
                    type="date"
                  /> -->
                  <Form.Description
                    >The date this wine bottle was purchased</Form.Description
                  >
                  <Form.Validation />
                </Form.Field>

                <!-- <Form.Field {config} name="Purchased">
                  <Form.Label>Purchased Date</Form.Label>
                  <Popover.Root>
                    <Form.Control id="Purchased" let:attrs>
                      <Popover.Trigger
                        id="Purchased"
                        {...attrs}
                        class={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-[280px] justify-start pl-4 text-left font-normal",
                          !value1 && "text-muted-foreground"
                        )}
                      >
                        {value1
                          ? df.format(value1.toDate(getLocalTimeZone()))
                          : "Pick a date (optional)"}
                        <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
                      </Popover.Trigger>
                    </Form.Control>
                    <Popover.Content class="w-auto p-0" side="top">
                      <Calendar
                        bind:value={value1}
                        bind:placeholder
                        minValue={new CalendarDate(1990, 1, 1)}
                        maxValue={today(getLocalTimeZone())}
                        calendarLabel="Purchased Date"
                        initialFocus
                        onValueChange={(v) => {
                          if (v) {
                            $theForm.Purchased = v.toString();
                            value1 = parseDate(v.toString());
                          } else {
                            value1 = placeholder;
                          }
                        }}
                      />
                    </Popover.Content>
                  </Popover.Root>
                  <Form.Description
                    >The date this wine bottle was purchased.</Form.Description
                  >
                  <Form.Validation />
                </Form.Field> -->
              </Form.Item>
              <Form.Item>
				  <Form.Field {config} name="Consumed">
					  <Form.Label>Consumed Date</Form.Label>
					  <FormSkeleInput />
					  <Form.Description>The date this wine bottle was consumed.</Form.Description>
					  <Form.Validation />
				  </Form.Field>




                <!-- <Form.Field {config} name="Consumed">
                  <Form.Label>Consumed Date</Form.Label>
                  <Popover.Root>
                    <Form.Control id="Consumed" let:attrs>
                      <Popover.Trigger
                        id="Consumed"
                        {...attrs}
                        class={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-[280px] justify-start pl-4 text-left font-normal",
                          !value2 && "text-muted-foreground"
                        )}
                      >
                        {value2
                          ? df.format(value2.toDate(getLocalTimeZone()))
                          : "Pick a date"}
                        <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
                      </Popover.Trigger>
                    </Form.Control>
                    <Popover.Content class="w-auto p-0" side="top">
                      <Calendar
                        bind:value={value2}
                        bind:placeholder={placeholder2}
                        minValue={new CalendarDate(1990, 1, 1)}
                        maxValue={today(getLocalTimeZone())}
                        calendarLabel="Consumed Date"
                        initialFocus
                        onValueChange={(v) => {
                          if (v) {
                            $theForm.Consumed = v.toString();
                            value2 = parseDate(v.toString());
                          } else {
                            value2 = placeholder2;
                          }
                        }}
                      />
                    </Popover.Content>
                  </Popover.Root>
                  <Form.Description
                    >The date this wine bottle was consumed.</Form.Description
                  >
                  <Form.Validation />
                </Form.Field> -->
              </Form.Item>
            </div>
          </div>
          <Form.Item class="flex w-full justify-center ">
            <Form.Button class="justify-self-center btn">Submit</Form.Button>
            {#if $delayed}Working...{/if}
          </Form.Item>
        </form>
      </Form.Root>
    </div>

    <!-- <div class="flex text-start">
	{#if $page.data.debug}<SuperDebug data={$theForm} collapsible />{/if}
</div> -->
  </div>
</div>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1em;
    align-items: flex-start;
    margin-bottom: 2em;
  }

  .bottles {
    columns: 1 150px;
  }

  .bottles > * {
    display: block;
    white-space: nowrap;
    overflow-x: hidden;
  }
</style>
