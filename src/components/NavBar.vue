<template>
	<div class="navbar">
		<header class="w-full m-0">
			<nav class="w-full justify-content-center flex-wrap">
				<router-link to="/">Inicio</router-link>
				<router-link to="/">Acerca de</router-link>
				<router-link to="/evento">Eventos</router-link>
				<router-link to="/">Videos</router-link>
				<router-link to="/">Podcast</router-link>
				<router-link to="/">Contacto</router-link>
				<router-link to="/">Lista de programas</router-link>
				<router-link to="/">Grupos</router-link>
				<router-link to="/login">Login</router-link>
				<!-- <Button icon="pi pi-bars" class="botonMenu" text size="large" @click="visibleSidebar = true" />
			 -->
			</nav>
		</header>
		<TopCreador class="top-1-navBar" :top="1" :nombre="clasificados[0].usuario" :foto="clasificados[0].foto" />
		<video src="/assets/video/banner/fondo_banner.mp4" autoplay muted class="fondo_banner">
			<source src="/assets/video/banner/fondo_banner.mp4" type="video/mp4" />
		</video>
		<!-- <Sidebar v-model:visible="visibleSidebar">
			<Menu :model="itemsMenu" class="w-full">
				<template #submenuheader="{ item }">
					<span class="text-primary-500 dark:text-primary-400 font-bold leading-none">{{ item.label }}</span>
				</template>
				<template #item="{ item, props }">
					<router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
						<a v-ripple :href="href" v-bind="props.action" @click="navigate">
							<span :class="item.icon" />
							<span class="ml-2">{{ item.label }}</span>
						</a>
					</router-link>
				</template>
			</Menu>
		</Sidebar> -->

		<!-- <div class="container-linea flex sm:justify-content-start md:justify-content-end w-full">
			<div class="linea xs:w-full sm:w-full md:w-6"></div>
		</div> -->
	</div>
</template>
<script>
import axios from "axios";
export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		visibleSidebar: false,
		itemsMenu: [
			{
				separator: true,
			},
			{
				label: "Creadores",
				items: [
					{
						label: "Login Agencia",
						icon: "pi pi-users",
						route: "/login",
					},
				],
			},
			{
				label: "Eventos",
				items: [
					{
						label: "Eventos Activos",
						icon: "pi pi-desktop",
						route: "/evento",
					},
				],
			},
			{
				label: "EventosEspeciales",
				items: [
					{
						label: "Eventos Especiales",
						icon: "pi pi-desktop",
						route: "/EventoEspecialView",
					},
				],
			},
			{
				label: "Control Reglas",
				items: [
					{
						label: "Control Reglas",
						icon: "pi pi-sliders-h",
						route: "/actualizaciones-reglas",
					},
				],
			},
			{
				separator: true,
			},
			{
				label: "Juegos",
				items: [
					{
						label: "DuckRacer",
						icon: "pi pi-caret-right",
						route: "/duckracer",
					},
				],
			},
		],
		clasificados: [
			{
				usuario: "x",
				foto: "/assets/img/perfil1.jpg",
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
	}),
	async created() {
		await axios.get(`${this.API}/usuario/top`).then((resp) => {
			if (resp.data.length > 0) {
				this.clasificados = resp.data;
			}
		});
	},
};
</script>
<style scoped>
.navbar {
	display: flex;
	top: 0;
	width: 100%;
	max-width: 100vw;
	flex-direction: column;
	z-index: 3;
}

header {
	padding: 10px 20px 10px 10px;
	background-color: #000000;
	height: max-content;
}

.top-1-navBar {
	opacity: 0;
	animation: fadeIn 4s forwards;
	animation-delay: 7s;
}

@keyframes fadeIn {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

.fondo_banner {
	height: 500px;
	width: 100%;
	object-fit: fill;
}
.container-linea {
	position: relative;
	top: -4px;
}

.linea {
	background-image: url("/assets/img/header/header-line.png") !important;
	background-repeat: no-repeat !important;
	background-size: cover !important;
	z-index: 12;
	height: 4px;
}

header nav {
	display: flex;
	gap: 15px;
}

.botonMenu {
	display: none;
}

@media (max-width: 1000px) {
	.top-1-navBar {
		top: 80px !important;
	}
	.fondo_banner {
		height: 600px;
	}
}

@media (max-width: 907px) {
	.top-1-navBar {
		top: 140px !important;
	}
	.fondo_banner {
		height: 650px;
	}
}

@media (max-width: 739px) {
	/* header nav a {
		display: none;
	} */

	.botonMenu {
		display: flex;
	}
}

@media (max-width: 364px) {
	.top-1-navBar {
		top: 180px !important;
	}
}

@media (max-width: 291px) {
	.top-1-navBar {
		top: 245px !important;
	}
}

@media (max-width: 250px) {
	.top-1-navBar {
		width: 90% !important;
		left: 6% !important;
	}
}

header nav a {
	color: #fff;
	font-weight: bold;
	font-size: 1.2em;
	text-decoration: none;
}
</style>

<style>
@media (max-width: 250px) {
	.top-1-navBar > .marco {
		padding: 24px 15px 34px 16px !important;
	}
}
</style>
