<script>
	let { data } = $props();
</script>


<main class="min-h-screen p-10">

	<div class="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">

		<h1 class="text-3xl font-bold">
			Dashboard
		</h1>

		<p class="mt-3">
			Willkommen
			<strong>
				{data.user.username}
			</strong>
		</p>

		<p>
			Rolle:
			{data.user.role}
		</p>

	</div>

</main>