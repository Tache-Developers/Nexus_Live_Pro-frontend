<template>
	<div class="excluir-creadores-root">
		<div class="flex w-full flex-wrap justify-content-between sticky top-0 z-5" style="background: #1f2937">
			<h1 class="m-0 text-900">Excluir creadores</h1>
			<div class="flex flex-wrap gap-2 botones">
				<Button label="Guardar cambios" severity="success" @click="excluirCreadores" :disabled="btnExcluir" />
			</div>
		</div>
		<div class="w-full flex-flex-column gap-1 mt-3 mb-6">
			<h2 class="m-0">Creadores excluidos</h2>
			<DataTable
				:value="creadoresExcluidosGuardados"
				:filters="filtersExcluidos"
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
							<InputText v-model="filtersExcluidos['global'].value" placeholder="Buscar..." />
						</span>
					</div>
				</template>
				<Column field="usuario" header="Creador" />
			</DataTable>
		</div>
		<div class="flex flex-wrap gap-2 w-full my-3">
			<div v-for="(modo, index) in modosAdd" :key="index" class="flex gap-1">
				<RadioButton v-model="modoAdd" :value="modo.value" :inputId="`modo-${index + 1}`" />
				<label :for="`modo-${index + 1}`" class="cursor-pointer text-800 text-sm">{{ modo.label }}</label>
			</div>
		</div>
		<div class="flex w-full flex-wrap flex-column">
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
				v-if="modoAdd == 'por_seleccion'"
			>
				<template #header>
					<div class="flex align-items-center gap-2 flex-end flex-column w-full justify-content-between">
						<InputText v-model="filters['global'].value" placeholder="Buscar..." />
						<h3 class="w-full m-0 text-center">
							{{ creadoresExcluidos.length }} {{ creadoresExcluidos.length == 1 ? "creador excluido" : "creadores excluidos" }}
						</h3>
					</div>
				</template>
				<Column selectionMode="multiple" headerStyle="width: 3.5rem" />
				<Column header="Creador" field="usuario" />
			</DataTable>
			<codemirror v-else-if="modoAdd == 'por_nombre_usuario'" v-model="nombreCreadoresEditor" v-bind="configCodeMirror" />
		</div>
	</div>
</template> 
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
import { Codemirror } from "vue-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { FilterMatchMode, FilterOperator } from "primevue/api";
export default {
	components: {
		Codemirror,
	},
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
		filtersExcluidos: {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		},
		btnExcluir: false,
		modosAdd: [
			{ label: "Por selección", value: "por_seleccion" },
			{ label: "Por nombre de usuario", value: "por_nombre_usuario" },
		],
		modoAdd: "por_seleccion",
		configCodeMirror: {
			placeholder: "Introduce los nombres de los creadores, un nombre de usuario por línea.",
			style: {
				height: "400px",
			},
			"indent-with-tab": true,
			extensions: [oneDark],
		},
		nombreCreadoresEditor: null,
		creadoresExcluidosGuardados: [],
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
			this.creadoresExcluidosGuardados = this.creadores.filter((c) => {
				return this.creadoresExcluidos.some((cr) => cr._id == c._id);
			});
		},
		async excluirCreadores() {
			this.btnExcluir = true;
			if (this.nombreCreadoresEditor != null) {
				const creadoresNombres = this.nombreCreadoresEditor.split("\n");
				if (creadoresNombres.length > 0) {
					creadoresNombres.forEach((creador) => {
						const c = this.creadores.find((cr) => cr.usuario == creador);
						if (c != undefined) {
							if (this.creadoresExcluidos.find((cr) => cr._id == c._id) == undefined) {
								this.creadoresExcluidos.push(c);
							}
						}
					});
				}
			}
			const excluir = { creadores: this.creadoresExcluidos.flatMap((c) => c._id) };
			await axios
				.post(`${this.API}/reunion/excluir-creador`, excluir, this.headers)
				.then((resp) => {
					if (!resp.data.error) {
						this.nombreCreadoresEditor = null;
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
		await this.getCreadores();
		await this.getCreadoresExcluidos();
	},
};
</script>