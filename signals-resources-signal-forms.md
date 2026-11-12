summary: Build a small CRUD app with Angular signals for state, resources for loading data and Signal Forms for input and validation.
id: signals-resources-signal-forms
categories: Web
tags: angular, signals, devfest
status: Published
authors: Babatunde Lamidi
repo: https://github.com/babatundelmd/devfest-lagos-26-starter
Feedback Link: https://github.com/babatundelmd/devfest-lagos-26-starter/issues

# Signals, Resources, and Signal Forms: Composing Modern Angular End-to-End

## Introduction
Duration: 0:02:00

In this codelab you build the DevFest Lagos **Call for Talks** app: a small CRUD app where speakers can list, search, create, edit and delete talk proposals.

It is small on purpose. Every line of code you add is one of three ideas:

| Idea | API | Job in this app |
|---|---|---|
| **Signals** | `signal`, `computed`, `linkedSignal` | Hold state and derive new state from it |
| **Resources** | `httpResource` | Load data, with loading and error states built in |
| **Signal Forms** | `form`, `schema`, `[formField]` | Bind inputs, validate them and submit |

```
+-------------+    httpResource (GET)    +---------------+
|   Angular   | <----------------------- |  json-server  |
|     app     | -----------------------> |  api/db.json  |
+-------------+  HttpClient (POST/PUT/   +---------------+
                       DELETE)
```

### What you'll do

* **Step 4:** Connect to the API with `HttpClient`.
* **Steps 5 to 7:** Build the talks list with `httpResource`, `signal` and `computed`.
* **Steps 8 to 10:** Build the talk form with Signal Forms and submit it.
* **Step 11:** Reuse the same form to edit a talk with `linkedSignal`.

### What you'll need

