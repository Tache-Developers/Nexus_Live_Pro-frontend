<template>
	<div>
		<appBar :creditos="creditosAppBar" />
		<div class="Panel">
			<main class="main">
				<router-view @actualizarSaldo="getNewSaldo" />
			</main>
		</div>
		<div class="mensajes">
			<div v-if="store.isAdmin()">
				<!-- Batallas en proceso, asistencia confirmada - asistencia confirmada -->
				<Message v-if="notificaciones.por_asignar.length > 0" severity="info">
					Hay {{ notificaciones.por_asignar.length }} {{ notificaciones.por_asignar.length == 1 ? "batalla" : "batallas" }} por asignar
					contrincante, ve a
					<router-link to="/panel/batalla">
						<a href="#">Batallas</a>
					</router-link>
					para asignarlos
				</Message>
				<Message v-if="notificaciones.batallas_proceso.length > 0" severity="success">
					Hay {{ notificaciones.batallas_proceso.length }} {{ notificaciones.batallas_proceso.length == 1 ? "batalla" : "batallas" }} en
					proceso, ve a
					<router-link to="/panel/batalla" v-slot="{ href }">
						<a :href="href">Batallas</a>
					</router-link>
					para seguirlas
				</Message>
			</div>
			<div v-else>
				<Message v-if="notificaciones.por_asignar.length > 0" severity="info">
					Esperando contrincante en {{ notificaciones.por_asignar.length }}
					{{ notificaciones.por_asignar.length == 1 ? "batalla" : "batallas" }}, revisa cuáles son en
					<router-link to="/panel/batalla">
						<a href="#">Batallas</a>
					</router-link>
				</Message>
				<Message v-if="notificaciones.asignado.length > 0" severity="success">
					Contrincante asignado en {{ notificaciones.asignado.length }} {{ notificaciones.asignado.length == 1 ? "batalla" : "batallas" }},
					ve a
					<router-link to="/panel/batalla" v-slot="{ href }">
						<a :href="href">Batallas</a>
					</router-link>
					para descubrirlos
				</Message>
				<Message v-if="notificaciones.batallas_proceso.length > 0" severity="warn">
					Tienes {{ notificaciones.batallas_proceso.length }} {{ notificaciones.batallas_proceso.length == 1 ? "batalla" : "batallas" }} en
					proceso, ve a
					<router-link to="/panel/batalla" v-slot="{ href }">
						<a :href="href">Batallas</a>
					</router-link>
					para verlas
				</Message>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		store: null,
		notificaciones: { por_asignar: [], batallas_proceso: [], asignado: [] },
		token: {
			headers: {
				Authorization: null,
			},
		},
		creditosAppBar: "0",
	}),
	methods: {
		getNewSaldo() {
			this.creditosAppBar = this.store.getSaldo;
		},
		async getNotificaciones() {
			await axios
				.get(
					`${this.API}/batalla/notificaciones/${this.store.getUsuario().rol == "Admin" ? "Admin" : this.store.getUsuario().usuario}`,
					this.token
				)
				.then((response) => {
					this.notificaciones = response.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({
								severity: "danger",
								summary: "Obteniendo notificaciones",
								detail: error.response.data.message,
								life: 1500,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
	},
	async created() {
		this.store = useStoreEvento();
		this.token.headers.Authorization = `Bearer ${this.store.getToken()}`;
		if (!this.store.isActive()) {
			this.$router.push("/login");
		}
		this.getNewSaldo();
		await this.getNotificaciones();
	},
};
</script>
<style scoped>
.panel {
	height: 100vh;
}

.mensajes {
	position: fixed;
	right: 55px;
	top: 3px;
}

* {
	border-width: 0 !important;
}
</style>
<style>
.p-tag {
	width: max-content !important;
}
</style>