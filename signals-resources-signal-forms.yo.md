summary: Kọ́ app CRUD kékeré pẹ̀lú Angular signals fún state, resources fún gbígba data, àti Signal Forms fún input àti àyẹ̀wò.

# Signals, Resources, and Signal Forms: Composing Modern Angular End-to-End

## Ìfihàn

Nínú codelab yìí, ìwọ yóò kọ́ app **Call for Talks** ti DevFest Lagos: app CRUD kékeré kan níbi tí àwọn olùsọ̀rọ̀ ti lè ṣe àkójọ, wá, ṣẹ̀dá, ṣàtúnṣe, kí wọ́n sì pa àbá ọ̀rọ̀ wọn rẹ́.

A mọ̀ọ́mọ̀ ṣe é ní kékeré. Gbogbo ìlà koodu tí o bá fi kún un jẹ́ ọ̀kan nínú èrò mẹ́ta yìí:

| Èrò | API | Iṣẹ́ rẹ̀ nínú app yìí |
|---|---|---|
| **Signals** | `signal`, `computed`, `linkedSignal` | Wọ́n ń di state mú, wọ́n sì ń ṣẹ̀dá state tuntun láti inú rẹ̀ |
| **Resources** | `httpResource` | Ó ń gba data, pẹ̀lú ipò loading àti error tí ó ti wà nínú rẹ̀ |
| **Signal Forms** | `form`, `schema`, `[formField]` | Ó ń so input pọ̀, ó ń yẹ̀ wọ́n wò, ó sì ń fi wọ́n ránṣẹ́ |

<<code>>

### Ohun tí ìwọ yóò ṣe

* **Ìgbésẹ̀ 4:** So mọ́ API pẹ̀lú `HttpClient`.
* **Ìgbésẹ̀ 5 sí 7:** Kọ́ àkójọ àwọn ọ̀rọ̀ pẹ̀lú `httpResource`, `signal` àti `computed`.
* **Ìgbésẹ̀ 8 sí 10:** Kọ́ fọ́ọ̀mù ọ̀rọ̀ pẹ̀lú Signal Forms, kí o sì fi ránṣẹ́.
* **Ìgbésẹ̀ 11:** Lo fọ́ọ̀mù kan náà láti ṣàtúnṣe ọ̀rọ̀ pẹ̀lú `linkedSignal`.

### Ohun tí ìwọ yóò nílò

