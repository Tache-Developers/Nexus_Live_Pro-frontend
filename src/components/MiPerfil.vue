<template>
    <Dialog v-model:visible="mostrarPerfil" @hide="dialogOculto" modal header="Mi perfil" :style="{ width: '35rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="flex flex-column align-items-center">
            <Avatar v-if="store.isAdmin() || store.getFoto().length == 0" icon="pi pi-user" size="xlarge" shape="circle" />
            <Avatar v-else :image="store.getFoto()" size="xlarge" shape="circle" />
            <h2 class="m-0">{{ datosUsuario.usuario }}</h2>
            <div class="datos-generales w-full" v-if="!store.isAdmin()">
                <div class="estadisticas flex justify-content-between w-full gap-2 flex-wrap">
                    <div class="flex flex-column">
                        <span class="w-full word-break">Seguidores</span>
                        <span class="font-bold text-lg">{{ parseInt(datosUsuario.seguidores).toLocaleString() }}</span>
                    </div>
                    <div class="flex flex-column">
                        <span class="w-full word-break">Nuevos fans en {{ meses[iActual] }}</span>
                        <span class="font-bold text-lg">{{ parseInt(datosUsuario.new_fans_mes_actual).toLocaleString() }}</span>
                        <span class="text-sm">En {{ meses[iAnterior] }}: <span class="font-bold">{{ parseInt(datosUsuario.new_fans_mes_anterior).toLocaleString() }}</span></span>
                    </div>
                    <div class="flex flex-column">
                        <span class="w-full word-break">Diamantes en {{ meses[iActual] }}
                            💎
                        </span>
                        <span class="font-bold text-lg">{{ parseInt(datosUsuario.diamantes_mes_actual).toLocaleString() }}</span>
                        <span class="text-sm">En {{ meses[iAnterior] }}: <span class="font-bold">{{ parseInt(datosUsuario.diamantes_mes_anterior).toLocaleString() }}</span> <span :class="porcentaje(datosUsuario.porcentaje_achieved)">{{ datosUsuario.porcentaje_achieved }}</span></span>
                    </div>
                </div>
                <div class="duracion-live flex justify-content-between w-full mt-3 gap-2">
                    <div class="flex flex-column">
                        <span class="w-full word-break">Duración LIVE en {{ meses[iActual] }} 🎥</span>
                        <span class="font-bold text-lg">{{ formatHoras(datosUsuario.last_live_duration_mes_actual) }}</span>
                        <span class="text-sm">En {{ meses[iAnterior] }}: <span class="font-bold">{{ formatHoras(datosUsuario.last_live_duration_mes_anterior) }}</span> <span :class="porcentaje(datosUsuario.porcentaje_achieved_2)">{{ datosUsuario.porcentaje_achieved_2 }}</span></span>
                    </div>
                    <div class="flex flex-column">
                        <span class="w-full word-break">Días válidos en {{ meses[iActual] }}</span>
                        <span class="font-bold text-lg">{{ datosUsuario.dias_validos_mes_actual }} {{ parseInt(datosUsuario.dias_validos_mes_actual) == 1 ? 'día' : 'días' }}</span>
                        <span class="text-sm">En {{ meses[iAnterior] }}: <span class="font-bold">{{ datosUsuario.dias_validos_mes_anterior + (parseInt(datosUsuario.dias_validos_mes_anterior) == 1 ? ' día' : ' días') }}</span> <span :class="porcentaje(datosUsuario.porcentaje_achieved_3)">{{ datosUsuario.porcentaje_achieved_3 }}</span></span>
                    </div>
                </div>
                <div class="videos-live flex justify-content-between w-full mt-3 gap-2">
                    <div class="flex flex-column">
                        <span class="w-full word-break">Videos LIVE en {{ meses[iActual] }} 🎥</span>
                        <span class="font-bold text-lg">{{ formatHoras(datosUsuario.live_times_mes_actual) }}</span>
                        <span class="text-sm">En {{ meses[iAnterior] }}: <span class="font-bold">{{ datosUsuario.live_times_mes_anterior }}</span> <span :class="porcentaje(datosUsuario.porcentaje_achieved_4)">{{ datosUsuario.porcentaje_achieved_4 }}</span></span>
                    </div>
                    <div class="flex flex-column">
                        <span class="w-full word-break">Último LIVE 🎥</span>
                        <span class="font-bold text-lg">{{ datosUsuario.last_live.slice(0, 19) }}</span>
                    </div>
                </div>
                <div class="extra flex justify-content-between w-full mt-3 gap-2">
                    <div class="flex flex-column">
                        <span class="w-full word-break">Estado del servicio</span>
                        <span class="font-bold text-lg">{{ datosUsuario.relationship_status == "Effective" ? "Efectivo" : datosUsuario.relationship_status }}</span>
                    </div>
                    <div class="flex flex-column">
                        <span class="w-full word-break">Nuevo creador en {{ meses[iActual] }}</span>
                        <span class="font-bold text-lg">{{ datosUsuario.nuevo_creador_mes_actual == "Yes" ? "Sí" : datosUsuario.relationship_status }}</span>
                    </div>
                </div>

                <div class="fans flex justify-content-between w-full mt-3 gap-2">
                    <div class="flex flex-column">
                        <span class="w-full word-break">Fecha de incorporación</span>
                        <span class="font-bold text-lg">{{ datosUsuario.joined_time.slice(0, 19) }}</span>
                    </div>
                    <div class="flex flex-column">
                        <span class="w-full word-break">Días después de la incorporación</span>
                        <span class="font-bold text-lg">{{ datosUsuario.dias_since_joining_agency.slice(0, (datosUsuario.dias_since_joining_agency.length) - 1) + (parseInt(datosUsuario.dias_since_joining_agency.slice(0, (datosUsuario.dias_since_joining_agency.length) - 1)) == 1 ? ' día' : ' días') }}</span>
                    </div>
                </div>
                <div class="fans flex justify-content-between w-full mt-3 gap-2">
                    <div class="flex flex-column">
                        <span class="w-full word-break">Nuevos fans en {{ meses[iActual] }}</span>
                        <span class="font-bold text-lg">{{ datosUsuario.new_fans_mes_actual }}</span>
                        <span class="text-sm">En {{ meses[iAnterior] }}: <span class="font-bold">{{ datosUsuario.new_fans_mes_anterior }}</span></span>
                    </div>
                </div>
                <Divider type="dotted" />
            </div>
            <div class="informacion-cuenta w-full">
                <h2 class="mt-1 mb-0">Datos del usuario</h2>
                <div class="datos-usuario flex justify-content-between gap-2 mt-2 w-full">
                    <div class="flex flex-column">
                        <span class="w-full word-break">Correo</span>
                        <span class="font-bold text-lg text-center">{{ datosUsuario.correo }}</span>
                    </div>
                    <div class="flex flex-column">
                        <span class="w-full word-break">Telefóno</span>
                        <span class="font-bold text-lg text-center">{{ datosUsuario.telefono }}</span>
                    </div>
                    <div class="flex flex-column" v-if="!store.isAdmin()">
                        <span class="w-full word-break">Grupo</span>
                        <span class="font-bold text-lg text-center">{{ datosUsuario.grupo }}</span>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>