* [Node.js](https://nodejs.org) 22.22 or newer
* Git and a code editor
* A web browser such as Chrome

<aside class="positive">
<strong>How this codelab works:</strong> you never type code. Each step gives you whole files to paste over the starter files. Use the copy button on each code block, then read the short "What just happened" note that follows.
</aside>

## Before you begin
Duration: 0:05:00

### Get the starter project

Clone the starter project and install its dependencies:

```bash
git clone {{repo}}
cd devfest-lagos-26-starter
npm install
```

### Start the app

```bash
npm start
```

This starts two things:

* **json-server** on port 3000. It turns `api/db.json` into a REST API.
* **The Angular dev server** on port 4200. It forwards every request that starts with `/api` to json-server.

Open [http://localhost:4200](http://localhost:4200). You should see the DevFest Lagos header and an empty Talks page.

<aside class="negative">
<strong>Port 3000 already taken?</strong> The start script picks the next free port for the API on its own and prints which one it chose. You don't need to change anything.
</aside>

### Check the tests

In a second terminal, run:

```bash
npm test
```

Four tests fail. That's expected: they test the form rules you write in step 8.

## Tour the starter project
Duration: 0:03:00

Open the project in your editor. Everything you work on is in `src/app/talks`:

| File | State |
|---|---|
| `talk.ts` | **Done.** The `Talk` type, the tracks and levels, and two helpers |
| `talk-schema.spec.ts` | **Done.** Tests for the form rules |
| `*.css` | **Done.** All the styling |
| `talks-api.ts` | Empty. You fill it in step 4 |
| `talk-list.ts` / `.html` | Placeholder. You fill them in steps 5 to 7 |
| `talk-schema.ts` | Empty. You fill it in step 8 |
| `talk-form.ts` / `.html` | Placeholder. You fill them in steps 9 to 11 |

Open `talk.ts`. This is the shape of every talk in the app:

```ts
export interface Talk {
  id: string;
  title: string;
  speaker: string;
  track: Track;
  level: Level;
  duration: number;
  abstract: string;
}

export type TalkDraft = Omit<Talk, 'id'>;
```

A `TalkDraft` is a talk without an `id`. The form works with drafts, because a new talk has no `id` until the server gives it one.

Now open `src/app/app.routes.ts`. There are three pages:

| URL | Component | Purpose |
|---|---|---|
| `/` | `TalkList` | All talks |
| `/talks/new` | `TalkForm` | Create a talk |
| `/talks/:id` | `TalkForm` | Edit a talk |

The same `TalkForm` component handles both creating and editing. You'll see how in step 11.

## Connect to the API
Duration: 0:05:00

### Look at the API

json-server gives you a full REST API for the `talks` array in `api/db.json`. With `npm start` running, open [http://localhost:4200/api/talks](http://localhost:4200/api/talks) in your browser. You get the talks as JSON.

These are the endpoints the app uses:

| Method | URL | Does |
|---|---|---|
| `GET` | `/api/talks` | List all talks |
| `GET` | `/api/talks/:id` | Get one talk |
| `POST` | `/api/talks` | Create a talk |
| `PUT` | `/api/talks/:id` | Replace a talk |
| `DELETE` | `/api/talks/:id` | Delete a talk |

Try [http://localhost:4200/api/talks/1](http://localhost:4200/api/talks/1) to see a single talk.

### Provide HttpClient

Angular apps need to opt in to `HttpClient`. Replace the contents of `src/app/app.config.ts` with the code below.

```ts
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
  ],
};
```

### Write the API service

Reading data is the job of `httpResource`, which you meet in the next step. This service handles the three writes. Replace the contents of `src/app/talks/talks-api.ts` with the code below.

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Talk, TalkDraft } from './talk';

@Injectable({ providedIn: 'root' })
export class TalksApi {
  private readonly http = inject(HttpClient);

  create(draft: TalkDraft): Promise<Talk> {
    return new Promise((resolve, reject) =>
      this.http.post<Talk>('/api/talks', draft).subscribe({ next: resolve, error: reject }),
    );
  }

  update(id: string, draft: TalkDraft): Promise<Talk> {
    return new Promise((resolve, reject) =>
      this.http.put<Talk>(`/api/talks/${id}`, { id, ...draft }).subscribe({ next: resolve, error: reject }),
    );
  }

  delete(id: string) {
    return this.http.delete(`/api/talks/${id}`);
  }
}
```

### What just happened

* `provideHttpClient(withFetch())` makes `HttpClient` available everywhere and tells it to use the browser's `fetch` API.
* `withComponentInputBinding()` was already there. It passes route parameters such as `:id` straight into component inputs. You'll use it in step 11.
* `create` and `update` wrap the request in a `Promise`. Signal Forms waits on a Promise to know when saving has finished, as you'll see in step 10.
* `delete` returns the request as it is. Nothing is sent until someone calls `.subscribe()`.

### Check it works

The terminal running `npm start` shows no errors and the app still loads. Nothing on the page changes yet, because nothing calls the service.

## Load talks with httpResource
Duration: 0:06:00

Replace the contents of `src/app/talks/talk-list.ts` with the code below.

```ts
import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Talk } from './talk';

@Component({
  selector: 'app-talk-list',
  imports: [RouterLink],
  templateUrl: './talk-list.html',
  styleUrl: './talk-list.css',
})
export default class TalkList {
  protected readonly talks = httpResource<Talk[]>(() => '/api/talks', { defaultValue: [] });
}
```

Replace the contents of `src/app/talks/talk-list.html` with the code below.

```html
<header class="page-header">
  <div>
    <h1>Talks</h1>
    <p class="lede">
      @if (talks.isLoading()) {
        Loading…
      } @else {
        {{ talks.value().length }} talks
      }
    </p>
  </div>
  <a routerLink="/talks/new" class="btn primary">+ New talk</a>
</header>

@if (talks.error()) {
  <div class="alert" role="alert">
    <p>Could not load talks. Is the API running?</p>
    <button type="button" class="btn" (click)="talks.reload()">Try again</button>
  </div>
} @else if (talks.isLoading() && talks.value().length === 0) {
  <ul class="list" aria-busy="true">
    @for (i of [1, 2, 3]; track i) {
      <li class="skeleton"></li>
    }
  </ul>
} @else {
  <ul class="list">
    @for (talk of talks.value(); track talk.id) {
      <li class="row">
        <div class="info">
          <a [routerLink]="['/talks', talk.id]" class="title">{{ talk.title }}</a>
          <p class="meta">
            <span class="track" [attr.data-track]="talk.track">{{ talk.track }}</span>
            {{ talk.speaker }} · {{ talk.level }} · {{ talk.duration }} min
          </p>
        </div>
        <div class="actions">
          <a [routerLink]="['/talks', talk.id]" class="btn">Edit</a>
        </div>
      </li>
    } @empty {
      <li class="empty">No talks yet. <a routerLink="/talks/new">Add the first one.</a></li>
    }
  </ul>
}
```

### What just happened

`httpResource` is a GET request that behaves like a signal. You give it a function that returns a URL, and it gives you back a set of signals:

| Signal | Meaning |
|---|---|
| `value()` | The data. Starts as `defaultValue`, here `[]` |
| `isLoading()` | `true` while the request is in flight |
| `error()` | The error, if the request failed |
| `hasValue()` | `true` once there is data |
| `reload()` | A method that sends the request again |

You didn't subscribe to anything or store anything by hand. The template reads the signals, and Angular updates the page whenever they change.

<aside class="positive">
The URL is a function for a reason. If it read a signal, such as a route id, the resource would send a new request every time that signal changed. You'll use exactly that in step 11.
</aside>

### Check it works

1. Refresh the app. You see 6 talks.
2. In Chrome DevTools, open the **Network** tab and set throttling to **Slow 4G**. Refresh again and watch the skeleton rows appear while the request loads. Set throttling back to **No throttling** afterwards.

## Search and filter with signal and computed
Duration: 0:05:00

Replace the contents of `src/app/talks/talk-list.ts` with the code below.

```ts
import { httpResource } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Talk, Track, TRACKS } from './talk';

@Component({
  selector: 'app-talk-list',
  imports: [RouterLink],
  templateUrl: './talk-list.html',
  styleUrl: './talk-list.css',
})
export default class TalkList {
  protected readonly talks = httpResource<Talk[]>(() => '/api/talks', { defaultValue: [] });

  protected readonly query = signal('');
  protected readonly track = signal<Track | 'All'>('All');
  protected readonly trackOptions: (Track | 'All')[] = ['All', ...TRACKS];

  protected readonly filtered = computed(() => {
    const talks = this.talks.hasValue() ? this.talks.value() : [];
    const query = this.query().trim().toLowerCase();
    const track = this.track();

    return talks.filter(
      (talk) =>
        (track === 'All' || talk.track === track) &&
        `${talk.title} ${talk.speaker}`.toLowerCase().includes(query),
    );
  });
}
```

Replace the contents of `src/app/talks/talk-list.html` with the code below.

```html
<header class="page-header">
  <div>
    <h1>Talks</h1>
    <p class="lede">
      @if (talks.isLoading()) {
        Loading…
      } @else {
        {{ filtered().length }} of {{ talks.value().length }} talks
      }
    </p>
  </div>
  <a routerLink="/talks/new" class="btn primary">+ New talk</a>
</header>

<div class="filters">
  <input
    type="search"
    placeholder="Search by title or speaker…"
    aria-label="Search talks"
    [value]="query()"
    (input)="query.set($any($event.target).value)"
  />
  <div class="chips" role="group" aria-label="Track">
    @for (option of trackOptions; track option) {
      <button
        type="button"
        class="chip"
        [attr.aria-pressed]="track() === option"
        (click)="track.set(option)"
      >
        {{ option }}
      </button>
    }
  </div>
</div>

@if (talks.error()) {
  <div class="alert" role="alert">
    <p>Could not load talks. Is the API running?</p>
    <button type="button" class="btn" (click)="talks.reload()">Try again</button>
  </div>
} @else if (talks.isLoading() && talks.value().length === 0) {
  <ul class="list" aria-busy="true">
    @for (i of [1, 2, 3]; track i) {
      <li class="skeleton"></li>
    }
  </ul>
} @else {
  <ul class="list">
    @for (talk of filtered(); track talk.id) {
      <li class="row">
        <div class="info">
          <a [routerLink]="['/talks', talk.id]" class="title">{{ talk.title }}</a>
          <p class="meta">
            <span class="track" [attr.data-track]="talk.track">{{ talk.track }}</span>
            {{ talk.speaker }} · {{ talk.level }} · {{ talk.duration }} min
          </p>
        </div>
        <div class="actions">
          <a [routerLink]="['/talks', talk.id]" class="btn">Edit</a>
        </div>
      </li>
    } @empty {
      <li class="empty">
        @if (talks.value().length) {
          No talks match your search.
        } @else {
          No talks yet. <a routerLink="/talks/new">Add the first one.</a>
        }
      </li>
    }
  </ul>
}
```

### What just happened

* `query` and `track` are **writable signals**. The search box calls `query.set(...)` on every keystroke, and each chip calls `track.set(...)` when clicked.
* `filtered` is a **computed signal**. It reads `talks`, `query` and `track`, so Angular knows to recalculate it when any of them changes, and only then.
* The list now loops over `filtered()` instead of `talks.value()`.

There is no event wiring between the search box and the list. The list depends on `filtered`, which depends on `query`, and Angular follows that chain for you.

### Check it works

1. Type `flutter` in the search box. Only 1 talk is left, and the header reads "1 of 6 talks".
2. Clear the search and click the **AI** chip. Only the 2 AI talks are left.
3. Type something that matches nothing. You see "No talks match your search."

## Delete with an optimistic update
Duration: 0:05:00

Replace the contents of `src/app/talks/talk-list.ts` with the code below.

```ts
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Talk, Track, TRACKS } from './talk';
import { TalksApi } from './talks-api';

