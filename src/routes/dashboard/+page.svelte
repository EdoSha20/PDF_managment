<script>
	let {
		data,
		form
	} = $props();

	function formatBytes(bytes) {
		if (bytes < 1024) {
			return `${bytes} B`;
		}

		if (bytes < 1024 * 1024) {
			return `${(bytes / 1024).toFixed(1)} KB`;
		}

		return `${(
			bytes / 1024 / 1024
		).toFixed(1)} MB`;
	}
</script>

<svelte:head>
	<title>Dashboard | PDF Manager</title>
</svelte:head>

<main class="min-h-screen bg-[#f5f2ea] px-6 py-8 text-stone-900 sm:px-10 lg:px-16">

	<div class="mx-auto max-w-7xl">

		<nav class="flex flex-col gap-5 border-b border-stone-300/70 pb-5 sm:flex-row sm:items-center sm:justify-between">

			<a href="/" class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#506a5a] text-sm font-semibold text-white">
					P
				</div>

				<p class="text-sm font-semibold tracking-tight">
					PDF Manager
				</p>
			</a>

			<div class="flex items-center gap-3">

				<div class="hidden text-right sm:block">
					<p class="text-sm font-medium text-stone-800">
						{data.user.username}
					</p>

					<p class="text-xs capitalize text-stone-500">
						{data.user.role}
					</p>
				</div>

				<div class="rounded-full border border-stone-300 bg-white/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#506a5a]">
					{data.user.role}
				</div>

				<form method="POST" action="/logout">
					<button
						class="rounded-full border border-stone-300 bg-white/40 px-4 py-2 text-sm font-medium text-stone-700 transition-all hover:bg-white/70 hover:text-stone-950"
					>
						Logout
					</button>
				</form>

			</div>

		</nav>

		<section class="py-12">

			<div class="mb-10">
				<p class="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#506a5a]">
					{#if data.user.role === 'admin'}
						Administration
					{:else}
						Dein Bereich
					{/if}
				</p>

				<h1 class="text-4xl font-medium tracking-[-0.04em] text-stone-950 sm:text-5xl">
					{#if data.user.role === 'admin'}
						Alle PDF-Dateien
					{:else}
						Deine PDF-Dateien
					{/if}
				</h1>

				<p class="mt-3 max-w-xl text-sm leading-6 text-stone-600">
					{#if data.user.role === 'admin'}
						Verwalte die hochgeladenen Dateien aller Benutzer.
					{:else}
						Lade neue Dokumente hoch und greife jederzeit auf deine Dateien zu.
					{/if}
				</p>
			</div>

			{#if form?.error}
				<p class="mb-6 rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm font-medium text-red-700">
					{form.error}
				</p>
			{/if}

			{#if form?.success}
				<p class="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm font-medium text-emerald-700">
					{form.success}
				</p>
			{/if}

			{#if data.user.role === 'user'}

				<section class="mb-10 rounded-[1.75rem] border border-stone-300/80 bg-white/40 p-6 sm:p-8">

					<div class="mb-6">
						<p class="text-lg font-semibold text-stone-900">
							Neue PDF hochladen
						</p>

						<p class="mt-1 text-sm text-stone-500">
							Wähle eine PDF-Datei von deinem Gerät aus.
						</p>
					</div>

					<form
						method="POST"
						action="?/upload"
						enctype="multipart/form-data"
						class="flex flex-col gap-4 sm:flex-row sm:items-center"
					>

						<input
							type="file"
							name="pdf"
							accept="application/pdf,.pdf"
							class="block w-full cursor-pointer rounded-xl border border-stone-300 bg-[#faf8f3] text-sm text-stone-500 transition-all file:mr-4 file:border-0 file:border-r file:border-stone-300 file:bg-[#ebe6da] file:px-4 file:py-3 file:text-sm file:font-medium file:text-stone-700 hover:border-stone-400"
							required
						/>

						<button
							type="submit"
							class="shrink-0 rounded-full bg-[#506a5a] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#405748]"
						>
							Hochladen
						</button>

					</form>

				</section>

			{/if}

			<section class="overflow-hidden rounded-[1.75rem] border border-stone-300/80 bg-white/40">

				<div class="flex items-center justify-between border-b border-stone-300/70 px-6 py-5">

					<div>
						<h2 class="text-lg font-semibold text-stone-900">
							{#if data.user.role === 'admin'}
								Alle PDFs
							{:else}
								Meine PDFs
							{/if}
						</h2>

						<p class="mt-1 text-xs text-stone-500">
							{data.pdfs.length} Datei{data.pdfs.length === 1 ? '' : 'en'}
						</p>
					</div>

				</div>

				{#if data.pdfs.length === 0}

					<div class="px-6 py-16 text-center">

						<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5e3da] text-sm font-semibold text-[#506a5a]">
							PDF
						</div>

						<p class="mt-4 text-sm font-medium text-stone-800">
							Noch keine PDFs vorhanden
						</p>

						<p class="mt-1 text-sm text-stone-500">
							{#if data.user.role === 'user'}
								Lade deine erste Datei oben hoch.
							{:else}
								Es wurden noch keine Dateien hochgeladen.
							{/if}
						</p>

					</div>

				{:else}

					<div class="overflow-x-auto">

						<table class="w-full min-w-[720px] text-left">

							<thead>
								<tr class="border-b border-stone-300/70 bg-[#ebe6da]/60 text-xs uppercase tracking-wider text-stone-500">

									<th class="px-6 py-4 font-semibold">
										Datei
									</th>

									{#if data.user.role === 'admin'}
										<th class="px-6 py-4 font-semibold">
											Benutzer
										</th>
									{/if}

									<th class="px-6 py-4 font-semibold">
										Größe
									</th>

									<th class="px-6 py-4 font-semibold">
										Datum
									</th>

									<th class="px-6 py-4 font-semibold">
										Aktionen
									</th>

								</tr>
							</thead>

							<tbody>

								{#each data.pdfs as pdf}

									<tr class="border-b border-stone-200/80 transition-colors last:border-0 hover:bg-white/50">

										<td class="px-6 py-5">

											<div class="flex items-center gap-3">

												<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dbe4dc] text-xs font-semibold text-[#506a5a]">
													PDF
												</div>

												<p class="max-w-[250px] truncate text-sm font-medium text-stone-900">
													{pdf.original_name}
												</p>

											</div>

										</td>

										{#if data.user.role === 'admin'}

											<td class="px-6 py-5 text-sm text-stone-600">
												{pdf.username}
											</td>

										{/if}

										<td class="px-6 py-5 text-sm text-stone-500">
											{formatBytes(pdf.size_bytes)}
										</td>

										<td class="px-6 py-5 text-sm text-stone-500">
											{new Date(
												pdf.uploaded_at
											).toLocaleString()}
										</td>

										<td class="px-6 py-5">

											<div class="flex items-center gap-2">

												<a
													href={`/pdf/${pdf.id}`}
													class="rounded-full border border-stone-300 bg-white/60 px-4 py-2 text-xs font-semibold text-stone-700 transition-all hover:bg-white hover:text-stone-950"
												>
													Download
												</a>

												{#if data.user.role === 'admin'}

													<form
														method="POST"
														action="?/delete"
													>

														<input
															type="hidden"
															name="id"
															value={pdf.id}
														/>

														<button
															type="submit"
															class="rounded-full border border-red-200 bg-red-50/70 px-4 py-2 text-xs font-semibold text-red-700 transition-all hover:bg-red-100"
														>
															Löschen
														</button>

													</form>

												{/if}

											</div>

										</td>

									</tr>

								{/each}

							</tbody>

						</table>

					</div>

				{/if}

			</section>

		</section>

	</div>

</main>