<template>
	<div class="actualizaciones-reglas">
		<NavBar />
		<video loop autoplay muted class="fondo">
			<source src="/assets/video/control-reglas/front-reglas-bg.mp4" type="video/mp4" />
		</video>
		<div class="contenido">
			<div class="info">
				<div class="img">
					<img src="/assets/img/control-regla/pregunta.png" alt="Preguntas, reglas y actualizaciones" />
				</div>
				<div class="reglas_act">
					<div class="btns mb-5 flex-wrap">
						<button @click="cambiarVista(1)" :class="`btn-reglas cursor-pointer ${tabActive == 1 ? 'active' : ''}`">
							PREGUNTAS Y REGLAS
						</button>
						<button @click="cambiarVista(2)" :class="`btn-reglas cursor-pointer ${tabActive == 2 ? 'active' : ''}`">ACTUALIZACIONES</button>
					</div>
					<div class="header rectangulo" />
					<div class="ver font-gamers text-white">
						<DataView :value="currentDatos.nuevas">
							<template #list="slotProps">
								<div class="flex flex-column lista">
									<h2 class="m-0 text-center font-gamers uppercase py-3" style="word-break: break-word">{{ currentVista }} NUEVAS</h2>
									<div v-for="(item, index) in slotProps.items" :key="index" class="flex flex-column align-items-center item">
										<div class="info w-full">
											<div class="header flex justify-content-between align-items-center uppercase text-white font-gamers gap-1 flex-wrap">
												<div class="titulo">{{ item.titulo }}</div>
												<div class="fecha">{{ item.fecha.slice(0, 10) }}</div>
											</div>
											<div class="content text-white flex align-items-start mb-3 py-2 pr-4" style="word-break: break-word">
												<div class="mover">
													<div class="tag-nuevo-fuego">
														<img src="/assets/img/control-regla/fuego.png" alt="Nuevo" />
													</div>
												</div>
												<p class="m-0 w-full" v-html="item.descripcion" />
											</div>
										</div>
									</div>
								</div>
							</template>
						</DataView>
						<DataView :value="currentDatos.antiguas">
							<template #list="slotProps">
								<div class="flex flex-column lista">
									<h2 class="m-0 text-center font-gamers uppercase py-3" style="word-break: break-word">{{ currentVista }} ANTIGUAS</h2>
									<div v-for="(item, index) in slotProps.items" :key="index" class="flex flex-column align-items-center item">
										<div class="info w-full">
											<div class="header flex justify-content-between align-items-center uppercase text-white font-gamers gap-1 flex-wrap">
												<div class="titulo">{{ item.titulo }}</div>
												<div class="fecha">{{ item.fecha.slice(0, 10) }}</div>
											</div>
											<div class="content text-white flex align-items-start mb-3 py-2 px-4" style="word-break: break-word">
												<p class="m-0 w-full" v-html="item.descripcion" />
											</div>
										</div>
									</div>
								</div>
							</template>
						</DataView>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