@Component({
  selector: 'app-talk-list',
  imports: [RouterLink],
  templateUrl: './talk-list.html',
  styleUrl: './talk-list.css',
})
export default class TalkList {
  private readonly api = inject(TalksApi);

  protected readonly talks = httpResource<Talk[]>(() => '/api/talks', { defaultValue: [] });

  protected readonly query = signal('');
  protected readonly track = signal<Track | 'All'>('All');
  protected readonly trackOptions: (Track | 'All')[] = ['All', ...TRACKS];

  protected readonly filtered = computed(() => {
    const talks = this.talks.hasValue() ? this.talks.value() : [];
    const query = this.query().trim().toLowerCase();
    const track = this.track();

    return talks.filter(
      (talk) =>
        (track === 'All' || talk.track === track) &&
        `${talk.title} ${talk.speaker}`.toLowerCase().includes(query),
    );
  });

  protected delete(talk: Talk): void {
    if (!confirm(`Delete "${talk.title}"?`)) return;
    this.talks.update((talks) => talks.filter((t) => t.id !== talk.id));
    this.api.delete(talk.id).subscribe({ error: () => this.talks.reload() });
  }
}
```

Replace the contents of `src/app/talks/talk-list.html` with the code below. The only change is the new **Delete** button next to **Edit**.

```html
<header class="page-header">
  <div>
    <h1>Talks</h1>
    <p class="lede">
      @if (talks.isLoading()) {
        Loading…
      } @else {
        {{ filtered().length }} of {{ talks.value().length }} talks
      }
    </p>
  </div>
  <a routerLink="/talks/new" class="btn primary">+ New talk</a>
