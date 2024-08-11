<template>
	<div class="home">
		<NavBar />
		<div class="inicio w-full">
			<div class="transmite w-full flex justify-content-between align-items-center line-height-1 py-3" style="word-wrap: break-word">
				<div class="descripcion-transmite pl-6">
					<p class="m-0 text-4xl">¡TRANSMITE EN VIVO DESDE</p>
					<p class="m-0 text-5xl">CUALQUIER LUGAR!</p>
				</div>
				<div class="accion pr-6">
					<div class="mas-info">MÁS INFORMACIÓN</div>
				</div>
			</div>
			<div class="sobre-nosotros w-full flex">
				<div class="nexus">
					<div class="marco" />
				</div>
				<div class="descripcion p-5">
					<h2 class="mt-0">SOBRE NOSOTROS</h2>
					<p class="m-0">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, nobis! Facere culpa minus, quia obcaecati quisquam itaque,
						labore natus repellat quis earum fugit beatae id sit odit tempora esse facilis!
					</p>
				</div>
			</div>
			<div class="resenas">
				<img src="/assets/img/home/resenas-bottom.png" class="resenas-top" alt="Reseñas" />
				<div class="contenido mt-8 pt-8 flex flex-column align-items-center">
					<h2 class="text-center text-4xl">RESEÑAS</h2>
					<div class="resenas-usuario">
						<VueCarousel
							v-bind="settings"
							v-model="currentSlide"
							:autoplay="2000"
							:transition="500"
							:wrap-around="true"
							:breakpoints="breakpoints"
						>
							<VueSlide v-for="(resena, index) in resenas" :key="index">
								<div class="marco-resena carousel__item">
									<div class="border-round container-foto w-full flex justify-content-center">
										<img :src="resena.foto" :alt="resena.nombre" class="border-circle" />
									</div>
									<div class="contenedor-resena flex flex-column">
										<h2 class="mt-1 mb-2 font-bold">{{ resena.nombre }}</h2>
										<ScrollPanel :unstyled="true" class="descripcion" style="width: 100%; height: 150px; overflow: auto !important">
											<p class="m-0 text-black-alpha-90">{{ resena.descripcion }}</p>
										</ScrollPanel>
										<div class="estrellas w-full flex gap-3 pt-2 mt-auto justify-content-center">
											<img
												v-for="estrella in resena.estrellas"
												:key="estrella"
												src="/assets/img/home/estrella_llena.png"
												alt="Estrella calificada"
												class="estrella"
											/>
											<img
												v-for="estrella in 5 - resena.estrellas"
												:key="estrella"
												src="/assets/img/home/estrella_vacia.png"
												alt="Estrella sin calificar"
												class="estrella"
											/>
										</div>
									</div>
								</div>
							</VueSlide>
							<template #addons>
								<div class="flex gap-2 justify-content-center">
									<div
										v-for="slide in resenas.length"
										:key="slide"
										@click="currentSlide = slide"
										:class="`border-circle cursor-pointer slide ${currentSlide == slide ? 'active' : ''}`"
									/>
								</div>
							</template>
						</VueCarousel>
						<!-- <Carousel
							:value="resenas"
							:numVisible="3"
							circular
							:autoplayInterval="8200"
							:showNavigators="false"
							:numScroll="1"
							:responsiveOptions="responsiveOptions"
						>
							<template #item="props">
								<div class="marco-resena">
									<div class="border-round container-foto w-full flex justify-content-center">
										<img :src="props.data.foto" :alt="props.data.nombre" class="border-circle" />
									</div>
									<div class="h-full border-round contenedor-resena flex flex-column">
										<h2 class="mb-2 font-bold">{{ props.data.nombre }}</h2>
										<p class="m-0">{{ props.data.descripcion }}</p>
										<div class="estrellas w-full flex gap-2">
											<img
												v-for="estrella in props.data.estrellas"
												:key="estrella"
												src="/assets/img/home/estrella_llena.png"
												alt="Estrella calificada"
												class="estrella"
											/>
											<img
												v-for="estrella in 5 - props.data.estrellas"
												:key="estrella"
												src="/assets/img/home/estrella_vacia.png"
												alt="Estrella sin calificar"
												class="estrella"
											/>
										</div>
									</div>
								</div>
							</template>
						</Carousel> -->
					</div>
				</div>
				<img src="/assets/img/home/resenas-bottom.png" class="resenas-bottom" alt="Reseñas" />
				<video src="/assets/video/home/bg-espacio.mp4" autoplay muted loop class="fondo_resena w-full">
					<source src="/assets/video/home/bg-espacio.mp4" type="video/mp4" />
				</video>
			</div>
		</div>
		<Footer id="footer" />
	</div>
