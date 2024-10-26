<template>
	<Panel class="creadores">
		<Toast />
		<template #header>
			<div class="flex align-items-center gap-2 flex-end w-full justify-content-between flex-wrap">
				<h1 class="m-0">Promoción</h1>
				<h3 class="m-0 p-0">Saldo creadores: ${{ saldoCreadores.toFixed(2) }}</h3>
				<div class="botones flex gap-2 flex-wrap">
					<span class="p-input-icon-left">
						<i class="pi pi-search" />
						<InputText v-model="filtersCreadores['global'].value" placeholder="Buscar.." />
					</span>
					<Button label="Servicios" icon="pi pi-plus" @click="modalServicios = true" />
				</div>
			</div>
		</template>
		<DataTable
			:value="creadores"
			:filters="filtersCreadores"
			sortField="saldo"
			:sortOrder="-1"
			paginator
			:rows="5"
			:rowsPerPageOptions="[5, 10, 20, 50]"
			tableStyle="min-width: 100%"
		>
			<Column field="usuario" header="Usuario" sortable></Column>
			<Column field="grupo" header="Grupo" sortable>
				<template #body="slotProps">
					<Badge v-if="slotProps.data.grupo == 'A'" :value="slotProps.data.grupo" severity="success"></Badge>
					<Badge v-if="slotProps.data.grupo == 'B'" :value="slotProps.data.grupo" severity="info"></Badge>
					<Badge v-if="slotProps.data.grupo == 'C'" :value="slotProps.data.grupo" severity="danger"></Badge>
				</template>
			</Column>
			<Column header="Saldo" field="saldo" sortable>
				<template #body="slotProps">
					<span class="text-xl font-semibold text-700">$ {{ slotProps.data.saldo }}</span>
				</template>
			</Column>
			<Column header="Cambiar">
				<template #body="slotProps">
					<Button
						icon="pi pi-money-bill"
						@click="
							() => {
								modalCambiarSaldo = true;
								actualizarSaldo.id = slotProps.data._id;
								actualizarSaldo.saldo = slotProps.data.saldo;
								actualizarSaldo.usuario = slotProps.data.usuario;
							}
						"
					/>
					<Button
						v-if="slotProps.data.ordenes.length > 0"
						outlined
						rounded
						severity="info"
						class="ml-2"
						v-tooltip.top="'Ver gastos'"
						icon="pi pi-eye"
						@click="
							() => {
								ordenesUsuario = slotProps.data.ordenes;
								modalGastos = true;
							}
						"
					/>
				</template>
			</Column>
		</DataTable>
		<DataTable :value="ordenesHistorial" sortField="orden.fecha" :sortOrder="-1" tableStyle="min-width: 100%">
			<template #header>
				<div class="flex flex-wrap gap-2 align-items-center justify-content-between">
					<h1 class="m-0 text-white">Historial ordenes</h1>
					<h3 class="m-0 p-0 text-white">Total gastado: ${{ totalGastado.toFixed(2) }}</h3>
				</div>
			</template>
			<Column field="usuario" header="Creador" sortable style="min-width: 6rem" />
			<Column field="orden.fecha" header="Fecha" sortable style="min-width: 11rem">
				<template #body="props">{{ props.data.orden.fecha.slice(0, 10) }} {{ props.data.orden.fecha.slice(11, 16) }}</template>
			</Column>
			<Column field="orden.proveedor.nombre" header="Proveedor" sortable />
			<Column field="orden.service" header="ID Service" sortable />
			<Column field="orden.descripcion" header="Descripcion" class="word-wrap" sortable />
			<Column field="orden.cantidad" header="Cantidad" />
			<Column field="orden.link" header="Publicación">
				<template #body="props">
					<a :href="props.data.orden.link" target="_blank" rel="noopener noreferrer">Ver publicación</a>
				</template>
			</Column>
			<Column field="orden.pagar" header="Pago" sortable />
			<Column field="orden.status" header="Estado" sortable />
			<Column field="orden.order" header="Order ID" sortable />
		</DataTable>
		<Dialog
			v-model:visible="modalServicios"
			:header="`Servicios Disponibles: ${servicios.length} - Servicios seleccionados: ${selectedServicios.length}`"
			:style="{ width: '80rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="top"
			:modal="true"
			:draggable="false"
		>
			<DataTable
				:value="servicios"
				:filters="filters"
				paginator
				:rows="5"
				:rowsPerPageOptions="[5, 10, 20, 50]"
				tableStyle="min-width: 100%"
			>
				<template #header>
					<div class="flex items-center gap-2 flex-end w-full justify-content-end">
						<div class="botones flex gap-2">
							<span class="p-input-icon-left">
								<i class="pi pi-search" />
								<InputText v-model="filters['global'].value" placeholder="Buscar.." />
							</span>
							<Button icon="pi pi-trash" label="Vaciar" @click="selectedServicios = []" />
						</div>
					</div>
				</template>
				<Column field="proveedor.nombre" header="Proveedor" sortable />
				<Column field="service" header="Código" />
				<Column field="name" header="Nombre" />
				<Column field="type" header="Tipo" />
				<Column field="category" header="Categoría" />
				<Column field="rate" header="Costo" />
				<Column field="min" header="Minimo" />
				<Column field="max" header="Maximo" />
				<Column field="dripfeed" header="Dripfeed" />
				<Column field="refill" header="Refill" />
				<Column field="cancel" header="Cancel" />
				<Column header="Agencia">
					<template #body="props">
						<Checkbox
							v-model="selectedServicios"
							:inputId="props.data.service"
							name="serviceSelect"
							:value="{ proveedor: props.data.proveedor._id, service: props.data.service }"
						/>
					</template>
				</Column>
			</DataTable>
			<template #footer>
				<Button label="Cancelar" @click="modalServicios = false" text severity="danger" autofocus />
				<Button
					:icon="btnServiciosIcon"
					label="Actualizar"
					@click="actualizarServiciosActive()"
					:disabled="btnServiciosSelect"
					severity="success"
				/>
			</template>
		</Dialog>
		<Dialog
			v-model:visible="modalCambiarSaldo"
			:header="`Actualizar Saldo: ${actualizarSaldo.usuario}`"
			:style="{ width: '30rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
		>
			<div class="flex flex-column gap-1 mb-2">
				<label for="excel" class="font-bold block">$ Saldo</label>
				<InputText type="number" id="saldo" v-model="actualizarSaldo.saldo" />
				<small id="saldo">Advertencia: Revise bien el saldo</small>
			</div>
			<template #footer>
				<Button label="Cancelar" @click="modalCambiarSaldo = false" text severity="danger" autofocus />
				<Button label="Actualizar" @click="updateSaldo()" :disabled="btnActualizarSaldo" severity="success" />
			</template>
		</Dialog>
		<Dialog
			v-model:visible="modalGastos"
			header="Gastos"
			:style="{ width: '60rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="top"
			:modal="true"
			:draggable="false"
		>
			<DataTable :value="ordenesUsuario" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 100%">
				<Column field="fecha" header="Fecha" sortable style="min-width: 11rem">
					<template #body="props">{{ props.data.fecha.slice(0, 10) }} {{ props.data.fecha.slice(11, 16) }}</template>
				</Column>
				<Column field="service" header="ID Service" sortable />
				<Column field="descripcion" header="Descripcion" class="word-wrap" sortable />
				<Column field="cantidad" header="Cantidad" />
				<Column field="link" header="Publicación">
					<template #body="props">
						<a :href="props.data.link" target="_blank" rel="noopener noreferrer">Ver publicación</a>
					</template>
				</Column>
				<Column field="pagar" header="Pago" sortable />
				<Column field="status" header="Estado" sortable />
				<Column field="order" header="Order ID" sortable />
			</DataTable>
			<template #footer>
				<Button label="Cerrar" @click="modalGastos = false" text severity="danger" autofocus />
			</template>
		</Dialog>
	</Panel>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
