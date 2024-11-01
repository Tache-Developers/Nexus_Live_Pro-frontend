<template>
	<Panel class="w-full h-full sin-panel-header ordenar border-none">
		<div class="flex flex-wrap justify-content-center align-items-center">
			<Card style="width: 35rem; overflow: hidden" class="p-3 shadow-6">
				<template #title><div class="m-0 p-0 text-center w-full text-break">Crear orden</div></template>
				<template #content>
					<form ref="formServicio">
						<div class="form-container">
							<div class="flex flex-column gap-1 mb-2">
								<label class="font-bold block">Categorías</label>
								<Dropdown
									v-model="categoriaSelect"
									:options="categoriasFilter"
									emptyMessage="Sin categorías disponibles"
									filter
									optionLabel="categoria"
									optionValue="categoria"
									placeholder="Selecciona categoría para filtrar servicios"
									aria-describedby="categoria-help"
								/>
								<small id="categoria-help">Selecciona una categoría para filtrar los servicios.</small>
							</div>
							<div class="flex flex-column gap-1 mb-2">
								<label class="font-bold block">Servicios</label>
								<Dropdown
									v-model="servicioSelect"
									showClear
									:options="servicios"
									emptyMessage="Sin servicios disponibles"
									filter
									optionLabel="name"
									@update:modelValue="selectServicio"
									placeholder="Selecciona servicio"
								>
									<template #option="props">
										<div class="flex align-items-center flex-wrap">
											<div>
												<Tag :value="props.option.service" severity="info" rounded />
												- {{ props.option.name }}
											</div>
										</div>
									</template>
								</Dropdown>
							</div>
							<div class="flex flex-column gap-1 mb-2">
								<label class="font-bold block">Cantidad</label>
								<InputText
									type="number"
									v-model="paquetePromocion.cantidad"
									:min="min"
									:max="max"
									@update:modelValue="calcularPago"
									aria-describedby="cantidad-help"
								/>
								<small id="cantidad-help">{{ help_cantidad }}</small>
							</div>
							<div class="flex flex-column gap-1 mb-2">
								<label class="font-bold block">Link</label>
								<InputText type="url" v-model="paquetePromocion.link" aria-describedby="url-help" />
								<small id="url-help">Del perfil o publicación a aumentar reacciones o seguidores</small>
							</div>
							<div class="flex flex-column gap-1 mb-2">
								<label class="font-bold block">$ Pagar</label>
								<Message :closable="false">{{ paquetePromocion.pagar }}</Message>
								<small id="saldo">Advertencia: Revise bien el saldo, se descontará de tu saldo</small>
							</div>
						</div>
					</form>
				</template>
				<template #footer>
					<div class="flex flex-column flex-wrap gap-2 mt-1">
						<Button label="Ordenar" :disabled="btnOrden" @click="ordenar" />
					</div>
				</template>
			</Card>
		</div>
	</Panel>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
