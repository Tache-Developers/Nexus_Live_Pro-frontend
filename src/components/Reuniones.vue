<template>
	<div class="reuniones-root">
		<Panel class="reuniones">
			<template #header>
				<div class="flex flex-wrap align-items-center gap-2 w-full justify-content-between">
					<h1 class="m-0">Reuniones</h1>
					<div class="botones flex gap-2 flex-wrap">
						<Button
							:icon="`pi ${paqueteReunionesConfig.activo ? 'pi-unlock' : 'pi-lock-open'}`"
							:label="`${paqueteReunionesConfig.activo ? 'Desactivar' : 'Activar'} reuniones`"
							:severity="paqueteReunionesConfig.activo ? 'success' : 'danger'"
							v-tooltip.top="`${paqueteReunionesConfig.activo ? 'Desactivar' : 'Activar'} criterio de reuniones`"
							@click="cambiarEstadoConfigReuniones"
							:disabled="btnCrear"
						/>
						<Button label="Reunión" v-if="paqueteReunionesConfig.activo" icon="pi pi-plus" @click="modalCrearReunion = true" />
						<Button
							label="Reuniones mínimas"
							v-if="paqueteReunionesConfig.activo"
							severity="warning"
							icon="pi pi-cog"
							@click="modalReunionesConfig = true"
						/>
					</div>
				</div>
			</template>
			<div class="flex flex-wrap w-full align-items-center justify-content-center">
				<div class="col-8">
					<VCalendar
						:initial-page="calendarInitial"
						expanded
						:is-dark="true"
						:attributes="reunionesCalendar"
						ref="calendar"
						@dayclick="clickFecha"
					/>
				</div>
			</div>
		</Panel>
		<Dialog
			v-model:visible="modalCrearReunion"
			header="Crear reunión"
			:style="{ width: '45rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
			@hide="
				() => {
					paqueteReunion = {
						asunto: null,
						fecha: new Date(),
						asistentes: [],
						estado: null,
					};
				}
			"
		>
			<div class="flex w-full flex-wrap flex-column justify content-center gap-2">
				<div class="w-full flex flex-column gap-1">
					<label for="asunto" class="m-0 font-bold">Asunto</label>
					<InputText v-model="paqueteReunion.asunto" id="asunto" placeholder="Asunto de la reunión" />
				</div>
				<div class="w-full flex flex-column gap-1">
					<label for="fecha" class="m-0 font-bold">Fecha</label>
					<Calendar id="fecha" v-model="paqueteReunion.fecha" :minDate="new Date()" showTime hourFormat="24" />
				</div>
			</div>
			<template #footer>
				<Button label="Cancelar" @click="modalCrearReunion = false" autofocus text severity="danger" />
				<Button label="Crear" :disabled="btnCrear" @click="crearReunion" />
			</template>
		</Dialog>
		<Dialog
			v-model:visible="modalEditarReunion"
			header="Editar reunión"
			:style="{ width: '55rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
			:maximizable="true"
			@hide="
				() => {
					activeIndexReunion = -1;
					paqueteReunion = {
						asunto: null,
						fecha: new Date(),
						asistentes: [],
						estado: null,
					};
				}
			"
		>
			<TabView
				:scrollable="true"
				class="tabReunionesAdmin"
				:activeIndex="activeIndexReunion"
				@update:activeIndex="(index) => (activeIndexReunion = index)"
			>
				<TabPanel
					v-for="(reunion, index) in dataReuniones"
					:key="index"
					:header="reunion.asunto"
					:headerClass="index == 0 ? 'tab-primero' : 'tab-sig'"
				>
					<div class="botones flex flex-wrap gap-2 w-full justify-content-end">
						<Button @click="confirmEliminarReunion(reunion._id)" label="Eliminar Reunión" severity="danger" icon="pi pi-trash" />
						<Button
							@click="finalizarReunion(reunion._id)"
							v-if="reunion.estado != 'Finalizada'"
							label="Finalizar Reunión"
							icon="pi pi-check"
							class="mr-2"
						/>
					</div>
					<div class="flex w-full flex-wrap flex-column justify content-center gap-2">
						<div class="w-full flex flex-column gap-1">
							<label for="asunto" class="m-0 font-bold">Asunto</label>
							<InputText v-model="reunion.asunto" id="asunto" placeholder="Asunto de la reunión" />
						</div>
						<div class="w-full flex flex-column gap-1">
							<label for="fecha" class="m-0 font-bold">Fecha</label>
							<Calendar id="fecha" v-model="reunion.fecha" :minDate="new Date()" showTime hourFormat="24" />
						</div>
						<div class="w-full flex-flex-column gap-1">
							<h2 class="m-0">Asistencia confirmada</h2>
							<DataTable
								:value="reunion.asistentes"
								dataKey="usuario"
								:filters="filtersAsistente"
								sortField="usuario"
								:sortOrder="1"
								paginator
								:rows="10"
								:rowsPerPageOptions="[5, 10, 20, 50]"
								class="pt-0"
								tableStyle="max-height:400px"
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

						<div class="w-full flex flex-column gap-2 mt-2">
							<h2 class="m-0 mt-4">Marcar Asistencia</h2>
							<DataTable
								v-model:selection="reunion.asistentes"
								:value="creadores"
								dataKey="_id"
								:filters="filtersCreador"
								sortField="usuario"
								:sortOrder="1"
								paginator
								:rows="10"
								:rowsPerPageOptions="[5, 10, 20, 50]"
							>
								<template #header>
									<div class="flex flex-column w-full gap-2">
										<span class="p-input-icon-left">
											<i class="pi pi-search" />
											<InputText v-model="filtersCreador['global'].value" placeholder="Buscar..." />
										</span>
										<p class="m-0 text-center text-xl mt-2">
											{{ reunion.asistentes.length }}
											{{ reunion.asistentes.length == 1 ? "creador asistente" : "creadores asistentes" }}
										</p>
									</div>
								</template>
								<Column selectionMode="multiple" headerStyle="width: 3rem" />
								<Column field="usuario" header="Creador" />
							</DataTable>
						</div>
					</div>
				</TabPanel>
			</TabView>

			<template #footer>
				<Button label="Cancelar" @click="modalEditarReunion = false" autofocus text severity="danger" />
				<Button label="Guardar cambios" :disabled="btnCrear" @click="crearReunion" />
			</template>
		</Dialog>
		<Dialog
			v-model:visible="modalReunionesConfig"
			:header="`Reuniones mínimas para ${meses[new Date().getMonth()]}`"
			:style="{ width: '30rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
		>
			<div class="flex w-full flex-wrap flex-column justify content-center gap-4">
				<div class="w-full flex flex-column gap-1">
					<label for="min_reuniones" class="m-0 font-bold">Reuniones mínimas</label>

					<div class="flex flex-wrap w-full gap-1">
						<div class="col-9">
							<InputText
								v-model.number="paqueteReunionesConfig.min_reuniones"
								id="min_reuniones"
								type="number"
								placeholder="Ingrese cantidad de reuniones"
								aria-describedby="reuniones-help"
							/>
						</div>
						<div class="col-2 align-self-center">
							<span class="text-lg">/ {{ getCantReunionesMesActual }}</span>
						</div>
					</div>
					<small id="reuniones-help">
						El creador debe cumplir {{ paqueteReunionesConfig.min_reuniones }}/{{ getCantReunionesMesActual }} para poder reclamar los
						bonus.
					</small>
				</div>
			</div>
			<template #footer>
				<Button label="Cancelar" @click="modalReunionesConfig = false" autofocus text severity="danger" />
				<Button label="Guardar" :disabled="btnCrear" @click="configReuniones" />
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
		calendarInitial: {
			month: new Date().getMonth() + 1,
			year: new Date().getFullYear(),
		},
		filtersCreador: {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		},
		filtersAsistente: {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		},
		modalCrearReunion: false,
		modalReunionesConfig: false,
		btnCrear: false,
		paqueteReunionesConfig: {
			min_reuniones: 0,
			activo: false,
		},
		paqueteReunion: {
			asunto: null,
			fecha: new Date(),
			asistentes: [],
			estado: null,
		},
		creadores: [],
		meses: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
		reuniones: [
			{
				highlight: true,
				title: "Reunion 1",
				dates: new Date(),
				popover: {
					label: "Reunion 1",
				},
			},
			{
				highlight: "red",
				title: "Reunion 2",
				dates: new Date(),
				popover: {
					label: "Reunion 2",
				},
			},
		],
		reunionesCalendar: [],
		dataReuniones: [],
		activeIndexReunion: -1,
		modalEditarReunion: false,
	}),
	methods: {
		clickFecha(dataCalendar) {
			if (dataCalendar.attributes.length > 0) {
				const r = dataCalendar.attributes.flatMap((a) => a.key);
				this.dataReuniones = this.reuniones
					.filter((re) => r.includes(re._id))
					.map((reu) => {
						return {
							...reu,
							fecha: new Date(reu.fecha),
						};
					});
				if (this.dataReuniones.length > 0) {
					this.activeIndexReunion = 0;
					this.modalEditarReunion = true;
				}
			}
		},
		confirmEliminarReunion(reunion = null) {
			if (reunion != null) {
				this.$confirm.require({
					group:"global",
					message: `¿Está seguro de eliminar esta reunión?`,
					header: "Eliminar reunión",
					icon: "pi pi-exclamation-triangle",
					rejectClass: "p-button-secondary p-button-outlined",
					rejectLabel: "No, cancelar",
					acceptLabel: "Sí, eliminar",
					acceptClass: "p-button-danger",
					defaultFocus: "reject",
					accept: () => {
						this.eliminarReunion(reunion);
					},
					reject: () => {},
				});
			}
		},
		async configReuniones() {
			this.btnCrear = true;
			if (this.paqueteReunionesConfig.min_reuniones != null && this.paqueteReunionesConfig.min_reuniones != "") {
				await axios.post(`${this.API}/reunion/config`, this.paqueteReunionesConfig, this.headers).then((resp) => {
					if (!resp.data.error) {
						this.modalReunionesConfig = false;
						this.getConfigReuniones();
					}
					this.$toast.add({
						severity: resp.data.error ? "error" : "success",
						summary: "Configuración de reuniones",
						detail: resp.data.message,
						life: 1650,
					});
				});
			} else {
				this.$toast.add({
					severity: "info",
					summary: "Configuración de reuniones",
					detail: "Debes ingresar la cantidad de reuniones mínimas",
					life: 1650,
				});
			}
			this.btnCrear = false;
		},
		async getConfigReuniones() {
			await axios.get(`${this.API}/reunion/config/actual`, this.headers).then((resp) => {
				if (resp.data != null && resp.data != "") {
					this.paqueteReunionesConfig.min_reuniones = resp.data.min_reuniones;
					this.paqueteReunionesConfig.activo = resp.data.activo;
				} else {
					this.$toast.add({
						severity: "warn",
						summary: "Configuración de reuniones",
						detail: "No haz configurado las reuniones mínimas para el mes actual. Recuerda que esto influye en los bonus del mes actual.",
					});
				}
			});
		},
		async crearReunion() {
			this.btnCrear = true;
			if (this.activeIndexReunion == -1) {
				if (this.paqueteReunion.asunto != null && this.paqueteReunion.asunto != "" && this.paqueteReunion.fecha != null) {
					await axios
						.post(`${this.API}/reunion/crear`, this.paqueteReunion, this.headers)
						.then((resp) => {
							if (!resp.data.error) {
								this.modalCrearReunion = false;
								this.paqueteReunion = {
									asunto: null,
									fecha: new Date(),
									asistentes: [],
									estado: null,
								};
								this.getReuniones();
							}
							this.$toast.add({
								severity: resp.data.error ? "error" : "success",
								summary: "Crear reunión",
								detail: resp.data.message,
								life: 1650,
							});
						})
						.catch((error) => {
							switch (error.response.data.statusCode) {
								case 400:
									//Bad Request
									this.$toast.add({
										severity: "error",
										summary: "Crear reuniones",
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
										summary: "Crear reuniones",
										detail: "Sucedió un error, comuníquese con soporte",
										life: 1600,
									});
									console.log("Error: ", error);
									break;
							}
						});
				} else {
					this.$toast.add({
						severity: "info",
						summary: "Crear reunión",
						detail: "Debes llenar todos los campos",
						life: 1650,
					});
				}
			} else {
				this.editarReunion();
			}
			this.btnCrear = false;
		},
		async editarReunion() {
			this.btnCrear = true;
			const paquete = { ...this.dataReuniones[this.activeIndexReunion] };
			const id = paquete._id;
			delete paquete._id;
			paquete.asistentes = paquete.asistentes.flatMap((c) => c._id);
			await axios
				.put(`${this.API}/reunion/${id}`, paquete, this.headers)
				.then((resp) => {
					if (!resp.data.error) {
						this.modalEditarReunion = false;
						this.paqueteReunion = {
							asunto: null,
							fecha: new Date(),
							asistentes: [],
							estado: null,
						};
						this.getReuniones();
					}
					this.$toast.add({
						severity: resp.data.error ? "error" : "success",
						summary: "Editar reunión",
						detail: resp.data.message,
						life: 1650,
					});
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 400:
							//Bad Request
							this.$toast.add({
								severity: "error",
								summary: "Editar reunión",
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
								summary: "Editar reunión",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
			this.btnCrear = false;
		},
		async getReuniones() {
			await axios
				.get(`${this.API}/reunion`, this.headers)
				.then((resp) => {
					this.reuniones = resp.data;
					this.reunionesCalendar = [];
					this.reunionesCalendar = this.reuniones.map((reunion) => {
						return {
							key: reunion._id,
							dot: true,
							highlight: reunion.estado == "Pendiente" ? "blue" : reunion.estado == "Finalizada" ? "green" : "orange",
							dates: new Date(reunion.fecha),
							popover: {
								label: reunion.asunto,
							},
						};
					});
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 400:
							//Bad Request
							this.$toast.add({
								severity: "error",
								summary: "Obtener reuniones",
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
								summary: "Obtener reuniones",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		async getCreadores() {
			await axios
				.get(`${this.API}/usuario`, this.headers)
				.then((resp) => {
					this.creadores = resp.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 400:
							//Bad Request
							this.$toast.add({
								severity: "error",
								summary: "Obtener creadores",
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
								summary: "Obtener creadores",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		async eliminarReunion(reunion = null) {
			this.btnCrear = true;
			await axios
				.delete(`${this.API}/reunion/${reunion}`, this.headers)
				.then((resp) => {
					if (!resp.data.error) {
						this.modalEditarReunion = false;
						this.getReuniones();
					}
					this.$toast.add({
						severity: resp.data.error ? "error" : "success",
						summary: "Eliminar reunión",
						detail: resp.data.message,
						life: 1650,
					});
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 400:
							//Bad Request
							this.$toast.add({
								severity: "error",
								summary: "Eliminar reunión",
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
								summary: "Eliminar reunión",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
			this.btnCrear = false;
		},
		async cambiarEstadoConfigReuniones() {
			this.btnCrear = true;
			await axios
				.put(`${this.API}/reunion/config/cambiar-estado`, {}, this.headers)
				.then((resp) => {
					if (!resp.data.error) {
						this.getConfigReuniones();
					}
					this.$toast.add({
						severity: resp.data.error ? "error" : "success",
						summary: "Cambiar estado de reuniones",
						detail: resp.data.message,
						life: 1650,
					});
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 400:
							//Bad Request
							this.$toast.add({
								severity: "error",
								summary: "Cambiar estado de reuniones",
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
								summary: "Cambiar estado de reuniones",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
			this.btnCrear = false;
		},
		async finalizarReunion(reunion = null) {
			if (reunion != null) {
				this.btnCrear = true;
				this.$toast.add({
					severity: "info",
					summary: "Finalizar reunión",
					detail: "Finalizando reunión, espera un momento",
					life: 1600,
				});
				await axios
					.put(`${this.API}/reunion/${reunion}/finalizar`, {}, this.headers)
					.then((resp) => {
						if (!resp.data.error) {
							this.modalEditarReunion = false;
							this.getReuniones();
						}
						this.$toast.add({
							severity: resp.data.error ? "error" : "success",
							summary: "Finalizar reunión",
							detail: resp.data.message,
							life: 1650,
						});
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 400:
								//Bad Request
								this.$toast.add({
									severity: "error",
									summary: "Finalizar reunión",
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
									summary: "Finalizar reunión",
									detail: "Sucedió un error, comuníquese con soporte",
									life: 1600,
								});
								console.log("Error: ", error);
								break;
						}
					});
				this.btnCrear = false;
			}
		},
	},
	computed: {
		getCantReunionesMesActual() {
			const d = new Date();
			return this.reuniones.filter((reunion) =>
				reunion.fecha.startsWith(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`)
			).length;
		},
	},
	async created() {
		this.store = useStoreEvento();
		this.headers.headers.Authorization = `Bearer ${this.store.getToken()}`;
		await this.getConfigReuniones();
		await this.getReuniones();
		await this.getCreadores();
	},
};
</script>
<style>
.vc-header .vc-title,
.vc-header .vc-prev,
.vc-header .vc-next,
.vc-nav-title,
.vc-nav-arrow,
.vc-nav-item {
	background: transparent;
}
</style>