<script>
import { useStoreEvento } from '../store';
export default {
    props: ['mostrarMiPerfil'],
    name: 'dialogMiPerfil',
    data: () => ({
        store: null,
        API: import.meta.env.VITE_APP_API,
        mostrarPerfil: false,
        iActual: '',
        iAnterior: '',
        meses: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datosUsuario: {
            usuario: null,
            correo: null,
            telefono: null,
            rol: null,
            foto: null,
            grupo: null,
            diamantes_mes_anterior: null,
            diamantes_mes_actual: null,
            last_live: null,
            porcentaje_achieved: null,
            last_live_duration_mes_actual: null,
            last_live_duration_mes_anterior: null,
            porcentaje_achieved_2: null,
            dias_validos_mes_actual: null,
            dias_validos_mes_anterior: null,
            porcentaje_achieved_3: null,
            live_times_mes_actual: null,
            live_times_mes_anterior: null,
            porcentaje_achieved_4: null,
            relationship_status: null,
            nuevo_creador_mes_actual: null,
            seguidores: null,
            new_fans_mes_actual: null,
            new_fans_mes_anterior: null,
            joined_time: null,
            dias_since_joining_agency: null
        }

    }),
    watch: {
        mostrarMiPerfil(newV, old) {
            this.mostrarPerfil = newV;
        }
    },
    methods: {
        dialogOculto() {
            this.$emit('dialogPerfilOculto');
        },
        porcentaje(porc) {
            const c = porc.slice(0, porc.length - 1);
            const nFloat = parseFloat(c);
            return nFloat > 100 ? 'text-green-500' : 'text-red-500';
        },
        formatHoras(tiempo) {
            const regex = /(\d+)h(\d+)m(\d+)s/;

            const format = tiempo.replace(regex, (match, horas, minutos, segundos) => {
                horas = horas === '0' ? '' : horas + 'h';
                minutos = minutos === '0' ? '' : minutos + 'min';
                segundos = segundos === '0' ? '' : segundos + 's';

                return `${horas} ${minutos} ${segundos}`;
            });

            return format;
        }
    },
    created() {
        this.iActual = new Date().getMonth();
        this.iAnterior = this.iActual == 0 ? 11 : (this.iActual - 1);
        this.store = useStoreEvento();
        this.datosUsuario = { ...this.store.getUsuario() };
    }

}
</script>
<style scoped>
.word-break {
    word-wrap: break-word;
}

.cambiar-foto {
    transform: translate(-12px, -16px);
    cursor: pointer;
}
</style>