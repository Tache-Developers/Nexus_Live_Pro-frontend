<template>
	<div class="excluix-creadores-root">
		<DataTable
			v-model:selection="creadoresExcluidos"
			:value="creadores"
			v-model:filters="filters"
			paginator
			:rows="10"
			:rowsPerPageOptions="[5, 10, 20, 50, 100]"
			tableStyle="min-width: 100%"
			sortField="usuario"
			:sortOrder="1"
			tableClass="tabla-excluir-creador"
			dataKey="_id"
		>
			<template #header>
				<div class="flex align-items-center gap-2 flex-end flex-column w-full justify-content-between">
					<div class="flex w-full flex-wrap justify-content-between">
						<h1 class="m-0 text-900">Excluir creadores</h1>
						<div class="flex flex-wrap gap-2 botones">
							<Button label="Guardar cambios" severity="success" @click="excluirCreadores" :disabled="btnExcluir" />
						</div>
					</div>
					<InputText v-model="filters['global'].value" placeholder="Buscar..." />
				<h3 class="w-full m-0 text-center">{{ creadoresExcluidos.length }} {{ creadoresExcluidos.length==1 ? 'creador excluido':'creadores excluidos' }}</h3>
                </div>
			</template>
			<Column selectionMode="multiple" headerStyle="width: 3.5rem" />
			<Column header="Creador" field="usuario" />
		</DataTable>
	</div>
</template> 
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
import { FilterMatchMode } from "primevue/api";
export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		headers: {
			headers: {
				Authorization: null,
			},
		},
		store: null,
		filters: {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		},
		btnExcluir: false,
		creadores: [],
		creadoresExcluidos: [],
	}),
	methods: {
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
		async getCreadoresExcluidos() {
			await axios
				.get(`${this.API}/reunion/creadores-excluidos`, this.headers)
				.then((resp) => {
					if (!resp.data.error) {
						this.creadoresExcluidos = resp.data.data.creadores.map((c) => ({
							_id: c,
						}));
					} else {
						this.$toast.add({
							severity: "error",
							summary: "Obtener creadores excluidos",
							detail: resp.data.message,
							life: 2600,
						});
					}
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 400:
							//Bad Request
							this.$toast.add({
								severity: "error",
								summary: "Obtener creadores excluidos",
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
								summary: "Obtener creadores excluidos",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		async excluirCreadores() {
			this.btnExcluir = true;
			const excluir = { creadores: this.creadoresExcluidos.flatMap((c) => c._id) };
			await axios
				.post(`${this.API}/reunion/excluir-creador`, excluir, this.headers)
				.then((resp) => {
					if (!resp.data.error) {
						this.$toast.add({
							severity: "success",
							summary: "Excluir creadores",
							detail: "Creadores excluidos correctamente",
							life: 1900,
						});
						this.getCreadoresExcluidos();
					} else {
						this.$toast.add({
							severity: "error",
							summary: "Excluir creadores",
							detail: resp.data.message,
							life: 2600,
						});
					}
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 400:
							//Bad Request
							this.$toast.add({
								severity: "error",
								summary: "Excluir creadores",
								detail: "Formato de los datos incorrecto",
								life: 1900,
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
								summary: "Excluir creadores",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1900,
							});
							console.log("Error:", error);
							break;
					}
				});
			this.btnExcluir = false;
		},
	},
	async created() {
		this.store = useStoreEvento();
		if (!this.store.isAdmin() || !this.store.isActive()) {
			this.$router.push("/login");
			return;
		}
		this.headers.headers.Authorization = `Bearer ${this.store.getToken()}`;
		await this.getCreadoresExcluidos();
		await this.getCreadores();
	},
};
</script>