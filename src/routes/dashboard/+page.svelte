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
 
 
<main class="min-h-screen p-8">
 
	<div class="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow">
 
		<div class="flex justify-between items-center mb-8">
 
			<div>
 
				<h1 class="text-3xl font-bold">
					Dashboard
</h1>
 
				<p>
					Eingeloggt als
 
					<strong>
						{data.user.username}
</strong>
 
					({data.user.role})
</p>
 
			</div>
 
 
			<form method="POST" action="/logout">
 
				<button
					class="bg-black text-white px-4 py-2 rounded"
>
					Logout
</button>
 
			</form>
 
		</div>
 
 
		{#if form?.error}
 
			<p class="error">
				{form.error}
</p>
 
		{/if}
 
 
		{#if form?.success}
 
			<p class="success">
				{form.success}
</p>
 
		{/if}
 
 
		<!-- Upload nur für normalen User -->
 
		{#if data.user.role === 'user'}
 
			<section class="mb-10">
 
				<h2 class="text-2xl font-bold mb-4">
					PDF hochladen
</h2>
 
 
				<form
					method="POST"
					action="?/upload"
					enctype="multipart/form-data"
					class="space-y-4"
>
 
					<input
						type="file"
						name="pdf"
						accept="application/pdf,.pdf"
						required
					/>
 
 
					<button
						type="submit"
						class="bg-black text-white px-5 py-2 rounded"
>
						Hochladen
</button>
 
				</form>
 
			</section>
 
		{/if}
 
 
		<section>
 
			{#if data.user.role === 'admin'}
 
				<h2 class="text-2xl font-bold mb-4">
					Alle PDFs
</h2>
 
			{:else}
 
				<h2 class="text-2xl font-bold mb-4">
					Meine PDFs
</h2>
 
			{/if}
 
 
			{#if data.pdfs.length === 0}
 
				<p>
					Keine PDFs vorhanden.
</p>
 
			{:else}
 
				<table>
 
					<thead>
 
						<tr>
<th>Datei</th>
 
							{#if data.user.role === 'admin'}
<th>User</th>
							{/if}
 
							<th>Größe</th>
<th>Datum</th>
<th>Aktionen</th>
</tr>
 
					</thead>
 
 
					<tbody>
 
						{#each data.pdfs as pdf}
 
							<tr>
 
								<td>
									{pdf.original_name}
</td>
 
 
								{#if data.user.role === 'admin'}
 
									<td>
										{pdf.username}
</td>
 
								{/if}
 
 
								<td>
									{formatBytes(pdf.size_bytes)}
</td>
 
 
								<td>
									{new Date(
										pdf.uploaded_at
									).toLocaleString()}
</td>
 
 
								<td>
 
									<a
										href={`/pdf/${pdf.id}`}
										class="bg-black text-white px-3 py-2 rounded"
>
										Download
</a>
 
 
									{#if data.user.role === 'admin'}
 
										<form
											method="POST"
											action="?/delete"
											class="inline"
>
 
											<input
												type="hidden"
												name="id"
												value={pdf.id}
											/>
 
 
											<button
												type="submit"
												class="bg-red-700 text-white px-3 py-2 rounded ml-2"
>
												Löschen
</button>
 
										</form>
 
									{/if}
 
								</td>
 
							</tr>
 
						{/each}
 
					</tbody>
 
				</table>
 
			{/if}
 
		</section>
 
	</div>
 
</main>