<script>
  import { link } from "svelte-spa-router";

  import { formatDate, formatSearchResult } from "./lib";

  export let entry;
  export let isActive;
</script>

<style>
  .date {
    font-style: italic;
  }
  .title {
    margin-top: 0;
  }
</style>

<a
  use:link={`/note/${entry.id}`}
  href="/"
  class="uk-card uk-card-small uk-card-default uk-card-body uk-margin-top {isActive ? 'uk-card-primary' : 'uk-card-hover'}">
  <h4 class="title">
    {@html formatSearchResult(entry) || '<em>без заголовка</em>'}
  </h4>
  <h6 class="date" style="margin-bottom: 10px;">Редактирована: {formatDate(entry.modified)}</h6>
  <h6 class="date" style="margin-top: 0;">Создана: {formatDate(entry.created)}</h6>
</a>
