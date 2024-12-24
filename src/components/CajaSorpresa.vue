<template>
	<Dialog
		v-model:visible="mostrarDialog"
		class="sorpresa"
		:style="{ width: '35rem' }"
		:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
		position="top"
		:modal="true"
		:draggable="false"
		@hide="cerrarDialog"
	>
		<div class="flex justify-content-center align-items-center caja">
			<video loop autoplay class="fondo">
				<source src="/assets/video/caja/fondo.webm" type="video/webm" />
			</video>
			<video loop autoplay="true" @click="abrir" v-if="estado == 'abrir'" preload="auto" v-tooltip.top="'Reclama tu premio'">
				<source src="/assets/video/caja/caja_estatica.webm" type="video/webm" />
				Este navegador no soporta video
			</video>
			<video loop autoplay v-else-if="estado == 'abriendo'" class="abriendo" preload="auto" ref="abierto">
				<source src="/assets/video/caja/caja_abriendo.webm" type="video/webm" />
				Este navegador no soporta video
			</video>
			<video loop autoplay v-else-if="estado == 'cerrando'" preload="auto" class="cerrando">
				<source src="/assets/video/caja/caja_cerrando.webm" type="video/webm" />
				Este navegador no soporta video
			</video>
			<div class="ganancia-detalle hidden absolute p-3" ref="ganancia_detalle">
				<div
					v-if="!['SaldoApi', 'Objeto'].includes(tipo_premio) && !isImg(premio)"
					class="ganancia efectivo fadein p-2 animation-duration-1000 line-height-2 flex align-items-center justify-content-center"
				>
					<span class="m-0 font-bold uppercase text-black">{{ premio }}</span>
				</div>
				<div
					v-else-if="tipo_premio == 'SaldoApi'"
					class="ganancia saldo fadein p-2 animation-duration-1000 line-height-2 flex align-items-center justify-content-center"
				>
					<span class="m-0 font-bold uppercase text-black">{{ premio }}</span>
				</div>
				<Image v-else :src="premio" preview class="ganancia objeto">
					<template #indicatoricon>
						<div class="flex flex-column justify-content-center align-items-center">
							<i class="pi pi-eye" />
							<p class="m-0 font-bold text-black uppercase">
								{{ descripcion }}
							</p>
						</div>
					</template>
					<template #image>
						<img :src="premio" alt="Premio" class="ganancia objeto" />
					</template>
				</Image>
			</div>
			<audio ref="abriendo_caja" loop src="/assets/audio/caja/abriendo_caja.mp3" type="audio/mp3" />
		</div>
	</Dialog>
</template>
<script>
export default {
	name: "CajaSorpresa",
	props: {
		mostrarCaja: {
			type: Boolean,
			required: true,
			default: false,
		},
		tipo_premio: {
			type: String,
			required: true,
		},
		premio: {
			type: String,
			required: true,
		},
		descripcion: {
			type: String,
		},
	},
	data: () => ({
		estado: "abrir",
		mostrarDialog: false,
		interval: null,
	}),
	watch: {
		mostrarCaja: {
			handler(newVal) {
				this.mostrarDialog = newVal;
			},
			immediate: true,
		},
	},
	methods: {
		abrir() {
			this.estado = "abriendo";
			this.$refs.abriendo_caja.play();
			this.interval = setTimeout(() => {
				clearTimeout(this.interval);
				this.$refs.ganancia_detalle.classList.remove("hidden");
				this.$refs.ganancia_detalle.classList.add("block");
				this.$refs.abierto.classList += " opacity-0 cursor-auto";
				this.$refs.abierto.pause();
				// this.estado = 'cerrando';
				this.cajaAbierta();
			}, 2000);
		},
		cajaAbierta() {
			this.interval = setTimeout(() => {
				this.$emit("reclamandoPremio");
				clearTimeout(this.interval);
			}, 1000);
		},
		cerrarDialog() {
			if (this.$refs.abriendo_caja != null) {
				this.$refs.abriendo_caja.pause();
			}
			this.estado = "abrir";
			this.$emit("cerrarCaja");
		},
		isImg(ruta = "") {
			return ruta.match(/\.(jpeg|jpg|png|gif|webp|bmp|apng|svg|avif|heic|heif)$/) != null;
		},
	},
};
</script>
<style scoped>
.caja > .fondo {
	position: absolute;
	top: -52px;
	width: 580px;
	height: 580px;
	z-index: -1;
}

.caja > video {
	width: 300px;
	height: 300px;
	position: relative;
	top: -35px;
	cursor: pointer;
}

.caja > .abriendo,
.caja > .cerrando {
	width: 500px;
	height: 400px;
	top: -86px;
}

.caja > .ganancia-detalle {
	/* animation: ganancia 3s ease; */
	width: max-content;
	top: 133px;
	transition: all 0.3s ease;
}

.caja > .ganancia-detalle > .ganancia:not(.objeto) {
	text-align: center;
	height: 90px;
	width: 160px;
	background-image: url("/assets/img/caja/billete.png");
	background-size: 100% 100%;
	background-repeat: no-repeat;
	color: #000000;
	word-wrap: break-word;
}

.caja > .ganancia-detalle > .ganancia.efectivo {
	background-image: url("/assets/img/caja/billeteEfectivo.webp");
}

.caja > .ganancia-detalle > .ganancia.saldo {
	background-image: url("/assets/img/caja/billeteApi.webp");
}

.caja > .ganancia-detalle > span > img {
	height: 190px !important;
	width: 200px !important;
}
</style>