export default {
	name: "ActualizacionesReglas",
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		tabActive: 2,
		reglas_act: [],
		currentVista: "Actualizaciones",
		currentDatos: {
			nuevas: [],
			antiguas: [],
		},
	}),
	methods: {
		cambiarVista(vista = 1) {
			//1- Preguntas y reglas, 2 - Actualizaciones
			if (this.tabActive != vista) {
				this.tabActive = vista;
				this.currentVista = vista == 1 ? "Preguntas y Reglas" : "Actualizaciones";
			}
			this.getItems();
		},
		getItems() {
			let findTipo = this.tabActive == 1 ? "Regla" : "Actualización";
			let coinc = this.reglas_act.find((item) => item._id == findTipo);
			this.currentDatos = {
				nuevas: [],
				antiguas: [],
			};
			if (coinc != null) {
				this.currentDatos.nuevas = coinc.items.filter((item) => item.estado == "Nueva");
				this.currentDatos.antiguas = coinc.items.filter((item) => item.estado == "Antigua");
			}
		},
		async getReglas_act() {
			await axios.get(`${this.API}/regla-actualizacion`).then((resp) => {
				this.reglas_act = resp.data;
				this.getItems();
			});
		},
	},
	async created() {
		await this.getReglas_act();
	},
};
</script>
<style scoped>
.actualizaciones-reglas {
	width: 100%;
	height: max-content;
}
.actualizaciones-reglas > .fondo {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	z-index: -1;
}
.actualizaciones-reglas > .contenido {
	padding: 0 12px 0 12px;
	margin: 90px 15px 30px 15px;
	height: 730px;
	width: calc(100% - 30px);
	background-image: url("/assets/img/control-regla/borde-reglas.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.actualizaciones-reglas > .contenido > .info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100%;
	padding: 20px;
	gap: 18px;
}

.actualizaciones-reglas > .contenido > .info > .img {
	height: 370px;
	width: 400px;
}
.actualizaciones-reglas > .contenido > .info > .img > img {
	max-width: 100%;
	height: 100%;
}
.actualizaciones-reglas > .contenido > .info > .reglas_act {
	width: calc(100% - 370px);
	height: 100%;
	padding-top: 90px;
}

.actualizaciones-reglas > .contenido > .info > .reglas_act > .btns {
	display: flex;
	justify-content: center;
	gap: 12px;
}

.actualizaciones-reglas > .contenido > .info > .reglas_act > .btns > button {
	background: transparent;
	border: 2px solid #84dc16;
	border-radius: 6px;
	padding: 9px 18px;
	font-weight: bold;
}
.actualizaciones-reglas > .contenido > .info > .reglas_act > .btns > button.active {
	background: #84dc16;
}

.actualizaciones-reglas > .contenido > .info > .reglas_act > .header.rectangulo {
	background-image: url("/assets/img/control-regla/tab_header.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	height: 48px;
	bottom: -5px;
	width: 100%;
	position: relative;
}
.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver {
	width: calc(100% - 26px);
	height: 460px;
	display: flex;
	margin: 0 auto;
	gap: 10px;
	justify-content: space-between;
	overflow: auto;
	background: linear-gradient(179deg, #49ff0036, transparent);
	padding: 20px 18px;
	border-radius: 10px;
}
.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver::-webkit-scrollbar {
	width: 8px;
}
.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver::-webkit-scrollbar-track {
	background: #555;
	border-radius: 10px;
	cursor: pointer;
}
.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver::-webkit-scrollbar-thumb {
	background: #5e951c;
	border-radius: 10px;
	cursor: pointer;
}
.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver::-webkit-scrollbar-thumb:hover {
	background: #84dc09;
}
@media (max-width: 1000px) {
	.actualizaciones-reglas > .contenido {
		padding: 30px 12px 30px 12px;
		height: max-content;
	}
	.actualizaciones-reglas > .contenido > .info {
		flex-direction: column;
		height: max-content;
	}
	.actualizaciones-reglas > .contenido > .info > .reglas_act {
		width: 100%;
		height: max-content;
	}
	.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver {
		overflow: hidden;
		height: max-content;
	}
}

@media (max-width: 700px) {
	.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver {
		flex-direction: column;
	}
	.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver > * {
		width: 100%;
	}
}

@media (max-width: 480px) {
	.actualizaciones-reglas > .contenido > .info > .img {
		width: 100%;
	}
	.actualizaciones-reglas > .contenido > .info {
		padding-top: 60px;
	}
}
</style>
<style>
.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver > :first-child {
	background: linear-gradient(179deg, #49ff0066, transparent);
}
.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver > :last-child {
	background: linear-gradient(179deg, #29641157, transparent);
}
.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver > * {
	height: max-content;
	border-radius: 10px;
	width: 50%;
}
.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver > * > .p-dataview-content {
	border-radius: 10px;
	background: transparent !important;
}
.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver > * > .p-dataview-content > .lista > .item > .info > .header {
	background-color: #0b2600ba;
	padding: 4px 4px 4px 30px;
}
.actualizaciones-reglas > .contenido > .info > .reglas_act > .ver > * > .p-dataview-content > .lista > .item > .info > .header > .fecha {
	background: transparent !important;
	border: 2px solid white;
	text-wrap: nowrap;
	width: max-content;
	border-radius: 50px;
	padding: 4px 8px;
}
.mover {
	position: relative;
	top: -10px;
	right: 10px;
}
.tag-nuevo-fuego {
	background-image: url("/assets/img/control-regla/nuevo.png");
	background-repeat: no-repeat;
	background-size: contain;
	height: 82px;
	width: 32px;
}
.tag-nuevo-fuego > img {
	mix-blend-mode: screen;
	transform: rotate(90deg);
	position: relative;
	top: 0;
	left: 0;
	height: 100px;
	width: 110px;
	translate: -41px 3px;
}
</style>