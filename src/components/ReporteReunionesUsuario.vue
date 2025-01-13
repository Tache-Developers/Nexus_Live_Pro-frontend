<template>
	<div class="reuniones relative w-full flex flex-column align-items-center justify-content-center" v-if="reunionesConfig.activo">
		<div class="contenedor flex w-full px-6 py-5 gap-4 justify-content-center align-items-center">
			<div class="detalle-reuniones lg:w-6 overflow-auto p-1">
				<div class="lista-reuniones w-full relative flex flex-wrap gap-2 justify-content-evenly align-items-center">
					<div class="reunion flex flex-column" v-for="(reunion, index) in miCalendario.reuniones_bonus_actual" :key="index">
						<p class="m-0 text-sm uppercase font-gamers text-center">{{ reunion.asunto }}</p>
						<div class="acciones w-full flex flex-nowrap justify-content-between gap-2 font-gamers">
							<div
								class="ver text-sm border-900 border-1 uppercase cursor-pointer relative"
								@click="clickFecha(reunion._id)"
								v-tooltip.top="'Ver detalles'"
							>
								<span>Ver</span>
								<img src="/assets/img/reuniones/ver-reunion.gif" alt="Ver más" class="absolute" />
							</div>
							<span class="fecha text-sm border-900 border-1">{{ reunion.fecha.slice(0, 10) }}</span>
						</div>
						<div class="flex flex-wrap justify-content-center gap-2 estados font-gamers align-items-center">
							<span class="text-lg uppercase">Estado:</span>
							<img
								v-for="(estado, index) in estados"
								:key="index"
								:src="`/assets/img/reuniones/${estado.img}`"
								class="fadein animation-duration-100 estado"
								:class="{ cumple: cumpleEstado(estado.label, reunion._id) }"
								:alt="estado.label"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="divisor absolute my-2" />
			<div class="detalle-progreso lg:w-6 flex p-1 flex-column align-items-center justify-content-center">
				<h2 class="uppercase font-gamers text-center text-xl m-0">Progreso</h2>
				<div class="barra-progreso mt-2 relative flex flex-nowrap w-full" v-if="getReunionesDestacadas().length > 0">
					<div
						v-for="(reunion, index) in getReunionesDestacadas()"
						:key="index"
						class="reunion relative"
						:class="{ primero: index == 0, ultimo: index == getReunionesDestacadas().length - 1 }"
						:style="{ width: `${(1 / reunionesConfig.min_reuniones) * 100}%` }"
					>
						<div
							class="barra"
							:class="{
								asistio: asistiAReunion(reunion._id),
								primero: index == 0,
								ultimo: index == getReunionesDestacadas().length - 1,
							}"
						/>
						<img v-if="asistiAReunion(reunion._id)" src="/assets/img/reuniones/progreso-asisti.png" alt="Asistí" />
						<img v-else src="/assets/img/reuniones/progreso-no-asisti.png" alt="No asistí" />
					</div>
				</div>
				<span class="text-base mt-2 text-center font-gamers uppercase">
					{{ miCalendario.reuniones_asistencia.length }}/{{ reunionesConfig.min_reuniones }} reuniones completadas
				</span>
				<img src="/assets/img/perfil/divisor.png" alt="Divisor" height="4px" width="100%" />
				<div class="info-total flex gap-1 w-full justify-content-evenly mt-2">
					<div class="detalle-reuniones flex flex-nowrap gap-2">
						<div
							v-for="(reunion, index) in getReunionesDestacadas()"
							:key="index"
							class="reunion font-gamers uppercase text-center"
							:class="{ asistio: asistiAReunion(reunion._id) }"
						>
							<div class="asunto">
								<p class="m-0 text-base">{{ reunion.asunto }}</p>
							</div>
							<div class="fecha">
								<span class="text-sm">{{ reunion.fecha.slice(0, 10) }}</span>
							</div>
						</div>
					</div>
					<div class="detalle flex flex-column">
						<h2 class="text-center font-gamers text-2xl uppercase mt-3 mb-0">Total:</h2>
						<img
							v-if="miCalendario.reuniones_asistencia.length >= reunionesConfig.min_reuniones"
							src="/assets/img/reuniones/progreso-completado.png"
							alt="Completado"
							class="total"
						/>
						<img v-else src="/assets/img/reuniones/progreso-en-curso.png" alt="En curso" class="total" />
					</div>
				</div>
			</div>
		</div>
		<div class="advertencia flex flex-column font-gamers">
			<p class="m-0 text-center uppercase text-xl">
				Completar las reuniones mínimas {{ miCalendario.reuniones_asistencia.length }} de {{ reunionesConfig.min_reuniones }}
			</p>
			<span class="text-base text-center uppercase">Si no asiste a reuniones no podrá reclamar su premio.</span>
		</div>
		<div class="titulo">
			<img src="/assets/img/reuniones/aura-azul.gif" alt="Aura" class="aura izquierda" />
			<h1 class="m-0 font-gamers uppercase text-2xl text-center">Reuniones</h1>
			<img src="/assets/img/reuniones/aura-azul.gif" alt="Aura" class="aura derecha" />
		</div>

		<Dialog
			v-model:visible="modalDataReunion"
			:header="dataReunion.asunto"
			:style="{ width: '50rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:draggable="false"
			:modal="true"
		>
			<div class="flex w-full flex-wrap flex-column justify content-center gap-4">
				<div class="w-full flex flex-column gap-1">
					<label for="asunto" class="m-0 font-bold">Asunto</label>
					<InputText v-model="dataReunion.asunto" :readonly="true" :disabled="true" id="asunto" placeholder="Asunto de la reunión" />
				</div>
				<div class="w-full flex flex-column gap-1">
					<label for="fecha" class="m-0 font-bold">Fecha</label>
					<Calendar
						id="fecha"
						v-model="dataReunion.fecha"
						:readonly="true"
						:disabled="true"
						:minDate="new Date()"
						showTime
						hourFormat="24"
					/>
				</div>
				<div class="w-full flex flex-column gap-2 mt-2">
					<h2 class="m-0">Asistencia confirmada</h2>
					<DataTable
						:value="dataReunion.asistentes"
						dataKey="usuario"
						:filters="filtersAsistente"
						sortField="usuario"
						:sortOrder="1"
						paginator
						:rows="10"
						:rowsPerPageOptions="[5, 10, 20, 50]"
						class="pt-0"
						paginatorTemplate="PrevPageLink PageLinks NextPageLink RowsPerPageDropdown"
						:alwaysShowPaginator="false"
					>
						<template #header>
							<div class="flex flex-column w-full gap-2">
								<span class="p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filtersAsistente['global'].value" placeholder="Buscar..." />
								</span>
							</div>
						</template>
						<Column field="usuario" header="Creador" />
					</DataTable>
				</div>
			</div>
			<template #footer>
				<Button label="Cerrar" @click="modalDataReunion = false" autofocus text severity="danger" />
			</template>
		</Dialog>
	</div>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