</header>

<div class="filters">
  <input
    type="search"
    placeholder="Search by title or speaker…"
    aria-label="Search talks"
    [value]="query()"
    (input)="query.set($any($event.target).value)"
  />
  <div class="chips" role="group" aria-label="Track">
    @for (option of trackOptions; track option) {
      <button
        type="button"
        class="chip"
        [attr.aria-pressed]="track() === option"
        (click)="track.set(option)"
      >
        {{ option }}
      </button>
    }
  </div>
</div>

@if (talks.error()) {
  <div class="alert" role="alert">
    <p>Could not load talks. Is the API running?</p>
    <button type="button" class="btn" (click)="talks.reload()">Try again</button>
  </div>
} @else if (talks.isLoading() && talks.value().length === 0) {
  <ul class="list" aria-busy="true">
    @for (i of [1, 2, 3]; track i) {
      <li class="skeleton"></li>
    }
  </ul>
} @else {
  <ul class="list">
    @for (talk of filtered(); track talk.id) {
      <li class="row">
        <div class="info">
          <a [routerLink]="['/talks', talk.id]" class="title">{{ talk.title }}</a>
          <p class="meta">
            <span class="track" [attr.data-track]="talk.track">{{ talk.track }}</span>
            {{ talk.speaker }} · {{ talk.level }} · {{ talk.duration }} min
          </p>
        </div>
        <div class="actions">
          <a [routerLink]="['/talks', talk.id]" class="btn">Edit</a>
          <button type="button" class="btn danger" (click)="delete(talk)">Delete</button>
        </div>
      </li>
    } @empty {
      <li class="empty">
        @if (talks.value().length) {
          No talks match your search.
        } @else {
          No talks yet. <a routerLink="/talks/new">Add the first one.</a>
        }
      </li>
    }
  </ul>
}
```

### What just happened

`delete` does three things, in this order:

1. **`this.talks.update(...)`** removes the talk from the resource's value straight away. The list and the count update before the server has even replied. This is called an **optimistic update**.
2. **`this.api.delete(talk.id).subscribe(...)`** sends the `DELETE` request.
3. **`error: () => this.talks.reload()`** runs only if the server refuses. The resource fetches the real list again, and the talk comes back.

A resource's value isn't read-only. `set` and `update` change it locally until the next request replaces it.

### Check it works

1. Delete a talk. It disappears at once.
2. Refresh the page. It's still gone, because json-server saved the change to `api/db.json`.

<aside class="positive">
Want your talks back? Stop the app, run <code>npm run db:reset</code>, then run <code>npm start</code> again.
</aside>

## Define the form rules with a schema
Duration: 0:05:00

Before building the form, you describe what a valid talk looks like. Replace the contents of `src/app/talks/talk-schema.ts` with the code below.

```ts
import { max, maxLength, min, minLength, required, schema, validate } from '@angular/forms/signals';
import { TalkDraft } from './talk';

