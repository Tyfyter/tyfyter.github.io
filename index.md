## Welcome to my poorly set up GitHub Page
<style>
#linksource > a {
  border: black 1px solid;
  border-radius: 5px;
  background: #0001;
  padding: 2px;
}
</style>
<div id="linksource" hidden="true"><a href="https://github.com/Tyfyter/{0}">{0}'s source code</a> <a href="https://github.com/Tyfyter/{0}/issues">Report an issue</a></div>

There's a [Discord server](https://discord.gg/FyRUyQG).

The source code for my terraria mods is [here](https://github.com/Tyfyter) in case you want to see how something works;

[here](https://forms.gle/1zA8JDKQNZMJoRFy8)'s a form for feedback and such;

And [here](https://tyfyter.github.io/search) is a helpful search page for song lyrics and tML's ExampleMod.

That's about it.

<script defer=true>
if (window.location.search) {
  console.log(document.children[0].innerHTML);
  let linkSource = document.getElementById("linksource");
  let search = window.location.search.replace("?", "");
  linkSource.hidden = false;
  linkSource.innerHTML = linkSource.innerHTML.replaceAll("{0}", search);
}
</script>