</template>
<script>
import axios from "axios";

export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		currentSlide: 0,
		clasificados: [
			{
				usuario: "x",
				foto: "",
			},
			{
				usuario: "x",
				foto: "",
			},
			{
				usuario: "x",
				foto: "",
			},
		],
		responsiveOptions: [
			{
				breakpoint: "1400px",
				numVisible: 3,
				numScroll: 1,
			},
			{
				breakpoint: "1199px",
				numVisible: 3,
				numScroll: 1,
			},
			{
				breakpoint: "991px",
				numVisible: 2,
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
		settings: {
			itemsToShow: 3,
			snapAlign: "start",
		},
		// breakpoints are mobile first
		// any settings not specified will fallback to the carousel settings
		breakpoints: {
			0: {
				itemsToShow: 1,
				snapAlign: "start",
			},
			620: {
				itemsToShow: 2,
				snapAlign: "start",
			},
			// 700px and up
			700: {
				itemsToShow: 2,
				snapAlign: "start",
			},
			// 1024 and up
			1024: {
				itemsToShow: 3,
				snapAlign: "start",
			},
		},
		novedades: [],
		resenas: [
			{
				nombre: "Juan",
				foto: "/assets/img/perfil1.jpg",
				descripcion: "Lorem ipsum dolor",
				estrellas: 5,
			},
			{
				nombre: "Luis",
				foto: "/assets/img/perfil2.jpg",
				descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, ipsum id malesuada sagittis, mauris velit",
				estrellas: 4,
			},
			{
				nombre: "Pedro",
				foto: "/assets/img/perfil3.jpg",
				descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, ipsum id malesuada sagittis, mauris velit",
				estrellas: 3,
			},
			{
				nombre: "Maria",
				foto: "/assets/img/perfil1.jpg",
				descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, ipsum id malesuada sagittis, mauris velit",
				estrellas: 2,
			},
		],
	}),
	async created() {
		/* await axios.get(`${this.API}/regla-actualizacion/nuevas`).then((resp) => {
			this.novedades = resp.data;
		});
		await axios.get(`${this.API}/usuario/homeCreadores`).then((resp) => {
			this.clasificados = resp.data;
		}); */
	},
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Lato&family=Raleway&display=swap");
@import url("https://fonts.googleapis.com/css?family=Playfair+Display:400,900");

.slide {
	height: 18px;
	width: 18px;
	border: 2px solid #de4740;
	background: transparent;
}

.slide.active {
	background-color: #de4740;
}

.carousel__slide {
	padding: 10px;
}

.carousel__viewport {
	perspective: 2000px;
}

.carousel__track {
	transform-style: preserve-3d;
}

.carousel__slide--sliding {
	transition: 0.5s;
}

.carousel__slide {
	transform: rotateY(-20deg) scale(0.9);
}

.carousel__slide--active ~ .carousel__slide {
	transform: rotateY(20deg) scale(0.9);
}

