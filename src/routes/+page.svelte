<svelte:head>
	<title>PDF Manager</title>
	<meta
		name="description"
		content="PDF-Dateien einfach und übersichtlich verwalten"
	/>
</svelte:head>

<main class="min-h-screen bg-[#f5f2ea] px-6 py-8 text-stone-900 sm:px-10 lg:px-16">
	<div class="mx-auto max-w-7xl">

		<nav class="flex items-center justify-between border-b border-stone-300/70 pb-5">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#506a5a] text-sm font-semibold text-white">
					P
				</div>

				<p class="text-sm font-semibold tracking-tight">
					PDF Manager
				</p>
			</div>

			<a
				href="/login"
				class="rounded-full border border-stone-300 bg-white/60 px-5 py-2.5 text-sm font-medium text-stone-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-stone-950"
			>
				Login
			</a>
		</nav>

		<section class="py-20 lg:py-28">
			<div class="max-w-4xl">

				<p class="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-[#506a5a]">
					Einfach. Übersichtlich. Sicher.
				</p>

				<h1 class="text-5xl font-medium leading-[1.02] tracking-[-0.045em] text-stone-950 sm:text-6xl lg:text-7xl">
					PDFs verwalten,
					<span class="text-stone-500">
						ohne unnötigen Aufwand.
					</span>
				</h1>

				<p class="mt-7 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
					Lade deine Dateien hoch, behalte den Überblick
					und greife jederzeit wieder darauf zu.
				</p>

				<div class="mt-9 flex flex-wrap gap-3">
					<a
						href="/login"
						class="rounded-full bg-[#506a5a] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#405748]"
					>
						Jetzt starten
					</a>

					<a
						href="#features"
						class="rounded-full border border-stone-300 bg-white/30 px-6 py-3 text-sm font-medium text-stone-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/70"
					>
						Mehr erfahren
					</a>
				</div>

			</div>
		</section>

		<section
	id="features"
	class="grid gap-4 border-t border-stone-300/70 py-10 sm:grid-cols-3"
>
	<a
		href="/login"
		class="group rounded-2xl border border-stone-300/80 bg-white/40 p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-white/65 hover:shadow-sm"
	>
		<div
			class="mb-5 h-2 w-10 rounded-full bg-[#506a5a] transition-all duration-200 group-hover:w-14"
		></div>

		<p class="text-sm font-semibold text-stone-900">
			Hochladen
		</p>

		<p class="mt-2 text-sm leading-6 text-stone-600">
			PDF-Dateien schnell und unkompliziert speichern.
		</p>

		<p class="mt-5 text-sm font-medium text-[#506a5a]">
			Loslegen →
		</p>
	</a>

	<a
		href="/login"
		class="group rounded-2xl border border-stone-300/80 bg-white/40 p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-white/65 hover:shadow-sm"
	>
		<div
			class="mb-5 h-2 w-10 rounded-full bg-[#7c9a86] transition-all duration-200 group-hover:w-14"
		></div>

		<p class="text-sm font-semibold text-stone-900">
			Verwalten
		</p>

		<p class="mt-2 text-sm leading-6 text-stone-600">
			Alle Dokumente übersichtlich an einem Ort behalten.
		</p>

		<p class="mt-5 text-sm font-medium text-[#506a5a]">
			Loslegen →
		</p>
	</a>

	<a
		href="/login"
		class="group rounded-2xl border border-stone-300/80 bg-white/40 p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-white/65 hover:shadow-sm"
	>
		<div
			class="mb-5 h-2 w-10 rounded-full bg-[#9e927f] transition-all duration-200 group-hover:w-14"
		></div>

		<p class="text-sm font-semibold text-stone-900">
			Herunterladen
		</p>

		<p class="mt-2 text-sm leading-6 text-stone-600">
			Jederzeit schnell wieder auf deine Dateien zugreifen.
		</p>

		<p class="mt-5 text-sm font-medium text-[#506a5a]">
			Loslegen →
		</p>
	</a>
</section>
	</div>

	<footer class="mt-10 border-t border-stone-300/70 py-6 text-center">
	<p class="text-sm text-stone-500">
		© 2026 PDF Manager
	</p>
</footer>

	
</main>