<script>
	let { form } = $props();
</script>
 
 
<svelte:head>
<title>Login | PDF Manager</title>
</svelte:head>
 
 
<main class="min-h-screen flex items-center justify-center">
 
	<div class="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
 
		<h1 class="text-3xl font-bold mb-6">
			Login
</h1>
 
 
		{#if form?.error}
 
			<p class="error">
				{form.error}
</p>
 
		{/if}
 
 
		<form method="POST" class="space-y-4">
 
			<div>
 
				<label for="username">
					Benutzername
</label>
 
				<input
					id="username"
					type="text"
					name="username"
					class="w-full rounded-lg"
					required
				/>
 
			</div>
 
 
			<div>
 
				<label for="password">
					Passwort
</label>
 
				<input
					id="password"
					type="password"
					name="password"
					class="w-full rounded-lg"
					required
				/>
 
			</div>
 
 
			<button
				type="submit"
				class="w-full bg-black text-white p-3 rounded-lg"
>
				Einloggen
</button>
 
		</form>
 
 
		<a
			href="/"
			class="block mt-5 text-center underline"
>
			Zurück zur Startseite
</a>
 
	</div>
 
</main>