summary: Build small CRUD app with Angular signals for state, resources to load data, and Signal Forms for input and validation.

# Signals, Resources, and Signal Forms: Composing Modern Angular End-to-End

## Introduction

For dis codelab, you go build the DevFest Lagos **Call for Talks** app: small CRUD app wey speakers fit use list, search, create, edit and delete their talk proposals.

We make am small on purpose. Every line of code wey you go add na one of these three ideas:

| Idea | API | Wetin e dey do for dis app |
|---|---|---|
| **Signals** | `signal`, `computed`, `linkedSignal` | E dey hold state, and e dey use am form new state |
| **Resources** | `httpResource` | E dey load data, with loading and error state already inside |
| **Signal Forms** | `form`, `schema`, `[formField]` | E dey bind input, check say e correct, and submit am |

<<code>>

### Wetin you go do

* **Step 4:** Connect to the API with `HttpClient`.
* **Step 5 reach 7:** Build the talks list with `httpResource`, `signal` and `computed`.
* **Step 8 reach 10:** Build the talk form with Signal Forms and submit am.
* **Step 11:** Use the same form edit talk with `linkedSignal`.

### Wetin you go need

* [Node.js](https://nodejs.org) 22.22 or newer one
* Git and code editor
* Browser like Chrome

<aside class="positive">
<strong>How dis codelab dey work:</strong> you no go type code at all. Every step go give you full files wey you go paste on top the starter files. Use the copy button for each code block, then read the short "Wetin just happen" note wey follow am.
</aside>

## Before you start

### Get the starter project

Clone the starter project and install wetin e need:

<<code>>

### Start the app

<<code>>

Dis one go start two things:

* **json-server** for port 3000. E dey turn `api/db.json` to REST API.
* **The Angular dev server** for port 4200. Any request wey start with `/api`, e go pass am give json-server.

Open [http://localhost:4200](http://localhost:4200). You go see the DevFest Lagos header and empty Talks page.

<aside class="negative">
<strong>Another thing don collect port 3000?</strong> The start script go pick the next free port for the API by itself, and e go print the one wey e choose. You no need change anything.
</aside>

### Check the tests

Open second terminal, run:

<<code>>

Four tests go fail. Na so e suppose be: dem dey test the form rules wey you go write for step 8.

## Waka round the starter project

Open the project for your editor. Everything wey you go work on dey inside `src/app/talks`:

| File | How e be |
|---|---|
| `talk.ts` | **E don finish.** The `Talk` type, the tracks and levels, and two helpers |
| `talk-schema.spec.ts` | **E don finish.** Tests for the form rules |
| `*.css` | **E don finish.** All the styling |
| `talks-api.ts` | Empty. You go fill am for step 4 |
| `talk-list.ts` / `.html` | Placeholder. You go fill dem for step 5 reach 7 |
| `talk-schema.ts` | Empty. You go fill am for step 8 |
| `talk-form.ts` / `.html` | Placeholder. You go fill dem for step 9 reach 11 |

Open `talk.ts`. Na dis one be the shape of every talk for the app:

<<code>>

`TalkDraft` na talk wey no get `id`. The form dey work with drafts, because new talk no go get `id` until server give am one.

Now open `src/app/app.routes.ts`. Three pages dey:

| URL | Component | Wetin e dey for |
|---|---|---|
| `/` | `TalkList` | All the talks |
| `/talks/new` | `TalkForm` | Create talk |
| `/talks/:id` | `TalkForm` | Edit talk |

Na the same `TalkForm` component dey handle create and edit. You go see how for step 11.

## Connect to the API

### Look the API

json-server dey give you full REST API for the `talks` array wey dey inside `api/db.json`. As `npm start` dey run, open [http://localhost:4200/api/talks](http://localhost:4200/api/talks) for your browser. You go see the talks as JSON.

Na these endpoints the app dey use:

| Method | URL | Wetin e dey do |
|---|---|---|
| `GET` | `/api/talks` | List all the talks |
| `GET` | `/api/talks/:id` | Bring one talk |
| `POST` | `/api/talks` | Create talk |
| `PUT` | `/api/talks/:id` | Replace talk |
| `DELETE` | `/api/talks/:id` | Delete talk |

Try [http://localhost:4200/api/talks/1](http://localhost:4200/api/talks/1) to see only one talk.

### Provide HttpClient

Angular apps need to opt in before dem fit use `HttpClient`. Replace everything wey dey inside `src/app/app.config.ts` with dis code:

<<code>>

### Write the API service

Na `httpResource` dey do the reading, and you go meet am for the next step. Dis service dey handle the three writes. Replace everything wey dey inside `src/app/talks/talks-api.ts` with dis code:

<<code>>

### Wetin just happen

* `provideHttpClient(withFetch())` make `HttpClient` available everywhere, and e tell am make e use the browser `fetch` API.
* `withComponentInputBinding()` don dey there before. E dey pass route parameters like `:id` straight enter component inputs. You go use am for step 11.
* `create` and `update` wrap the request inside `Promise`. Signal Forms dey wait for Promise to know when saving don finish. You go see am for step 10.
* `delete` dey return the request as e be. Nothing go send until somebody call `.subscribe()`.

### Check say e dey work

The terminal wey `npm start` dey run no show any error, and the app still dey load. Nothing go change for the page yet, because nobody dey call the service.

## Load talks with httpResource

Replace everything wey dey inside `src/app/talks/talk-list.ts` with dis code:

<<code>>

Replace everything wey dey inside `src/app/talks/talk-list.html` with dis code:

<<code>>

### Wetin just happen

`httpResource` na GET request wey dey behave like signal. You go give am function wey dey return URL, and e go give you back some signals:

| Signal | Meaning |
|---|---|
| `value()` | The data. E start as `defaultValue`, wey be `[]` here |
| `isLoading()` | E go be `true` while the request still dey go |
| `error()` | The error, if the request fail |
| `hasValue()` | E go be `true` once data don land |
| `reload()` | Method wey go send the request again |

You no subscribe to anything, you no store anything by hand. The template dey read the signals, and Angular go update the page anytime dem change.

<aside class="positive">
Na reason make the URL be function. If e read signal like route id, the resource go send new request every time that signal change. Na exactly wetin you go use for step 11.
</aside>

### Check say e dey work

1. Refresh the app. You go see 6 talks.
2. For Chrome DevTools, open the **Network** tab and set throttling to **Slow 4G**. Refresh again, watch the skeleton rows show while the request dey load. After, set throttling back to **No throttling**.

## Search and filter with signal and computed

Replace everything wey dey inside `src/app/talks/talk-list.ts` with dis code:

<<code>>

Replace everything wey dey inside `src/app/talks/talk-list.html` with dis code:

<<code>>

### Wetin just happen

* `query` and `track` na **writable signals**. The search box dey call `query.set(...)` anytime you press key, and each chip dey call `track.set(...)` when you click am.
* `filtered` na **computed signal**. E dey read `talks`, `query` and `track`, so Angular know say make e calculate am again when any of dem change, and only that time.
* The list now dey loop over `filtered()` instead of `talks.value()`.

No event wiring dey between the search box and the list. The list depend on `filtered`, `filtered` depend on `query`, and Angular dey follow that chain for you.

### Check say e dey work

1. Type `flutter` for the search box. Only 1 talk go remain, and the header go read "1 of 6 talks".
2. Clear the search and click the **AI** chip. Only the 2 AI talks go remain.
3. Type something wey no match anything. You go see "No talks match your search."

## Delete with optimistic update

Replace everything wey dey inside `src/app/talks/talk-list.ts` with dis code:

<<code>>

Replace everything wey dey inside `src/app/talks/talk-list.html` with dis code. Only change na the new **Delete** button wey dey near **Edit**.

<<code>>

### Wetin just happen

`delete` dey do three things, for dis order:

1. **`this.talks.update(...)`** remove the talk from the resource value sharp sharp. The list and the count go update before server even reply. Dem dey call am **optimistic update**.
2. **`this.api.delete(talk.id).subscribe(...)`** send the `DELETE` request.
3. **`error: () => this.talks.reload()`** go run only if server refuse. The resource go fetch the real list again, and the talk go come back.

Resource value no be read-only. `set` and `update` dey change am for your side until the next request replace am.

### Check say e dey work

1. Delete one talk. E go disappear immediately.
2. Refresh the page. E still don go, because json-server don save the change inside `api/db.json`.

<aside class="positive">
You want your talks back? Stop the app, run <code>npm run db:reset</code>, then run <code>npm start</code> again.
</aside>

## Write the form rules with schema

Before you build the form, you go first describe how correct talk suppose look. Replace everything wey dey inside `src/app/talks/talk-schema.ts` with dis code:

<<code>>

### Wetin just happen

* `schema<TalkDraft>(...)` dey give you typed path to every field: `talk.title`, `talk.duration`, and the rest. If you mistake type am, e go be compile error.
* `required`, `min`, `max`, `minLength` and `maxLength` na rules wey Angular already get. Each one dey collect message wey e go show the user.
* `validate` na custom rule. E dey use `valueOf(talk.level)` read **another** field, so dis rule depend on two fields. Change the level and the duration error go show or comot immediately.

The schema no know say na form go use am. That one make am easy to test on its own, and na exactly wetin `talk-schema.spec.ts` dey do.

### Check say e dey work

Run the tests again:

<<code>>

All 5 tests go pass.

## Build the form

First create the component wey dey show field error message. Create `src/app/talks/field-error.ts` with dis code:

<<code>>

Replace everything wey dey inside `src/app/talks/talk-form.ts` with dis code:

<<code>>

Replace everything wey dey inside `src/app/talks/talk-form.html` with dis code:

<<code>>

### Wetin just happen

* **The model na plain signal.** `model` dey hold `TalkDraft`, and na im be the only source of truth for the form.
* **`form(this.model, talkSchema)`** wrap that signal inside **field tree**. `form.title`, `form.duration` and the rest each dey point to one part of the model, with your schema rules attached.
* **`[formField]="form.title"`** bind input to field both ways. Typing go update `model`, and if `model` change, the input go update. E dey work the same way for text inputs, number inputs, selects and textareas.
* **`form.title()`** (with the bracket) dey give you the field **state**: `value()`, `valid()`, `errors()`, `touched()` and more, all of dem na signals. `FieldError` dey read that state and e go show the first error once the user don leave the field.
* **`[formRoot]="form"`** connect the `<form>` element to the field tree. E still dey stop the browser from reloading the page when you submit the form.

The `<pre>` wey dey for down na temporary. E dey print the model so you fit watch am change.

### Check say e dey work

1. Click **+ New talk**. Type for the **Title** box and watch the JSON under the form update anytime you press key.
2. Click enter **Speaker**, then click another place. "Who is giving this talk?" go show.
3. Set **Level** to **Advanced** and **Minutes** to `30`, then leave the field. "Advanced talks need at least 45 minutes" go show. Change the level to **Beginner** and e go comot.
4. Click **Create talk**. Nothing go happen yet. Na the next step be that.

## Submit the form

Replace everything wey dey inside `src/app/talks/talk-form.ts` with dis code:

<<code>>

Replace everything wey dey inside `src/app/talks/talk-form.html` with dis code:

<<code>>

### Wetin just happen

The third thing wey you pass to `form()` dey hold the **submission action**. When user submit, Signal Forms go:

1. Mark every field as touched, so all the error messages go show.
2. Stop if the form no correct. Your action no go ever run with bad data.
3. Set `submitting()` to `true` and call your action.
4. Wait for the Promise wey your action return, then set `submitting()` back to `false`.

Wetin the action return na im go decide wetin go happen next:

* **`undefined`** mean say e work. Here, you don already carry the user go back to the list.
* **Error object** go attach to the form. The template dey show am through `form().errors()`.

Na why `TalksApi.create` dey return Promise: `submitting()` go remain `true` exactly as long as the request take.

### Check say e dey work

1. Click **Create talk** for the empty form. Every error message go show at once.
2. Fill the form well and click **Create talk**. The button go read "Saving…", then you go land back for the list with your new talk for the bottom.
3. **Test server error:** open new talk form and fill am. For DevTools, open the **Network** tab and set throttling to **Offline**. Click **Create talk** and "Could not save the talk. Please try again." go show. After, set throttling back to **No throttling**.

## Edit talk with linkedSignal

The `/talks/:id` route don already dey point to `TalkForm`. Now make we teach the form how to load talk wey dey before and save changes to am.

Replace everything wey dey inside `src/app/talks/talk-form.ts` with dis code:

<<code>>

Replace everything wey dey inside `src/app/talks/talk-form.html` with dis code:

<<code>>

### Wetin just happen

Four pieces join body:

1. **`id = input<string>()`** dey collect `:id` from the URL, thanks to `withComponentInputBinding()` from step 4. For `/talks/new`, no `:id` dey, so e go remain `undefined`.
2. **`httpResource`** dey read `this.id()`. When the URL function return `undefined`, the resource no go send any request at all. So the same component dey load talk when you dey edit, and e no dey do anything when you dey create.
3. **`linkedSignal`** na writable signal wey get starting value from other signals. Here, the starting value na the talk wey load, or empty draft. The form fit write enter am anyhow, and if the talk load again, the model go reset to the new data.
4. **The submission action** dey call `update` when `id` dey, and `create` when e no dey.

<aside class="positive">
Why we no use plain <code>signal</code> for the model? Plain signal go set only once, before the talk don load. <code>computed</code> go follow the talk but you no fit write enter am, so the form no go fit change am. <code>linkedSignal</code> na both: e dey follow im source and e dey accept writes.
</aside>

### Check say e dey work

1. Click **Edit** for any talk. You go see the loading skeleton small, then the form go show, filled with that talk.
2. Change the title and click **Save changes**. The list go show the new title.
3. Open [http://localhost:4200/talks/does-not-exist](http://localhost:4200/talks/does-not-exist). You go see "We couldn't find that talk."
4. Click **+ New talk**. The form go dey empty and the button go read **Create talk**.

## Congratulations

You don build complete CRUD app with modern Angular, and every piece of state inside am na signal.

### Wetin you use

| API | Where |
|---|---|
| `httpResource` | To load the list, and to load one talk by id |
| `signal` | The search query and the track filter |
| `computed` | The filtered list, and `isEdit` |
| `linkedSignal` | The form model wey dey follow the talk wey load |
| `schema`, `validate` | The form rules, including one wey dey read two fields |
| `form`, `[formField]`, `[formRoot]` | To bind and submit the form |
| `HttpClient` | To create, update and delete |

### Wetin next

* Read the [Signals guide](https://angular.dev/guide/signals) and the [Resource guide](https://angular.dev/guide/signals/resource) for angular.dev.
* Read the [Signal Forms guide](https://angular.dev/guide/forms/signals/overview).
* Show live character count under the abstract, with `computed`.
* Add new rule to `talkSchema`, then write test for am inside `talk-schema.spec.ts`.

### Reset your data

To get the original talks back anytime:

<<code>>

Thank you say you build with us for DevFest Lagos 2026.
