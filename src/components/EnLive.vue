<template>
	<div class="live-root">
		<Panel>
			<template #header>
				<div class="flex align-items-center gap-2 flex-end flex-wrap w-full">
					<h1 class="m-0">Conectar Live</h1>
					<div class="botones flex flex-wrap gap-2">
						<Button label="Conectar Live" v-if="!storeSocket.isConnected" icon="pi pi-video" severity="danger" @click="conectarLive" />
						<Button label="Desconectar del Live" v-else icon="pi pi-video" severity="info" @click="desconectarLive" />
					</div>
				</div>
			</template>
			<div class="flex justify-content-center w-full mb-6">
				<DataTable :value="storeSocket.ultimosGifts" class="card-shadow lg:w-10 w-12 mt-4" sortField="regalos" :sortOrder="-1">
					<template #header>
						<div class="flex w-full flex-column justify-content-between align-items-center text-start text-white">
							<h2 class="m-0">Recientes</h2>
						</div>
					</template>
					<template #empty>
						<p class="w-full font-bold text-center">Sin recientes</p>
					</template>
					<Column field="nickname" header="Usuario" />
					<Column field="profilePictureUrl" header="">
						<template #body="props">
							<Avatar :image="props.data.profilePictureUrl" shape="circle" size="xlarge" />
						</template>
					</Column>
					<Column field="giftName" header="Regalo">
						<template #body="props">
							<div class="flex flex-column gap-1 w-max align-items-center">
								<Avatar v-badge.info="props.data.cant" class="p-overlay-badge" :image="props.data.giftPictureUrl" size="xlarge" />
								<span class="font-bold">{{ props.data.giftName }}</span>
							</div>
						</template>
					</Column>
				</DataTable>
			</div>
			<div class="flex justify-content-center w-full mt-2">
				<DataTable
					v-model:expandedRows="expandedHistorial"
					dataKey="userId"
					:value="storeSocket.historial"
					class="card-shadow lg:w-10 w-12 mt-4"
					sortField="totalRegalos"
					:sortOrder="-1"
				>
					<template #header>
						<div class="flex w-full flex-column justify-content-between align-items-center text-start text-white">
							<h2 class="m-0">Historial</h2>
						</div>
					</template>
					<template #empty>
						<p class="w-full font-bold text-center">Sin historial</p>
					</template>
					<Column expander style="width: 5rem" />
					<Column field="nickname" header="Usuario" />
					<Column field="profilePictureUrl" header="">
						<template #body="props">
							<Avatar :image="props.data.profilePictureUrl" shape="circle" size="xlarge" />
						</template>
					</Column>
					<Column field="totalRegalos" header="Regalos" />
					<template #expansion="props">
						<div class="p-3">
							<h3>Regalos enviados</h3>
							<div class="flex flex-wrap gap-5 justify-content-center">
								<div
									style="width: 110px"
									v-for="(regalo, index) in props.data.regalos.sort((r1, r2) => r2.cant - r1.cant)"
									:key="index"
									class="flex flex-column align-items-center card-shadow p-2 border-round overflow-hidden"
								>
									<img alt="Regalo" width="70" :src="regalo.giftPictureUrl" />

									<span class="w-full white-space-nowrap overflow-hidden text-overflow-ellipsis text-center">{{ regalo.giftName }}</span>
									<Badge :value="regalo.cant" :severity="getSeverity(index)" />
								</div>
							</div>
						</div>
					</template>
				</DataTable>
			</div>
		</Panel>
		<Toast position="bottom-right" group="toast_bottom" />
		<Dialog
			v-model:visible="modalUsuario"
			header="Conectar a Live"
			:style="{ width: '20rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:draggable="false"
			:pt="{
				root: 'border-none',
				mask: {
					style: 'backdrop-filter: blur(2px)',
				},
			}"
		>
			<div class="flex w-full flex-wrap flex-column justify-content-center gap-1">
				<label for="usuario">Usuario</label>
				<InputText v-model="usuario_admin" id="usuario" placeholder="Nombre de usuario de TikTok" />
			</div>
			<template #footer>
				<Button label="Conectar" @click="conectarLive" autofocus severity="success" />
			</template>
		</Dialog>
	</div>
</template>
<script>
import axios from "axios";
import { useStoreEvento, useSocketStore } from "../store";

