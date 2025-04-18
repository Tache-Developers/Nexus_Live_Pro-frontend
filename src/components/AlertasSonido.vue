<template>
	<div class="alertas-sonido-root">
		<!-- <div class="semaforo table-alertas m-4">
			<div :class="`luz luz-unica-${i}`" v-for="i in 3" :key="i" />
		</div> -->
		<Panel>
			<template #header>
				<div class="flex align-items-center gap-2 flex-end flex-wrap w-full justify-content-between">
					<h1 class="m-0">Configuración de alertas</h1>
				</div>
			</template>
			<DataTable
				:value="misAlertas.alertas"
				tableStyle="min-width: 100%"
				class="tabla-alertas"
				:filters="filterAlertas"
				paginator
				:rows="10"
				:rowsPerPageOptions="[10, 20, 50, 100]"
				:loading="loadingAlertas"
			>
				<template #header>
					<div class="flex w-full flex-column gap-3 justify-content-between align-items-center text-white">
						<div class="flex w-full flex-wrap gap-2 justify-content-between align-items-center">
							<h2 class="m-0">Mis alertas</h2>
							<div class="botones flex flex-wrap gap-2 text-white">
								<Button
									icon="pi pi-plus"
									label="Crear alerta"
									class="text-white"
									severity="secondary"
									outlined
									@click="modalCrearAlerta = true"
								/>
							</div>
						</div>
						<span class="p-input-icon-left w-full">
							<i class="pi pi-search" />
							<InputText v-model="filterAlertas['global'].value" placeholder="Buscar..." />
						</span>
					</div>
				</template>
				<template #empty>
					<p class="w-full font-bold text-center">Sin alertas creadas</p>
				</template>
				<Column field="isHabilitada" header="Alerta habilitada" headerStyle="width: 195px;">
					<template #body="props">
						<Checkbox v-model="props.data.isHabilitada" :binary="true" @change="actualizarAlertas" />
					</template>
				</Column>
				<Column field="disparador" header="Evento" headerStyle="width:auto;" />
				<Column field="fuentes_disparador" header="Fuente" headerStyle="width:auto;">
					<template #body="props">
						<div class="flex flex-wrap gap-2" v-if="props.data.fuentes_disparador.length > 0">
							<div class="flex gap-2 flex-wrap align-items-center justify-content-center" v-if="props.data.fuentes_disparador.length <= 5">
								<div
									class="flex flex-column gap-1 align-items-center justify-content-center"
									v-for="(fuente, index) in props.data.fuentes_disparador"
									:key="index"
								>
									<Image :src="getRegaloById(fuente).image" preview width="80" />
									<span>{{ getRegaloById(fuente).name }}</span>
								</div>
							</div>
							<Button
								v-else
								@click="mostrarRegalos(props.data.fuentes_disparador)"
								icon="pi pi-eye"
								:label="`Ver ${props.data.fuentes_disparador.length} regalos`"
								severity="info"
								text
							/>
						</div>
					</template>
				</Column>
				<Column header="Acciones" headerStyle="width: 350px;">
					<template #body="props">
						<div class="flex flex-column gap-3 align-items-center">
							<div class="flex flex-column w-full gap-2">
								<label class="font-bold">Volumen</label>
								<Slider v-model="props.data.volumen" :step="5" class="w-full" @slideend="actualizarAlertas" />
							</div>
							<Button
								@click="reproducir(props.data.sonido, props.data.volumen)"
								icon="pi pi-play"
								label="Escuchar"
								severity="secondary"
								outlined
								class="text-white"
							/>
							<Button
								v-tooltip.top="'Eliminar alerta'"
								@click="confirmEliminar(props.data)"
								icon="pi pi-trash"
								severity="danger"
								rounded
								outlined
								aria-label="Eliminar"
							/>
						</div>
					</template>
				</Column>
			</DataTable>
		</Panel>
		<Dialog
			v-model:visible="modalCrearAlerta"
			header="Nueva alerta"
			:style="{ width: '55rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="top"
			:modal="true"
			:draggable="false"
		>
			<form ref="formCrearAlerta">
				<div class="flex flex-column gap-2">
					<div class="flex flex-column gap-1 w-full">
						<label class="font-semibold">Tipo Evento</label>
						<Dropdown
							v-model="paqueteAlerta.disparador"
							:options="disparadores"
							optionLabel="label"
							optionValue="value"
							placeholder="Selecciona evento"
							checkmark
							:highlightOnSelect="false"
						/>
					</div>
					<div class="flex flex-column gap-1 w-full mt-2" v-if="paqueteAlerta.disparador == 'gift'">
						<label class="font-semibold">Regalos</label>
						<DataView
							:value="gifts_copia"
							layout="grid"
							class="overflow-auto py-2 h-full dataview-regalos"
							:rows="10"
							:totalRecords="gifts_copia.length"
							:rowsPerPageOptions="[10, 25, 50, 100]"
							paginatorTemplate="PrevPageLink PageLinks NextPageLink RowsPerPageDropdown"
							:alwaysShowPaginator="false"
						>
							<template #empty>
								<div class="flex flex-column gap-1 align-items-center">
									<p class="w-full text-center font-bold">Sin regalos</p>
								</div>
							</template>
							<template #header>
								<div class="flex flex-column gap-2">
									<span class="p-input-icon-left">
										<i class="pi pi-search" />
										<InputText v-model="nombreBuscar" placeholder="Buscar por nombre" />
									</span>
									<div class="w-full flex flex-wrap gap-2 justify-content-end" v-if="gifts_copia.length > 0">
										<Button label="Seleccionar todos" @click="selectRegalos('agregar')" severity="info" icon="pi pi-check" />
										<Button label="Deseleccionar todos" @click="selectRegalos('quitar')" severity="danger" icon="pi pi-times" />
									</div>
								</div>
							</template>
							<template #grid="props">
								<div class="grid grid-nogutter gap-4 w-full justify-content-center">
									<div
										v-for="(item, index) in props.items"
										:key="index"
										class="relative w-max flex flex-column my-2 align-items-center white-space-nowrap overflow-hidden text-overflow-ellipsis item-regalo border-round"
										:class="[isSeleccionado(item.id) ? 'seleccionado' : 'no-seleccionado']"
										style="min-width: 72px; max-width: 72px; max-height: max-content; padding: 2px"
									>
										<Image :src="item.image" class="border-circle" :alt="item.name">
											<template #image>
												<img
													:src="item.image == '' ? '/assets/img/avatar-default.jpg' : item.image"
													:alt="item.name"
													class="border-circle img-creador-seleccionar"
												/>
											</template>
										</Image>
										<span class="text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis w-full">
											{{ item.name }}
										</span>
										<Checkbox multiple v-model="paqueteAlerta.fuentes_disparador" class="absolute top-0 right-0" :value="item.id" />
									</div>
								</div>
							</template>
						</DataView>
					</div>
					<div class="flex flex-column gap-1 w-full mt-2">
						<label class="font-semibold">Sonido</label>
						<DataTable
							:value="sonidos"
							tableStyle="min-width: 100%"
							:filters="filterSonidos"
							paginator
							:rows="10"
							:rowsPerPageOptions="[10, 20, 50, 100]"
						>
							<template #header>
								<div class="flex w-full flex-column gap-3 justify-content-between align-items-center text-white">
									<div class="flex flex-wrap gap-2 w-full justify-content-end align-items-center">
										<Button
											@click="
												() => {
													paqueteNuevoSonido.tipo = 'local';
													modalNuevoSonido = true;
												}
											"
											icon="pi pi-file"
											label="Subir sonido local"
											severity="info"
										/>
										<Button
											@click="
												() => {
													paqueteNuevoSonido.tipo = 'url';
													modalNuevoSonido = true;
												}
											"
											icon="pi pi-upload"
											label="Subir sonido URL"
											severity="warning"
										/>
									</div>
									<span class="p-input-icon-left w-full">
										<i class="pi pi-search" />
										<InputText v-model="filterSonidos['global'].value" placeholder="Buscar..." />
									</span>
								</div>
							</template>
							<template #empty>
								<p class="w-full font-bold text-center">Sin sonidos</p>
							</template>
							<Column field="name" header="Nombre" />
							<Column header="Acciones">
								<template #body="props">
									<div class="flex flex-wrap gap-3 align-items-center">
										<Button
											@click="reproducir(props.data.url)"
											icon="pi pi-play"
											label="Escuchar"
											severity="secondary"
											outlined
											class="text-white"
										/>
										<Button
											@click="paqueteAlerta.sonido = props.data.url"
											icon="pi pi-check"
											:label="paqueteAlerta.sonido == props.data.url ? 'Seleccionado' : 'Seleccionar'"
											:severity="paqueteAlerta.sonido == props.data.url ? 'success' : 'secondary'"
											outlined
										/>
									</div>
								</template>
							</Column>
						</DataTable>
					</div>
				</div>
			</form>
			<template #footer>
				<Button label="Cancelar" @click="modalCrearAlerta = false" autofocus text severity="danger" />
				<Button label="Crear" :disabled="btnCrear" @click="crearAlerta" />
			</template>
		</Dialog>
		<Dialog
			v-model:visible="modalNuevoSonido"
			header="Nueva sonido"
			:style="{ width: '45rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="top"
			:modal="true"
			:draggable="false"
		>
			<form ref="formCrearSonido">
				<div class="flex flex-column gap-2">
					<div class="flex flex-column gap-1 w-full">
						<label class="font-semibold">Nombre</label>
						<InputText v-model="paqueteNuevoSonido.name" placeholder="Ingresa el nombre del sonido" />
					</div>
					<div class="flex flex-column gap-1 w-full" v-if="paqueteNuevoSonido.tipo == 'local'">
						<label class="font-semibold">Archivo de audio</label>
						<InputText
							type="file"
							@change="
								(e) => {
									paqueteNuevoSonido.sonido = e.target.files[0];
								}
							"
							placeholder="Selecciona el archivo de audio"
							accept="audio/*"
						/>
					</div>
					<div class="flex flex-column gap-1 w-full" v-else>
						<label class="font-semibold">URL del audio</label>
						<InputText type="url" v-model="paqueteNuevoSonido.sonido" placeholder="Ingresa la URL del audio" />
					</div>
				</div>
			</form>
			<template #footer>
				<Button label="Cancelar" @click="modalNuevoSonido = false" autofocus text severity="danger" />
				<Button label="Subir" :disabled="btnCrear" @click="subirSonido" />
			</template>
		</Dialog>
		<Galleria
			:value="verRegalos"
			v-model:visible="galleryVerRegalos"
			:fullScreen="true"
			:showItemNavigators="true"
			:showThumbnails="false"
			:activeIndex="activeIndexGallery"
			@update:activeIndex="
				(i) => {
					activeIndexGallery = i;
				}
			"
		>
			<template #item="props">
				<img :src="props.item.image" :alt="props.item.name" style="width: max-content; height: 415px; object-fit: none; display: block" />
			</template>
			<template #caption="props">
				<div class="text-xl mb-2 font-bold">Regalo {{ activeIndexGallery + 1 }}</div>
				<p class="text-white">{{ props.item.name }}</p>
			</template>
		</Galleria>
	</div>