body,
html {
	margin: 0;
	padding: 0;
	min-height: 100vh;
	background: #000000;
	box-sizing: border-box;
	scroll-behavior: smooth !important;
}
.transmite {
	background-image: url("/assets/img/home/bg-transmite.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	font-weight: bold;
	height: max-content;
}

.transmite > .accion > .mas-info {
	background-image: url("/assets/img/home/btn-mas-info.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	height: 82px;
	padding: 32px 73px 32px 86px;
	font-size: medium;
	text-align: center;
	font-style: italic;
	width: 340px;
	mix-blend-mode: screen;
}

@media (max-width: 972px) {
	.transmite > .descripcion-transmite {
		width: 47%;
	}
	.transmite > .accion > .mas-info {
		width: 100%;
	}
	.transmite > .accion {
		width: 53%;
		padding-left: 50px;
		padding-right: 20px;
	}
}

@media (max-width: 779px) {
	.transmite > .accion > .mas-info {
		padding: 33px 68px 27px 77px;
		font-size: 14px !important;
	}
}

@media (max-width: 716px) {
	.transmite > .accion > .mas-info {
		padding: 35px 63px 25px 69px;
	}
}

@media (max-width: 700px) {
	.inicio > .sobre-nosotros {
		flex-direction: column;
	}
	.inicio > .sobre-nosotros > * {
		width: 100% !important;
	}
}

@media (max-width: 691px) {
	.transmite > .accion > .mas-info {
		padding: 35px 59px 25px 65px;
	}
}
@media (max-width: 676px) {
	.transmite > .accion > .mas-info {
		padding: 35px 57px 25px 64px;
		font-size: 13px !important;
	}
}

@media (max-width: 652px) {
	.transmite > .accion > .mas-info {
		padding: 35px 57px 25px 64px;
		font-size: 12px !important;
	}
}

@media (max-width: 634px) {
	.transmite > .accion > .mas-info {
		padding: 35px 46px 25px 60px;
		font-size: 12px !important;
	}
}

@media (max-width: 605px) {
	.transmite > .accion > .mas-info {
		padding: 35px 47px 25px 55px;
	}
}

@media (max-width: 600px) {
	.transmite {
		flex-direction: column;
		padding: 15px 22px;
	}
	.transmite > * {
		width: 100% !important;
		text-align: center;
	}
	.transmite > .descripcion-transmite {
		padding: 0;
		padding-left: 0 !important;
	}

	.transmite > .accion > .mas-info {
		margin: 0 auto;
		width: 85%;
		font-size: medium !important;
	}

	.inicio > .resenas > .contenido {
		margin-top: 0 !important;
	}

	.inicio > .resenas > .contenido > h2 {
		margin-bottom: 0 !important;
	}
}

@media (max-width: 485px) {
	.transmite > .accion > .mas-info {
		width: 100% !important;
	}
}

@media (max-width: 440px) {
	.transmite > .accion {
		padding: 0;
		padding-left: 0 !important;
		padding-right: 0 !important;
	}
	.transmite > .accion > .mas-info {
		width: 100% !important;
	}
}

@media (max-width: 345px) {
	.transmite > .accion > .mas-info {
		width: 100% !important;
		font-size: 14px !important;
	}
}

@media (max-width: 300px) {
	.transmite > .accion > .mas-info {
		width: 100% !important;
		font-size: 12px !important;
	}
	img.estrella {
		width: 24px !important;
		height: 24px !important;
	}
}

@media (max-width: 270px) {
	.transmite > .accion > .mas-info {
		width: 100% !important;
		font-size: 11px !important;
	}
}

@media (max-width: 253px) {
	.transmite > .accion > .mas-info {
		width: 100% !important;
		font-size: 11px !important;
		padding: 36px 43px 25px 52px;
	}
}

@media (max-width: 235px) {
	img.estrella {
		width: 20px !important;
		height: 20px !important;
	}
}

@media (max-width: 200px) {
	img.estrella {
		width: 16px !important;
		height: 16px !important;
	}
}

.inicio > .sobre-nosotros > * {
	width: 50%;
}
.inicio > .sobre-nosotros > .nexus {
	background-image: url("/assets/img/home/bg-marco-nexus.png");
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
	padding: 40px 0;
}
.inicio > .sobre-nosotros > .nexus > .marco {
	background-image: url("/assets/img/home/marco-nexus.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	width: 100%;
	height: 450px;
	max-width: 600px;
	max-height: 450px;
}

.inicio > .resenas {
	background-repeat: no-repeat;
	background-size: 100% 100%;
	mix-blend-mode: screen;
	height: 840px;
}
.inicio > .resenas > video {
	height: 100%;
	object-fit: fill;
}

.inicio > .resenas > *,
.inicio > .resenas > .contenido > * {
	width: 100%;
}
.inicio > .resenas > .contenido {
	z-index: 999999;
	color: #000000;
	background: transparent;
	position: absolute;
	height: 652px;
}

.inicio > .resenas > img.resenas-top {
	position: absolute;
	mix-blend-mode: darken;
	background: #000000;
}

.inicio > .resenas > img.resenas-bottom {
	position: absolute;
	margin-top: calc(840px - 100px);
	height: 100px;
}

img.estrella {
	width: 34px;
	height: 34px;
}

.container-foto > img {
	width: 100px;
	height: 100px;
}

#about p {
	font-size: 14px;
	margin-bottom: 20px;
	color: #fff;
}

.container {
	--bs-gutter-x: 1.5rem;
	--bs-gutter-y: 0;
	width: 100%;
	padding-right: calc(var(--bs-gutter-x) * 0.5);
	padding-left: calc(var(--bs-gutter-x) * 0.5);
	margin-right: auto;
	margin-left: auto;
}

.position-relative {
	position: relative !important;
}

.row {
	--bs-gutter-x: 1.5rem;
	--bs-gutter-y: 0;
	display: flex;
	flex-wrap: wrap;
	margin-top: calc(-1 * var(--bs-gutter-y));
	margin-right: calc(-0.5 * var(--bs-gutter-x));
	margin-left: calc(-0.5 * var(--bs-gutter-x));
}

.row > * {
	flex-shrink: 0;
	width: 100%;
	max-width: 100%;
	padding-right: calc(var(--bs-gutter-x) * 0.5);
	padding-left: calc(var(--bs-gutter-x) * 0.5);
	margin-top: var(--bs-gutter-y);
}

@media (min-width: 992px) {
	.col-lg-6 {
		flex: 0 0 auto;
		width: 50%;
	}

	.col-lg-3 {
		flex: 0 0 auto;
		width: 25%;
	}
}

.fecha {
	background: transparent !important;
	border: 2px solid white;
	text-wrap: nowrap;
	width: max-content;
	border-radius: 50px;
	padding: 4px 8px;
}
</style>
<style>
body,
html {
	scroll-behavior: smooth !important;
}
.marco-resena {
	background: transparent !important;
	height: max-content;
	max-height: max-content !important;
	width: 100%;
	max-width: 100% !important;
}

.marco-resena > .container-foto {
	position: relative;
	bottom: -57px;
}

.marco-resena > .contenedor-resena {
	background: #ffffff !important;
	border-radius: 20px;
	padding: 55px 20px 20px 20px;
	height: 290px;
}

.marco-resena > .contenedor-resena > .descripcion {
	height: 230px;
	max-height: 230px;
	color: #000000;
}

.carousel__prev,
.carousel__next {
	box-sizing: content-box;
}

.resenas-usuario {
	height: 391px !important;
	max-height: 600px;
	width: 90% !important;
}
.resenas-usuario > * {
	width: 100% !important;
	height: 100% !important;
}

.resenas-usuario > .carousel > .carousel__viewport {
	height: 100% !important;
	width: 100% !important;
	background: transparent;
}
.resenas-usuario > .carousel > .carousel__viewport > .carousel__track {
	display: flex !important;
}

.resenas-usuario > .carousel > .carousel__viewport > .carousel__track > * {
	height: 400px !important;
	max-height: 400px !important;
}

.descripcion::-webkit-scrollbar {
	width: 8px;
}
.descripcion::-webkit-scrollbar-track {
	background: #555;
	border-radius: 10px;
	cursor: pointer;
}
.descripcion::-webkit-scrollbar-thumb {
	background: #5e951c;
	border-radius: 10px;
	cursor: pointer;
}
.descripcion::-webkit-scrollbar-thumb:hover {
	background: #84dc09;
}
</style>