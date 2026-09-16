<script>
	let { form } = $props();
</script>

<svelte:head>
	<title>Login | PDF Manager</title>
</svelte:head>

<main class="min-h-screen bg-[#f5f2ea] px-6 py-8 text-stone-900 sm:px-10 lg:px-16">
	<div class="mx-auto max-w-7xl">

		<nav class="flex items-center justify-between border-b border-stone-300/70 pb-5">
			<a href="/" class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#506a5a] text-sm font-semibold text-white">
					P
				</div>

				<p class="text-sm font-semibold tracking-tight">
					PDF Manager
				</p>
			</a>

			<a
				href="/"
				class="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
			>
				Zur Startseite
			</a>
		</nav>

		<section class="flex min-h-[75vh] items-center justify-center py-16">

			<div class="w-full max-w-md">

				<div class="mb-8">
					<p class="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#506a5a]">
						Willkommen zurück
					</p>

					<h1 class="text-4xl font-medium tracking-[-0.04em] text-stone-950">
						Einloggen
					</h1>

					<p class="mt-3 text-sm leading-6 text-stone-600">
						Melde dich an, um deine PDF-Dateien zu verwalten.
					</p>
				</div>

				<div class="rounded-[1.75rem] border border-stone-300/80 bg-white/45 p-6 shadow-[0_20px_60px_-40px_rgba(87,83,78,0.4)] backdrop-blur-sm sm:p-8">

					{#if form?.error}
						<p class="mb-5 rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm font-medium text-red-700">
							{form.error}
						</p>
					{/if}

					<form method="POST" class="space-y-5">

						<div>
							<label
								for="username"
								class="mb-2 block text-sm font-medium text-stone-700"
							>
								Benutzername
							</label>

							<input
								id="username"
								type="text"
								name="username"
								class="w-full rounded-xl border border-stone-300 bg-[#faf8f3] px-4 py-3 text-sm text-stone-900 outline-none transition-all placeholder:text-stone-400 hover:border-stone-400 focus:border-[#7c9a86] focus:ring-4 focus:ring-[#7c9a86]/10"
								placeholder="Benutzername eingeben"
								required
							/>
						</div>

						<div>
							<label
								for="password"
								class="mb-2 block text-sm font-medium text-stone-700"
							>
								Passwort
							</label>

							<input
								id="password"
								type="password"
								name="password"
								class="w-full rounded-xl border border-stone-300 bg-[#faf8f3] px-4 py-3 text-sm text-stone-900 outline-none transition-all placeholder:text-stone-400 hover:border-stone-400 focus:border-[#7c9a86] focus:ring-4 focus:ring-[#7c9a86]/10"
								placeholder="Passwort eingeben"
								required
							/>
						</div>

						<button
							type="submit"
							class="w-full rounded-full bg-[#506a5a] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#405748]"
						>
							Einloggen
						</button>

					</form>

				</div>

			</div>

		</section>

	</div>
</main>