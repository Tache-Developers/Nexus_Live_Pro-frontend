import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import EventoView from "../views/Evento.vue";
import LoginEvento from "../views/Login.vue";
import Registro from "../views/Registro.vue";
import Panel from "../views/Panel.vue";
import Evento from "../components/Evento.vue";
import Creadores from "../components/Creadores.vue";
import Bonus from "../components/Bonus.vue";
import Promocion from "../components/Promocion.vue";
import Promouser from "../components/Promouser.vue";
import PremioAleatorio from "../components/PremioAleatorio.vue";
import Game from "../views/game/Game.vue";
import Logingame from "../views/game/Login.vue";
import Admingame from "../views/game/Admin.vue";
import PremiosUsuario from "../components/PremiosUsuario.vue";
import AsignarPremios from "../components/AsignarPremios.vue";
import Batalla from "../components/Batalla.vue";
import EventoEspecial from "../components/EventoEspecial.vue";
import { useStoreEvento } from "../store";
import EventoEspecialView from "../views/EventoEspecial.vue";
import Deseos from "../components/Deseos.vue";
import Terminos from "../views/Terminos.vue";
import ControlReglas from "../components/ControlReglas.vue";
import ActualizacionesReglas from "../components/ActualizacionesReglas.vue";
import Regalos from "../components/Regalos.vue";
import Proveedores from "../components/Proveedores.vue";
import Ordenar from "../components/Ordenar.vue";
import AgregarFondos from "../components/AgregarFondos.vue";
import Servicios from "../components/Servicios.vue";
import TablaSeleccionado from "../components/TablaSeleccionado.vue";
import Reuniones from "../components/Reuniones.vue";

const routes = [
	{ path: "/", name: "Home", component: Home },
	{ path: "/evento", name: "EventoView", component: EventoView },
	{ path: "/login", name: "LoginEvento", component: LoginEvento },
	{ path: "/registro", name: "RegistroEvento", component: Registro },
	{ path: "/terminos", name: "Terminos", component: Terminos },
	{ path: "/EventoEspecialView", name: "EventoEspecialView", component: EventoEspecialView },
	{ path: "/actualizaciones-reglas", name: "ActualizacionesReglas", component: ActualizacionesReglas },
	{
		path: "/panel",
		name: "Panel",
		component: Panel,
		children: [
			{
				path: "/panel/evento",
				name: "Evento",
				component: Evento,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					if (store.isActive()) {
						return store.isAdmin() ? next() : next(from);
					}
					return next("/login");
				},
			},
			{
				path: "/panel/eventoEspecial",
				name: "EventoEspecial",
				component: EventoEspecial,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					if (store.isActive()) {
						return store.isAdmin() ? next() : next(from);
					}
					return next("/login");
				},
			},
			{
				path: "/panel/creadores",
				name: "Creadores",
				component: Creadores,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					if (store.isActive()) {
						return store.isAdmin() ? next() : next(from);
					}
					return next("/login");
				},
			},
			{
				path: "/panel/bonus",
				name: "Bonus",
				component: Bonus,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isActive() ? next() : next("/login");
				},
			},
			{
				path: "/panel/promocion",
				name: "Promocion",
				component: Promocion,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isActive() ? next() : next("/login");
				},
			},
			{
				path: "/panel/ordenes",
				name: "Ordenes",
				component: Promouser,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isActive() ? next() : next("/login");
				},
			},
			{
				path: "/panel/aleatorios",
				name: "PremiosAleatorios",
				component: PremioAleatorio,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isActive() ? next() : next("/login");
				},
			},
			{
				path: "/panel/premio",
				name: "Premios",
				component: PremiosUsuario,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isActive() ? next() : next("/login");
				},
			},
			{
				path: "/panel/asignar",
				name: "Asignar Premios",
				component: AsignarPremios,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					if (store.isActive()) {
						return store.isAdmin() ? next() : next(from);
					}
					return next("/login");
				},
			},
			{
				path: "/panel/batalla",
				name: "Batalla",
				component: Batalla,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isActive() ? next() : next("/login");
				},
			},
			{
				path: "/panel/deseos",
				name: "Deseos",
				component: Deseos,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isActive() ? next() : next("/login");
				},
			},
			{
				path: "/panel/reglas",
				name: "ControlReglas",
				component: ControlReglas,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isAdmin() ? next() : next(from);
				},
			},
			{
				path: "/panel/regalos",
				name: "Regalos",
				component: Regalos,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isAdmin() ? next() : next(from);
				},
			},
			{
				path: "/panel/proveedores",
				name: "Proveedores",
				component: Proveedores,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isAdmin() ? next() : next("/login");
				},
			},
			{
				path: "/panel/ordenar",
				name: "Ordenar",
				component: Ordenar,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isActive() ? next() : next("/login");
				},
			},
			{
				path: "/panel/agregarfondos",
				name: "AgregarFondos",
				component: AgregarFondos,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isActive() ? next() : next("/login");
				},
			},
			{
				path: "/panel/servicios",
				name: "Servicios",
				component: Servicios,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isActive() ? next() : next("/login");
				},
			},
			{
				path: "/panel/tablas",
				name: "TablasSeleccionados",
				component: TablaSeleccionado,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isAdmin() ? next() : next("/login");
				},
			},
			{
				path: "/panel/reuniones",
				name: "Reuniones",
				component: Reuniones,
				beforeEnter: (to, from, next) => {
					const store = useStoreEvento();
					return store.isAdmin() ? next() : next("/login");
				},
			},
		],
	},
	{ path: "/duckracer", name: "Game", component: Game },
	{ path: "/duckracer/login", name: "Login", component: Logingame },
	{ path: "/duckracer/admin", name: "Admin", component: Admingame },
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
