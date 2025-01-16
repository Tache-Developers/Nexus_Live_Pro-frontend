<template>
	<div class="appBarContainer">
		<Toast group="appBar" />
		<Sidebar v-model:visible="visibleSidebar">
			<Menu :model="itemsMenu" class="w-full">
				<template #submenuheader="{ item }">
					<span class="text-primary-500 dark:text-primary-400 font-bold leading-none">{{ item.label }}</span>
				</template>

				<template #item="{ item, props }">
					<router-link :to="item.route" v-if="!item.children" v-slot="{ href }" custom>
						<a v-ripple :href="href" v-bind="props.action" aria-hidden="false" @click="actionMenu(item.action)">
							<span :class="item.icon" class="mr-2" />
							<span>{{ item.label }}</span>
						</a>
					</router-link>
					<div v-else>
						<a
							v-ripple
							v-styleclass="{
								selector: '@next',
								enterClass: 'hidden',
								enterActiveClass: 'slidedown',
								leaveToClass: 'hidden',
								leaveActiveClass: 'slideup',
							}"
							class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple"
						>
							<span :class="item.icon" class="mr-2" />
							<span class="font-medium">{{ item.label }}</span>
							<i class="pi pi-chevron-down ml-auto"></i>
						</a>
						<ul class="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
							<li v-for="(child, index) in item.children" :key="index">
								<router-link :to="child.route" v-slot="{ href }" custom>
									<a
										v-ripple
										class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple"
										:href="href"
										v-bind="props.action"
										aria-hidden="false"
										@click="actionMenu(item.action)"
									>
										<span :class="child.icon" class="mr-2" />
										<span class="font-medium">{{ child.label }}</span>
									</a>
								</router-link>
							</li>
						</ul>
					</div>
				</template>
			</Menu>
		</Sidebar>
		<Menubar class="appBar" :model="sinMenu">
			<template #start>
				<div class="flex gap-2 align-items-center">
					<Button icon="pi pi-bars" text size="large" @click="visibleSidebar = true" />
					<a href="/" style="text-decoration: none">
						<span class="text-2xl font-bold logo">
							<span>Nexus</span>
							Live Pro
						</span>
					</a>
				</div>
			</template>

			<template #end>
				<div class="flex flex-wrap justify-content-end align-items-center gap-2 info-perfil">
					<CalendarioUsuario v-if="!store.isAdmin()" />
					<Tag v-if="!store.isAdmin()" severity="info" rounded :value="`Créditos: ${creditos}`" />
					<a style="cursor: pointer !important" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
						<Avatar
							v-if="store.isAdmin() || store.getFoto().length == 0"
							icon="pi pi-user"
							class="mr-2"
							shape="circle"
							style="background-color: var(--primary-color); color: #2a1261"
						/>
						<Avatar v-else :image="store.getFoto()" class="mr-2" shape="circle" />
					</a>
					<Menu ref="menu" id="overlay_menu" :model="itemsUsuario" :popup="true" :focusedOptionId="null" :aria-activedescendant="false">
						<template #start>
							<button
								v-ripple
								class="relative overflow-hidden w-full p-link flex items-center p-2 pl-3 text-surface-700 dark:text-surface-0/80 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-none"
							>
								<Avatar v-if="store.isAdmin() || store.getFoto().length == 0" icon="pi pi-user" class="mr-2" shape="circle" />
								<Avatar v-else :image="store.getFoto()" class="mr-2" shape="circle" />

								<span class="inline-flex flex-column justify-start">
									<span class="font-bold">{{ usuarioLog.usuario }}</span>
									<span class="text-sm">{{ usuarioLog.rol }}</span>
								</span>
							</button>
						</template>

						<template #item="{ item, props }">
							<a v-ripple class="flex items-center" @click="actionMenu(item.action)" v-bind="props.action">
								<span :class="item.icon" />
								<span class="ml-2">{{ item.label }}</span>
							</a>
						</template>
					</Menu>
				</div>
			</template>
		</Menubar>
		<dialogMiPerfil :mostrarMiPerfil="mostrarPerfil" @dialogPerfilOculto="mostrarPerfil = false" />
		<dialogEditarPerfil :mostrarEditar="mostrarEditar" @dialogEditarOculto="mostrarEditar = false" @perfilActualizado="getNewDatos" />
		<Insignias v-if="store.isAdmin()" :mostrarInsigniasProp="mostrarInsignias" @dialogOculto="mostrarInsignias = false"></Insignias>
		<Dialog
			v-model:visible="addCreador"
			maximizable
			:header="store.isAdmin() ? 'Credenciales backstage' : 'Agregar creador'"
			:style="{ width: store.isAdmin() ? '34rem' : '45rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="top"
			:modal="true"
			:draggable="false"
		>
			<div v-if="store.isAdmin()">
				<form ref="formAdd">
					<div class="flex flex-column gap-1 mb-2">
						<label for="correo" class="font-bold block">Correo</label>
						<InputText v-model="paquete.correo" type="email" placeholder="Correo" id="correo" />
					</div>
					<div class="flex flex-column gap-1 mb-2">
						<label for="contrasena" class="font-bold block">Contraseña</label>
						<InputText v-model="paquete.contrasena" type="text" placeholder="Contraseña" id="contrasena" />
					</div>
				</form>
			</div>
			<div v-else>
				<h2 class="m-0">Credenciales backstage</h2>
				<div class="flex flex-column gap-1">
					<label for="correo" class="font-bold block">Correo</label>
					<InputText v-model="paquete.correo" disabled type="email" placeholder="Correo" id="correo" />
				</div>
				<div class="flex flex-column gap-1">
					<label for="contrasena" class="font-bold block">Contraseña</label>
					<InputText v-model="paquete.contrasena" disabled type="text" placeholder="Contraseña" id="contrasena" />
				</div>
				<div class="mt-2 mb-3">
					<h3 class="m-0">Guía</h3>
					<video width="100%" autoplay="false" muted height="300px" controls>
						<source
							src="https://res.cloudinary.com/dq2sbqjgf/video/upload/v1711917204/tutoriales/byfp8ygyo7kdv1ueclwf.mp4"
							type="video/mp4"
						/>
					</video>
				</div>
				<p>Inicia sesión con las credenciales y agrega al creador</p>
				<iframe
					title="TikTok Backstage"
					height="800px"
					width="100%"
					src="https://live-backstage.tiktok.com/login/"
					frameborder="0"
				></iframe>
			</div>
			<template #footer>
				<Button label="Cerrar" @click="addCreador = false" text severity="danger" />
				<div class="flex gap-2" v-if="store.isAdmin()">
					<Button :label="paquete.estado == 'Activado' ? 'Desactivar' : 'Activar'" severity="warning" @click="cambiarEstadoBackstage" />
					<Button label="Agregar" @click="modificarCredenciales" severity="success" />
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script>
import axios from "axios";
import { useStoreEvento } from "../store";
import dialogMiPerfil from "./MiPerfil.vue";
import dialogEditarPerfil from "./EditarPerfil.vue";
import EventoEspecial from "./EventoEspecial.vue";
import Insignias from "./Insignias.vue";
import CalendarioUsuario from "./CalendarioUsuario.vue";
export default {
	props: {
		creditos: {
			type: String,
			default: "0",
		},
	},
	components: {
		dialogMiPerfil,
		dialogEditarPerfil,
		Insignias,
		EventoEspecial,
		CalendarioUsuario,
	},
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		store: null,
		sinMenu: [],
		itemsMenu: [],
		itemsUsuario: [],
		mostrarInsignias: false,
		mostrarPerfil: false,
		mostrarEditar: false,
		usuarioLog: {
			usuario: null,
			rol: null,
			correo: null,
			telefono: null,
		},
		visibleSidebar: false,
		addCreador: false,
		paquete: {
			correo: null,
			contrasena: null,
			estado: "Desactivado",
		},
	}),
	methods: {
		toggle(event) {
			this.$refs.menu.toggle(event);
		},
		actionMenu(action) {
			this.visibleSidebar = false;
			if (action) {
				action = action.toLowerCase();
			}
			switch (action) {
				case "perfil":
					this.mostrarPerfil = true;
					break;

				case "editar_perfil":
					this.mostrarEditar = true;
					break;

				case "cerrar_sesión":
					this.cerrarSesion();
					break;
				case "insignia_abrir":
					this.mostrarInsignias = true;
					break;
				case "add_creador":
					this.addCreador = true;
					break;
			}
		},
		async getDatosUsuario() {
			await axios
				.get(`${this.API}/usuario/${this.store.getId()}`, {
					headers: {
						Authorization: `Bearer ${this.store.getToken()}`,
					},
				})
				.then((response) => {
					this.usuarioLog.usuario = response.data.usuario;
					this.usuarioLog.rol = response.data.rol;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({group:"appBar", severity: "error", summary: "Datos del usuario", detail: "Ocurrió un problema inesperado!", life: 1600 });
							console.log("Error: ", error);
							break;
					}
				});
		},
		async getNewDatos() {
			await axios
				.get(`${this.API}/usuario/${this.store.getId()}`, {
					headers: {
						Authorization: `Bearer ${this.store.getToken()}`,
					},
				})
				.then((response) => {
					this.store.newDatos(response.data);
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
					}
				});
		},
		async modificarCredenciales() {
			if (this.paquete.correo != null && this.paquete.contrasena != null) {
				const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (isEmail.test(this.paquete.correo)) {
					await axios
						.post(`${this.API}/usuario/credencialesBackstage`, this.paquete, {
							headers: {
								Authorization: `Bearer ${this.store.getToken()}`,
							},
						})
						.then((r) => {
							if (r.data) {
								this.addCreador = false;
							}
							this.$toast.add({group:"appBar",
								severity: "success",
								summary: "Credenciales backstage",
								detail: r.data ? "Credenciales actualizadas correctamente" : "No se pudo actualizar las credenciales",
								life: 1600,
							});
						})
						.catch((error) => {
							switch (error.response.data.statusCode) {
								case 401:
									//Se le termino la sesión
									this.store.clearUser();
									this.$router.push("/login");
									break;
								default:
									this.$toast.add({group:"appBar", severity: "error", summary: `Sucedió un problema`, detail: error.response.data.message, life: 1500 });
									console.log("Error: ", error);
									break;
							}
						});
				} else {
					this.$toast.add({group:"appBar" ,severity: "error", summary: "Credenciales", detail: "Ingresa un correo válido", life: 1600 });
				}
			} else {
				this.$toast.add({group:"appBar", severity: "error", summary: "Credenciales", detail: "Debes llenar todos los campos", life: 1600 });
			}
		},
		async getBackstage() {
			await axios
				.get(`${this.API}/usuario/backstage`, {
					headers: {
						Authorization: `Bearer ${this.store.getToken()}`,
					},
				})
				.then((response) => {
					if (response.data) {
						this.paquete = { ...response.data };
					}
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({group:"appBar", severity: "error", summary: "Backstage", detail: "Sucedió un problema", life: 1600 });
							console.log("Error: ", error);
							break;
					}
				});
		},
		async cambiarEstadoBackstage() {
			this.paquete.estado = this.paquete.estado == "Activado" ? "Desactivado" : "Activado";
			await axios
				.put(
					`${this.API}/usuario/estadoBackstage`,
					{ estado: this.paquete.estado },
					{
						headers: {
							Authorization: `Bearer ${this.store.getToken()}`,
						},
					}
				)
				.then((r) => {
					this.$toast.add({group:"appBar",
						severity: "success",
						summary: "Estado backstage",
						detail: r.data ? "Estado cambiado correctamente" : "No se pudo cambiar el estado",
						life: 1600,
					});
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({group:"appBar", severity: "error", summary: `Sucedió un problema`, detail: error.response.data.message, life: 1500 });
							console.log("Error: ", error);
							break;
					}
				});
		},
		cerrarSesion() {
			this.store.clearUser();
			this.$router.push("/login");
		},
	},
	async created() {
		this.store = useStoreEvento();
		const admin = this.store.isAdmin();
		await this.getBackstage();
		if (admin) {
			this.itemsMenu = [
				{
					separator: true,
				},
				{
					label: "Creadores",
					items: [
						{
							label: "Gestionar Creador",
							icon: "pi pi-users",
							route: "/panel/creadores",
						},
						{
							label: "Configuración Bonus",
							icon: "pi pi-money-bill",
							route: "/panel/bonus",
						},
						{ label: "Tabla seleccionados", icon: "pi pi-table", route: "/panel/tablas" },
						{
							label: "Premios Aleatorios",
							icon: "pi pi-wallet",
							route: "/panel/aleatorios",
						},
						{
							label: "Gestionar Promoción",
							icon: "pi pi-thumbs-up-fill",
							route: "/panel/promocion",
						},
						{
							label: "Regalos",
							icon: "pi pi-gift",
							route: "/panel/regalos",
						},
						{
							label: "Agregar creadores",
							icon: "pi pi-user-plus",
							action: "add_creador",
							route: "#action",
						},
					],
				},
				{
					label: "Eventos",
					items: [
						{
							label: "Gestionar Eventos",
							icon: "pi pi-calendar-plus",
							route: "/panel/evento",
						},
						{
							label: "Eventos Especiales",
							icon: "pi pi-flag-fill",
							route: "/panel/eventoEspecial",
						},
						{
							label: "Vista Previa",
							icon: "pi pi-desktop",
							route: "/evento",
						},
						{
							label: "Batallas",
							icon: "pi pi-calendar-plus",
							route: "/panel/batalla",
						},
					],
				},
				{
					separator: true,
				},
				{
					label: "Tienda",
					items: [
						{
							label: "Deseos",
							icon: "pi pi-gift",
							route: "/panel/deseos",
						},
					],
				},
				{
					separator: true,
				},
				{
					label: "Administración",
					items: [
						{ label: "Proveedores", icon: "pi pi-sitemap", route: "/panel/proveedores" },
						{ label: "Reuniones", icon: "pi pi-calendar", route: "/panel/reuniones" },
						{
							label: "Insignias",
							icon: "pi pi-star",
							action: "insignia_abrir",
							route: "#action",
						},
						{
							label: "Entregar Premios",
							icon: "pi pi-gift",
							route: "/panel/asignar",
						},
						{
							label: "Control de reglas",
							icon: "pi pi-sliders-h",
							route: "/panel/reglas",
						},
						{
							label: "Mi perfil",
							icon: "pi pi-user",
							action: "perfil",
							route: "#action",
						},
						{
							label: "Editar perfil",
							icon: "pi pi-user-edit",
							action: "editar_perfil",
							route: "#action",
						},
						{
							label: "Cerrar sesión",
							icon: "pi pi-sign-out",
							action: "cerrar_sesión",
							route: "#action",
						},
					],
				},
			];
			this.itemsUsuario = [
				{
					label: "Mi perfil",
					icon: "pi pi-user",
					action: "perfil",
				},
				{
					label: "Editar perfil",
					icon: "pi pi-user-edit",
					action: "editar_perfil",
				},
				{
					label: "Cerrar sesión",
					icon: "pi pi-sign-out",
					action: "cerrar_sesión",
				},
			];
		} else {
			//Verificamos el estado del backstage
			this.itemsMenu = [
				{
					separator: true,
				},
				{
					label: "Principal",
					icon: "pi pi-user",
					route: "/panel/bonus",
				},
				{
					label: "Promoción",
					icon: "pi pi-thumbs-up-fill",
					children: [
						{ label: "Crear orden", icon: "pi pi-cart-plus", route: "/panel/ordenar" },
						{ label: "Ordenes", icon: "pi pi-shopping-cart", route: "/panel/ordenes" },
						{ label: "Servicios", icon: "pi pi-list", route: "/panel/servicios" },
						{ label: "Agregar fondos", icon: "pi pi-money-bill", route: "/panel/agregarfondos" },
					],
				},
				{
					label: "Deseos",
					icon: "pi pi-gift",
					route: "/panel/deseos",
				},
				{
					label: "Evento",
					icon: "pi pi-calendar-plus",
					route: "/evento",
				},
				{
					label: "Eventos Especiales",
					icon: "pi pi-flag-fill",
					route: "/EventoEspecialView",
				},
				{
					label: "Batallas",
					icon: "pi pi-calendar-plus",
					route: "/panel/batalla",
				},
				{
					label: "DuckRacer",
					icon: "pi pi-dollar",
					route: "/duckracer",
				},
				{
					separator: true,
				},
				{
					label: "Administración",
					items: [
						{
							label: "Mi perfil",
							icon: "pi pi-user",
							route: "/panel/bonus",
						},
						{
							label: "Mis premios",
							icon: "pi pi-gift",
							route: "/panel/premio",
						},
						{
							label: "Control de reglas",
							icon: "pi pi-sliders-h",
							route: "/actualizaciones-reglas",
						},
						{
							label: "Editar perfil",
							icon: "pi pi-user-edit",
							action: "editar_perfil",
							route: "#action",
						},
						{
							label: "Cerrar sesión",
							icon: "pi pi-sign-out",
							action: "cerrar_sesión",
							route: "#action",
						},
					],
				},
			];

			if (this.paquete.estado == "Activado") {
				this.itemsMenu.splice(2, 0, {
					label: "Agregar creadores",
					icon: "pi pi-user-plus",
					action: "add_creador",
					route: "#action",
				});
			}

			this.itemsUsuario = [
				{
					label: "Editar perfil",
					icon: "pi pi-user-edit",
					action: "editar_perfil",
				},
				{
					label: "Cerrar sesión",
					icon: "pi pi-sign-out",
					action: "cerrar_sesión",
				},
			];
		}
		this.getDatosUsuario();
	},
};
</script>

<style>
.appBar {
	background-color: #1f2937 !important;
	border-radius: 0 !important;
	border: 0 !important;
	/* padding: 0 200px; */
}
.info-perfil > span.p-tag {
	width: auto !important;
	text-align: center;
}
.opciones {
	padding: 0 50px !important;
}

.p-sidebar-content > div,
.p-sidebar-content > .p-menu.p-component > .p-menu-end > .p-menu.p-component {
	background: none !important;
	border: 0 !important;
	min-width: 100% !important;
	border-radius: 0 !important;
	height: 100% !important;
}

.p-menu .p-submenu-header {
	background: none !important;
}

.p-panel .p-panel-header {
	border-top-left-radius: 0 !important;
	border-top-right-radius: 0 !important;
}

.logo {
	color: #fff;
	font-size: 2em;
	font-weight: 700;
	text-decoration: none;
}

.logo > span {
	color: #84dc16;
}
@media (max-width: 1012px) {
	.opciones {
		padding: 0 30px !important;
	}
}
@media (max-width: 972px) {
	.opciones {
		padding: 0 20px !important;
	}
}
@media (max-width: 909px) {
	.opciones {
		padding: 0 0 !important;
	}
}
</style>
