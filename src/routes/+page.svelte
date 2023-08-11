<script>
  import { _ } from 'svelte-i18n'
</script>
<main class="container" dir={$_("dir")}>
  <article class="grid">
    <div>
      <hgroup>
        <h1>{$_("friendCard")}</h1>
        <h2>{$_("createOnlineCard")}</h2>
      </hgroup>
      <a href="/create" role="button">{$_("create")}</a>
    </div>
    <div>
      <img src="/screenshot.png" alt="screenshot">
    </div>
  </article>
</main>
  
<style>
  main {
    height: 100vh;
    display: grid;
    place-items: center;
  }

</style>