export const talkSchema = schema<TalkDraft>((talk) => {
  required(talk.title, { message: 'Give your talk a title' });
  maxLength(talk.title, 80, { message: 'Keep the title under 80 characters' });

  required(talk.speaker, { message: 'Who is giving this talk?' });

  min(talk.duration, 15, { message: 'Talks are at least 15 minutes' });
  max(talk.duration, 90, { message: 'Talks are at most 90 minutes' });

  validate(talk.duration, ({ value, valueOf }) =>
    valueOf(talk.level) === 'Advanced' && value() < 45
      ? { kind: 'tooShort', message: 'Advanced talks need at least 45 minutes' }
      : undefined,
  );

  required(talk.abstract, { message: 'Tell attendees what the talk is about' });
  minLength(talk.abstract, 50, {
    message: ({ value }) => `A little more detail please (${value().length}/50 characters)`,
  });
});
```

### What just happened

* `schema<TalkDraft>(...)` gives you a typed path to every field: `talk.title`, `talk.duration`, and so on. A typo is a compile error.
* `required`, `min`, `max`, `minLength` and `maxLength` are built-in rules. Each one takes a message to show the user.
* `validate` is a custom rule. It uses `valueOf(talk.level)` to read a **different** field, so this rule depends on two fields. Change the level and the duration error appears or disappears straight away.

The schema has no idea it will be used in a form. That makes it easy to test on its own, which is exactly what `talk-schema.spec.ts` does.

### Check it works

Run the tests again:

```bash
npm test
```

All 5 tests pass.

## Build the form
Duration: 0:07:00

First create the component that shows a field's error message. Create `src/app/talks/field-error.ts` with the code below.

```ts
import { Component, input } from '@angular/core';
import { FieldState } from '@angular/forms/signals';

@Component({
  selector: 'app-field-error',
  template: `
    @let state = field();
    @if (state.touched() && state.invalid()) {
      <p>{{ state.errors()[0].message }}</p>
    }
  `,
  host: { 'aria-live': 'polite' },
  styles: `p { margin: .375rem 0 0; font-size: .875rem; color: var(--red); }`,
})
export class FieldError {
  readonly field = input.required<FieldState<unknown>>();
}
```

Replace the contents of `src/app/talks/talk-form.ts` with the code below.

```ts
import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { FieldError } from './field-error';
import { emptyDraft, LEVELS, TalkDraft, TRACKS } from './talk';
import { talkSchema } from './talk-schema';

@Component({
  selector: 'app-talk-form',
  imports: [RouterLink, FormField, FormRoot, FieldError, JsonPipe],
  templateUrl: './talk-form.html',
  styleUrl: './talk-form.css',
})
export default class TalkForm {
  protected readonly tracks = TRACKS;
  protected readonly levels = LEVELS;

  protected readonly model = signal<TalkDraft>(emptyDraft());

  protected readonly form = form(this.model, talkSchema);
}
```

Replace the contents of `src/app/talks/talk-form.html` with the code below.

```html
<a routerLink="/" class="back">← All talks</a>

<h1>New talk</h1>