import { FilterMatchMode, FilterOperator } from "primevue/api";

export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		token: null,
		store: null,
		modalServicios: false,
		modalCambiarSaldo: false,
		modalGastos: false,
		actualizarSaldo: {
			saldo: null,
			id: null,
			usuario: null,
		},
		btnActualizarSaldo: false,
		servicios: [],
		selectedServicios: [],
		servicesActives: [],
		btnServiciosSelect: false,
		btnServiciosIcon: "",
		filters: {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		},
		filtersCreadores: {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		},
		creadores: [],
		ordenesUsuario: [],
		ordenesHistorial: [],
	}),
	methods: {
		servicioSeleccionado(service) {
			console.log(service);
		},
		async getServicios() {
			await axios
				.get(`${this.API}/promocion/servicesALL`, this.token)
				.then((response) => {
					this.servicios = response.data;
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
								severity: "error",
								summary: "Obtener Servicios de API Promociones",
								detail: "Sucedió un error, Comuniquese con soporte",
								life: 1500,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		async getServiciosActive() {
			await axios
				.get(`${this.API}/promocion/servicesActive`, this.token)
				.then((response) => {
					this.selectedServicios = response.data.map((s) => ({ proveedor: s.proveedor._id, service: s.service }));
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
								severity: "error",
								summary: "Obtener servicios Activos",
								detail: "Sucedió un error, Comuniquese con soporte",
								life: 1500,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		async actualizarServiciosActive() {
			this.btnServiciosIcon = "pi pi-spin pi-spinner";
			this.btnServiciosSelect = true;
			await axios
				.post(`${this.API}/promocion/servicesActive`, this.selectedServicios, this.token)
				.then((response) => {
					if (response.data) {
						this.$toast.add({
							severity: "success",
							summary: "Actualizar servicios",
							detail: "Se actualizo correctamente",
							life: 1500,
						});
					} else {
						this.$toast.add({
							severity: "error",
							summary: "Actualizar servicios",
							detail: "Comuniquese con soporte",
							life: 1500,
						});
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
							this.$toast.add({
								severity: "error",
								summary: "Actualizar servicios",
								detail: "Sucedió un error, Comuniquese con soporte",
								life: 1500,
							});
							console.log("Error: ", error);
							break;
					}
				});
			this.btnServiciosIcon = "";
			this.btnServiciosSelect = false;
			this.modalServicios = false;
		},
		async getCreadores() {
			await axios
				.get(`${this.API}/usuario`, this.token)
				.then((response) => {
					this.creadores = response.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							console.log("Error: ", error);
							break;
					}
				});
		},
		async updateSaldo() {
			this.btnActualizarSaldo = true;
			await axios
				.post(`${this.API}/promocion/updateSaldo`, this.actualizarSaldo, this.token)
				.then((response) => {
					if (response.data) {
						this.$toast.add({
							severity: "success",
							summary: "Actualizar saldo",
							detail: "Se actualizo correctamente",
							life: 1500,
						});
					} else {
						this.$toast.add({
							severity: "error",
							summary: "Actualizar saldo",
							detail: "Comuniquese con soporte",
							life: 1500,
						});
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
							this.$toast.add({
								severity: "error",
								summary: "Actualizar saldo",
								detail: "Sucedió un error, Comuniquese con soporte",
								life: 1500,
							});
							console.log("Error: ", error);
							break;
					}
				});
			await this.getCreadores();
			this.btnActualizarSaldo = false;
			this.modalCambiarSaldo = false;
		},
		async getOrdenesHistorial() {
			await axios
				.get(`${this.API}/usuario/ordenes`, this.token)
				.then((response) => {
					this.ordenesHistorial = response.data;
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
								severity: "error",
								summary: "Obtener ordenes",
								detail: "Sucedió un error, Comuniquese con soporte",
								life: 1500,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
	},
	computed: {
		saldoCreadores() {
			const saldo = this.creadores.reduce((acum, val) => (acum += parseFloat(val.saldo)), 0);
			return saldo;
		},
		totalGastado() {
			const total = this.ordenesHistorial.reduce((acum, val) => (acum += parseFloat(val.orden.pagar)), 0);
			return total;
		},
	},
	async created() {
		this.store = useStoreEvento();
		if (!this.store.isActive()) {
			this.$router.push("/login");
		}
		this.token = {
			headers: {
				Authorization: `Bearer ${this.store.getToken()}`,
			},
		};
		await this.getCreadores();
		await this.getOrdenesHistorial();
		await this.getServicios();
		await this.getServiciosActive();
	},
};
</script>