* [Node.js](https://nodejs.org) 22.22 tàbí èyí tí ó jù bẹ́ẹ̀ lọ
* Git àti code editor
* Browser bíi Chrome

<aside class="positive">
<strong>Bí codelab yìí ṣe ń ṣiṣẹ́:</strong> ìwọ kò ní tẹ koodu rárá. Ìgbésẹ̀ kọ̀ọ̀kan yóò fún ọ ní fáìlì pípé láti lẹ̀ mọ́ orí àwọn fáìlì starter. Lo bọ́tìnnì copy lórí bulọ́ọ̀kù koodu kọ̀ọ̀kan, lẹ́yìn náà ka àkọsílẹ̀ kúkúrú "Ohun tó ṣẹlẹ̀" tí ó tẹ̀lé e.
</aside>

## Kí o tó bẹ̀rẹ̀

### Gba starter project

Clone starter project, kí o sì install àwọn ohun tí ó nílò:

<<code>>

### Bẹ̀rẹ̀ app náà

<<code>>

Èyí yóò bẹ̀rẹ̀ nǹkan méjì:

* **json-server** lórí port 3000. Ó ń sọ `api/db.json` di REST API.
* **Angular dev server** lórí port 4200. Ó ń fi gbogbo request tí ó bá bẹ̀rẹ̀ pẹ̀lú `/api` ránṣẹ́ sí json-server.

Ṣí [http://localhost:4200](http://localhost:4200). Ìwọ yóò rí header DevFest Lagos àti ojú-ewé Talks tí kò ní nǹkan kan.

<aside class="negative">
<strong>Ṣé nǹkan mìíràn ti ń lo port 3000?</strong> Script ìbẹ̀rẹ̀ yóò yan port tí ó bá ṣófo tẹ̀lé e fún API fúnra rẹ̀, yóò sì tẹ èyí tí ó yàn jáde. O kò nílò láti yí nǹkankan padà.
</aside>

### Yẹ àwọn test wò

Ní terminal kejì, ṣiṣẹ́ èyí:

<<code>>

Test mẹ́rin yóò kùnà. Bẹ́ẹ̀ ló yẹ kí ó rí: wọ́n ń dán àwọn òfin fọ́ọ̀mù tí ìwọ yóò kọ ní ìgbésẹ̀ 8 wò.

## Rìn yíká starter project

Ṣí project náà nínú editor rẹ. Gbogbo ohun tí ìwọ yóò ṣiṣẹ́ lé lórí wà nínú `src/app/talks`:

| Fáìlì | Ipò rẹ̀ |
|---|---|
| `talk.ts` | **Ó ti parí.** Type `Talk`, àwọn track àti level, àti helper méjì |
| `talk-schema.spec.ts` | **Ó ti parí.** Àwọn test fún òfin fọ́ọ̀mù |
| `*.css` | **Ó ti parí.** Gbogbo styling |
| `talks-api.ts` | Ó ṣófo. Ìwọ yóò kún un ní ìgbésẹ̀ 4 |
| `talk-list.ts` / `.html` | Placeholder. Ìwọ yóò kún wọn ní ìgbésẹ̀ 5 sí 7 |
| `talk-schema.ts` | Ó ṣófo. Ìwọ yóò kún un ní ìgbésẹ̀ 8 |
| `talk-form.ts` / `.html` | Placeholder. Ìwọ yóò kún wọn ní ìgbésẹ̀ 9 sí 11 |

Ṣí `talk.ts`. Èyí ni ìrísí gbogbo ọ̀rọ̀ nínú app náà:

<<code>>

`TalkDraft` jẹ́ ọ̀rọ̀ tí kò ní `id`. Fọ́ọ̀mù ń ṣiṣẹ́ pẹ̀lú draft, nítorí pé ọ̀rọ̀ tuntun kò ní `id` títí server yóò fi fún un ní ọ̀kan.

Wàyí o, ṣí `src/app/app.routes.ts`. Ojú-ewé mẹ́ta ló wà:

| URL | Component | Ìdí rẹ̀ |
|---|---|---|
| `/` | `TalkList` | Gbogbo ọ̀rọ̀ |
| `/talks/new` | `TalkForm` | Ṣẹ̀dá ọ̀rọ̀ |
| `/talks/:id` | `TalkForm` | Ṣàtúnṣe ọ̀rọ̀ |

Component `TalkForm` kan náà ló ń ṣe ìṣẹ̀dá àti àtúnṣe. Ìwọ yóò rí bí ó ṣe ń ṣe é ní ìgbésẹ̀ 11.

## So mọ́ API

### Wo API náà

json-server ń fún ọ ní REST API pípé fún array `talks` tí ó wà nínú `api/db.json`. Bí `npm start` ṣe ń ṣiṣẹ́, ṣí [http://localhost:4200/api/talks](http://localhost:4200/api/talks) nínú browser rẹ. Ìwọ yóò rí àwọn ọ̀rọ̀ náà gẹ́gẹ́ bí JSON.

Àwọn endpoint tí app náà ń lò nìyí:

| Method | URL | Ohun tí ó ń ṣe |
|---|---|---|
| `GET` | `/api/talks` | Ṣe àkójọ gbogbo ọ̀rọ̀ |
| `GET` | `/api/talks/:id` | Gba ọ̀rọ̀ kan |
| `POST` | `/api/talks` | Ṣẹ̀dá ọ̀rọ̀ |
| `PUT` | `/api/talks/:id` | Rọ́pò ọ̀rọ̀ |
| `DELETE` | `/api/talks/:id` | Pa ọ̀rọ̀ rẹ́ |

Gbìyànjú [http://localhost:4200/api/talks/1](http://localhost:4200/api/talks/1) láti rí ọ̀rọ̀ kan ṣoṣo.

### Pèsè HttpClient

Àwọn app Angular gbọ́dọ̀ yàn láti lo `HttpClient`. Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/app.config.ts`:

<<code>>

### Kọ API service

Iṣẹ́ `httpResource` ni kíka data, èyí tí ìwọ yóò pàdé ní ìgbésẹ̀ tó kàn. Service yìí ń bójú tó àwọn ìkọ̀wé mẹ́ta. Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talks-api.ts`:

<<code>>

### Ohun tó ṣẹlẹ̀

* `provideHttpClient(withFetch())` mú kí `HttpClient` wà níbi gbogbo, ó sì sọ fún un pé kí ó lo `fetch` API ti browser.
* `withComponentInputBinding()` ti wà níbẹ̀ tẹ́lẹ̀. Ó ń fi àwọn route parameter bíi `:id` ránṣẹ́ tààrà sí component input. Ìwọ yóò lò ó ní ìgbésẹ̀ 11.
* `create` àti `update` fi `Promise` wé request náà. Signal Forms ń dúró de Promise láti mọ ìgbà tí fífipamọ́ bá parí, gẹ́gẹ́ bí ìwọ yóò ṣe rí ní ìgbésẹ̀ 10.
* `delete` dá request náà padà bí ó ṣe rí. Kò sí ohun tí yóò lọ títí ẹnìkan yóò fi pe `.subscribe()`.

### Yẹ̀ ẹ́ wò pé ó ń ṣiṣẹ́

Terminal tí `npm start` ti ń ṣiṣẹ́ kò fi àṣìṣe kankan hàn, app náà sì ṣì ń ṣí. Kò sí ohun tí yóò yí padà lójú-ewé síbẹ̀, nítorí kò sí ohun tí ń pe service náà.

## Gba àwọn ọ̀rọ̀ pẹ̀lú httpResource

Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talk-list.ts`:

<<code>>

Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talk-list.html`:

<<code>>

### Ohun tó ṣẹlẹ̀

`httpResource` jẹ́ GET request tí ó ń hùwà bíi signal. O fún un ní function tí ó ń dá URL padà, ó sì fún ọ ní àwọn signal padà:

| Signal | Ìtumọ̀ |
|---|---|
| `value()` | Data náà. Ó bẹ̀rẹ̀ gẹ́gẹ́ bí `defaultValue`, èyí tí ó jẹ́ `[]` níbí |
| `isLoading()` | Ó jẹ́ `true` nígbà tí request ṣì ń lọ |
| `error()` | Àṣìṣe náà, bí request bá kùnà |
| `hasValue()` | Ó di `true` ní kété tí data bá dé |
| `reload()` | Method tí ó ń fi request ránṣẹ́ lẹ́ẹ̀kan sí i |

O kò subscribe sí nǹkankan, o kò sì fi ọwọ́ tọ́jú nǹkankan. Template ń ka àwọn signal, Angular yóò sì ṣe àtúnṣe ojú-ewé nígbàkígbà tí wọ́n bá yí padà.

<aside class="positive">
Ìdí wà tí URL fi jẹ́ function. Bí ó bá ka signal kan, bíi route id, resource náà yóò fi request tuntun ránṣẹ́ ní gbogbo ìgbà tí signal yẹn bá yí padà. Ohun tí ìwọ yóò lò gan-an nìyẹn ní ìgbésẹ̀ 11.
</aside>

### Yẹ̀ ẹ́ wò pé ó ń ṣiṣẹ́

1. Tún app náà ṣí. Ìwọ yóò rí ọ̀rọ̀ mẹ́fà.
2. Nínú Chrome DevTools, ṣí taabu **Network**, kí o sì ṣètò throttling sí **Slow 4G**. Tún ṣí lẹ́ẹ̀kan sí i, kí o wo àwọn ìlà skeleton bí wọ́n ṣe ń hàn nígbà tí request ń lọ. Lẹ́yìn náà, dá throttling padà sí **No throttling**.

## Wá àti ṣàlẹ̀mọ́ pẹ̀lú signal àti computed

Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talk-list.ts`:

<<code>>

Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talk-list.html`:

<<code>>

### Ohun tó ṣẹlẹ̀

* `query` àti `track` jẹ́ **writable signal**. Àpótí ìwádìí ń pe `query.set(...)` ní gbogbo ìgbà tí o bá tẹ bọ́tìnnì, chip kọ̀ọ̀kan sì ń pe `track.set(...)` nígbà tí o bá tẹ̀ ẹ́.
* `filtered` jẹ́ **computed signal**. Ó ń ka `talks`, `query` àti `track`, nítorí náà Angular mọ̀ pé kí ó ṣírò rẹ̀ lẹ́ẹ̀kan sí i nígbà tí èyíkéyìí nínú wọn bá yí padà, àti ìgbà yẹn nìkan.
* Àkójọ náà ti ń yípo lórí `filtered()` báyìí dípò `talks.value()`.

Kò sí ìsopọ̀ event kankan láàárín àpótí ìwádìí àti àkójọ náà. Àkójọ gbára lé `filtered`, `filtered` gbára lé `query`, Angular sì ń tẹ̀lé ẹ̀wọ̀n yẹn fún ọ.

### Yẹ̀ ẹ́ wò pé ó ń ṣiṣẹ́

1. Tẹ `flutter` sínú àpótí ìwádìí. Ọ̀rọ̀ kan ṣoṣo ni yóò kù, header yóò sì kà "1 of 6 talks".
2. Pa ìwádìí rẹ́, kí o sì tẹ chip **AI**. Ọ̀rọ̀ AI méjì nìkan ni yóò kù.
3. Tẹ ohun kan tí kò bá nǹkankan mu. Ìwọ yóò rí "No talks match your search."

## Pa ọ̀rọ̀ rẹ́ pẹ̀lú optimistic update

Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talk-list.ts`:

<<code>>

Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talk-list.html`. Ìyípadà kan ṣoṣo ni bọ́tìnnì **Delete** tuntun lẹ́gbẹ̀ẹ́ **Edit**.

<<code>>

### Ohun tó ṣẹlẹ̀

`delete` ń ṣe nǹkan mẹ́ta, ní ètò yìí:

1. **`this.talks.update(...)`** yọ ọ̀rọ̀ náà kúrò nínú value resource lẹ́sẹ̀kẹsẹ̀. Àkójọ àti iye ọ̀rọ̀ yóò yí padà kí server tó dáhùn. Èyí ni a ń pè ní **optimistic update**.
2. **`this.api.delete(talk.id).subscribe(...)`** fi request `DELETE` ránṣẹ́.
3. **`error: () => this.talks.reload()`** ń ṣiṣẹ́ nìkan bí server bá kọ̀. Resource yóò tún gba àkójọ gidi, ọ̀rọ̀ náà yóò sì padà.

Value resource kì í ṣe ohun tí a kò lè yí padà. `set` àti `update` ń yí i padà ní ẹ̀gbẹ́ rẹ títí request tó kàn yóò fi rọ́pò rẹ̀.

### Yẹ̀ ẹ́ wò pé ó ń ṣiṣẹ́

1. Pa ọ̀rọ̀ kan rẹ́. Yóò pòórá lẹ́sẹ̀kẹsẹ̀.
2. Tún ojú-ewé ṣí. Ó ṣì ti lọ, nítorí json-server ti fi ìyípadà náà pamọ́ sínú `api/db.json`.

<aside class="positive">
Ṣé o fẹ́ kí àwọn ọ̀rọ̀ rẹ padà? Dá app dúró, ṣiṣẹ́ <code>npm run db:reset</code>, lẹ́yìn náà ṣiṣẹ́ <code>npm start</code> lẹ́ẹ̀kan sí i.
</aside>

## Kọ òfin fọ́ọ̀mù pẹ̀lú schema

Kí o tó kọ́ fọ́ọ̀mù, ìwọ yóò ṣàpèjúwe bí ọ̀rọ̀ tí ó tọ́ ṣe yẹ kí ó rí. Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talk-schema.ts`:

<<code>>

### Ohun tó ṣẹlẹ̀

* `schema<TalkDraft>(...)` ń fún ọ ní ọ̀nà tí ó ní type sí gbogbo field: `talk.title`, `talk.duration`, àti bẹ́ẹ̀ bẹ́ẹ̀ lọ. Àṣìṣe ìkọ̀wé yóò jẹ́ compile error.
* `required`, `min`, `max`, `minLength` àti `maxLength` jẹ́ òfin tí ó ti wà tẹ́lẹ̀. Ọ̀kọ̀ọ̀kan ń gba ọ̀rọ̀ tí yóò fi han olùlò.
* `validate` jẹ́ òfin àdáni. Ó ń lo `valueOf(talk.level)` láti ka field **mìíràn**, nítorí náà òfin yìí gbára lé field méjì. Yí level padà, àṣìṣe duration yóò sì hàn tàbí pòórá lẹ́sẹ̀kẹsẹ̀.

Schema náà kò mọ̀ pé fọ́ọ̀mù ni yóò lò ó. Èyí mú kí ó rọrùn láti dán an wò fúnra rẹ̀, ohun tí `talk-schema.spec.ts` sì ń ṣe gan-an nìyẹn.

### Yẹ̀ ẹ́ wò pé ó ń ṣiṣẹ́

Ṣiṣẹ́ àwọn test lẹ́ẹ̀kan sí i:

<<code>>

Gbogbo test márùn-ún yóò yege.

## Kọ́ fọ́ọ̀mù

Lákọ̀ọ́kọ́, ṣẹ̀dá component tí ó ń fi ọ̀rọ̀ àṣìṣe field hàn. Ṣẹ̀dá `src/app/talks/field-error.ts` pẹ̀lú koodu yìí:

<<code>>

Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talk-form.ts`:

<<code>>

Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talk-form.html`:

<<code>>

### Ohun tó ṣẹlẹ̀

* **Model jẹ́ signal lásán.** `model` ń di `TalkDraft` mú, òun sì ni orísun òtítọ́ kan ṣoṣo fún fọ́ọ̀mù náà.
* **`form(this.model, talkSchema)`** fi signal yẹn wé inú **field tree**. `form.title`, `form.duration` àti àwọn yòókù ń tọ́ka sí apá kan nínú model, pẹ̀lú àwọn òfin schema rẹ tí a so mọ́ wọn.
* **`[formField]="form.title"`** so input mọ́ field ní ọ̀nà méjèèjì. Títẹ̀ ń ṣe àtúnṣe `model`, bí `model` bá sì yí padà, input yóò yí padà. Ó ń ṣiṣẹ́ bákan náà fún text input, number input, select àti textarea.
* **`form.title()`** (pẹ̀lú àkámọ́) ń fún ọ ní **state** field náà: `value()`, `valid()`, `errors()`, `touched()` àti àwọn mìíràn, gbogbo wọn jẹ́ signal. `FieldError` ń ka state yẹn, ó sì ń fi àṣìṣe àkọ́kọ́ hàn ní kété tí olùlò bá kúrò ní field náà.
* **`[formRoot]="form"`** so element `<form>` mọ́ field tree. Ó tún ń dá browser dúró láti tún ojú-ewé ṣí nígbà tí a bá fi fọ́ọ̀mù ránṣẹ́.

`<pre>` tí ó wà nísàlẹ̀ jẹ́ fún ìgbà díẹ̀. Ó ń tẹ model jáde kí o lè máa wò ó bí ó ṣe ń yí padà.

### Yẹ̀ ẹ́ wò pé ó ń ṣiṣẹ́

1. Tẹ **+ New talk**. Tẹ ọ̀rọ̀ sínú àpótí **Title**, kí o sì wo JSON tí ó wà lábẹ́ fọ́ọ̀mù bí ó ṣe ń yí padà ní gbogbo ìgbà tí o bá tẹ bọ́tìnnì.
2. Tẹ inú **Speaker**, lẹ́yìn náà tẹ ibòmíràn. "Who is giving this talk?" yóò hàn.
3. Ṣètò **Level** sí **Advanced** àti **Minutes** sí `30`, lẹ́yìn náà kúrò ní field náà. "Advanced talks need at least 45 minutes" yóò hàn. Yí level padà sí **Beginner**, yóò sì pòórá.
4. Tẹ **Create talk**. Kò sí ohun tí yóò ṣẹlẹ̀ síbẹ̀. Ìgbésẹ̀ tó kàn ni ìyẹn.

## Fi fọ́ọ̀mù ránṣẹ́

Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talk-form.ts`:

<<code>>

Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talk-form.html`:

<<code>>

### Ohun tó ṣẹlẹ̀

Ohun kẹta tí o fi fún `form()` ni ó di **submission action** mú. Nígbà tí olùlò bá fi ránṣẹ́, Signal Forms yóò:

1. Sàmì sí gbogbo field gẹ́gẹ́ bí èyí tí a ti fọwọ́ kàn, kí gbogbo ọ̀rọ̀ àṣìṣe lè hàn.
2. Dúró bí fọ́ọ̀mù kò bá tọ́. Action rẹ kì yóò ṣiṣẹ́ pẹ̀lú data tí kò dára láé.
3. Ṣètò `submitting()` sí `true`, yóò sì pe action rẹ.
4. Dúró de Promise tí action rẹ dá padà, lẹ́yìn náà yóò dá `submitting()` padà sí `false`.

Ohun tí action náà bá dá padà ló ń pinnu ohun tí yóò ṣẹlẹ̀ tẹ̀lé e:

* **`undefined`** túmọ̀ sí pé ó ṣiṣẹ́. Níbí, o ti gbé olùlò padà sí àkójọ.
* **Error object** ni a ó so mọ́ fọ́ọ̀mù. Template ń fi hàn nípasẹ̀ `form().errors()`.

Ìdí nìyí tí `TalksApi.create` fi ń dá Promise padà: `submitting()` yóò wà ní `true` fún gbogbo àkókò tí request bá gbà.

### Yẹ̀ ẹ́ wò pé ó ń ṣiṣẹ́

1. Tẹ **Create talk** lórí fọ́ọ̀mù tí ó ṣófo. Gbogbo ọ̀rọ̀ àṣìṣe yóò hàn lẹ́ẹ̀kan náà.
2. Kún fọ́ọ̀mù dáadáa, kí o sì tẹ **Create talk**. Bọ́tìnnì yóò kà "Saving…", lẹ́yìn náà ìwọ yóò padà sí àkójọ pẹ̀lú ọ̀rọ̀ tuntun rẹ nísàlẹ̀.
3. **Dán àṣìṣe server wò:** ṣí fọ́ọ̀mù ọ̀rọ̀ tuntun, kí o sì kún un. Nínú DevTools, ṣí taabu **Network**, kí o sì ṣètò throttling sí **Offline**. Tẹ **Create talk**, "Could not save the talk. Please try again." yóò sì hàn. Lẹ́yìn náà, dá throttling padà sí **No throttling**.

## Ṣàtúnṣe ọ̀rọ̀ pẹ̀lú linkedSignal

Route `/talks/:id` ti ń tọ́ka sí `TalkForm` tẹ́lẹ̀. Wàyí o, kọ́ fọ́ọ̀mù bí ó ṣe lè gba ọ̀rọ̀ tí ó ti wà, kí ó sì fi àwọn ìyípadà pamọ́ sí i.

Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talk-form.ts`:

<<code>>

Fi koodu yìí rọ́pò gbogbo ohun tí ó wà nínú `src/app/talks/talk-form.html`:

<<code>>

### Ohun tó ṣẹlẹ̀

Apá mẹ́rin ló ṣiṣẹ́ papọ̀:

1. **`id = input<string>()`** ń gba `:id` láti inú URL, ọpẹ́ ni fún `withComponentInputBinding()` láti ìgbésẹ̀ 4. Lórí `/talks/new`, kò sí `:id`, nítorí náà yóò wà ní `undefined`.
2. **`httpResource`** ń ka `this.id()`. Nígbà tí function URL bá dá `undefined` padà, resource kì yóò fi request kankan ránṣẹ́ rárá. Nítorí náà component kan náà ń gba ọ̀rọ̀ nígbà àtúnṣe, kò sì ṣe nǹkankan nígbà ìṣẹ̀dá.
3. **`linkedSignal`** jẹ́ writable signal tí iye ìbẹ̀rẹ̀ rẹ̀ ń wá láti inú àwọn signal mìíràn. Níbí, iye ìbẹ̀rẹ̀ ni ọ̀rọ̀ tí a gbà, tàbí draft tí ó ṣófo. Fọ́ọ̀mù lè kọ sí i bí ó ṣe fẹ́, bí ọ̀rọ̀ náà bá sì tún gbà, model yóò padà sí data tuntun.
4. **Submission action** ń pe `update` nígbà tí `id` bá wà, àti `create` nígbà tí kò bá sí.

<aside class="positive">
Kí ló dé tí a kò lo <code>signal</code> lásán fún model? A máa ń ṣètò signal lásán lẹ́ẹ̀kan, kí ọ̀rọ̀ náà tó dé. <code>computed</code> yóò tẹ̀lé ọ̀rọ̀ náà, ṣùgbọ́n a kò lè kọ sí i, nítorí náà fọ́ọ̀mù kò ní lè yí i padà. <code>linkedSignal</code> jẹ́ méjèèjì: ó ń tẹ̀lé orísun rẹ̀, ó sì ń gba ìkọ̀wé.
</aside>

### Yẹ̀ ẹ́ wò pé ó ń ṣiṣẹ́

1. Tẹ **Edit** lórí ọ̀rọ̀ èyíkéyìí. Ìwọ yóò rí skeleton loading fún ìṣẹ́jú àáyá díẹ̀, lẹ́yìn náà fọ́ọ̀mù tí a ti kún pẹ̀lú ọ̀rọ̀ yẹn.
2. Yí àkọlé padà, kí o sì tẹ **Save changes**. Àkójọ yóò fi àkọlé tuntun hàn.
3. Ṣí [http://localhost:4200/talks/does-not-exist](http://localhost:4200/talks/does-not-exist). Ìwọ yóò rí "We couldn't find that talk."
4. Tẹ **+ New talk**. Fọ́ọ̀mù yóò ṣófo, bọ́tìnnì yóò sì kà **Create talk**.

## Oríire

O ti kọ́ app CRUD pípé pẹ̀lú Angular òde òní, gbogbo state inú rẹ̀ sì jẹ́ signal.

### Ohun tí o lò

| API | Ibi tí a ti lò ó |
|---|---|
| `httpResource` | Gbígba àkójọ, àti gbígba ọ̀rọ̀ kan pẹ̀lú id |
| `signal` | Ìwádìí àti àlẹ̀mọ́ track |
| `computed` | Àkójọ tí a ṣàlẹ̀mọ́, àti `isEdit` |
| `linkedSignal` | Model fọ́ọ̀mù tí ó ń tẹ̀lé ọ̀rọ̀ tí a gbà |
| `schema`, `validate` | Àwọn òfin fọ́ọ̀mù, pẹ̀lú èyí tí ó ń ka field méjì |
| `form`, `[formField]`, `[formRoot]` | Síso àti fífi fọ́ọ̀mù ránṣẹ́ |
| `HttpClient` | Ṣíṣẹ̀dá, ṣíṣàtúnṣe àti píparẹ́ |

### Kí ló kàn

* Ka [Signals guide](https://angular.dev/guide/signals) àti [Resource guide](https://angular.dev/guide/signals/resource) lórí angular.dev.
* Ka [Signal Forms guide](https://angular.dev/guide/forms/signals/overview).
* Fi iye lẹ́tà tí ó ń yí padà hàn lábẹ́ abstract, pẹ̀lú `computed`.
* Fi òfin tuntun kún `talkSchema`, lẹ́yìn náà kọ test fún un nínú `talk-schema.spec.ts`.

### Dá data rẹ padà

Láti gba àwọn ọ̀rọ̀ àtilẹ̀bá padà nígbàkígbà:

<<code>>

A dúpẹ́ pé o kọ́ nǹkan pẹ̀lú wa ní DevFest Lagos 2026.
