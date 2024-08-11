<template>
	<div class="navbar">
		<video src="/assets/video/banner/fondo_banner.mp4" autoplay muted loop class="fondo_banner">
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
				<!-- <Button icon="pi pi-bars" class="botonMenu" text size="large" @click="visibleSidebar = true" />
			 -->
			</nav>
		</header>
		<!-- <div class="container-linea flex sm:justify-content-start md:justify-content-end w-full">
			<div class="linea xs:w-full sm:w-full md:w-6"></div>
		</div> -->
	</div>
</template>
<script>
export default {
	data: () => ({
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
	}),
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

header .logo {
	color: #fff;
	font-size: 2em;
	font-weight: 700;
	text-decoration: none;
}

header .logo span {
	color: #84dc16;
}

header nav {
	display: flex;
	gap: 15px;
}

.botonMenu {
	display: none;
}
@media (max-width: 960px) {
	header .logo {
		font-size: 1.5em;
	}
}
@media (max-width: 865px) {
	header .logo {
		font-size: 1.2em;
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

header nav a {
	color: #fff;
	font-weight: bold;
	font-size: 1.2em;
	text-decoration: none;
}
</style>
