<template>
	<div class="chattts-root">
		<Panel>
			<template #header>
				<div class="flex align-items-center gap-2 flex-end flex-wrap w-full justify-content-between">
					<h1 class="m-0">Chat Texto a Voz</h1>
				</div>
			</template>
			<div class="flex flex-wrap gap-6 align-items-center justify-content-center">
				<Card style="width: 25rem; overflow: hidden" class="card-shadow">
					<template #title>Usuarios permitidos</template>
					<template #subtitle>Debes seleccionar a los usuarios cuyas interacciones serán leídas durante el LIVE.</template>
					<template #content>
						<div class="flex flex-column w-full gap-2">
							<div
								class="flex w-full gap-2 flex-nowrap align-items-center"
								v-for="(config, index) in usuarios_permitidos_config"
								:key="index"
							>
								<Checkbox v-model="miTTS.tipos_usuarios_permitidos" :inputId="config.value" name="config_users" :value="config.value" />
								<div class="flex flex-column" v-if="config.custom">
									<label :for="config.value" class="cursor-pointer">{{ config.label }}</label>
									<div class="flex flex-nowrap gap-2 cursor-pointer text-blue-400 align-items-center text-xs font-bold">
										<i :class="config.icon" />
										<span @click="config.call">
											{{ config.detail() }}
										</span>
									</div>
								</div>
								<label v-else :for="config.value" class="cursor-pointer">{{ config.label }}</label>
							</div>
						</div>
					</template>
				</Card>
				<Card style="width: 25rem; overflow: hidden" class="card-shadow">
					<template #title>Tipos de comentarios</template>
					<template #subtitle>Debes seleccionar qué tipo de comentarios deseas escuchar.</template>
					<template #content>
						<div class="flex flex-column w-full gap-2">
							<div class="flex w-full gap-2 flex-nowrap align-items-center" v-for="(config, index) in comentarios_config" :key="index">
								<RadioButton
									v-model="miTTS.tipo_comentarios_permitidos"
									:inputId="config.value"
									name="config_comentarios"
									:value="config.value"
								/>
								<div class="flex flex-column" v-if="config.custom">
									<label :for="config.value" class="cursor-pointer">{{ config.label }}</label>
									<InputText
										id="comando"
										v-model="custom_comando"
										size="small"
										:readonly="miTTS.tipo_comentarios_permitidos != 'comando'"
										:disabled="miTTS.tipo_comentarios_permitidos != 'comando'"
										:modelValue="config.value"
										@blur="guardarConfiguracion(true)"
									/>
								</div>
								<label v-else :for="config.value" class="cursor-pointer">{{ config.label }}</label>
							</div>
						</div>
					</template>
				</Card>
				<Card style="width: 25rem; overflow: hidden" class="card-shadow">
					<template #title>Configuración de Voz</template>
					<template #content>
						<div class="flex flex-column w-full gap-2">
							<div class="flex flex-column gap-1 w-full">
								<label for="idioma" class="font-bold block">Idioma</label>
								<Dropdown
									inputId="idioma"
									v-model="paisTTS"
									checkmark
									:options="paisesTTS"
									filter
									optionLabel="nombre"
									placeholder="Selecciona un idioma"
								/>
							</div>
							<div class="flex flex-column gap-1 w-full">
								<label for="voces" class="font-bold block">Voces</label>
								<Dropdown
									inputId="voces"
									v-model="miTTS.voz_tts"
									checkmark
									:options="filtrarVoces"
									filter
									optionLabel="FriendlyName"
									placeholder="Selecciona una voz"
								/>
							</div>
							<Divider class="mb-0" />
							<p class="m-0">Prueba la voz</p>
							<div class="flex flex-column gap-2 w-full">
								<InputText inputId="voces" v-model="texto" placeholder="Ingresa texto de prueba" />
								<Button label="Escuchar" class="font-bold block text-white" @click="probarVoz" severity="secondary" outlined />
							</div>
						</div>
					</template>
				</Card>
				<DataTable
					:value="miTTS.lista_usuarios_permitidos"
					class="card-shadow lg:w-10 w-12 mt-4"
					:filters="filterCreadores"
					paginator
					:rows="10"
					:rowsPerPageOptions="[10, 20, 50, 100]"
					editMode="cell"
					@cell-edit-complete="onCellEditComplete"
					:pt="{
						table: { style: 'min-width: 50rem' },
						column: {
							bodycell: ({ state }) => ({
								class: [{ 'pt-0 pb-0': state['d_editing'] }],
							}),
						},
					}"
					:class="{ mover: isMoviendo }"
					@animationend="isMoviendo = false"
					id="dtUsuarios"
				>
					<template #header>
						<div class="flex w-full flex-column justify-content-between align-items-center text-start text-white">
							<h2 class="m-0">Creadores habilitados</h2>
							<p class="font-light">
								Aquí puedes permitir y no permitir a los usuarios utilizar TTS y asignar sus propias voces. Si desactiva la opción
								«Habilitado», el usuario estará totalmente bloqueado para el TTS. Haga clic en
								<span class="font-bold">+ Nuevo usuario</span>
								para añadir un nuevo usuario.
							</p>
							<div class="flex w-full flex-wrap gap-2 justify-content-end align-items-center my-2">
								<div class="botones flex flex-wrap gap-2 text-white">
									<Button
										icon="pi pi-plus"
										label="Nuevo usuario"
										class="text-white"
										severity="secondary"
										outlined
										@click="agregarUsuarioLista"
									/>
								</div>
							</div>
							<span class="p-input-icon-left w-full">
								<i class="pi pi-search" />
								<InputText v-model="filterCreadores['global'].value" placeholder="Buscar..." />
							</span>
						</div>
					</template>
					<template #empty>
						<p class="w-full font-bold text-center">Sin configuración para creadores</p>
					</template>
					<Column field="usuario" header="Usuario">
						<template #body="props">
							{{ props.data.usuario == null ? "Clic para ingresar nombre" : props.data.usuario }}
						</template>
						<template #editor="{ data, field }">
							<InputText v-model="data[field]" placeholder="Ingresa usuario del creador" />
						</template>
					</Column>
					<Column field="isHabilitado" header="Habilitado">
						<template #body="props">
							<Checkbox v-model="props.data.isHabilitado" :binary="true" />
						</template>
					</Column>

					<Column header="Acciones" headerStyle="width: 350px;">
						<template #body="props">
							<div class="flex flex-wrap gap-2 align-items-center">
								<Button icon="pi pi-trash" outlined rounded severity="danger" @click="quitarUsuarioLista(props.data.usuario)" />
							</div>
						</template>
					</Column>
				</DataTable>
			</div>
		</Panel>
		<Dialog
			v-model:visible="dialogGifters"
			header="Top máximo"
			:style="{ width: '2px5rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
		>
			<form ref="formCrearAlerta">
				<div class="flex flex-column gap-2">
					<InputNumber v-model="miTTS.max_top_gifters" inputId="max_top_gifters" showButtons buttonLayout="horizontal">
						<template #incrementbuttonicon>
							<span class="pi pi-plus" />
						</template>
						<template #decrementbuttonicon>
							<span class="pi pi-minus" />
						</template>
					</InputNumber>
				</div>
			</form>
			<template #footer>
				<Button label="Cerrar" @click="dialogGifters = false" autofocus text severity="danger" />
			</template>
		</Dialog>
	</div>
