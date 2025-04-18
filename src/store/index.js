import { defineStore } from "pinia";
import { io } from "socket.io-client";
import axios from "axios";

export const useSessionStore = defineStore("session", {
	state: () => ({
		user: null,
		sessionTime: null,
	}),

	actions: {
		isActive() {
			console.log(this.user);
			if (this.user) {
				return true;
			}
			return false;
		},
		saveUser(user) {
			console.log("guardando");
			this.user = user;
			this.sessionTime = new Date();
			console.log(this.user);
		},
		token() {
			return this.user.access_token;
		},
		clearUser() {
			this.user = null;
			this.sessionTime = null;
		},
	},
});

export const useStoreEvento = defineStore("evento", {
	state: () => ({
		user: null,
		evento: {
			evento: null,
			categoria: null,
			premio: null,
		},
	}),

	actions: {
		eventoID(id, categoria, premio) {
			this.evento.evento = id;
			this.evento.categoria = categoria;
			this.evento.premio = premio;
		},
		eventoDelete() {
			this.evento = {
				evento: null,
				categoria: null,
				premio: null,
			};
		},

		isActive() {
			let u;
			try {
				u = JSON.parse(localStorage.user);
			} catch (error) {
				u = null;
			}

			return u != null;
		},
		isAdmin() {
			const u = JSON.parse(localStorage.user);
			return u.rol.toLowerCase() == "admin";
		},
		saveUser(user) {
			localStorage.user = JSON.stringify(user);
			this.user = user;
		},
		newDatos(user) {
			localStorage.user = JSON.stringify({ ...user, access_token: this.getToken() });
			this.user = { ...user, access_token: this.getToken() };
		},
		getToken() {
			const u = JSON.parse(localStorage.user);
			return u.access_token;
		},
		getUsuario() {
			return JSON.parse(localStorage.user);
		},
		getId() {
			const u = JSON.parse(localStorage.user);
			return u._id;
		},
		getFoto() {
			const u = JSON.parse(localStorage.user);
			return u.foto;
		},
		clearUser() {
			this.user = null;
			localStorage.user = null;
		},
		setSaldo(saldo) {
			const u = JSON.parse(localStorage.user);
			if (u) {
				u.saldo = saldo;
				this.user = u;
				localStorage.user = JSON.stringify(u);
			}
		},
	},
	getters: {
		getSaldo() {
			const u = JSON.parse(localStorage.user);
			if (u) {
				this.user = u;
				return this.user.saldo;
			}
			return "0";
		},
	},
});

export const useStoreMezcla = defineStore("mezcla", {
	state: () => ({
		grupos: null,
	}),
	actions: {
		getGrupo() {
			try {
				this.grupos = JSON.parse(localStorage.grupos);
			} catch (error) {
				this.grupos = null;
			}
			return this.grupos;
		},
		saveMezcla(grupos = "A-B") {
			localStorage.grupos = JSON.stringify(grupos);
			this.grupos = grupos;
		},
		reiniciarMezcla() {
			localStorage.grupos = null;
			this.grupos = null;
		},
	},
});

// Store para la cola de reproducción de audio
export const useAudioQueue = defineStore("audioQueue", {
	state: () => ({
		queue: [],
		isPlaying: false,
	}),
	actions: {
		enqueue(audio) {
			this.queue.push(audio);
			if (!this.isPlaying) {
				this.playNext();
			}
		},
		async playNext() {
			if (this.queue.length === 0) {
				this.isPlaying = false;
				return;
			}

			this.isPlaying = true;
			const current = this.queue.shift();
			let audioElement;

			if (current.isBase64) {
				audioElement = new Audio(`data:audio/mp3;base64,${current.src}`);
			} else {
				audioElement = new Audio(current.src);
			}

			audioElement.volume = current.volume || 1;

			audioElement.onended = () => this.playNext();

			try {
				await audioElement.play();
			} catch (error) {
				console.error("Error reproduciendo audio:", error);
				this.playNext();
			}
		},
	},
});