</template>
<script>
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { useStoreEvento } from "../store";
import axios from "axios";

export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		API_GAME: "https://patosgame.fly.dev",
		headers: {
			headers: {
				Authorization: null,
			},
		},
		store: null,
		filterAlertas: {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		},
		filterSonidos: {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		},
		verRegalos: [],
		galleryVerRegalos: false,
		modalCrearAlerta: false,
		modalNuevoSonido: false,
		nombreBuscar: null,
		loadingAlertas: false,
		activeIndexGallery: 0,
		paqueteAlerta: {
			disparador: null, //gift, like, chat
			fuentes_disparador: [], //Solo aplica para gift que pueden ser varios
			sonido: null, //url del sonido a reproducir,
			volumen: 0.6, //Intensidad del sonido
		},
		paqueteNuevoSonido: {
			tipo: null, //local o url
			name: null,
			sonido: null,
		},
		disparadores: [
			{ label: "Regalo", value: "gift" },
			{ label: "Like", value: "like" },
			{ label: "Nuevo comentario", value: "chat" },
			{ label: "Nuevo espectador", value: "member" },
			{ label: "Nuevo seguidor", value: "follow" },
			{ label: "Nuevo suscriptor", value: "subscribe" },
			{ label: "Compartida", value: "share" },
			{ label: "Sticker enviado", value: "emote" },
			{ label: "Cofre del tesoro enviado", value: "envelope" },
			{ label: "Nueva pregunta", value: "questionNew" },
			{ label: "Batalla iniciada", value: "linkMicBattle" },
		],
		btnCrear: false,
		current_audio: null,
		misAlertas: { usuario: null, alertas: [] },
		gifts: [],
		gifts_copia: [],
		sonidos: [],
	}),
	watch: {
		nombreBuscar(newValue) {
			if (newValue != "" && newValue != null) {
				this.gifts_copia = this.gifts.filter((g) =>
					g.name
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.toLowerCase()
						.includes(
							newValue
								.normalize("NFD")
								.replace(/[\u0300-\u036f]/g, "")
								.toLowerCase()
						)
				);
			} else {
				this.gifts_copia = this.gifts;
			}
		},
	},
	methods: {
		isSeleccionado(id) {
			return this.paqueteAlerta.fuentes_disparador.includes(id);
		},
		selectRegalos(accion = null) {
			let mod = 0;
			this.gifts_copia.forEach((row) => {
				if (accion === "agregar") {
					if (!this.isSeleccionado(row.id)) {
						this.paqueteAlerta.fuentes_disparador.push(row.id);
						mod++;
					}
				} else if (accion === "quitar") {
					if (this.isSeleccionado(row.id)) {
						const index = this.paqueteAlerta.fuentes_disparador.indexOf(row.id);
						this.paqueteAlerta.fuentes_disparador.splice(index, 1);
						mod++;
					}
				}
			});
			this.$toast.add({
				severity: "info",
				summary: `${accion == "agregar" ? "Agregar" : "Quitar"} regalos`,
				detail: `Se ${accion === "agregar" ? "agregaron" : "quitaron"} ${mod} regalos`,
				life: 2100,
			});
		},
		isSonidoSeleccionado(url_sonido = "") {
			return this.paqueteAlerta.sonido == url_sonido;
		},
		reproducir(url = null, vol = null) {
			if (url != null) {
				if (this.current_audio != null) {
					this.current_audio.pause();
				}
				this.current_audio = new Audio(url);
				if (vol != null) {
					this.current_audio.volume = vol / 100;
				}
				this.current_audio.play();
			}
		},
		getNombreRegalos(regalos = []) {
			return this.gifts
				.filter((g) => regalos.includes(g.id))
				.flatMap((gi) => gi.name)
				.join(", ");
		},
		isAudio(url) {
			// Extensiones de archivos de audio más comunes
			const extensionesValidas = /\.(mp3|wav|ogg|m4a|flac|aac|opus|wma)$/i;

			return extensionesValidas.test(url);
		},
		getRegaloById(id) {
			return this.gifts.find((g) => g.id == id);
		},
		mostrarRegalos(fuentes = []) {
			this.verRegalos = this.gifts.filter((g) => fuentes.includes(g.id));
			this.galleryVerRegalos = true;
		},
		confirmEliminar(data) {
			if (data != null) {
				const index = this.misAlertas.alertas.indexOf(data);
				if (index > -1) {
					this.$confirm.require({
						group: "global",
						message: "¿Está seguro de eliminar esta alerta?",
						header: "Eliminar alerta?",
						icon: "pi pi-exclamation-triangle",
						rejectClass: "p-button-secondary p-button-outlined",
						rejectLabel: "No, cancelar",
						acceptLabel: "Sí, eliminar",
						acceptClass: "p-button-danger",
						defaultFocus: "reject",
						accept: () => {
							this.misAlertas.alertas.splice(index, 1);
							this.actualizarAlertas();
						},
						reject: () => {},
					});
				}
			}
		},
		async getGifts() {
			try {
				const resp = await axios.get(`${this.API_GAME}/gift`);
				resp.data.forEach((gift) => {
					const reg = this.gifts.find((g) => g.id == gift.id);
					if (reg == undefined) {
						this.gifts.push(gift);
					}
				});
				this.gifts_copia = this.gifts;
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
							summary: "Obtener Regalos",
							detail: "Sucedió un error, comuníquese con soporte",
							life: 1500,
						});
						console.log("Error: ", error);
						break;
				}
			}
		},
		async getMisAlertas() {
			this.loadingAlertas = true;
			try {
				const resp = await axios.get(`${this.API}/alerta-sonido/usuario/${this.store.getId()}`, this.headers);
				const alt = typeof resp.data != "object" ? { usuario: null, alertas: [] } : resp.data;
				this.misAlertas = { ...alt, alertas: alt.alertas.map((a) => ({ ...a, volumen: a.volumen * 100 })) };
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
			this.loadingAlertas = false;
		},
		async crearAlerta() {
			this.btnCrear = true;
			if (this.paqueteAlerta.disparador == null) {
				this.$toast.add({
					severity: "error",
					summary: "Agregar alerta",
					detail: "Debe seleccionar un tipo de evento",
					life: 1600,
				});
				this.btnCrear = false;
				return;
			}
			if (this.paqueteAlerta.disparador == "gift" && this.paqueteAlerta.fuentes_disparador.length == 0) {
				this.$toast.add({
					severity: "error",
					summary: "Agregar alerta",
					detail: "Debe seleccionar al menos un regalo",
					life: 1600,
				});
				this.btnCrear = false;
				return;
			}
			if (this.paqueteAlerta.sonido == null) {
				this.$toast.add({
					severity: "error",
					summary: "Agregar alerta",
					detail: "Debe seleccionar un sonido",
					life: 1600,
				});
				this.btnCrear = false;
				return;
			}
			try {
				const resp = await axios.post(
					`${this.API}/alerta-sonido/crear`,
					{ ...this.paqueteAlerta, usuario: this.store.getId() },
					this.headers
				);
				if (!resp.data.error) {
					this.paqueteAlerta = {
						disparador: null,
						fuentes_disparador: [],
						sonido: null,
						volumen: 0.6,
					};
					this.getMisAlertas();
				}
				this.$toast.add({
					severity: resp.data.error ? "error" : "success",
					summary: "Agregar alerta",
					detail: resp.data.message,
					life: 1600,
				});
			} catch (error) {
				switch (error.response.data.statusCode) {
					case 401:
						//Se le termino la sesión
						this.store.clearUser();
						this.$router.push("/login");
						break;
					case 400:
						this.$toast.add({
							severity: "error",
							summary: "Agregar alerta",
							detail: "Formato de datos incorrecto",
							life: 1500,
						});
						break;
					default:
						this.$toast.add({
							severity: "error",
							summary: "Agregar alerta",
							detail: "Sucedió un error, comuníquese con soporte",
							life: 1500,
						});
						console.log("Error: ", error);
						break;
				}
			}
			this.btnCrear = false;
		},
		async getSonidos() {
			try {
				const resp = await axios.get(`${this.API}/sonido`, this.headers);
				const s = [
					{
						name: "Fart",
						url: "https://www.myinstants.com/media/sounds/dry-fart.mp3",
					},
					{
						name: "su hijo esta viendo nopor",
						url: "https://www.myinstants.com/media/sounds/1_fD2Qond.mp3",
					},
					{
						name: "Rat dance Music",
						url: "https://www.myinstants.com/media/sounds/rat-dance-music.mp3",
					},
					{
						name: "random.mp3",
						url: "https://www.myinstants.com/media/sounds/random-mp3.mp3",
					},
					{
						name: "CALVOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
						url: "https://www.myinstants.com/media/sounds/calvoooooooooooooooooooooooooooo.mp3",
					},
					{
						name: "Linganguliguli Don pollo",
						url: "https://www.myinstants.com/media/sounds/linganguliguli-don-pollo.mp3",
					},
					{
						name: "Tuco: GET OUT",
						url: "https://www.myinstants.com/media/sounds/tuco-get-out.mp3",
					},
					{
						name: "Bomba en casa",
						url: "https://www.myinstants.com/media/sounds/bomba-en-casa.mp3",
					},
					{
						name: "Alarma de Auron play",
						url: "https://www.myinstants.com/media/sounds/alarma-de-auron-play.mp3",
					},
					{
						name: "POU ESTOURADO",
						url: "https://www.myinstants.com/media/sounds/pou-estourado_zIWCpMy.mp3",
					},
					{
						name: "TODAS MIS PAJAS ME GUSTA RECORDAR",
						url: "https://www.myinstants.com/media/sounds/todas-mis-pajas-me-gusta-recordar.mp3",
					},
					{
						name: "gemidos meme ahh",
						url: "https://www.myinstants.com/media/sounds/gemidos-meme-ahh.mp3",
					},
					{
						name: "goofy ahh sounds",
						url: "https://www.myinstants.com/media/sounds/goofy-ahh-sounds.mp3",
					},
					{
						name: "VINE BOOM SOUND",
						url: "https://www.myinstants.com/media/sounds/vine-boom.mp3",
					},
					{
						name: "Chavales que es viernes",
						url: "https://www.myinstants.com/media/sounds/chavales-que-es-viernes.mp3",
					},
					{
						name: "Tu madre tiene una",
						url: "https://www.myinstants.com/media/sounds/tu-madre-tiene-una_4GG4162.mp3",
					},
					{
						name: "Tienes un mensajeee!!!",
						url: "https://www.myinstants.com/media/sounds/tienes-un-mensajeee.mp3",
					},
					{
						name: "contesta puñetas",
						url: "https://www.myinstants.com/media/sounds/contesta-punetas.mp3",
					},
					{
						name: "estaba paralizado con mucho miedo",
						url: "https://www.myinstants.com/media/sounds/estaba-paralizado-con-mucho-miedo.mp3",
					},
					{
						name: "Metal pipe clang",
						url: "https://www.myinstants.com/media/sounds/metal-pipe-clang.mp3",
					},
					{
						name: "BRUH",
						url: "https://www.myinstants.com/media/sounds/movie_1.mp3",
					},
					{
						name: "el rap de peru",
						url: "https://www.myinstants.com/media/sounds/el-rap-de-peru.mp3",
					},
					{
						name: "Doraemon puerta mágica",
						url: "https://www.myinstants.com/media/sounds/doraemon-puerta-magica.mp3",
					},
					{
						name: "YOUR PHONE RINGING",
						url: "https://www.myinstants.com/media/sounds/your-phone-ringing_TKtb5bz.mp3",
					},
					{
						name: "MUSICA THEGREFG EPICA",
						url: "https://www.myinstants.com/media/sounds/musica-thegrefg-epica.mp3",
					},
					{
						name: "Pew_Pew",
						url: "https://www.myinstants.com/media/sounds/pew_pew-dknight556-1379997159.mp3",
					},
					{
						name: "El señor de la noche - Don Omar",
						url: "https://www.myinstants.com/media/sounds/el-senor-de-la-noche-don-omar.mp3",
					},
					{
						name: "Scream meme",
						url: "https://www.myinstants.com/media/sounds/y2mate_5gbydy1.mp3",
					},
					{
						name: "SpongeBob Fail",
						url: "https://www.myinstants.com/media/sounds/spongebob-fail.mp3",
					},
					{
						name: "se me sale la caca",
						url: "https://www.myinstants.com/media/sounds/se-me-sale-la-caca.mp3",
					},
					{
						name: "Hola tururururururururururu",
						url: "https://www.myinstants.com/media/sounds/hola-tururururururururururu.mp3",
					},
					{
						name: "Juego del Calamardoso",
						url: "https://www.myinstants.com/media/sounds/juego-del-calamardoso.mp3",
					},
					{
						name: "bombadiro crocodilo",
						url: "https://www.myinstants.com/media/sounds/bombadiro-crocodilo.mp3",
					},
					{
						name: "Rajoy: Viva el vino",
						url: "https://www.myinstants.com/media/sounds/viva-el-vino.mp3",
					},
					{
						name: "TRALALELO TRALALA",
						url: "https://www.myinstants.com/media/sounds/tralalelo-tralala.mp3",
					},
					{
						name: "tu madre tiene el empire state",
						url: "https://www.myinstants.com/media/sounds/tu-madre-tiene-el-empire-state.mp3",
					},
				];
				this.sonidos = s.concat(resp.data);
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
							summary: "Obtener sonidos",
							detail: "Sucedió un error, comuníquese con soporte",
							life: 1500,
						});
						console.log("Error: ", error);
						break;
				}
			}
		},
		async subirSonido() {
			this.btnCrear = true;

			try {
				if (this.paqueteNuevoSonido.sonido == null) {
					this.$toast.add({
						severity: "error",
						summary: "Subir sonido",
						detail: "Debe seleccionar un archivo",
						life: 1600,
					});
					this.btnCrear = false;
					return;
				}
				const ext = this.paqueteNuevoSonido.tipo == "local" ? this.paqueteNuevoSonido.sonido.name : this.paqueteNuevoSonido.sonido;
				if (!this.isAudio(ext)) {
					this.$toast.add({
						severity: "error",
						summary: "Subir sonido",
						detail: "Formato de archivo no válido",
						life: 1600,
					});
					this.btnCrear = false;
					return;
				}
				if (this.paqueteNuevoSonido.name == null || this.paqueteNuevoSonido.name.length == 1) {
					this.$toast.add({
						severity: "error",
						summary: "Subir sonido",
						detail: "Nombre del sonido es requerido y debe tener al menos 2 caracteres",
						life: 1600,
					});
					this.btnCrear = false;
					return;
				}
				let resp;
				if (this.paqueteNuevoSonido.tipo == "local") {
					resp = await axios.postForm(
						`${this.API}/sonido/subir-sonido`,
						{ name: this.paqueteNuevoSonido.name, sonido: this.paqueteNuevoSonido.sonido },
						this.headers
					);
				} else {
					resp = await axios.post(
						`${this.API}/sonido/crear`,
						{ name: this.paqueteNuevoSonido.name, url: this.paqueteNuevoSonido.sonido },
						this.headers
					);
				}
				if (!resp.data.error) {
					this.paqueteAlerta.sonido = this.paqueteNuevoSonido.tipo == "local" ? resp.data.url_sonido : this.paqueteNuevoSonido.sonido;
					this.paqueteNuevoSonido = { name: null, sonido: null, tipo: "local" };
					this.getSonidos();
					this.modalNuevoSonido = false;
				}
				this.$toast.add({
					severity: resp.data.error ? "error" : "success",
					summary: "Subir sonido",
					detail: resp.data.message,
					life: 1800,
				});
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
							summary: "Subir sonido",
							detail: "Sucedió un error, comuníquese con soporte",
							life: 1600,
						});
						console.log("Error: ", error);
						break;
				}
			}

			this.btnCrear = false;
		},
		async actualizarAlertas() {
			try {
				const alertas = this.misAlertas.alertas.map((a) => {
					return {
						...a,
						volumen: a.volumen / 100,
					};
				});
				const resp = await axios.put(`${this.API}/alerta-sonido/${this.store.getId()}`, alertas, this.headers);
				this.$toast.add({
					severity: resp.data.error ? "error" : "success",
					summary: "Actualizar alertas",
					detail: resp.data.message,
					life: 1700,
				});
				if (!resp.data.error) {
					await this.getMisAlertas();
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
							summary: "Actualizar alertas",
							detail: "Sucedió un error, comuníquese con soporte",
							life: 1600,
						});
						console.log("Error: ", error);
						break;
				}
			}
		},
	},
	async created() {
		this.store = useStoreEvento();
		if (!this.store.isActive()) {
			return;
		}
		this.headers.headers.Authorization = `Bearer ${this.store.getToken()}`;
		await this.getGifts();
		await this.getSonidos();
		await this.getMisAlertas();
	},
};
</script>
<style>
.alertas-sonido-root > .semaforo {
	width: 150px;
	height: 380px;
	background: #2e2e2e;
	border-radius: 12px;
	margin: 20px 0;
	padding: 10px;
	display: flex;
	gap: 12px;
	flex-direction: column;
	align-items: center;
	overflow: hidden;
}
.alertas-sonido-root > .semaforo > .luz {
	width: 120px;
	height: 122px;
	background: gray;
	border-radius: 50%;
	box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
}
.luz-unica-1 {
	animation: luzRoja 20s infinite;
}
.luz-unica-2 {
	animation: luzAmarrilla 20s infinite;
}
.luz-unica-3 {
	animation: luzVerde 20s infinite;
}
@keyframes luzRoja {
	0%,
	50% {
		background: #ff0000;
		opacity: 1;
	}
	52%,
	100% {
		background: gray;
		opacity: 0.3;
	}
}
@keyframes luzAmarrilla {
	0%,
	52% {
		background: gray;
		opacity: 0.3;
	}
	52.1%,
	60.5% {
		background: #ffff00;
		opacity: 1;
	}
	60.5%,
	100% {
		background: gray;
		opacity: 0.3;
	}
}
@keyframes luzVerde {
	0%,
	60% {
		background: gray;
		opacity: 0.3;
	}
	61%,
	100% {
		background: #00ff00;
		opacity: 1;
	}
}

.alertas-sonido-root > .p-panel > .p-toggleable-content > .p-panel-content,
.alertas-sonido-root
	> .p-panel
	> .p-toggleable-content
	> .p-panel-content
	> .p-datatable
	*:not(.p-checkbox, .p-checkbox-icon, .p-checkbox.p-highlight .p-checkbox-box, .p-button, .p-slider, .p-slider-range) {
	background: #2e2e2e;
}

.tabla-alertas {
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.item-regalo.seleccionado {
	outline: 2px solid #6ee7b7;
}

.item-regalo.no-puede-seleccionar {
	box-shadow: none !important;
	opacity: 0.3;
}
.dataview-regalos {
	max-height: 450px;
}
.alertas-sonido-root > .p-panel > .p-toggleable-content > .p-panel-content {
	min-height: 100vh;
}
.container-gallery .p-galleria-thumbnail-item {
	min-width: 55px;
}
</style>