</template>
<script>
import { FilterMatchMode, FilterOperator } from "primevue/api";
import axios from "axios";
import { useStoreEvento } from "../store";
export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		API_TTS: import.meta.env.VITE_APP_API_TTS,
		headers: {
			headers: {
				Authorization: null,
			},
		},
		store: null,
		filterCreadores: {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		},
		isMoviendo: false,
		dialogGifters: false,
		usuarios_permitidos_config: [],
		comentarios_config: [
			{ label: "Cualquier comentario", value: "cualquiera" },
			{ label: "Comentarios que comience por punto (.)", value: "." },
			{ label: "Comentarios que comiencen por slash (/)", value: "/" },
			{ label: "Comentarios que comiencen con el comando: ", value: "comando", custom: true, detail: "Comando" },
		],
		miTTS: {
			usuario: null,
			tipos_usuarios_permitidos: [],
			lista_usuarios_permitidos: [], //Un objeto con usuario e isHabilitado
			tipo_comentarios_permitidos: null,
			comando_comentario_permitido: null,
			max_top_gifters: 3, //Para cuándo el top gifters esté activado
			voz_tts: null,
		},
		custom_comando: "!tts",
		is_getting_config: false,
		paisTTS: null,
		texto: null,
		vocesTTS: [],
		paisesTTS: [
			{ locale: "ar-EG", nombre: "العربية (مصر)", code: "EG" },
			{ locale: "ar-SA", nombre: "العربية (السعودية)", code: "SA" },
			{ locale: "bg-BG", nombre: "Български (България)", code: "BG" },
			{ locale: "ca-ES", nombre: "Català (Espanya)", code: "ES" },
			{ locale: "cs-CZ", nombre: "Čeština (Česká republika)", code: "CZ" },
			{ locale: "da-DK", nombre: "Dansk (Danmark)", code: "DK" },
			{ locale: "de-DE", nombre: "Deutsch (Deutschland)", code: "DE" },
			{ locale: "el-GR", nombre: "Ελληνικά (Ελλάδα)", code: "GR" },
			{ locale: "en-AU", nombre: "English (Australia)", code: "AU" },
			{ locale: "en-CA", nombre: "English (Canada)", code: "CA" },
			{ locale: "en-GB", nombre: "English (United Kingdom)", code: "GB" },
			{ locale: "en-IN", nombre: "English (India)", code: "IN" },
			{ locale: "en-IE", nombre: "English (Ireland)", code: "IE" },
			{ locale: "en-US", nombre: "English (United States)", code: "US" },
			{ locale: "es-AR", nombre: "Español (Argentina)", code: "AR" },
			{ locale: "es-BO", nombre: "Español (Bolivia)", code: "BO" },
			{ locale: "es-CL", nombre: "Español (Chile)", code: "CL" },
			{ locale: "es-CO", nombre: "Español (Colombia)", code: "CO" },
			{ locale: "es-ES", nombre: "Español (España)", code: "ES" },
			{ locale: "es-MX", nombre: "Español (México)", code: "MX" },
			{ locale: "es-US", nombre: "Español (Estados Unidos)", code: "US" },
			{ locale: "fi-FI", nombre: "Suomi (Suomi)", code: "FI" },
			{ locale: "fr-BE", nombre: "Français (Belgique)", code: "BE" },
			{ locale: "fr-CA", nombre: "Français (Canada)", code: "CA" },
			{ locale: "fr-FR", nombre: "Français (France)", code: "FR" },
			{ locale: "he-IL", nombre: "עברית (ישראל)", code: "IL" },
			{ locale: "hi-IN", nombre: "हिन्दी (भारत)", code: "IN" },
			{ locale: "hu-HU", nombre: "Magyar (Magyarország)", code: "HU" },
			{ locale: "id-ID", nombre: "Bahasa Indonesia (Indonesia)", code: "ID" },
			{ locale: "it-IT", nombre: "Italiano (Italia)", code: "IT" },
			{ locale: "ja-JP", nombre: "日本語 (日本)", code: "JP" },
			{ locale: "ko-KR", nombre: "한국어 (대한민국)", code: "KR" },
			{ locale: "nb-NO", nombre: "Norsk (Norge)", code: "NO" },
			{ locale: "nl-BE", nombre: "Nederlands (België)", code: "BE" },
			{ locale: "nl-NL", nombre: "Nederlands (Nederland)", code: "NL" },
			{ locale: "pl-PL", nombre: "Polski (Polska)", code: "PL" },
			{ locale: "pt-BR", nombre: "Português (Brasil)", code: "BR" },
			{ locale: "pt-PT", nombre: "Português (Portugal)", code: "PT" },
			{ locale: "ro-RO", nombre: "Română (România)", code: "RO" },
			{ locale: "ru-RU", nombre: "Русский (Россия)", code: "RU" },
			{ locale: "sk-SK", nombre: "Slovenčina (Slovensko)", code: "SK" },
			{ locale: "sv-SE", nombre: "Svenska (Sverige)", code: "SE" },
			{ locale: "ta-IN", nombre: "தமிழ் (இந்தியா)", code: "IN" },
			{ locale: "th-TH", nombre: "ไทย (ไทย)", code: "TH" },
			{ locale: "tr-TR", nombre: "Türkçe (Türkiye)", code: "TR" },
			{ locale: "uk-UA", nombre: "Українська (Україна)", code: "UA" },
			{ locale: "vi-VN", nombre: "Tiếng Việt (Việt Nam)", code: "VN" },
			{ locale: "zh-CN", nombre: "中文 (中国)", code: "CN" },
			{ locale: "zh-HK", nombre: "中文 (香港)", code: "HK" },
			{ locale: "zh-TW", nombre: "中文 (台灣)", code: "TW" },
		],
	}),
	methods: {
		quitarUsuarioLista(usuario = null) {
			const index = this.miTTS.lista_usuarios_permitidos.findIndex((u) => u.usuario == usuario);
			if (index >= 0) {
				this.miTTS.lista_usuarios_permitidos.splice(index, 1);
			}
		},
		agregarUsuarioLista() {
			if (this.miTTS.lista_usuarios_permitidos.some((u) => u.usuario == null || u.usuario.length == 0)) {
				this.$toast.add({
					severity: "warn",
					summary: "Agregar usuario",
					detail: "Le falta el nombre de usuario a una fila en la tabla",
					life: 1650,
				});
				return;
			}
			this.miTTS.lista_usuarios_permitidos.unshift({
				usuario: null,
				isHabilitado: true,
			});
			setTimeout(() => {
				const tdNombre = document.querySelector("#dtUsuarios table.p-datatable-table>tbody>tr>td");
				tdNombre.click();
			}, 500);
		},
		onCellEditComplete(event) {
			let { data, newValue, field } = event;
			if (newValue == null) {
				event.preventDefault();
				return;
			}
			const val = newValue.trim();
			if (val.length > 0) {
				const c = this.miTTS.lista_usuarios_permitidos.filter((cr) => cr.usuario == val);
				if (c.length >= 1) {
					this.$toast.add({
						severity: "error",
						summary: "Habilitar creador",
						detail: "El usuario ya existe en la lista",
						life: 1650,
					});
					event.preventDefault();
					return;
				}
				data[field] = val;
				return;
			}
			event.preventDefault();
		},
		async guardarConfiguracion(isBlur = false) {
			if (this.is_getting_config) {
				return;
			}
			if (isBlur && this.miTTS.tipo_comentarios_permitidos == "comando") {
				if (this.custom_comando == this.miTTS.comando_comentario_permitido) {
					return;
				}
			}
			try {
				if (this.miTTS.tipos_usuarios_permitidos.length == 0) {
					this.$toast.add({
						severity: "error",
						summary: "Guardar configuración",
						detail: "Debes seleccionar al menos un tipo de usuario permitido",
						life: 1650,
					});
					return;
				}
				if (this.miTTS.tipo_comentarios_permitidos == null) {
					this.$toast.add({
						severity: "error",
						summary: "Guardar configuración",
						detail: "Debes seleccionar un tipo de comentarios permitidos",
						life: 1650,
					});
					return;
				}
				if (this.miTTS.tipo_comentarios_permitidos == "comando" && this.custom_comando.trim().length == 0) {
					this.$toast.add({
						severity: "error",
						summary: "Guardar comando",
						detail: "Debes ingresar un comando para el tipo de comentarios permitidos",
						life: 1650,
					});
					return;
				}
				if (this.miTTS.voz_tts == null) {
					this.$toast.add({
						severity: "error",
						summary: "Guardar configuración",
						detail: "Debes configurar una voz",
						life: 1650,
					});
					return;
				}
				const paquete = { ...this.miTTS, voz_tts: this.miTTS.voz_tts.ShortName };
				if (this.miTTS.tipo_comentarios_permitidos == "comando") {
					paquete.comando_comentario_permitido = this.custom_comando;
				}
				paquete.lista_usuarios_permitidos = [];
				if (this.miTTS.tipos_usuarios_permitidos.includes("lista_personalizada")) {
					this.miTTS.lista_usuarios_permitidos.forEach((usuario) => {
						if (
							!paquete.lista_usuarios_permitidos.some((u) => u.usuario == usuario.usuario) &&
							usuario.usuario != null &&
							usuario.usuario != ""
						) {
							paquete.lista_usuarios_permitidos.push(usuario);
						}
					});
				}
				const resp = await axios.post(`${this.API}/tts/crear`, paquete, this.headers);
				if (!resp.data.error) {
					this.getMiTTS();
				}
				this.$toast.add({
					severity: resp.data.error ? "error" : "success",
					summary: "Guardar configuración",
					detail: resp.data.message,
					life: 1700,
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
							summary: "Guardar configuración",
							detail: "Sucedió un error, comuníquese con soporte",
							life: 1500,
						});
						console.log("Error: ", error);
						break;
				}
			}
		},
		async getMiTTS() {
			this.is_getting_config = true;
			try {
				const resp = await axios.get(`${this.API}/tts/usuario/${this.store.getId()}`, this.headers);
				if (typeof resp.data == "object") {
					this.miTTS = resp.data;
					this.miTTS.voz_tts = this.vocesTTS.find((v) => v.ShortName == resp.data.voz_tts);
					this.paisTTS = this.paisesTTS.find((p) => p.locale == this.miTTS.voz_tts.Locale);
					if (resp.data.comando_comentario_permitido != null) {
						this.custom_comando = resp.data.comando_comentario_permitido;
					}
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
			setTimeout(() => {
				this.is_getting_config = false;
			}, 1200);
		},
		async getVoicesTTS() {
			try {
				const resp = await axios.get(`${this.API_TTS}/voices`);
				this.vocesTTS = resp.data;
			} catch (error) {
				this.$toast.add({
					severity: "error",
					summary: "Obtener voces",
					detail: "Sucedió un error obteniendo las voces",
					life: 1600,
				});
			}
		},
		async probarVoz() {
			if (this.miTTS.voz_tts != null && this.texto != null && this.texto.trim().length > 0) {
				try {
					const resp = await axios.post(`${this.API_TTS}/text-to-speech`, { text: this.texto, voice: this.miTTS.voz_tts.ShortName });
					const audio = new Audio(`data:audio/mp3;base64,${resp.data.audio_base64}`);
					audio.play();
				} catch (error) {
					this.$toast.add({
						severity: "error",
						summary: "Probar voz",
						detail: "Sucedió un problema obteniendo el audio",
						life: 1500,
					});
				}
			} else {
				this.$toast.add({
					severity: "warn",
					summary: "Probar voz",
					detail: "Debes seleccionar una voz e ingresar un texto",
					life: 1500,
				});
			}
		},
	},
	watch: {
		miTTS: {
			handler() {
				this.guardarConfiguracion();
			},
			deep: true,
		},
	},
	computed: {
		filtrarVoces() {
			if (this.paisTTS != null) {
				return this.vocesTTS.filter((v) => v.Locale == this.paisTTS.locale);
			}
			return [];
		},
	},
	async created() {
		this.store = useStoreEvento();
		if (!this.store.isActive()) {
			return;
		}
		this.headers.headers.Authorization = `Bearer ${this.store.getToken()}`;
		this.miTTS.usuario=this.store.getId();
		await this.getVoicesTTS();
		await this.getMiTTS();
		this.usuarios_permitidos_config = [
			{ label: "Todos los usuarios", value: "todos" },
			{ label: "Seguidores", value: "followers" },
			{ label: "Suscriptores", value: "suscribers" },
			{ label: "Moderadores", value: "moderators" },
			{
				label: "Top Gifters",
				value: "top_gifters",
				icon: "pi pi-cog",
				detail: () => {
					return `Top: ${this.miTTS.max_top_gifters}`;
				},
				custom: true,
				call: () => {
					this.dialogGifters = true;
				},
			},
			{
				label: "Creadores permitidos desde lista",
				value: "lista_personalizada",
				icon: "pi pi-users",
				custom: true,
				detail: () => {
					const h = this.miTTS.lista_usuarios_permitidos.filter((c) => c.isHabilitado == true);
					return `Creadores habilitados: ${h.length}`;
				},
				call: () => {
					const tabla = document.getElementById("tablaUsuariosEnabled");
					if (tabla) {
						const yOffset = tabla.getBoundingClientRect().top + window.scrollY - 100;
						window.scrollTo({ top: yOffset, behavior: "smooth" });
					}
					this.isMoviendo = true;
				},
			},
		];
	},
};
</script>
<style>
.chattts-root > .p-panel > .p-toggleable-content > .p-panel-content,
.chattts-root
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
.chattts-root > .p-panel > .p-toggleable-content > .p-panel-content,
.chattts-root
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
		.p-radiobutton.p-highlight .p-radiobutton-box
	) {
	background: #2e2e2e;
}
.chattts-root > .p-panel > .p-toggleable-content > .p-panel-content {
	min-height: 100vh;
}
.chattts-root > .p-panel > .p-toggleable-content > .p-panel-content > div > .p-card > .p-card-body {
	padding: 8px 10px !important;
}

.card-shadow {
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

@keyframes moviendo {
	0% {
		transform: translateX(0);
	}
	10% {
		transform: translateX(-8px);
	}
	20% {
		transform: translateX(8px);
	}
	30% {
		transform: translateX(-8px);
	}
	40% {
		transform: translateX(8px);
	}
	50% {
		transform: translateX(-8px);
	}
	60% {
		transform: translateX(8px);
	}
	70% {
		transform: translateX(-8px);
	}
	80% {
		transform: translateX(8px);
	}
	90% {
		transform: translateX(-8px);
	}
	100% {
		transform: translateX(0);
	}
}

.mover {
	animation: moviendo 1s ease-in-out;
}
</style>