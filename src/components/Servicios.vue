<template>
	<Panel class="servicios">
		<template #header>
			<div class="flex align-items-center gap-2 flex-end w-full justify-content-between flex-wrap">
				<h1 class="m-0">Servicios</h1>
			</div>
		</template>
		<DataTable
			:value="servicios"
			:filters="filtersServicios"
			sortField="saldo"
			:sortOrder="-1"
			paginator
			:rows="5"
			:rowsPerPageOptions="[5, 10, 20, 50]"
			tableStyle="min-width: 100%"
		>
			<template #header>
				<div class="flex flex-column align-items-center gap-2 flex-end w-full justify-content-end">
					<div class="botones w-full">
						<span class="p-input-icon-left">
							<i class="pi pi-search" />
							<InputText v-model="filtersServicios['global'].value" placeholder="Buscar..." />
						</span>
					</div>
				</div>
			</template>
			<template #empty>
				<div class="flex flex-column align-items-center text-center gap-2 flex-end w-full justify-content-end">
					Sin servicios disponibles
				</div>
			</template>
			<Column field="service" header="ID Servicio" sortable />
			<Column field="name" header="Descripción" />
			<Column field="rate" header="Precio" sortable />
			<Column field="min" header="Min Orden" sortable />
			<Column field="max" header="Max Orden" sortable />
		</DataTable>
	</Panel>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
import { FilterMatchMode, FilterOperator } from "primevue/api";

export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		store: null,
		token: {
			headers: {
				Authorization: null,
			},
		},
		filtersServicios: {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		},
		servicios: [],
	}),
	methods: {
		async getServicios() {
			await axios
				.get(`${this.API}/promocion/servicesActive`, this.token)
				.then((resp) => {
					this.servicios = resp.data;
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
	},
	async created() {
		this.store = useStoreEvento();
		if (!this.store.isActive()) {
			this.$router.push("/login");
			return;
		}
		this.token.headers.Authorization = `Bearer ${this.store.getToken()}`;
		await this.getServicios();
	},
};
</script>