export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		headers: {
			headers: {
				Authorization: null,
			},
		},
		storeSocket: null,
		store: null,
		expandedHistorial: {},
		modalUsuario: false,
		interval: null,
		miTTS: {
			usuario: null,
			isActivo: false,
			tipos_usuarios_permitidos: [],
			lista_usuarios_permitidos: [], //Un objeto con usuario e isHabilitado
			tipo_comentarios_permitidos: null,
			comando_comentario_permitido: null,
			max_top_gifters: 3, //Para cuándo el top gifters esté activado
			voz_tts: null,
			plantilla_mensaje: "{usuario} dice {comentario}",
		},
		misAlertas: { usuario: null, alertas: [], isActiva: false },
		usuario_admin: null,
	}),
	methods: {
		async getMisAlertas() {
			try {
				const resp = await axios.get(`${this.API}/alerta-sonido/usuario/${this.store.getId()}`, this.headers);
				const alt = typeof resp.data != "object" ? { usuario: null, alertas: [], isActiva: false } : resp.data;
				this.misAlertas = {
					...alt,
					alertas: alt.alertas.filter((a) => a.isHabilitada == true),
				};
			} catch (error) {
				switch (error.response.data.statusCode) {
					case 401:
						//Se le termino la sesión
						this.store.clearUser();
						this.$router.push("/login");
						break;
					default:
						this.$toast.add({
							severity: "error",
							summary: "Obtener alertas",
							detail: "Sucedió un error, comuníquese con soporte",
							life: 1500,
						});
						console.log("Error: ", error);
						break;
				}
			}
		},
		async getMiTTS() {
			try {
				const resp = await axios.get(`${this.API}/tts/usuario/${this.store.getId()}`, this.headers);
				if (typeof resp.data == "object") {
					this.miTTS = resp.data;
				}
			} catch (error) {
				switch (error.response.data.statusCode) {
					case 401:
						//Se le termino la sesión
						this.store.clearUser();
						this.$router.push("/login");
						break;
					default:
						this.$toast.add({
							severity: "error",
							summary: "Guardar configuración",
							detail: "Sucedió un error, comuníquese con soporte",
							life: 1500,
						});
						console.log("Error: ", error);
						break;
				}
			}
		},
		conectarLive() {
			let name = this.store.getUsuario().usuario;
			if (this.store.isAdmin()) {
				if (this.usuario_admin == null) {
					this.modalUsuario = true;
					return;
				} else {
					this.modalUsuario = false;
					name = this.usuario_admin;
					this.usuario_admin = null;
					this.storeSocket.usuario_conectar = name;
					this.storeSocket.actualizarConfig();
				}
			}
			const f = new Date();
			const id = `${name}_${f.getTime()}`;
			try {
				this.storeSocket.connect({ id, name }, this.miTTS, this.misAlertas);
			} catch (error) {
				this.desconectarLive();
				this.$toast.add({
					severity: "error",
					summary: "Conectar al Live",
					detail: "Sucedió un error conectado al Live",
					life: 1600,
				});
				console.log("Error en el socket:", error);
			}
		},
		desconectarLive() {
			try {
				this.storeSocket.disconnect();
				console.log("🔴 Socket desconectado");
			} catch (error) {
				console.log("No se pudo desconectar el socket:", error);
			}
		},
		getSeverity(index = 0) {
			if (index == 0) {
				return "success";
			} else if (index == 1) {
				return "info";
			} else if (index == 2) {
				return "warning";
			}
			return "secondary";
		},
	},
	async created() {
		this.store = useStoreEvento();
		if (!this.store.isActive()) {
			return;
		}
		this.storeSocket = useSocketStore();
		this.headers.headers.Authorization = `Bearer ${this.store.getToken()}`;
//Obtenemos la configuración local si la hay y conectamos el socket
		this.storeSocket.getConfigLocal();
		await this.getMiTTS();
		await this.getMisAlertas();
			this.storeSocket.actualizarConfig(this.miTTS, this.misAlertas);
		
		this.interval = setInterval(() => {
			const notificacion = this.storeSocket.notificaciones[0];
			if (notificacion) {
				this.$toast.add({
					...notificacion,
					life: 2000,
					group: "toast_bottom",
				});
				this.storeSocket.eliminarNotificacion(notificacion.id);
			}
		}, 1500);
	},
	beforeMount() {
		if (this.interval != null) {
			clearInterval(this.interval);
		}
	},
};
</script>
<style>
.live-root > .p-panel > .p-toggleable-content > .p-panel-content,
.live-root
	> .p-panel
	> .p-toggleable-content
	> .p-panel-content
	> div
	> .p-card
	*:not(
		.p-checkbox,
		.p-checkbox-icon,
		.p-checkbox.p-highlight .p-checkbox-box,
		.p-button,
		.p-slider,
		.p-slider-range,
		.p-radiobutton,
		.p-radiobutton-icon,
		.p-radiobutton.p-highlight .p-radiobutton-box
	),
.live-root > .p-panel > .p-toggleable-content > .p-panel-content,
.live-root
	> .p-panel
	> .p-toggleable-content
	> .p-panel-content
	> div
	> .p-datatable
	*:not(
		.p-checkbox,
		.p-checkbox-icon,
		.p-checkbox.p-highlight .p-checkbox-box,
		.p-button,
		.p-slider,
		.p-slider-range,
		.p-radiobutton,
		.p-radiobutton-icon,
		.p-radiobutton.p-highlight .p-radiobutton-box,
		.p-badge
	) {
	background: #2e2e2e;
}
.live-root > .p-panel > .p-toggleable-content > .p-panel-content {
	min-height: 100vh;
}
.live-root > .p-panel > .p-toggleable-content > .p-panel-content > div > .p-card > .p-card-body {
	padding: 8px 10px !important;
}

.card-shadow {
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>