<form [formRoot]="form" class="card">
  <div class="field">
    <label for="title">Title</label>
    <input id="title" [formField]="form.title" />
    <app-field-error [field]="form.title()" />
  </div>

  <div class="field">
    <label for="speaker">Speaker</label>
    <input id="speaker" [formField]="form.speaker" />
    <app-field-error [field]="form.speaker()" />
  </div>

  <div class="row">
    <div class="field">
      <label for="track">Track</label>
      <select id="track" [formField]="form.track">
        @for (track of tracks; track track) {
          <option [value]="track">{{ track }}</option>
        }
      </select>
    </div>

    <div class="field">
      <label for="level">Level</label>
      <select id="level" [formField]="form.level">
        @for (level of levels; track level) {
          <option [value]="level">{{ level }}</option>
        }
      </select>
    </div>

    <div class="field">
      <label for="duration">Minutes</label>
      <input id="duration" type="number" step="5" [formField]="form.duration" />
    </div>
  </div>
  <app-field-error [field]="form.duration()" />

  <div class="field">
    <label for="abstract">Abstract</label>
    <textarea id="abstract" rows="5" [formField]="form.abstract"></textarea>
    <app-field-error [field]="form.abstract()" />
  </div>

  <div class="actions">
    <button type="submit" class="btn primary">Create talk</button>
    <a routerLink="/" class="btn">Cancel</a>
  </div>
</form>

<pre>{{ model() | json }}</pre>
```

### What just happened

* **The model is a plain signal.** `model` holds a `TalkDraft`, and it is the single source of truth for the form.
* **`form(this.model, talkSchema)`** wraps that signal in a **field tree**. `form.title`, `form.duration` and the rest each point at one part of the model, with your schema's rules attached.
* **`[formField]="form.title"`** binds an input to a field in both directions. Typing updates `model`, and changing `model` updates the input. It works the same for text inputs, number inputs, selects and textareas.
* **`form.title()`** (with the parentheses) gives you the field's **state**: `value()`, `valid()`, `errors()`, `touched()` and more, all signals. `FieldError` reads that state and shows the first error once the user has left the field.
* **`[formRoot]="form"`** connects the `<form>` element to the field tree. It also stops the browser from reloading the page when the form is submitted.

The `<pre>` at the bottom is temporary. It prints the model so you can watch it change.

### Check it works

1. Click **+ New talk**. Type in the **Title** box and watch the JSON under the form update with every keystroke.
2. Click into **Speaker**, then click somewhere else. "Who is giving this talk?" appears.
3. Set **Level** to **Advanced** and **Minutes** to `30`, then leave the field. "Advanced talks need at least 45 minutes" appears. Change the level to **Beginner** and it disappears.
4. Click **Create talk**. Nothing happens yet. That's the next step.

## Submit the form
Duration: 0:05:00

Replace the contents of `src/app/talks/talk-form.ts` with the code below.

```ts
import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { FieldError } from './field-error';
import { emptyDraft, LEVELS, TalkDraft, TRACKS } from './talk';
import { talkSchema } from './talk-schema';
import { TalksApi } from './talks-api';

@Component({
  selector: 'app-talk-form',
  imports: [RouterLink, FormField, FormRoot, FieldError],
  templateUrl: './talk-form.html',
  styleUrl: './talk-form.css',
})
export default class TalkForm {
  private readonly api = inject(TalksApi);
  private readonly router = inject(Router);

  protected readonly tracks = TRACKS;
  protected readonly levels = LEVELS;

  protected readonly model = signal<TalkDraft>(emptyDraft());

  protected readonly form = form(this.model, talkSchema, {
    submission: {
      action: async (field) => {
        try {
          await this.api.create(field().value());
          await this.router.navigate(['/']);
          return undefined;
        } catch {
          return { kind: 'server', message: 'Could not save the talk. Please try again.' };
        }
      },
    },
  });
}
```

Replace the contents of `src/app/talks/talk-form.html` with the code below.

```html
<a routerLink="/" class="back">← All talks</a>

<h1>New talk</h1>