import { FilterMatchMode, FilterOperator } from "primevue/api";
export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		store: null,
		headers: {
			headers: { Authorization: null },
		},
		filtersAsistente: {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		},
		referencias: [
			{ label: "Falló, no reclama", icon: "pi pi-times", severity: "danger" },
			{ label: "Pendiente", icon: "pi pi-hourglass", severity: "warning" },
			{ label: "Completado", icon: "pi pi-check", severity: "success" },
		],
		estados: [
			{ label: "Fallo", img: "fallo.png", description: "Falló, no reclama" },
			{ label: "Pendiente", img: "pendiente.png", description: "Pendiente" },
			{ label: "Asistio", img: "asistio.png", description: "Completado" },
		],
		miCalendario: { reuniones: [], reuniones_asistencia: [], reuniones_bonus_actual: [] },
		reunionesConfig: {
			min_reuniones: 0,
			activo: false,
		},
		dataReunion: { asunto: null, fecha: new Date(), estado: "Pendiente", asistentes: [] },
		modalDataReunion: false,
		itemsMostradoProgreso: 0,
	}),
	methods: {
		getReunionesDestacadas() {
			let reuniones = [];
			if (this.miCalendario.reuniones_asistencia.length >= this.reunionesConfig.min_reuniones) {
				reuniones = this.miCalendario.reuniones_asistencia.slice(0, this.reunionesConfig.min_reuniones);
			}
			reuniones = this.miCalendario.reuniones_asistencia.slice(0, this.reunionesConfig.min_reuniones);
			if (reuniones.length < this.reunionesConfig.min_reuniones) {
				const finalizados = this.miCalendario.reuniones_bonus_actual.filter((r) => r.estado == "Finalizada");
				for (let i = 0; i < finalizados.length; i++) {
					const reunion = finalizados[i];
					const isInReuniones = reuniones.findIndex((r) => r._id == reunion._id);
					if (isInReuniones == -1) {
						if (reuniones.length < this.reunionesConfig.min_reuniones) {
							reuniones.push(reunion);
						} else {
							break;
						}
					}
				}
			}
			reuniones.sort((f1, f2) => {
				return new Date(f1.fecha).getTime() - new Date(f2.fecha).getTime();
			});
			return reuniones;
		},
		cumpleEstado(estado = null, reunion = null) {
			if (estado != null && reunion != null) {
				const r = this.miCalendario.reuniones_bonus_actual.find((re) => re._id == reunion);
				if (r != null) {
					if (r.estado == "Pendiente" && estado == "Pendiente") {
						return true;
					} else if (r.estado == "Finalizada" && estado == "Asistio" && r.asistentes.includes(this.store.getId())) {
						return true;
					} else if (r.estado == "Finalizada" && estado == "Fallo" && !r.asistentes.includes(this.store.getId())) {
						return true;
					}
				}
			}
			return false;
		},
		asistiAReunion(reunion = null) {
			if (reunion != null) {
				const r = this.miCalendario.reuniones_asistencia.find((r) => r._id == reunion);
				return r != undefined;
			}
			return false;
		},
		async clickFecha(reunion = null) {
			if (reunion != null) {
				this.$toast.add({
					severity: "info",
					summary: "Reunión",
					detail: "Buscando reunión, espera un momento...",
					life: 1600,
				});
				await axios
					.get(`${this.API}/reunion/${reunion}`, this.headers)
					.then((resp) => {
						if (!resp.data.error) {
							this.dataReunion = { ...resp.data, fecha: new Date(resp.data.fecha) };

							this.modalDataReunion = true;
						} else {
							this.$toast.add({
								severity: "error",
								summary: "Reunión",
								detail: "No se encontró la reunión",
								life: 1600,
							});
						}
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 400:
								//Bad Request
								this.$toast.add({
									severity: "error",
									summary: "Obtener reunión",
									detail: "Formato de los datos incorrecto",
									life: 1600,
								});
								break;
							case 401:
								//Se le termino la sesión
								this.store.clearUser();
								this.$router.push("/login");
								break;
							default:
								this.$toast.add({
									severity: "error",
									summary: "Obtener reunión",
									detail: "Sucedió un error, comuníquese con soporte",
									life: 1600,
								});
								console.log("Error: ", error);
								break;
						}
					});
			}
		},
		async getMiCalendario() {
			const d = new Date();
			await axios
				.get(`${this.API}/reunion/usuario/${this.store.getId()}`, this.headers)
				.then((resp) => {
					if (!resp.data.error) {
						this.miCalendario = resp.data;
					}
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 400:
							//Bad Request
							this.$toast.add({
								severity: "error",
								summary: "Obtener mi calendario",
								detail: "Formato de los datos incorrecto",
								life: 1600,
							});
							break;
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({
								severity: "error",
								summary: "Obtener mi calendario",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		async getConfigReuniones() {
			await axios.get(`${this.API}/reunion/config/actual`, this.headers).then((resp) => {
				if (resp.data != null && resp.data != "") {
					this.reunionesConfig.min_reuniones = resp.data.min_reuniones;
					this.reunionesConfig.activo = resp.data.activo;
				}
			});
		},
	},
	async created() {
		this.store = useStoreEvento();
		this.headers.headers.Authorization = `Bearer ${this.store.getToken()}`;
		await this.getConfigReuniones();
		await this.getMiCalendario();
	},
};
</script>
<style scoped>
.reuniones {
	margin-top: 120px;
}
.reuniones > .contenedor {
	background-image: url("/assets/img/eventos/marco-tabla.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	min-height: 570px;
	max-height: 570px;
	z-index: 1;
}
.reuniones > .contenedor > .divisor {
	background-image: url("/assets/img/perfil/divisor.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	min-width: 510px;
	height: 3px;
	transform: rotate(90deg);
}
.reuniones > .contenedor > .detalle-reuniones {
	max-height: 500px;
}
.reuniones > .titulo > .aura {
	background-image: url("/assets/img/reuniones/aura-azul.gif");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	z-index: 1;
	position: absolute;
	top: -14px;
	height: 120px;
	mix-blend-mode: screen;
}
.reuniones > .titulo > .aura.izquierda {
	left: calc(50% - 530px);
}
.reuniones > .titulo > .aura.derecha {
	left: calc(50% + 248px);
	transform: rotate(180deg);
}
.reuniones > .titulo {
	background-image: url("/assets/img/reuniones/titulo-contenedor.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	width: 74%;
	height: 100px;
	position: absolute;
	top: -70px;
	padding-top: 15px;
	z-index: 2;
}

.reuniones > .contenedor > .detalle-reuniones > .lista-reuniones > .reunion {
	background-image: url("/assets/img/reuniones/borde-reunion.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	max-width: 230px;
	min-width: 230px;
	min-height: 160px;
	max-height: 160px;
	padding: 18px 15px;
}
.reuniones > .contenedor > .detalle-reuniones > .lista-reuniones > .reunion > p {
	min-height: 50px;
	max-height: 50px;
	overflow: hidden;
	text-overflow: ellipsis;
}
.reuniones > .contenedor > .detalle-reuniones > .lista-reuniones > .reunion > .acciones {
	background-image: url("/assets/img/reuniones/fondo-detalle.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	height: 37px;
	min-height: 37px;
	padding: 5px 15px;
}
.reuniones > .contenedor > .detalle-reuniones > .lista-reuniones > .reunion > .acciones > .ver {
	width: 70px !important;
}
.reuniones > .contenedor > .detalle-reuniones > .lista-reuniones > .reunion > .acciones > .ver > img {
	right: -12px;
	top: -1px;
	width: 30px;
	height: 30px;
}
.reuniones > .contenedor > .detalle-reuniones > .lista-reuniones > .reunion > .acciones > * {
	border-radius: 30px;
	max-width: 100px;
	padding: 5px 4px;
}
.reuniones > .contenedor > .detalle-reuniones > .lista-reuniones > .reunion > .estados {
	min-height: 35px;
	max-height: 35px;
	overflow: hidden;
}
.reuniones > .contenedor > .detalle-reuniones > .lista-reuniones > .reunion > .estados > .estado {
	width: 30px;
	height: 30px;
	opacity: 0.3;
}
.reuniones > .contenedor > .detalle-reuniones > .lista-reuniones > .reunion > .estados > .estado.cumple {
	opacity: 1;
}

/* Por defecto asumo que no asistió a la reunión */
.reuniones > .contenedor > .detalle-progreso > .info-total > .detalle-reuniones {
	max-width: 50%;
	overflow-y: auto;
}
.reuniones > .contenedor > .detalle-progreso > .info-total > .detalle-reuniones > .reunion {
	background-image: url("/assets/img/reuniones/detalle-no-cumplio.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	max-width: 160px;
	min-width: 160px;
	min-height: 150px;
	max-height: 150px;
	padding: 20px 12px 25px 12px;
}
.reuniones > .contenedor > .detalle-progreso > .info-total > .detalle-reuniones > .reunion > * {
	overflow: hidden;
	text-overflow: ellipsis;
}
.reuniones > .contenedor > .detalle-progreso > .info-total > .detalle-reuniones > .reunion > .asunto {
	min-height: 65px;
	max-height: 65px;
}
.reuniones > .contenedor > .detalle-progreso > .info-total > .detalle-reuniones > .reunion > .fecha {
	margin-top: 25px;
}
.reuniones > .contenedor > .detalle-progreso > .info-total > .detalle-reuniones > .reunion.asistio {
	background-image: url("/assets/img/reuniones/detalle-cumplio.png");
}

/* Barra de progreso */
.reuniones > .contenedor > .detalle-progreso > .barra-progreso > .reunion > .barra.primero,
.reuniones > .contenedor > .detalle-progreso > .barra-progreso > .reunion.primero {
	border-top-left-radius: 25px !important;
	border-bottom-left-radius: 25px !important;
}
.reuniones > .contenedor > .detalle-progreso > .barra-progreso > .reunion > .barra.ultimo,
.reuniones > .contenedor > .detalle-progreso > .barra-progreso > .reunion.ultimo {
	border-top-right-radius: 25px !important;
	border-bottom-right-radius: 25px !important;
}
.reuniones > .contenedor > .detalle-progreso > .barra-progreso > *,
.reuniones > .contenedor > .detalle-progreso > .barra-progreso > .reunion > .barra {
	height: 100%;
}
.reuniones > .contenedor > .detalle-progreso > .barra-progreso {
	background-image: url("/assets/img/perfil/iconos/verde.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	width: 500px;
	height: 40px;
	border-radius: 25px;
	border: 2px solid #69c9d0;
}
/* Asumo que no asistió */
.reuniones > .contenedor > .detalle-progreso > .barra-progreso > .reunion > .barra {
	opacity: 0.4;
	background-color: red;
	background-image: url("/assets/img/reuniones/barra-no-asistio.png");
}
.reuniones > .contenedor > .detalle-progreso > .barra-progreso > .reunion > img {
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
	height: 100%;
	left: calc(50% - 18px);
	position: absolute;
	top: 0;
	mix-blend-mode: overlay;
}
.reuniones > .contenedor > .detalle-progreso > .barra-progreso > .reunion > .barra.asistio {
	background: white;
	mix-blend-mode: inherit !important;
}
.reuniones > .contenedor > .detalle-progreso > .info-total > .detalle {
	max-width: 50%;
}
.reuniones > .contenedor > .detalle-progreso > .info-total > .detalle > .total {
	max-width: 600px;
	max-height: 80px;
	background-size: 100% 100%;
}

@media (max-width: 1700px) {
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 470px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 200px);
	}
}
@media (max-width: 1450px) {
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 445px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 175px);
	}
}
@media (max-width: 1330px) {
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 425px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 155px);
	}
}
@media (max-width: 1200px) {
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 405px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 135px);
	}
}
@media (max-width: 1000px) {
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 380px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 110px);
	}
}
@media (max-width: 992px) {
	.reuniones > .contenedor > .detalle-progreso > .info-total {
		flex-direction: column;
		align-items: center;
	}
	.reuniones > .contenedor > .detalle-progreso > .info-total > .detalle-reuniones {
		max-width: 100% !important;
	}
	.reuniones > .contenedor {
		flex-direction: column;
		max-height: 800px;
		min-height: 800px;
	}
	.reuniones > .contenedor > * {
		width: 100% !important;
	}
	.reuniones > .contenedor > .divisor {
		position: relative !important;
		transform: none;
	}
	.reuniones > .titulo > .aura {
		top: -7px;
		height: 90px;
		mix-blend-mode: screen;
	}
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 330px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 125px);
	}
}
@media (max-width: 850px) {
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 305px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 100px);
	}
}
@media (max-width: 790px) {
	.reuniones > .contenedor {
		max-height: 1000px;
		min-height: 1000px;
	}
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 290px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 80px);
	}
	.reuniones > .contenedor > .detalle-reuniones {
		max-height: 600px;
	}
}
@media (max-width: 750px) {
	.reuniones > .titulo > .aura {
		top: 6px;
		height: 60px;
	}
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 230px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 97px);
	}
}
@media (max-width: 700px) {
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 210px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 80px);
	}
}
@media (max-width: 610px) {
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 205px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 70px);
	}
	.reuniones > .titulo {
		padding-top: 20px;
	}
	.reuniones > .contenedor > .detalle-progreso > .info-total > * {
		max-width: 100% !important;
	}
}
@media (max-width: 550px) {
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 185px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 50px);
	}
}
@media (max-width: 510px) {
	.reuniones > .contenedor > .divisor {
		min-width: 100% !important;
	}
}
@media (max-width: 460px) {
	.reuniones > .titulo > .aura {
		top: 8px;
		height: 40px;
	}
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 146px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 56px);
	}
	.reuniones > .titulo {
		top: -44px;
		width: 80%;
		padding-top: 20px;
		height: 80px;
	}
	.reuniones > .titulo > h1 {
		font-size: 1.2rem !important;
	}
}
@media (max-width: 400px) {
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 136px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 46px);
	}
}
@media (max-width: 350px) {
	.reuniones > .titulo > h1 {
		font-size: 1rem !important;
	}
}
@media (max-width: 330px) {
	.reuniones > .titulo > h1 {
		font-size: 0.7rem !important;
	}
}
@media (max-width: 310px) {
	.reuniones > .titulo > .aura.izquierda {
		left: calc(50% - 126px);
	}
	.reuniones > .titulo > .aura.derecha {
		left: calc(50% + 36px);
	}
}
</style>