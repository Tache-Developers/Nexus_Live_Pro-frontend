<template>
	<footer class="footer flex flex-column align-items-center justify-content-end">
		<div class="marcas" style="max-height: 400px">
			<Carousel :value="marcas" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions">
				<template #item="slotProps">
					<div class="border-1 surface-border border-round m-2 p-3">
						<div class="mb-3">
							<div class="relative mx-auto">
								<img
									:src="'https://primefaces.org/cdn/primevue/images/product/' + slotProps.data.image"
									:alt="slotProps.data.name"
									class="w-full border-round"
								/>
								<Tag
									:value="slotProps.data.inventoryStatus"
									:severity="getSeverity(slotProps.data.inventoryStatus)"
									class="absolute"
									style="left: 5px; top: 5px"
								/>
							</div>
						</div>
						<div class="mb-3 font-medium">{{ slotProps.data.name }}</div>
						<div class="flex justify-content-between align-items-center">
							<div class="mt-0 font-semibold text-xl">${{ slotProps.data.price }}</div>
							<span>
								<Button icon="pi pi-heart" severity="secondary" outlined />
								<Button icon="pi pi-shopping-cart" class="ml-2" />
							</span>
						</div>
					</div>
				</template>
			</Carousel>
		</div>
		<div class="flex gap-3 justify-content-center flex-wrap">
			<a v-for="(red, index) in redes" :key="index" :href="red.ruta" target="_blank" rel="noopener noreferrer">
				<img :src="red.imagen" class="img-fluid" alt="Red" />
			</a>
		</div>
		<div class="politicas text-center font-bold text-black-alpha-90 flex align-items-center justify-content-center flex-wrap gap-1">
			<p class="m-0 font-bold text-black-alpha-90 flex-order-1">Términos y Condiciones</p>
			<span class="font-bold text-black-alpha-90 pt-2 flex-order-2 divisor">°</span>
			<p class="m-0 font-bold text-black-alpha-90 flex-order-3">Política de Privacidad</p>
		</div>
	</footer>
</template>
<script>
export default {
	data: () => ({
		marcas: [],
		responsiveOptions: [
			{
				breakpoint: "1400px",
				numVisible: 2,
				numScroll: 1,
			},
			{
				breakpoint: "1199px",
				numVisible: 3,
				numScroll: 1,
			},
			{
				breakpoint: "767px",
				numVisible: 2,
				numScroll: 1,
			},
			{
				breakpoint: "575px",
				numVisible: 1,
				numScroll: 1,
			},
		],
		redes: [
			{ ruta: "#", imagen: "/assets/img/footer/face.png" },
			{ ruta: "#", imagen: "/assets/img/footer/x.png" },
			{ ruta: "#", imagen: "/assets/img/footer/ins.png" },
			{ ruta: "#", imagen: "/assets/img/footer/yt.png" },
			{ ruta: "#", imagen: "/assets/img/footer/tiktok.png" },
			{ ruta: "#", imagen: "/assets/img/footer/what.png" },
		],
	}),
};
</script>

<style scoped>
* {
	padding: 0px;
	margin: 0px;
}

.footer {
	height: 280px;
	background: #ffffff;
	gap: 20px;
	flex-direction: column;
}
.img-fluid {
	height: 40px;
	width: 40px;
}

@media (max-width: 416px) {
	.footer > .politicas {
		flex-direction: column;
		gap: 0 !important;
	}

	.footer > .politicas > .divisor {
		padding-top: 0 !important;
		line-height: 0.8;
	}
}
</style>