// Store para la conexión y manejo de eventos de Socket.IO
export const useSocketStore = defineStore("socket", {
	state: () => ({
		socket: null,
		storeAudio: useAudioQueue(),
		isConnected: false,
		API_SOCKET: "https://socket.samyflw.com",
		API_TTS: import.meta.env.VITE_APP_API_TTS,
		miTTS: {
			usuario: null,
			tipos_usuarios_permitidos: [],
			lista_usuarios_permitidos: [], //Un objeto con usuario e isHabilitado
			tipo_comentarios_permitidos: null,
			comando_comentario_permitido: null,
			max_top_gifters: 3, //Para cuándo el top gifters esté activado
			voz_tts: null,
		},
		misAlertas: { usuario: null, alertas: [] },
		historial: [],
		ultimosGifts: [],
		notificaciones: [],
	}),
	actions: {
		connect(query, configTTS, configAlertas) {
			if (this.socket != null && this.socket.connected) return;
			this.miTTS = configTTS;
			this.misAlertas = configAlertas;
			this.socket = io(this.API_SOCKET, {
				transports: ["polling"],
				autoConnect: false,
				reconnection: true,
				query,
			});

			this.socket.on("connect", () => {
				this.isConnected = true;
				console.log("Socket conectado");
			});

			this.socket.on("disconnect", () => {
				this.isConnected = false;
				this.storeAudio.queue = [];
				console.log("Socket desconectado");
			});

			// Listeners
			if (this.misAlertas.alertas.some((a) => a.disparador == "gift")) {
				this.socket.on("gift", async (data) => {
					// Solo procesamos si:
					// 1. El gift es streakable (giftType === 1) Y el streak ha terminado (data.repeatEnd === true)
					// 2. O si el gift NO es streakable (giftType !== 1)
					if (data.giftType === 1 && !data.repeatEnd) return;
					this.agregarNotificacion({
						tipo: "gift",
						summary: "Nuevo regalo 🎁",
						detail: `${data.nickname} envió ${data.giftName} x${data.repeatCount}`,
						severity: "info",
					});
					this.actualizarHistorial(data);
					this.actualizarGiftsRecientes(data);
					const alerta = this.misAlertas.alertas
						.filter((a) => a.disparador == "gift")
						.find((a) => a.fuentes_disparador.includes(data.giftId));
					if (alerta != undefined) {
						// Reproducir sonido del regalo
						const sonidoRegalo = {
							type: "audio",
							src: alerta.sonido,
							isBase64: false,
							volume: alerta.volumen || 1,
						};

						// Encolar sonido del regalo
						this.storeAudio.enqueue(sonidoRegalo);
					}
				});
			}
			if (this.misAlertas.alertas.some((a) => a.disparador == "like")) {
				this.socket.on("like", (data) => {
					const alerta = this.misAlertas.alertas.filter((a) => a.disparador == "like");
					if (alerta.length > 0) {
						// Reproducir sonido del regalo
						const sonido = {
							type: "audio",
							src: alerta[0].sonido,
							isBase64: false,
							volume: alerta[0].volumen || 1,
						};
						this.storeAudio.enqueue(sonido);
					}
				});
			}

			this.socket.on("chat", async (data) => {
				const alerta = this.misAlertas.alertas.filter((a) => a.disparador == "chat");

				if (alerta.length > 0) {
					const sonido = {
						type: "audio",
						src: alerta[0].sonido,
						isBase64: false,
						volume: alerta[0].volumen || 1,
					};

					this.storeAudio.enqueue(sonido);
				}

				if (this.puedeUsarTTS(data) && this.comentarioCumple(data.comment)[0]) {
					try {
						const texto = `${data.nickname} comentó: ${data.comment}`;
						const res = await axios.post(`${this.API_TTS}/text-to-speech`, {
							text: texto,
							voice: this.miTTS.voz_tts,
						});

						const audio = {
							type: "tts",
							src: res.data.audio_base64,
							isBase64: true,
						};
						this.storeAudio.enqueue(audio);
					} catch (error) {
						console.error("Error al convertir texto a voz:", error);
					}
				}
			});

			if (this.misAlertas.alertas.some((a) => a.disparador == "member")) {
				this.socket.on("member", (data) => {
					const alerta = this.misAlertas.alertas.filter((a) => a.disparador == "member");
					if (alerta.length > 0) {
						const sonido = {
							type: "audio",
							src: alerta[0].sonido,
							isBase64: false,
							volume: alerta[0].volumen || 1,
						};
						this.storeAudio.enqueue(sonido);
					}
				});
			}
			if (this.misAlertas.alertas.some((a) => a.disparador == "follow")) {
				this.socket.on("follow", (data) => {
					const alerta = this.misAlertas.alertas.filter((a) => a.disparador == "follow");
					if (alerta.length > 0) {
						const sonido = {
							type: "audio",
							src: alerta[0].sonido,
							isBase64: false,
							volume: alerta[0].volumen || 1,
						};
						this.storeAudio.enqueue(sonido);
					}
				});
			}
			if (this.misAlertas.alertas.some((a) => a.disparador == "subscribe")) {
				this.socket.on("subscribe", (data) => {
					const alerta = this.misAlertas.alertas.filter((a) => a.disparador == "subscribe");
					if (alerta.length > 0) {
						const sonido = {
							type: "audio",
							src: alerta[0].sonido,
							isBase64: false,
							volume: alerta[0].volumen || 1,
						};
						this.storeAudio.enqueue(sonido);
					}
				});
			}
			if (this.misAlertas.alertas.some((a) => a.disparador == "share")) {
				this.socket.on("share", (data) => {
					const alerta = this.misAlertas.alertas.filter((a) => a.disparador == "share");
					if (alerta.length > 0) {
						const sonido = {
							type: "audio",
							src: alerta[0].sonido,
							isBase64: false,
							volume: alerta[0].volumen || 1,
						};
						this.storeAudio.enqueue(sonido);
					}
				});
			}
			if (this.misAlertas.alertas.some((a) => a.disparador == "emote")) {
				this.socket.on("emote", (data) => {
					const alerta = this.misAlertas.alertas.filter((a) => a.disparador == "emote");
					if (alerta.length > 0) {
						const sonido = {
							type: "audio",
							src: alerta[0].sonido,
							isBase64: false,
							volume: alerta[0].volumen || 1,
						};
						this.storeAudio.enqueue(sonido);
					}
				});
			}
			if (this.misAlertas.alertas.some((a) => a.disparador == "envelope")) {
				this.socket.on("envelope", (data) => {
					const alerta = this.misAlertas.alertas.filter((a) => a.disparador == "envelope");
					if (alerta.length > 0) {
						const sonido = {
							type: "audio",
							src: alerta[0].sonido,
							isBase64: false,
							volume: alerta[0].volumen || 1,
						};
						this.storeAudio.enqueue(sonido);
					}
				});
			}
			if (this.misAlertas.alertas.some((a) => a.disparador == "questionNew")) {
				this.socket.on("questionNew", (data) => {
					const alerta = this.misAlertas.alertas.filter((a) => a.disparador == "questionNew");
					if (alerta.length > 0) {
						const sonido = {
							type: "audio",
							src: alerta[0].sonido,
							isBase64: false,
							volume: alerta[0].volumen || 1,
						};
						this.storeAudio.enqueue(sonido);
					}
				});
			}
			if (this.misAlertas.alertas.some((a) => a.disparador == "linkMicBattle")) {
				this.socket.on("linkMicBattle", (data) => {
					const alerta = this.misAlertas.alertas.filter((a) => a.disparador == "linkMicBattle");
					if (alerta.length > 0) {
						const sonido = {
							type: "audio",
							src: alerta[0].sonido,
							isBase64: false,
							volume: alerta[0].volumen || 1,
						};
						this.storeAudio.enqueue(sonido);
					}
				});
			}

			this.socket.connect();
		},
		actualizarConfig(configTTS, configAlertas) {
			this.miTTS = configTTS;
			this.misAlertas = configAlertas;
		},
		disconnect() {
			if (this.socket && this.socket.connected) {
				this.isConnected = false;
				this.storeAudio.queue = [];
				this.socket.disconnect();
			}
		},
		puedeUsarTTS(data) {
			const miTTS = this.miTTS;
			const tiposPermitidos = new Set(miTTS.tipos_usuarios_permitidos);
			if (tiposPermitidos.has("todos")) return true;
			if (tiposPermitidos.has("followers") && data.followRole === 1) return true;
			if (tiposPermitidos.has("suscribers") && data.isSubscriber) return true;
			if (tiposPermitidos.has("moderators") && data.isModerator) return true;
			if (tiposPermitidos.has("top_gifters") && data.topGifterRank != null && data.topGifterRank <= miTTS.max_top_gifters) return true;
			if (tiposPermitidos.has("lista_personalizada")) {
				return miTTS.lista_usuarios_permitidos.some((u) => u.isHabilitado && u.usuario === data.nickname);
			}
			return false;
		},
		comentarioCumple(comentario = "") {
			const miTTS = this.miTTS;
			if (miTTS.tipo_comentarios_permitidos == "cualquiera") return [true, comentario];
			if (miTTS.tipo_comentarios_permitidos == "." && comentario.startsWith(".")) return [true, comentario.slice(1).trim()];
			if (miTTS.tipo_comentarios_permitidos == "/" && comentario.startsWith("/")) return [true, comentario.slice(1).trim()];
			if (miTTS.tipo_comentarios_permitidos == "comando" && comentario.startsWith(miTTS.comando_comentario_permitido))
				return [true, comentario.slice(miTTS.comando_comentario_permitido.length).trim()];
			return [false, comentario];
		},
		actualizarGiftsRecientes(data) {
			const index = this.ultimosGifts.findIndex((gift) => gift.userId === data.userId && gift.giftId === data.giftId);

			if (index !== -1) {
				this.ultimosGifts[index].cant += data.repeatCount;
				// Mueve el gift actualizado al inicio del array
				const giftActualizado = this.ultimosGifts.splice(index, 1)[0];
				this.ultimosGifts.unshift(giftActualizado);
			} else {
				this.ultimosGifts.unshift({
					userId: data.userId,
					nickname: data.nickname,
					profilePictureUrl: data.profilePictureUrl,
					giftId: data.giftId,
					giftName: data.giftName,
					giftPictureUrl: data.giftPictureUrl,
					cant: data.repeatCount,
				});
			}
			// Mantiene solo los 5 más recientes
			this.ultimosGifts = this.ultimosGifts.slice(0, 5);
		},
		actualizarHistorial(data) {
			const indexUser = this.historial.findIndex((u) => u.userId == data.userId);
			if (indexUser > -1) {
				const indexRegalo = this.historial[indexUser].regalos.findIndex((r) => r.giftId == data.giftId);
				if (indexRegalo > -1) {
					this.historial[indexUser].regalos[indexRegalo].cant += data.repeatCount;
				} else {
					this.historial[indexUser].regalos.push({
						giftId: data.giftId,
						giftName: data.giftName,
						giftPictureUrl: data.giftPictureUrl,
						cant: data.repeatCount,
					});
				}
				this.historial[indexUser].totalRegalos += data.repeatCount;
			} else {
				this.historial.push({
					userId: data.userId,
					nickname: data.nickname,
					profilePictureUrl: data.profilePictureUrl,
					regalos: [{ giftId: data.giftId, giftName: data.giftName, giftPictureUrl: data.giftPictureUrl, cant: data.repeatCount }],
					totalRegalos: data.repeatCount,
				});
			}
		},
		agregarNotificacion(notificacion) {
			this.notificaciones.push({
				...notificacion,
				id: Date.now() + Math.random(),
			});
		},
		eliminarNotificacion(id) {
			this.notificaciones = this.notificaciones.filter((n) => n.id !== id);
		},
	},
});