<form [formRoot]="form" class="card">
  <div class="field">
    <label for="title">Title</label>
    <input id="title" [formField]="form.title" />
    <app-field-error [field]="form.title()" />
  </div>

  <div class="field">
    <label for="speaker">Speaker</label>
    <input id="speaker" [formField]="form.speaker" />
    <app-field-error [field]="form.speaker()" />
  </div>

  <div class="row">
    <div class="field">
      <label for="track">Track</label>
      <select id="track" [formField]="form.track">
        @for (track of tracks; track track) {
          <option [value]="track">{{ track }}</option>
        }
      </select>
    </div>

    <div class="field">
      <label for="level">Level</label>
      <select id="level" [formField]="form.level">
        @for (level of levels; track level) {
          <option [value]="level">{{ level }}</option>
        }
      </select>
    </div>

    <div class="field">
      <label for="duration">Minutes</label>
      <input id="duration" type="number" step="5" [formField]="form.duration" />
    </div>
  </div>
  <app-field-error [field]="form.duration()" />

  <div class="field">
    <label for="abstract">Abstract</label>
    <textarea id="abstract" rows="5" [formField]="form.abstract"></textarea>
    <app-field-error [field]="form.abstract()" />
  </div>

  @for (error of form().errors(); track $index) {
    <p class="server-error" role="alert">{{ error.message }}</p>
  }

  <div class="actions">
    <button type="submit" class="btn primary" [disabled]="form().submitting()">
      {{ form().submitting() ? 'Saving…' : 'Create talk' }}
    </button>
    <a routerLink="/" class="btn">Cancel</a>
  </div>
</form>
```

### What just happened

The third argument to `form()` holds the **submission action**. When the user submits, Signal Forms:

1. Marks every field as touched, so all the error messages show.
2. Stops if the form is invalid. Your action never runs with bad data.
3. Sets `submitting()` to `true` and calls your action.
4. Waits for the Promise your action returns, then sets `submitting()` back to `false`.

What the action returns decides what happens next:

* **`undefined`** means it worked. Here, you've already navigated back to the list.
* **An error object** is attached to the form. The template shows it through `form().errors()`.

This is why `TalksApi.create` returns a Promise: `submitting()` stays `true` exactly as long as the request takes.

### Check it works

1. Click **Create talk** on the empty form. Every error message appears at once.
2. Fill the form in properly and click **Create talk**. The button reads "Saving…", then you're back on the list with your new talk at the bottom.
3. **Test a server error:** open a new talk form and fill it in. In DevTools, open the **Network** tab and set throttling to **Offline**. Click **Create talk** and "Could not save the talk. Please try again." appears. Set throttling back to **No throttling** afterwards.

## Edit a talk with linkedSignal
Duration: 0:06:00

The `/talks/:id` route already points at `TalkForm`. Now teach the form to load an existing talk and save changes to it.

Replace the contents of `src/app/talks/talk-form.ts` with the code below.

```ts
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { FieldError } from './field-error';
import { emptyDraft, LEVELS, Talk, TalkDraft, toDraft, TRACKS } from './talk';
import { talkSchema } from './talk-schema';
import { TalksApi } from './talks-api';

@Component({
  selector: 'app-talk-form',
  imports: [RouterLink, FormField, FormRoot, FieldError],
  templateUrl: './talk-form.html',
  styleUrl: './talk-form.css',
})
export default class TalkForm {
  private readonly api = inject(TalksApi);
  private readonly router = inject(Router);

  protected readonly tracks = TRACKS;
  protected readonly levels = LEVELS;

  readonly id = input<string>();
  protected readonly isEdit = computed(() => this.id() !== undefined);

  protected readonly talk = httpResource<Talk>(() =>
    this.id() ? `/api/talks/${this.id()}` : undefined,
  );

  protected readonly model = linkedSignal<TalkDraft>(() =>
    this.talk.hasValue() ? toDraft(this.talk.value()) : emptyDraft(),
  );

  protected readonly form = form(this.model, talkSchema, {
    submission: {
      action: async (field) => {
        const draft = field().value();
        const id = this.id();
        try {
          if (id) {
            await this.api.update(id, draft);
          } else {
            await this.api.create(draft);
          }
          await this.router.navigate(['/']);
          return undefined;
        } catch {
          return { kind: 'server', message: 'Could not save the talk. Please try again.' };
        }
      },
    },
  });
}
```

Replace the contents of `src/app/talks/talk-form.html` with the code below.

```html
<a routerLink="/" class="back">← All talks</a>

<h1>{{ isEdit() ? 'Edit talk' : 'New talk' }}</h1>