export default {
	data: () => ({
		btnOrden: false,
		API: import.meta.env.VITE_APP_API,
		store: null,
		token: {
			headers: {
				Authorization: null,
			},
		},
		User: {
			saldo: "",
			_id: null,
		},
		min: 1,
		max: 2,
		categoriaSelect: null,
		categoriasFilter: [],
		servicioSelect: null,
		servicios: [],
		serviciosActivos: [],
		paquetesRecargas: [],
		paquetePromocion: {
			proveedor: null,
			service: null,
			descripcion: null,
			cantidad: null,
			link: null,
			pagar: 0,
			idUsuario: null,
		},
		help_cantidad: "Cantidad del servicio.",
	}),
	watch: {
		categoriaSelect: {
			handler(newVal) {
				if (newVal) {
					this.servicios = this.serviciosActivos.filter((s) => s.category == newVal);
				}
			},
			deep: true,
		},
	},
	methods: {
		selectServicio(event) {
			this.paquetePromocion.proveedor = event.proveedor._id;
			this.help_cantidad = `Puedes ordenar entre ${event.min} y ${event.max}`;
			this.paquetePromocion.service = event.service;
			this.paquetePromocion.descripcion = event.name;
			this.min = parseInt(event.min);
			this.max = parseInt(event.max);
			this.precioRate = parseFloat(event.rate) / 1000;
			this.calcularPago();
		},
		calcularPago() {
			this.paquetePromocion.pagar = this.paquetePromocion.cantidad * this.precioRate;
		},
		async getUserInfo() {
			await axios
				.get(`${this.API}/usuario/${this.User._id}`, this.token)
				.then((response) => {
					this.User = response.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							console.log(error);
							break;
						default:
							this.$toast.add({
								severity: "error",
								summary: "Obtener usuario",
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
					this.serviciosActivos = response.data;
					this.serviciosActivos.forEach((service) => {
						const existCat = this.categoriasFilter.some((cat) => cat.categoria == service.category);
						if (!existCat) {
							this.categoriasFilter.push({ categoria: service.category });
						}
					});
					if (this.categoriasFilter.length > 0) {
						this.categoriaSelect = this.categoriasFilter[0].categoria;
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
								summary: "Obtener servicios Activos",
								detail: "Sucedió un error, Comuniquese con soporte",
								life: 1500,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		async ordenar() {
			if (this.paquetePromocion.service != null) {
				this.paquetePromocion.cantidad = parseInt(this.paquetePromocion.cantidad);
				if (this.paquetePromocion.cantidad >= this.min && this.paquetePromocion.cantidad <= this.max) {
					this.paquetePromocion.pagar = parseFloat(this.paquetePromocion.pagar);
					if (parseFloat(this.User.saldo) >= this.paquetePromocion.pagar) {
						if (this.paquetePromocion.link != null) {
							this.btnOrden = true;

							await axios
								.post(`${this.API}/usuario/ordenar`, this.paquetePromocion, this.token)
								.then(async (response) => {
									if (response.data) {
										this.$toast.add({ severity: "success", summary: "Ordenar", detail: "Orden creada con éxito", life: 1500 });
										this.servicioSelect = null;
										this.$refs.formServicio.reset();
										await this.getUserInfo();
										this.store.setSaldo(this.User.saldo);
										this.$emit("actualizarSaldo");
										this.getServiciosActive();
									} else {
										this.$toast.add({ severity: "error", summary: "Ordenar", detail: "No se pudo crear la orden", life: 1500 });
									}
								})
								.catch((error) => {
									console.log("Error orden; ", error);
									this.$toast.add({ severity: "error", summary: "Ordenar", detail: "Ocurrió un problema creando la orden", life: 1500 });
								});
							this.btnOrden = false;
						} else {
							this.$toast.add({ severity: "info", summary: "Ordenar", detail: "Ingresa el link de la publicación o perfil", life: 1500 });
						}
					} else {
						this.$toast.add({ severity: "error", summary: "Ordenar", detail: "No tienes suficiente saldo", life: 1500 });
					}
				} else {
					this.$toast.add({
						severity: "info",
						summary: "Ordenar",
						detail: `La cantidad debe estar entre ${this.min} y ${this.max}`,
						life: 1500,
					});
				}
			} else {
				this.$toast.add({ severity: "info", summary: "Ordenar", detail: "Debes escoger un servicio", life: 1500 });
			}
		},
	},
	async created() {
		this.store = useStoreEvento();
		if (!this.store.isActive()) {
			this.$router.push("/login");
		}
		this.token.headers.Authorization = `Bearer ${this.store.getToken()}`;
		this.User._id = this.store.getId();
		this.paquetePromocion.idUsuario = this.store.getId();
		await this.getUserInfo();
		await this.getServiciosActive();
	},
};
</script>
<style>
.sin-panel-header > .p-panel-header {
	display: none !important;
}
</style>