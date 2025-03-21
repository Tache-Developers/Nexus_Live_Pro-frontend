<template>
	<div class="calendario-usuario">
		<Tag
			@click="modalCalendario = true"
			:severity="getSeverity()"
			rounded
			class="cursor-pointer btn-info-reunion w-auto"
			v-tooltip.bottom="'Clic para ver más reuniones'"
		>
			<template #icon>
				<img alt="Calendario" src="/assets/img/perfil/iconos/dias_habiles_actual.png" style="width: 20px; height: 20px" />
			</template>
			<div class="flex align-items-center gap-2 px-1">
				<span class="text-base">{{ getReunionCercana() }}</span>
			</div>
		</Tag>
		<Dialog
			v-model:visible="modalCalendario"
			header=""
			:style="{ width: '30rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:draggable="false"
			class="dialogCalendario"
			:pt="{
				root: 'border-none',
				mask: {
					style: 'backdrop-filter: blur(2px)',
				},
			}"
		>
			<div class="flex w-full flex-wrap flex-column justify content-center gap-4">
				<VCalendar
					:initial-page="calendarInitial"
					expanded
					:is-dark="true"
					:attributes="reunionesCalendar"
					ref="calendar"
					@dayclick="clickFecha"
				/>
			</div>
			<template #footer>
				<Button label="Cerrar" @click="modalCalendario = false" autofocus text severity="danger" />
			</template>
		</Dialog>
		<Dialog
			v-model:visible="modalDataReunion"
			header="Reuniones"
			:style="{ width: '50rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:draggable="false"
			:modal="true"
		>
			<TabView :scrollable="true" class="tabViewnCalendario">
				<TabPanel
					v-for="(reunion, index) in reuniones"
					:key="index"
					:header="reunion.asunto"
					:headerClass="index == 0 ? 'tab-primero' : 'tab-sig'"
				>
					<div class="flex w-full flex-wrap flex-column justify content-center gap-4">
						<div class="w-full flex flex-column gap-1">
							<label for="asunto" class="m-0 font-bold">Asunto</label>
							<InputText v-model="reunion.asunto" :readonly="true" :disabled="true" id="asunto" placeholder="Asunto de la reunión" />
						</div>
						<div class="w-full flex flex-column gap-1">
							<label for="fecha" class="m-0 font-bold">Fecha</label>
							<Calendar
								id="fecha"
								v-model="reunion.fecha"
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
								:value="reunion.asistentes"
								dataKey="_id"
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
				</TabPanel>
			</TabView>

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
		calendarInitial: {
			month: new Date().getMonth() + 1,
			year: new Date().getFullYear(),
		},
		filtersAsistente: {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		},
		miCalendario: { reuniones: [], reuniones_asistencia: [], reuniones_bonus_actual: [] },
		reunionesCalendar: [],
		reuniones: [],
		modalCalendario: false,
		modalDataReunion: false,
	}),
	methods: {
		getReunionCercana() {
			if (this.miCalendario.reuniones.length > 0) {
				const r = this.miCalendario.reuniones_bonus_actual.find((re) => re.estado == "Pendiente");
				if (r != undefined) {
					return `Reunión: ${this.formatearFecha(r.fecha)}`;
				}
			}
			return "Sin reuniones";
		},
		getSeverity() {
			if (this.miCalendario.reuniones.length > 0) {
				const reunion = this.miCalendario.reuniones_bonus_actual.find((re) => re.estado == "Pendiente");
				if (reunion != undefined) {
					return reunion.estado == "Pendiente" ? "info" : "success";
				}
			}
			return "info";
		},
		formatearFecha(fechaISO) {
			const fecha = new Date(fechaISO);

			const anio = fecha.getFullYear();
			const mes = String(fecha.getMonth() + 1).padStart(2, "0");
			const dia = String(fecha.getDate()).padStart(2, "0");
			const horas = String(fecha.getHours()).padStart(2, "0");
			const minutos = String(fecha.getMinutes()).padStart(2, "0");

			return `${anio}-${mes}-${dia} ${horas}:${minutos}`;
		},
		async clickFecha(dataCalendar) {
			if (dataCalendar.attributes.length > 0) {
				const r = dataCalendar.attributes.flatMap((a) => a.key);

				this.reuniones = this.miCalendario.reuniones
					.filter((re) => r.includes(re._id))
					.map((reu) => {
						return {
							...reu,
							fecha: new Date(reu.fecha),
						};
					});
				this.modalDataReunion = true;
			}
		},
		async getMiCalendario() {
			await axios
				.get(`${this.API}/reunion/usuario/${this.store.getId()}`, this.headers)
				.then((resp) => {
					if (!resp.data.error) {
						this.miCalendario = resp.data;
						this.reunionesCalendar = this.miCalendario.reuniones.map((reunion) => {
							return {
								key: reunion._id,
								dot: true,
								highlight: reunion.estado == "Pendiente" ? "blue" : reunion.creador_asistente ? "green" : "red",
								dates: new Date(reunion.fecha),
								popover: {
									label: `${reunion.asunto} - ${reunion.estado}`,
								},
							};
						});
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
	},
	async created() {
		this.store = useStoreEvento();
		this.headers.headers.Authorization = `Bearer ${this.store.getToken()}`;
		await this.getMiCalendario();
	},
};
</script>
<style>
.dialogCalendario,
.dialogCalendario > .p-dialog-header,
.dialogCalendario > .p-dialog-content,
.dialogCalendario > .p-dialog-footer {
	background: transparent;
	border: none;
}
.calendario-usuario > .p-tag {
	width: auto !important;
}
@media (max-width: 410px) {
	.btn-info-reunion > div > span {
		font-size: 0.8rem !important;
	}
}
</style>