@if (talk.error()) {
  <div class="alert" role="alert">
    <p>We couldn't find that talk.</p>
    <a routerLink="/" class="btn">Back to all talks</a>
  </div>
} @else if (talk.isLoading()) {
  <div class="card" aria-busy="true">
    <div class="skeleton" style="block-size: 2.5rem"></div>
    <div class="skeleton" style="block-size: 2.5rem"></div>
    <div class="skeleton" style="block-size: 8rem"></div>
  </div>
} @else {
  <form [formRoot]="form" class="card">
    <div class="field">
      <label for="title">Title</label>
      <input id="title" [formField]="form.title" />
      <app-field-error [field]="form.title()" />
    </div>

    <div class="field">
      <label for="speaker">Speaker</label>
      <input id="speaker" [formField]="form.speaker" />
      <app-field-error [field]="form.speaker()" />
    </div>

    <div class="row">
      <div class="field">
        <label for="track">Track</label>
        <select id="track" [formField]="form.track">
          @for (track of tracks; track track) {
            <option [value]="track">{{ track }}</option>
          }
        </select>
      </div>

      <div class="field">
        <label for="level">Level</label>
        <select id="level" [formField]="form.level">
          @for (level of levels; track level) {
            <option [value]="level">{{ level }}</option>
          }
        </select>
      </div>

      <div class="field">
        <label for="duration">Minutes</label>
        <input id="duration" type="number" step="5" [formField]="form.duration" />
      </div>
    </div>
    <app-field-error [field]="form.duration()" />

    <div class="field">
      <label for="abstract">Abstract</label>
      <textarea id="abstract" rows="5" [formField]="form.abstract"></textarea>
      <app-field-error [field]="form.abstract()" />
    </div>

    @for (error of form().errors(); track $index) {
      <p class="server-error" role="alert">{{ error.message }}</p>
    }

    <div class="actions">
      <button type="submit" class="btn primary" [disabled]="form().submitting()">
        {{ form().submitting() ? 'Saving…' : isEdit() ? 'Save changes' : 'Create talk' }}
      </button>
      <a routerLink="/" class="btn">Cancel</a>
    </div>
  </form>
}
```

### What just happened

Four pieces fit together:

1. **`id = input<string>()`** receives `:id` from the URL, thanks to `withComponentInputBinding()` from step 4. On `/talks/new` there is no `:id`, so it stays `undefined`.
2. **`httpResource`** reads `this.id()`. When the URL function returns `undefined`, the resource sends no request at all. So the same component loads a talk when editing and does nothing when creating.
3. **`linkedSignal`** is a writable signal whose starting value comes from other signals. Here the starting value is the loaded talk, or an empty draft. The form can then write to it freely, and if the talk ever reloads, the model resets to the new data.
4. **The submission action** calls `update` when there is an `id`, and `create` when there isn't.

<aside class="positive">
Why not use a plain <code>signal</code> for the model? A plain signal is set once, before the talk has loaded. A <code>computed</code> would follow the talk but can't be written to, so the form couldn't change it. <code>linkedSignal</code> is both: it follows its source and accepts writes.
</aside>

### Check it works

1. Click **Edit** on any talk. You briefly see the loading skeleton, then the form, filled in with that talk.
2. Change the title and click **Save changes**. The list shows the new title.
3. Open [http://localhost:4200/talks/does-not-exist](http://localhost:4200/talks/does-not-exist). You see "We couldn't find that talk."
4. Click **+ New talk**. The form is empty and the button reads **Create talk**.

## Congratulations
Duration: 0:02:00

You built a complete CRUD app with modern Angular, and every piece of state in it is a signal.

### What you used

| API | Where |
|---|---|
| `httpResource` | Loading the list, and loading one talk by id |
| `signal` | The search query and the track filter |
| `computed` | The filtered list, and `isEdit` |
| `linkedSignal` | The form model that follows the loaded talk |
| `schema`, `validate` | The form rules, including one that reads two fields |
| `form`, `[formField]`, `[formRoot]` | Binding and submitting the form |
| `HttpClient` | Creating, updating and deleting |

### What's next

* Read the [Signals guide](https://angular.dev/guide/signals) and the [Resource guide](https://angular.dev/guide/signals/resource) on angular.dev.
* Read the [Signal Forms guide](https://angular.dev/guide/forms/signals/overview).
* Show a live character count under the abstract, using `computed`.
* Add a new rule to `talkSchema`, then write a test for it in `talk-schema.spec.ts`.

### Reset your data

To get the original talks back at any time:

```bash
npm run db:reset
```

Thank you for building with us at DevFest Lagos 2026.
